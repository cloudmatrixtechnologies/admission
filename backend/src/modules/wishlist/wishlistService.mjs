
import Wishlist from "./wishlistModel.mjs";
import College from "../colleges/collegeModel.mjs";

// Add a published college to a student's wishlist.
export async function addToWishlist(studentId, collegeId) {
  // Only active and published colleges can be saved.
  const college = await College.findOne({
    _id: collegeId,
    status: "active",
    visibility: "published",
  }).select("_id");

  if (!college) {
    return {
      success: false,
      reason: "COLLEGE_NOT_FOUND",
    };
  }

  try {
    const wishlistItem = await Wishlist.create({
      student: studentId,
      college: collegeId,
    });

    return {
      success: true,
      wishlistItem,
    };
    } catch (error) {
    // Handle only duplicates from the student + college unique index.
    const isWishlistDuplicate =
      error.code === 11000 &&
      error.keyPattern?.student === 1 &&
      error.keyPattern?.college === 1;

    if (isWishlistDuplicate) {
      return {
        success: false,
        reason: "ALREADY_SAVED",
      };
    }

    // Forward all unrelated database errors.
    throw error;
  }
}

// Retrieve all colleges saved by a student.
export async function getStudentWishlist(studentId) {
  return Wishlist.find({ student: studentId })
    .populate({
      path: "college",
      match: {
        status: "active",
        visibility: "published",
      },
      select:
        "collegeName category description address district state pincode website affiliation",
    })
    .sort({ createdAt: -1 })
    .lean();
}

// Remove a college from a student's wishlist.
export async function removeFromWishlist(studentId, collegeId) {
  return Wishlist.findOneAndDelete({
    student: studentId,
    college: collegeId,
  });
}
