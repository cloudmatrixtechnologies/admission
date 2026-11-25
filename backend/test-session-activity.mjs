
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import Session from "./src/modules/auth/sessionModel.mjs";
import { updateSessionActivity } from "./src/modules/auth/sessionService.mjs";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

let testSessionId;

try {
  const now = new Date();

  // Create a temporary test session.
  const session = await Session.create({
    user: new mongoose.Types.ObjectId(),
    refreshTokenHash: "test_" + Date.now(),
    lastActivityAt: new Date(now.getTime() - 60 * 1000),
    lastRefreshAt: now,
    absoluteExpiresAt: new Date(now.getTime() + 60 * 60 * 1000),
  });

  testSessionId = session._id;

  console.log("Test session created.");

  // Test 1: Newer activity should update the timestamp.
  const newerTime = new Date(now.getTime() + 5000);

  await updateSessionActivity(session._id, newerTime);

  let updated = await Session.findById(session._id);

  console.log(
    "Test 1 - Newer activity updates:",
    updated.lastActivityAt.getTime() === newerTime.getTime()
      ? "PASS"
      : "FAIL"
  );

  // Test 2: Older activity must not overwrite newer activity.
  const olderTime = new Date(now.getTime() - 10000);

  await updateSessionActivity(session._id, olderTime);

  updated = await Session.findById(session._id);

  console.log(
    "Test 2 - Older activity cannot overwrite:",
    updated.lastActivityAt.getTime() === newerTime.getTime()
      ? "PASS"
      : "FAIL"
  );

  // Test 3: Expired session must not be revived.
  const expiredSession = await Session.create({
    user: new mongoose.Types.ObjectId(),
    refreshTokenHash: "expired_test_" + Date.now(),
    lastActivityAt: new Date(now.getTime() - 16 * 60 * 1000),
    lastRefreshAt: now,
    absoluteExpiresAt: new Date(now.getTime() + 60 * 60 * 1000),
  });

  const expiredResult = await updateSessionActivity(
    expiredSession._id,
    now
  );

  console.log(
    "Test 3 - Expired session cannot be revived:",
    expiredResult === null ? "PASS" : "FAIL"
  );

  await Session.deleteMany({
    _id: { $in: [session._id, expiredSession._id] },
  });

} catch (error) {
  console.error("Test failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

