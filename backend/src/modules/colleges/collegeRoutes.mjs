
import { Router } from "express";

import { requireAuth } from "../auth/authMiddleware.mjs";
import { allowRoles } from "../auth/roleMiddleware.mjs";

import {
  createCollegeController,
  getPublishedCollegesController,
  getCollegeByIdController,
  getMyCollegesController,
  updateCollegeController,
} from "./collegeController.mjs";

const router = Router();

router.get("/", getPublishedCollegesController);

router.get("/:collegeId", getCollegeByIdController);

router.post(
  "/",
  requireAuth,
  allowRoles("college_admin"),
  createCollegeController
);

router.get(
  "/my-colleges",
  requireAuth,
  allowRoles("college_admin"),
  getMyCollegesController
);

router.patch(
  "/:collegeId",
  requireAuth,
  allowRoles("college_admin"),
  updateCollegeController
);

export default router;
