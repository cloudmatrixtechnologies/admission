import mongoose from "mongoose";

import Lead from "./leadModel.mjs";
import Student from "../students/studentModel.mjs";
import User from "../users/userModel.mjs";
import College from "../colleges/collegeModel.mjs";
import Course from "../courses/courseModel.mjs";

export const createLead = async (leadData, userId) => {
  const { studentId, interestedCollege, interestedCourses } = leadData;

  const student = await Student.findOne({
    _id: studentId,
    $or: [
      { parentUser: userId },
      { studentUser: userId },
    ],
    status: "active",
  });

  if (!student) {
    return null;
  }

  const college = await College.findOne({
    _id: interestedCollege,
    status: "active",
    visibility: "published",
  });

  if (!college) {
    return null;
  }

  const courses = await Course.find({
    _id: { $in: interestedCourses },
    category: college.category,
    status: "active",
  });

  if (
    courses.length !== interestedCourses.length ||
    interestedCourses.length === 0
  ) {
    throw Object.assign(
      new Error("Invalid interested courses"),
      { statusCode: 400 }
    );
  }

  const existingLead = await Lead.findOne({
    student: studentId,
    interestedCollege,
    isActive: true,
    status: {
      $nin: ["closed", "converted"],
    },
  });

  if (existingLead) {
    throw Object.assign(
      new Error("Lead already exists for this college"),
      { statusCode: 409 }
    );
  }

  return Lead.create({
    student: studentId,
    interestedCollege,
    interestedCourses,
    createdBy: userId,
    history: [
      {
        action: "lead_created",
        newStatus: "new",
        performedBy: userId,
      },
    ],
  });
};

export const getLeads = async (filters = {}) => {
  const searchFilters = {
    isActive: true,
  };

  if (filters.status) {
    searchFilters.status = filters.status;
  }

  if (filters.assignedTelecaller) {
    searchFilters.assignedTelecaller =
      filters.assignedTelecaller;
  }

  if (filters.assignedAdmin) {
    searchFilters.assignedAdmin = filters.assignedAdmin;
  }

  if (filters.assignedAdminRole) {
    searchFilters.assignedAdminRole =
      filters.assignedAdminRole;
  }

  if (filters.interestedCollege) {
    searchFilters.interestedCollege =
      filters.interestedCollege;
  }

  return Lead.find(searchFilters)
    .populate("student")
    .populate("interestedCollege")
    .populate("interestedCourses")
    .populate("assignedTelecaller", "full_name mobile_number")
    .populate("assignedAdmin", "full_name mobile_number")
    .sort({ createdAt: -1 })
    .lean();
};

export const getLeadById = async (leadId, userId, role) => {
  const lead = await Lead.findOne({
    _id: leadId,
    isActive: true,
  })
    .populate("student")
    .populate("interestedCollege")
    .populate("interestedCourses")
    .populate("followUps.createdBy", "full_name")
    .lean();

  if (!lead) {
    return null;
  }

  const isAuthorized =
    ["super_admin", "manager_admin"].includes(role) ||
    (role === "telecaller" &&
      String(lead.assignedTelecaller) === String(userId)) ||
    (
      ["college_admin", "consultation_admin"].includes(role) &&
      String(lead.assignedAdmin) === String(userId) &&
      lead.assignedAdminRole === role
    );

  if (!isAuthorized) {
    return null;
  }

  return lead;
};

export const assignLeadToTelecaller = async (
  leadId,
  telecallerId,
  managerId
) => {
  const telecaller = await User.findOne({
    _id: telecallerId,
    role: "telecaller",
    status: "active",
  });

  if (!telecaller) {
    return null;
  }

  const lead = await Lead.findOne({
    _id: leadId,
    isActive: true,
  });

  if (!lead) {
    return null;
  }

  const previousStatus = lead.status;

  lead.assignedTelecaller = telecallerId;
  lead.assignedBy = managerId;
  lead.assignedAt = new Date();
  lead.status = "assigned";

  lead.history.push({
    action: "assigned_to_telecaller",
    previousStatus,
    newStatus: "assigned",
    performedBy: managerId,
  });

  await lead.save();

  return lead;
};

export const shareLeadWithAdmin = async (
  leadId,
  adminId,
  adminRole,
  managerId
) => {
  if (
    !["college_admin", "consultation_admin"].includes(adminRole)
  ) {
    throw Object.assign(
      new Error("Invalid admin role"),
      { statusCode: 400 }
    );
  }

  const admin = await User.findOne({
    _id: adminId,
    role: adminRole,
    status: "active",
  });

  if (!admin) {
    return null;
  }

  const lead = await Lead.findOne({
    _id: leadId,
    isActive: true,
  });

  if (!lead) {
    return null;
  }

  const previousStatus = lead.status;

  lead.assignedAdmin = adminId;
  lead.assignedAdminRole = adminRole;
  lead.assignedBy = managerId;
  lead.assignedAt = new Date();
  lead.status = "shared";

  lead.history.push({
    action: "shared_with_admin",
    previousStatus,
    newStatus: "shared",
    performedBy: managerId,
  });

  await lead.save();

  return lead;
};

export const updateLeadCallStatus = async (
  leadId,
  userId,
  callStatus,
  remarks
) => {
  const lead = await Lead.findOne({
    _id: leadId,
    assignedTelecaller: userId,
    isActive: true,
  });

  if (!lead) {
    return null;
  }

  const previousStatus = lead.status;

  lead.callStatus = callStatus;

  const statusMapping = {
    interested: "interested",
    not_interested: "not_interested",
    follow_up_required: "follow_up",
    connected: "contacted",
  };

  if (statusMapping[callStatus]) {
    lead.status = statusMapping[callStatus];
  }

  lead.history.push({
    action: "call_status_updated",
    previousStatus,
    newStatus: lead.status,
    remarks,
    performedBy: userId,
  });

  await lead.save();

  return lead;
};

export const addLeadFollowUp = async (
  leadId,
  userId,
  followUpData
) => {
  const lead = await Lead.findOne({
    _id: leadId,
    assignedTelecaller: userId,
    isActive: true,
  });

  if (!lead) {
    return null;
  }

  lead.followUps.push({
    followUpDate: followUpData.followUpDate,
    notes: followUpData.notes,
    createdBy: userId,
  });

  const previousStatus = lead.status;
  lead.status = "follow_up";

  lead.history.push({
    action: "follow_up_added",
    previousStatus,
    newStatus: "follow_up",
    performedBy: userId,
  });

  await lead.save();

  return lead;
};

export const reviewLead = async (
  leadId,
  adminId,
  adminRole,
  decision,
  remarks
) => {
  if (
    !["accepted", "rejected", "re_requested"].includes(decision)
  ) {
    throw Object.assign(
      new Error("Invalid review decision"),
      { statusCode: 400 }
    );
  }

  const lead = await Lead.findOne({
    _id: leadId,
    assignedAdmin: adminId,
    assignedAdminRole: adminRole,
    isActive: true,
  });

  if (!lead) {
    return null;
  }

  const previousStatus = lead.status;

  lead.status = decision;
  lead.reviewRemarks = remarks || "";

  lead.history.push({
    action: "lead_reviewed",
    previousStatus,
    newStatus: decision,
    remarks,
    performedBy: adminId,
  });

  await lead.save();

  return lead;
};