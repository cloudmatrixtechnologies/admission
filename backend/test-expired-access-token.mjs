import "dotenv/config";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("JWT_SECRET is missing or too short.");
}

const expiredToken = jwt.sign(
  {
    sub: "64b000000000000000000001",
    role: "parent",
    sid: "64b000000000000000000002",
  },
  secret,
  {
    algorithm: "HS256",
    issuer: "admission-panel-api",
    audience: "admission-panel-client",
    expiresIn: -1,
  }
);

console.log("Expired access token:");
console.log(expiredToken);JJn0iLrRfb6PJSkwRqI5gVWBBIxaGnmYmioi92ELZzez_nF2epm5yTjEwLKhJ8pVvQUlQzZ5MpYPObQKeLekgg