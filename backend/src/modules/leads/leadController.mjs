import mongoose from "mongoose";

import {
  createLead,
  getLeads,
  getLeadById,
  assignLeadToTelecaller,
  shareLeadWithAdmin,
  updateLeadCallStatus,
  addLeadFollowUp,
  reviewLead,
} from "./leadService.mjs";

export const createLeadController = async (req, res, next) => {
  try {
    const lead = await createLead(req.body, req.user.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Student or college not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadsController = async (req, res, next) => {
  try {
    const filters = {};

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

    if (req.user.role === "super_admin") {
      if (req.query.status) {
        filters.status = req.query.status;
      }
    }

    if (req.user.role === "manager_admin") {
      if (req.query.status) {
        filters.status = req.query.status;
      }

      if (req.query.assignedTelecaller) {
        filters.assignedTelecaller =
          req.query.assignedTelecaller;
      }
    }

    const leads = await getLeads(filters);

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadByIdController = async (req, res, next) => {
  try {
    const { leadId } = req.params;

    if (!mongoose.isValidObjectId(leadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await getLeadById(
      leadId,
      req.user.id,
      req.user.role
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const assignLeadController = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { telecallerId } = req.body;

    if (
      !mongoose.isValidObjectId(leadId) ||
      !mongoose.isValidObjectId(telecallerId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead or telecaller ID",
      });
    }

    const lead = await assignLeadToTelecaller(
      leadId,
      telecallerId,
      req.user.id
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead or active telecaller not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const shareLeadController = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { adminId, adminRole } = req.body;

    if (
      !mongoose.isValidObjectId(leadId) ||
      !mongoose.isValidObjectId(adminId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead or admin ID",
      });
    }

    const lead = await shareLeadWithAdmin(
      leadId,
      adminId,
      adminRole,
      req.user.id
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead or active admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead shared successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeadCallStatusController = async (
  req,
  res,
  next
) => {
  try {
    const { leadId } = req.params;
    const { callStatus, remarks } = req.body;

    if (!mongoose.isValidObjectId(leadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const allowedStatuses = [
      "not_called",
      "called",
      "connected",
      "not_connected",
      "interested",
      "not_interested",
      "follow_up_required",
    ];

    if (!allowedStatuses.includes(callStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid call status",
      });
    }

    const lead = await updateLeadCallStatus(
      leadId,
      req.user.id,
      callStatus,
      remarks
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Assigned lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Call status updated successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const addLeadFollowUpController = async (
  req,
  res,
  next
) => {
  try {
    const { leadId } = req.params;
    const { followUpDate, notes } = req.body;

    if (!mongoose.isValidObjectId(leadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    if (!followUpDate || !Number.isFinite(Date.parse(followUpDate))) {
      return res.status(400).json({
        success: false,
        message: "Valid follow-up date is required",
      });
    }

    const lead = await addLeadFollowUp(
      leadId,
      req.user.id,
      { followUpDate, notes }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Assigned lead not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Follow-up added successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewLeadController = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { decision, remarks } = req.body;

    if (!mongoose.isValidObjectId(leadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await reviewLead(
      leadId,
      req.user.id,
      req.user.role,
      decision,
      remarks
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Assigned lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead review updated successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};