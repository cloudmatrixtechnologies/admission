import mongoose from "mongoose";

import {
  createCourse,
  getActiveCourses,
  getCourseById,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "./courseService.mjs";

export const createCourseController = async (req, res, next) => {
  try {
    const course = await createCourse(req.body, req.user.id);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveCoursesController = async (req, res, next) => {
  try {
    const courses = await getActiveCourses({
      category: req.query.category,
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseByIdController = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await getCourseById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCoursesController = async (req, res, next) => {
  try {
    const courses = await getAllCourses({
      category: req.query.category,
      status: req.query.status,
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourseController = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await updateCourse(courseId, req.body);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourseController = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await deleteCourse(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deactivated successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};