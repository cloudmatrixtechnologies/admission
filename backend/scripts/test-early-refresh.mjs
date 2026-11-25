
import "dotenv/config";
import assert from "node:assert/strict";
import mongoose from "mongoose";

import connectDB from "../src/config/db.js";
import Session from "../src/modules/auth/sessionModel.mjs";

import {
  generateRefreshToken,
  hashRefreshToken,
} from "../src/modules/auth/sessionTokenService.mjs";

import { createSession } from "../src/modules/auth/sessionService.mjs";

import {
  rotateRefreshToken,
} from "../src/modules/auth/sessionRefreshService.mjs";

let sessionId;

try {
  // 1. Connect to MongoDB
  await connectDB();

  // A temporary user ID is sufficient for this isolated Session test.
  // We are not testing user authentication in this test.
  const testUserId = new mongoose.Types.ObjectId();

  // 2. Generate a refresh token and save only its hash
  const originalRefreshToken = generateRefreshToken();
  const originalRefreshTokenHash = hashRefreshToken(originalRefreshToken);

  const session = await createSession(
    testUserId,
    originalRefreshTokenHash
  );

  sessionId = session._id;

  console.log("\nSession created successfully.");

  // Read the original values from MongoDB
  const beforeRefresh = await Session.findById(sessionId)
    .select("+refreshTokenHash +refreshTokenHistory");

  assert.ok(beforeRefresh, "Session should exist.");
  assert.equal(
    beforeRefresh.refreshTokenHash,
    originalRefreshTokenHash,
    "Original refresh-token hash should be stored."
  );

  const originalLastRefreshAt = beforeRefresh.lastRefreshAt.getTime();

  // 3. Immediately attempt to refresh
  const result = await rotateRefreshToken(originalRefreshToken);

  console.log("\nRefresh result:", result.status);

  assert.equal(
    result.status,
    "REFRESH_TOO_EARLY",
    "Immediate refresh should be rejected."
  );

  // 4. Read the session again
  const afterRefresh = await Session.findById(sessionId)
    .select("+refreshTokenHash +refreshTokenHistory");

  assert.ok(afterRefresh, "Session should still exist.");

  // Check that the original token hash was not changed
  assert.equal(
    afterRefresh.refreshTokenHash,
    originalRefreshTokenHash,
    "Refresh-token hash must remain unchanged."
  );

  // Check that lastRefreshAt was not changed
  assert.equal(
    afterRefresh.lastRefreshAt.getTime(),
    originalLastRefreshAt,
    "lastRefreshAt must remain unchanged."
  );

  // Check that no token history entry was added
  assert.equal(
    afterRefresh.refreshTokenHistory.length,
    0,
    "Token history must remain empty."
  );

  // Check that the session was not revoked
  assert.equal(
    afterRefresh.revokedAt,
    null,
    "Session must remain active."
  );

  console.log("\nALL TEST 1 CHECKS PASSED.");
  console.log("1. Session created.");
  console.log("2. Early refresh rejected.");
  console.log("3. Refresh-token hash unchanged.");
  console.log("4. lastRefreshAt unchanged.");
  console.log("5. Token history unchanged.");
  console.log("6. Session not revoked.");
} catch (error) {
  console.error("\nTEST 1 FAILED:");
  console.error(error);
  process.exitCode = 1;
} finally {
  // 5. Delete only this temporary test session
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
    console.log("\nTemporary test session deleted.");
  }

  await mongoose.disconnect();
}
