
import crypto from "node:crypto";

// Generate a cryptographically secure, unpredictable refresh token.
export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("base64url");
}

// Store only the SHA-256 hash in MongoDB.
// Never store the original refresh token.
export function hashRefreshToken(token) {
  if (typeof token !== "string" || token.length === 0) {
    throw new Error("A valid refresh token is required.");
  }

  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}
