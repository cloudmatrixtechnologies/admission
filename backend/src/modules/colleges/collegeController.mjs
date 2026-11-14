
import mongoose from "mongoose";

import {
  createCollege,
  getPublishedColleges,
  getCollegeById,
  getMyColleges,
  updateCollege,
} from "./collegeService.mjs";

export const createCollegeController = async (req, res, next) => {
  try {
    const college = await createCollege(req.body, req.user.id);

    return res.status(201).json({
      success: true,
      message: "College created successfully.",
      college,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPublishedCollegesController = async (
  req,
  res,
  next
) => {
  try {
    const colleges = await getPublishedColleges({
      category: req.query.category,
      district: req.query.district,
    });

    return res.status(200).json({
      success: true,
      count: colleges.length,
      colleges,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCollegeByIdController = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.collegeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID.",
      });
    }

    const college = await getCollegeById(req.params.collegeId);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found.",
      });
    }

    return res.status(200).json({
      success: true,
      college,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMyCollegesController = async (req, res, next) => {
  try {
    const colleges = await getMyColleges(req.user.id);

    return res.status(200).json({
      success: true,
      count: colleges.length,
      colleges,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateCollegeController = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.collegeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID.",
      });
    }

    const college = await updateCollege(
      req.params.collegeId,
      req.user.id,
      req.body
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "College updated successfully.",
      college,
    });
  } catch (error) {
    return next(error);
  }
};
