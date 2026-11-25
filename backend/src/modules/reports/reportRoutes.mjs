import { Router } from "express";

import { requireAuth } from "../auth/authMiddleware.mjs";
import { allowRoles } from "../auth/roleMiddleware.mjs";

import {
  getLeadSummaryReportController,
  getTelecallerPerformanceReportController,
  getCollegeLeadReportController,
  getConsultationLeadReportController,
  getLeadConversionReportController,
} from "./reportController.mjs";

const router = Router();

router.use(requireAuth);

router.get(
  "/lead-summary",
  allowRoles(
    "super_admin",
    "manager_admin",
    "telecaller",
    "college_admin",
    "consultation_admin"
  ),
  getLeadSummaryReportController
);

router.get(
  "/telecaller-performance",
  allowRoles("super_admin", "manager_admin", "telecaller"),
  getTelecallerPerformanceReportController
);

router.get(
  "/college-leads",
  allowRoles("super_admin", "manager_admin", "college_admin"),
  getCollegeLeadReportController
);

router.get(
  "/consultation-leads",
  allowRoles(
    "super_admin",
    "manager_admin",
    "consultation_admin"
  ),
  getConsultationLeadReportController
);

router.get(
  "/lead-conversion",
  allowRoles(
    "super_admin",
    "manager_admin",
    "telecaller",
    "college_admin",
    "consultation_admin"
  ),
  getLeadConversionReportController
);

export default router;