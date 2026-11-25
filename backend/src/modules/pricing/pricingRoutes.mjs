import { Router } from "express";

import { requireAuth } from "../auth/authMiddleware.mjs";
import { allowRoles } from "../auth/roleMiddleware.mjs";

import {
  createPricingController,
  getCollegePricingController,
  getMyPricingController,
  updatePricingController,
  deletePricingController,
} from "./pricingController.mjs";

const router = Router();

router.get(
  "/college/:collegeId",
  getCollegePricingController
);

router.post(
  "/",
  requireAuth,
  allowRoles("college_admin"),
  createPricingController
);

router.get(
  "/my-pricing",
  requireAuth,
  allowRoles("college_admin"),
  getMyPricingController
);

router.patch(
  "/:pricingId",
  requireAuth,
  allowRoles("college_admin"),
  updatePricingController
);

router.delete(
  "/:pricingId",
  requireAuth,
  allowRoles("college_admin"),
  deletePricingController
);

export default router;