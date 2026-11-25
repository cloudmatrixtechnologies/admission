
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

  // Temporary user ID for this isolated Session test
  const testUserId = new mongoose.Types.ObjectId();

  // 2. Create the original refresh token
  const originalRefreshToken = generateRefreshToken();
  const originalRefreshTokenHash = hashRefreshToken(originalRefreshToken);

  const session = await createSession(
    testUserId,
    originalRefreshTokenHash
  );

  sessionId = session._id;

  console.log("\nSession created successfully.");

  // 3. Simulate that 9 minutes have passed
  const simulatedRefreshTime = new Date(Date.now() - 9 * 60 * 1000);

  await Session.updateOne(
    { _id: sessionId },
    { $set: { lastRefreshAt: simulatedRefreshTime } }
  );

  console.log("\n9-minute refresh interval simulated.");

  // 4. Successfully rotate the original token
  const rotationResult = await rotateRefreshToken(originalRefreshToken);

  console.log("\nFirst refresh result:", rotationResult.status);

  assert.equal(
    rotationResult.status,
    "ROTATED",
    "The original token should rotate successfully."
  );

  assert.ok(
    rotationResult.refreshToken,
    "A new refresh token should be returned."
  );

  const newRefreshToken = rotationResult.refreshToken;
  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  // 5. Verify MongoDB contains the new token hash
  const afterRotation = await Session.findById(sessionId)
    .select("+refreshTokenHash +refreshTokenHistory");

  assert.ok(afterRotation, "Session should exist after rotation.");

  assert.equal(
    afterRotation.refreshTokenHash,
    newRefreshTokenHash,
    "New refresh-token hash should be stored."
  );

  assert.ok(
    afterRotation.refreshTokenHistory.some(
      (entry) => entry.tokenHash === originalRefreshTokenHash
    ),
    "Original token hash should be present in history."
  );

  console.log("\nFirst rotation verified successfully.");

  // 6. Submit the old refresh token again
  const replayResult = await rotateRefreshToken(originalRefreshToken);

  console.log("\nOld token replay result:", replayResult.status);

  assert.equal(
    replayResult.status,
    "TOKEN_REUSE_DETECTED",
    "Reusing the old token must trigger replay detection."
  );

  // 7. Verify the session was revoked in MongoDB
  const afterReplay = await Session.findById(sessionId)
    .select("+refreshTokenHash +refreshTokenHistory");

  assert.ok(afterReplay, "Session should still exist for inspection.");

  assert.ok(
    afterReplay.revokedAt instanceof Date,
    "Session must be revoked after token reuse."
  );

  assert.equal(
    afterReplay.refreshTokenHash,
    newRefreshTokenHash,
    "The stored current token hash should remain unchanged."
  );

  console.log("\nSession revocation verified successfully.");

  // 8. Try using the newly issued token after revocation
  const newTokenResult = await rotateRefreshToken(newRefreshToken);

  console.log(
    "\nNew token after revocation:",
    newTokenResult.status
  );

  assert.equal(
    newTokenResult.status,
    "SESSION_REVOKED",
    "The new token must not work after its session is revoked."
  );

  console.log("\nALL TEST 2 CHECKS PASSED.");
  console.log("1. Session created.");
  console.log("2. Nine-minute interval simulated.");
  console.log("3. Original token rotated successfully.");
  console.log("4. New token hash stored in MongoDB.");
  console.log("5. Old token detected as reused.");
  console.log("6. Affected session revoked.");
  console.log("7. New token rejected after revocation.");

} catch (error) {
  console.error("\nTEST 2 FAILED:");
  console.error(error);
  process.exitCode = 1;

} finally {
  // Delete only this temporary test session
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
    console.log("\nTemporary test session deleted.");
  }

  await mongoose.disconnect();
  console.log("MongoDB disconnected.");
}
