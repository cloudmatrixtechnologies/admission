
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    // The user who owns this session.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },

    // Hash of the current refresh token.
    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    // Hashes of previously rotated refresh tokens.
    refreshTokenHistory: {
      type: [
        {
          tokenHash: {
            type: String,
            required: true,
          },
          rotatedAt: {
            type: Date,
            required: true,
          },
          _id: false,
        },
      ],
      default: [],
      select: false,
    },

    // Last meaningful authenticated activity.
    lastActivityAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Last successful refresh-token rotation.
    lastRefreshAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Fixed maximum lifetime established at login.
    absoluteExpiresAt: {
      type: Date,
      required: true,
      immutable: true,
    },

    // Session revocation timestamp.
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

// Find sessions belonging to a user.
sessionSchema.index({ user: 1, revokedAt: 1 });

// Find sessions that have reached absolute expiry.
sessionSchema.index({ absoluteExpiresAt: 1 });

// Current refresh-token hashes must be globally unique.
sessionSchema.index(
  { refreshTokenHash: 1 },
  { unique: true }
);

// Find sessions containing a previously rotated token hash.
sessionSchema.index({
  "refreshTokenHistory.tokenHash": 1,
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
