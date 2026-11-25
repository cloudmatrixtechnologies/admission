
import { Router } from "express";

import { requireAuth } from "../auth/authMiddleware.mjs";
import { requireStudentProfileAccess } from "../students/studentAccessMiddleware.mjs";

import {
  addToWishlistController,
  getStudentWishlistController,
  removeFromWishlistController,
} from "./wishlistController.mjs";

const router = Router({ mergeParams: true });

// All wishlist endpoints require authentication
// and access to the requested student profile.
router.use(requireAuth, requireStudentProfileAccess);

// Add a college to the wishlist.
router.post("/", addToWishlistController);

// Retrieve the student's wishlist.
router.get("/", getStudentWishlistController);

// Remove a college from the wishlist.
router.delete("/:collegeId", removeFromWishlistController);

export default router;
