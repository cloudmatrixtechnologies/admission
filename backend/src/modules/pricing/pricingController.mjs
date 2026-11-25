import mongoose from "mongoose";

import {
  createPricing,
  getCollegePricing,
  getMyPricing,
  updatePricing,
  deletePricing,
} from "./pricingService.mjs";

export const createPricingController = async (req, res, next) => {
  try {
    const pricing = await createPricing(
      req.body,
      req.user.id
    );

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: "College not found or access denied",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Pricing created successfully",
      pricing,
    });
  } catch (error) {
    next(error);
  }
};

export const getCollegePricingController = async (
  req,
  res,
  next
) => {
  try {
    const { collegeId } = req.params;

    if (!mongoose.isValidObjectId(collegeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID",
      });
    }

    const pricing = await getCollegePricing(collegeId, {
      course: req.query.course,
      academicYear: req.query.academicYear,
    });

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: pricing.length,
      pricing,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPricingController = async (
  req,
  res,
  next
) => {
  try {
    const pricing = await getMyPricing(req.user.id);

    return res.status(200).json({
      success: true,
      count: pricing.length,
      pricing,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePricingController = async (
  req,
  res,
  next
) => {
  try {
    const { pricingId } = req.params;

    if (!mongoose.isValidObjectId(pricingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing ID",
      });
    }

    const pricing = await updatePricing(
      pricingId,
      req.user.id,
      req.body
    );

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: "Pricing not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pricing updated successfully",
      pricing,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePricingController = async (
  req,
  res,
  next
) => {
  try {
    const { pricingId } = req.params;

    if (!mongoose.isValidObjectId(pricingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing ID",
      });
    }

    const pricing = await deletePricing(
      pricingId,
      req.user.id
    );

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: "Pricing not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pricing deactivated successfully",
      pricing,
    });
  } catch (error) {
    next(error);
  }
};