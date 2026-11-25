
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      immutable: true,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

// A student can save a particular college only once.
wishlistSchema.index(
  { student: 1, college: 1 },
  { unique: true }
);

// Retrieve a student's wishlist efficiently.
wishlistSchema.index({ student: 1, createdAt: -1 });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
