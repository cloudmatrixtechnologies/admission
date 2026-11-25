
import mongoose from "mongoose";

import {
    addToWishlist,
    getStudentWishlist,
    removeFromWishlist,
} from "./wishlistService.mjs";

// Add a college to a student's wishlist.
export async function addToWishlistController(req, res, next) {
    try {
        const { collegeId } = req.body;

        if (!mongoose.isObjectIdOrHexString(collegeId)) {
            return res.status(400).json({
                success: false,
                message: "A valid college ID is required.",
            });
        }

        const result = await addToWishlist(
            req.studentProfile._id,
            collegeId
        );

        if (!result.success) {
            if (result.reason === "ALREADY_SAVED") {
                return res.status(409).json({
                    success: false,
                    message: "This college is already in the wishlist.",
                });
            }

            return res.status(404).json({
                success: false,
                message: "College not found or unavailable.",
            });
        }

        return res.status(201).json({
            success: true,
            message: "College added to wishlist successfully.",
            wishlistItem: {
                id: result.wishlistItem._id,
                student: result.wishlistItem.student,
                college: result.wishlistItem.college,
                createdAt: result.wishlistItem.createdAt,
            },
        });
    } catch (error) {
        return next(error);
    }
}

// Retrieve a student's wishlist.
export async function getStudentWishlistController(req, res, next) {
    try {
        const wishlist = await getStudentWishlist(
            req.studentProfile._id
        );

        // Exclude entries whose colleges are no longer published.
        const availableWishlist = wishlist.filter(
            (item) => item.college != null
        );

        return res.status(200).json({
            success: true,
            count: availableWishlist.length,
            wishlist: availableWishlist.map((item) => ({
                id: item._id,
                college: item.college,
                createdAt: item.createdAt,
            })),
        });
    } catch (error) {
        return next(error);
    }
}

// Remove a college from a student's wishlist.
export async function removeFromWishlistController(req, res, next) {
    try {
        const { collegeId } = req.params;

        if (!mongoose.isObjectIdOrHexString(collegeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid college ID.",
            });
        }

        const removedItem = await removeFromWishlist(
            req.studentProfile._id,
            collegeId
        );

        if (!removedItem) {
            return res.status(404).json({
                success: false,
                message: "Wishlist item not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "College removed from wishlist successfully.",
        });
    } catch (error) {
        return next(error);
    }
}
