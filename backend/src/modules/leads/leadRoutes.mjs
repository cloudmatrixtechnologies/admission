import { Router } from "express";

import { requireAuth } from "../auth/authMiddleware.mjs";
import { allowRoles } from "../auth/roleMiddleware.mjs";

import {
  createLeadController,
  getLeadsController,
  getLeadByIdController,
  assignLeadController,
  shareLeadController,
  updateLeadCallStatusController,
  addLeadFollowUpController,
  reviewLeadController,
} from "./leadController.mjs";

const router = Router();

router.post(
  "/",
  requireAuth,
  allowRoles("parent", "student"),
  createLeadController
);

router.get(
  "/",
  requireAuth,
  allowRoles(
    "super_admin",
    "manager_admin",
    "telecaller",
    "college_admin",
    "consultation_admin"
  ),
  getLeadsController
);

router.get(
  "/:leadId",
  requireAuth,
  allowRoles(
    "super_admin",
    "manager_admin",
    "telecaller",
    "college_admin",
    "consultation_admin"
  ),
  getLeadByIdController
);

router.patch(
  "/:leadId/assign-telecaller",
  requireAuth,
  allowRoles("manager_admin"),
  assignLeadController
);

router.patch(
  "/:leadId/share",
  requireAuth,
  allowRoles("manager_admin"),
  shareLeadController
);

router.patch(
  "/:leadId/call-status",
  requireAuth,
  allowRoles("telecaller"),
  updateLeadCallStatusController
);

router.post(
  "/:leadId/follow-ups",
  requireAuth,
  allowRoles("telecaller"),
  addLeadFollowUpController
);

router.patch(
  "/:leadId/review",
  requireAuth,
  allowRoles("college_admin", "consultation_admin"),
  reviewLeadController
);

export default router;