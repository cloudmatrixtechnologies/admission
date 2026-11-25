import { Router } from "express";

import { requireAuth } from "../auth/authMiddleware.mjs";
import { allowRoles } from "../auth/roleMiddleware.mjs";

import {
  createCourseController,
  getActiveCoursesController,
  getCourseByIdController,
  getAllCoursesController,
  updateCourseController,
  deleteCourseController,
} from "./courseController.mjs";

const router = Router();

// Public course routes
router.get("/", getActiveCoursesController);

router.get("/:courseId", getCourseByIdController);

// Admin course routes
router.get(
  "/admin/all",
  requireAuth,
  allowRoles("super_admin"),
  getAllCoursesController
);

router.post(
  "/",
  requireAuth,
  allowRoles("super_admin"),
  createCourseController
);

router.patch(
  "/:courseId",
  requireAuth,
  allowRoles("super_admin"),
  updateCourseController
);

router.delete(
  "/:courseId",
  requireAuth,
  allowRoles("super_admin"),
  deleteCourseController
);

export default router;