
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
  allowRoles("collegeAdmin"),
  createCollegeController
);

router.get(
  "/my-colleges",
  requireAuth,
  allowRoles("collegeAdmin"),
  getMyCollegesController
);

router.patch(
  "/:collegeId",
  requireAuth,
  allowRoles("collegeAdmin"),
  updateCollegeController
);

export default router;
