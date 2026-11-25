
import { Router } from "express";

import { requireAuth } from "../auth/authMiddleware.mjs";
import { requireStudentProfileAccess } from "../students/studentAccessMiddleware.mjs";

import {
  getFamilyDetailsController,
  updateFamilyDetailsController,
} from "./familyController.mjs";

const router = Router({ mergeParams: true });

// Every family endpoint requires authentication
// and access to the requested student profile.
router.use(requireAuth, requireStudentProfileAccess);

// Retrieve family details.
router.get("/", getFamilyDetailsController);

// Create or update family details.
router.put("/", updateFamilyDetailsController);

export default router;
