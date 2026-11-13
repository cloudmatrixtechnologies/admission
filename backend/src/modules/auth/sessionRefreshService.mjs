
import Session from "./sessionModel.mjs";

import {
  generateRefreshToken,
  hashRefreshToken,
} from "./sessionTokenService.mjs";

import {
  getSessionExpiryReason,
} from "./sessionService.mjs";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
const MIN_REFRESH_INTERVAL_MS = 9 * 60 * 1000;
const MAX_TOKEN_HISTORY = 64;

async function revokeSessionById(sessionId) {
  return Session.findOneAndUpdate(
    {
      _id: sessionId,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    }
  );
}

export async function rotateRefreshToken(presentedToken) {
  if (
    typeof presentedToken !== "string" ||
    presentedToken.length === 0
  ) {
    return { status: "INVALID_TOKEN" };
  }

  const presentedHash = hashRefreshToken(presentedToken);
  const now = new Date();

  const session = await Session.findOne({
    refreshTokenHash: presentedHash,
  }).select("+refreshTokenHash +refreshTokenHistory");

  // Check whether this token was already rotated.
  if (!session) {
    const previousSession = await Session.findOne({
      "refreshTokenHistory.tokenHash": presentedHash,
    });

    if (!previousSession) {
      return { status: "INVALID_TOKEN" };
    }

    if (!previousSession.revokedAt) {
      await revokeSessionById(previousSession._id);
    }

    return { status: "TOKEN_REUSE_DETECTED" };
  }

  if (session.revokedAt) {
    return { status: "SESSION_REVOKED" };
  }

  const expiryReason = getSessionExpiryReason(session, now);

  if (expiryReason) {
    await revokeSessionById(session._id);

    return {
      status: "SESSION_EXPIRED",
      reason: expiryReason,
    };
  }

  // Do not allow refresh requests more frequently than once per 9 minutes.
  const lastRefreshTime = new Date(session.lastRefreshAt).getTime();
  const elapsed = now.getTime() - lastRefreshTime;

  if (elapsed < MIN_REFRESH_INTERVAL_MS) {
    return {
      status: "REFRESH_TOO_EARLY",
      retryAfterMs: MIN_REFRESH_INTERVAL_MS - elapsed,
    };
  }

  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const inactivityCutoff = new Date(
    now.getTime() - INACTIVITY_TIMEOUT_MS
  );

  const refreshCutoff = new Date(
    now.getTime() - MIN_REFRESH_INTERVAL_MS
  );

  // Atomic compare-and-swap: only one request can rotate this token.
  const updatedSession = await Session.findOneAndUpdate(
    {
      _id: session._id,
      refreshTokenHash: presentedHash,
      revokedAt: null,
      absoluteExpiresAt: { $gt: now },
      lastActivityAt: { $gt: inactivityCutoff },
      lastRefreshAt: { $lte: refreshCutoff },
    },
    {
      $set: {
        refreshTokenHash: newRefreshTokenHash,
        lastRefreshAt: now,
      },
      $push: {
        refreshTokenHistory: {
          $each: [
            {
              tokenHash: presentedHash,
              rotatedAt: now,
            },
          ],
          $slice: -MAX_TOKEN_HISTORY,
        },
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (updatedSession) {
    return {
      status: "ROTATED",
      refreshToken: newRefreshToken,
      session: updatedSession,
    };
  }

  // If another request rotated this token, treat it as replay.
  const reusedSession = await Session.findOne({
    _id: session._id,
    "refreshTokenHistory.tokenHash": presentedHash,
  });

  if (reusedSession) {
    await revokeSessionById(session._id);

    return { status: "TOKEN_REUSE_DETECTED" };
  }

  const latestSession = await Session.findById(session._id)
    .select("+refreshTokenHash +refreshTokenHistory");

  if (!latestSession || latestSession.revokedAt) {
    return { status: "SESSION_REVOKED" };
  }

  const latestExpiryReason = getSessionExpiryReason(latestSession);

  if (latestExpiryReason) {
    await revokeSessionById(session._id);

    return {
      status: "SESSION_EXPIRED",
      reason: latestExpiryReason,
    };
  }

  // A concurrent refresh may have updated lastRefreshAt.
  const latestRefreshTime = new Date(
    latestSession.lastRefreshAt
  ).getTime();

  const latestElapsed = Date.now() - latestRefreshTime;

  if (latestElapsed < MIN_REFRESH_INTERVAL_MS) {
    return {
      status: "REFRESH_TOO_EARLY",
      retryAfterMs: MIN_REFRESH_INTERVAL_MS - latestElapsed,
    };
  }

  return { status: "INVALID_TOKEN" };
}
