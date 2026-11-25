import mongoose from "mongoose";

import {
  getLeadSummaryReport,
  getTelecallerPerformanceReport,
  getCollegeLeadReport,
  getConsultationLeadReport,
  getLeadConversionReport,
} from "./reportService.mjs";

const validateReportFilters = (query) => {
  const { startDate, endDate, assignedTelecaller, assignedAdmin } =
    query;

  if (startDate && !Number.isFinite(Date.parse(startDate))) {
    return "Invalid start date";
  }

  if (endDate && !Number.isFinite(Date.parse(endDate))) {
    return "Invalid end date";
  }

  if (
    startDate &&
    endDate &&
    new Date(startDate) > new Date(endDate)
  ) {
    return "Start date cannot be after end date";
  }

  if (
    assignedTelecaller &&
    !mongoose.isValidObjectId(assignedTelecaller)
  ) {
    return "Invalid telecaller ID";
  }

  if (
    assignedAdmin &&
    !mongoose.isValidObjectId(assignedAdmin)
  ) {
    return "Invalid admin ID";
  }

  return null;
};

const getReportFilters = (query) => ({
  startDate: query.startDate,
  endDate: query.endDate,
  assignedTelecaller: query.assignedTelecaller,
  assignedAdmin: query.assignedAdmin,
});

export const getLeadSummaryReportController = async (
  req,
  res,
  next
) => {
  try {
    const validationError = validateReportFilters(req.query);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const filters = getReportFilters(req.query);

    if (req.user.role === "telecaller") {
      filters.assignedTelecaller = req.user.id;
    }

    if (
      ["college_admin", "consultation_admin"].includes(
        req.user.role
      )
    ) {
      filters.assignedAdmin = req.user.id;
      filters.assignedAdminRole = req.user.role;
    }

    const report = await getLeadSummaryReport(filters);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const getTelecallerPerformanceReportController = async (
  req,
  res,
  next
) => {
  try {
    const validationError = validateReportFilters(req.query);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const filters = getReportFilters(req.query);

    if (req.user.role === "telecaller") {
      filters.assignedTelecaller = req.user.id;
    }

    const report = await getTelecallerPerformanceReport(filters);

    return res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const getCollegeLeadReportController = async (
  req,
  res,
  next
) => {
  try {
    const validationError = validateReportFilters(req.query);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const filters = getReportFilters(req.query);

    if (req.user.role === "college_admin") {
      filters.assignedAdmin = req.user.id;
    }

    const report = await getCollegeLeadReport(filters);

    return res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const getConsultationLeadReportController = async (
  req,
  res,
  next
) => {
  try {
    const validationError = validateReportFilters(req.query);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const filters = getReportFilters(req.query);

    if (req.user.role === "consultation_admin") {
      filters.assignedAdmin = req.user.id;
    }

    const report = await getConsultationLeadReport(filters);

    return res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadConversionReportController = async (
  req,
  res,
  next
) => {
  try {
    const validationError = validateReportFilters(req.query);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const filters = getReportFilters(req.query);

    if (req.user.role === "telecaller") {
      filters.assignedTelecaller = req.user.id;
    }

    if (
      ["college_admin", "consultation_admin"].includes(
        req.user.role
      )
    ) {
      filters.assignedAdmin = req.user.id;
      filters.assignedAdminRole = req.user.role;
    }

    const report = await getLeadConversionReport(filters);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};