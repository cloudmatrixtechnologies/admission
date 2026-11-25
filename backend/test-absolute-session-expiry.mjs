
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

import Session from "./src/modules/auth/sessionModel.mjs";

import {
  createSession,
} from "./src/modules/auth/sessionService.mjs";

import {
  generateRefreshToken,
  hashRefreshToken,
} from "./src/modules/auth/sessionTokenService.mjs";

import {
  rotateRefreshToken,
} from "./src/modules/auth/sessionRefreshService.mjs";

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
const TEN_MINUTES_MS = 10 * 60 * 1000;

let testSessionId;

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected.");

  // Test 1: A new session receives an 8-hour absolute expiry.
  const originalToken = generateRefreshToken();

  const session = await createSession(
    new mongoose.Types.ObjectId(),
    hashRefreshToken(originalToken)
  );

  testSessionId = session._id;

  const createdDuration =
    session.absoluteExpiresAt.getTime() -
    session.createdAt.getTime();

  console.log(
    "Test 1 - New session has 8-hour expiry:",
    Math.abs(createdDuration - EIGHT_HOURS_MS) < 2000
      ? "PASS"
      : "FAIL"
  );

  // Prepare the session for refresh eligibility.
  const earlierRefreshTime = new Date(
    Date.now() - TEN_MINUTES_MS
  );

  await Session.updateOne(
    { _id: session._id },
    {
      $set: {
        lastRefreshAt: earlierRefreshTime,
      },
    }
  );

  const originalAbsoluteExpiry =
    session.absoluteExpiresAt.getTime();

  // Test 2: Refresh must not extend absolute expiry.
  const refreshResult = await rotateRefreshToken(originalToken);

  console.log(
    "Refresh operation:",
    refreshResult.status
  );

  if (refreshResult.status !== "ROTATED") {
    throw new Error("Refresh did not succeed. Cannot continue.");
  }

  const refreshedSession = await Session.findById(session._id);

  console.log(
    "Test 2 - Refresh does not extend 8-hour expiry:",
    refreshedSession.absoluteExpiresAt.getTime() ===
      originalAbsoluteExpiry
      ? "PASS"
      : "FAIL"
  );

  // Test 3: An absolutely expired session cannot be refreshed.
  // Use the native collection to simulate expiry in this test only.
  await Session.collection.updateOne(
    { _id: session._id },
    {
      $set: {
        absoluteExpiresAt: new Date(Date.now() - 1000),
        lastActivityAt: new Date(),
      },
    }
  );

  const latestToken = refreshResult.refreshToken;

  const expiredResult = await rotateRefreshToken(latestToken);

  const revokedSession = await Session.findById(session._id);

  console.log(
    "Test 3 - Absolutely expired session rejected:",
    expiredResult.status === "SESSION_EXPIRED" &&
      expiredResult.reason === "SESSION_ABSOLUTE_EXPIRED"
      ? "PASS"
      : "FAIL"
  );

  console.log(
    "Test 4 - Expired session revoked:",
    revokedSession?.revokedAt ? "PASS" : "FAIL"
  );

} catch (error) {
  console.error("Test failed:", error.message);
  process.exitCode = 1;

} finally {
  if (testSessionId) {
    await Session.deleteOne({ _id: testSessionId });
    console.log("Temporary test session cleaned up.");
  }

  await mongoose.disconnect();
}
