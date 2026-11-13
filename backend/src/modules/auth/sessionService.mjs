
import Session from "./sessionModel.mjs";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
const ABSOLUTE_SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000;

// Create a new server-side session.
export async function createSession(userId, refreshTokenHash) {
  if (!userId || !refreshTokenHash) {
    throw new Error("User ID and refresh token hash are required.");
  }

  const now = new Date();

  const session = await Session.create({
    user: userId,
    refreshTokenHash,
    lastActivityAt: now,
    lastRefreshAt: now,
    absoluteExpiresAt: new Date(
      now.getTime() + ABSOLUTE_SESSION_TIMEOUT_MS
    ),
  });

  return session;
}

// Check whether a session is revoked, inactive, or absolutely expired.
export function getSessionExpiryReason(session, now = new Date()) {
  if (!session) {
    return "SESSION_NOT_FOUND";
  }

  if (session.revokedAt) {
    return "SESSION_REVOKED";
  }

  if (session.absoluteExpiresAt <= now) {
    return "SESSION_ABSOLUTE_EXPIRED";
  }

  const inactivityExpiresAt =
    new Date(session.lastActivityAt).getTime() +
    INACTIVITY_TIMEOUT_MS;

  if (inactivityExpiresAt <= now.getTime()) {
    return "SESSION_IDLE_EXPIRED";
  }

  return null;
}

// Update meaningful authenticated activity.
// Never extend the original 8-hour absolute expiry.
export async function updateSessionActivity(sessionId, now = new Date()) {
  const inactivityCutoff = new Date(
    now.getTime() - INACTIVITY_TIMEOUT_MS
  );

  return Session.findOneAndUpdate(
    {
      _id: sessionId,
      revokedAt: null,
      absoluteExpiresAt: { $gt: now },
      lastActivityAt: { $gt: inactivityCutoff },
    },
    {
      $set: {
        lastActivityAt: now,
      },
    },
    {
      returnDocument: "after",
    }
  );
}

// Revoke a session immediately.
export async function revokeSession(sessionId) {
  if (!sessionId) {
    return null;
  }

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
