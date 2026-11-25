import mongoose from "mongoose";
import Lead from "../leads/leadModel.mjs";

const buildDateFilter = (filters = {}) => {
  const dateFilter = {};

  if (filters.startDate || filters.endDate) {
    dateFilter.createdAt = {};

    if (filters.startDate) {
      dateFilter.createdAt.$gte = new Date(filters.startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      dateFilter.createdAt.$lte = endDate;
    }
  }

  return dateFilter;
};

export const getLeadSummaryReport = async (filters = {}) => {
  const match = {
    isActive: true,
    ...buildDateFilter(filters),
  };

  if (filters.assignedTelecaller) {
    match.assignedTelecaller = new mongoose.Types.ObjectId(
      filters.assignedTelecaller
    );
  }

  if (filters.assignedAdmin) {
    match.assignedAdmin = new mongoose.Types.ObjectId(
      filters.assignedAdmin
    );
  }

  if (filters.assignedAdminRole) {
    match.assignedAdminRole = filters.assignedAdminRole;
  }

  if (filters.status) {
    match.status = filters.status;
  }

  const report = await Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        totalLeads: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        totalLeads: 1,
      },
    },
    { $sort: { status: 1 } },
  ]);

  const totalLeads = report.reduce(
    (total, item) => total + item.totalLeads,
    0
  );

  return {
    totalLeads,
    statusWise: report,
  };
};

export const getTelecallerPerformanceReport = async (
  filters = {}
) => {
  const match = {
    isActive: true,
    assignedTelecaller: { $ne: null },
    ...buildDateFilter(filters),
  };

  if (filters.assignedTelecaller) {
    match.assignedTelecaller = new mongoose.Types.ObjectId(
      filters.assignedTelecaller
    );
  }

  return Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$assignedTelecaller",
        totalLeads: { $sum: 1 },
        interestedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "interested"] },
              1,
              0,
            ],
          },
        },
        followUpLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "follow_up"] },
              1,
              0,
            ],
          },
        },
        acceptedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "accepted"] },
              1,
              0,
            ],
          },
        },
        rejectedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "rejected"] },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "telecaller",
      },
    },
    {
      $unwind: {
        path: "$telecaller",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        telecallerId: "$_id",
        telecallerName: "$telecaller.full_name",
        totalLeads: 1,
        interestedLeads: 1,
        followUpLeads: 1,
        acceptedLeads: 1,
        rejectedLeads: 1,
      },
    },
    { $sort: { totalLeads: -1 } },
  ]);
};

export const getCollegeLeadReport = async (filters = {}) => {
  const match = {
    isActive: true,
    assignedAdminRole: "college_admin",
    ...buildDateFilter(filters),
  };

  if (filters.assignedAdmin) {
    match.assignedAdmin = new mongoose.Types.ObjectId(
      filters.assignedAdmin
    );
  }

  return Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$interestedCollege",
        totalLeads: { $sum: 1 },
        acceptedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "accepted"] },
              1,
              0,
            ],
          },
        },
        rejectedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "rejected"] },
              1,
              0,
            ],
          },
        },
        pendingLeads: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$status",
                  ["shared", "under_review", "re_requested"],
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "colleges",
        localField: "_id",
        foreignField: "_id",
        as: "college",
      },
    },
    {
      $unwind: {
        path: "$college",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        collegeId: "$_id",
        collegeName: "$college.collegeName",
        totalLeads: 1,
        acceptedLeads: 1,
        rejectedLeads: 1,
        pendingLeads: 1,
      },
    },
    { $sort: { totalLeads: -1 } },
  ]);
};

export const getConsultationLeadReport = async (
  filters = {}
) => {
  const match = {
    isActive: true,
    assignedAdminRole: "consultation_admin",
    ...buildDateFilter(filters),
  };

  if (filters.assignedAdmin) {
    match.assignedAdmin = new mongoose.Types.ObjectId(
      filters.assignedAdmin
    );
  }

  return Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$assignedAdmin",
        totalLeads: { $sum: 1 },
        acceptedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "accepted"] },
              1,
              0,
            ],
          },
        },
        rejectedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "rejected"] },
              1,
              0,
            ],
          },
        },
        pendingLeads: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$status",
                  ["shared", "under_review", "re_requested"],
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "consultationAdmin",
      },
    },
    {
      $unwind: {
        path: "$consultationAdmin",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        adminId: "$_id",
        adminName: "$consultationAdmin.full_name",
        totalLeads: 1,
        acceptedLeads: 1,
        rejectedLeads: 1,
        pendingLeads: 1,
      },
    },
    { $sort: { totalLeads: -1 } },
  ]);
};

export const getLeadConversionReport = async (filters = {}) => {
  const match = {
    isActive: true,
    ...buildDateFilter(filters),
  };

  const result = await Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalLeads: { $sum: 1 },
        acceptedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "accepted"] },
              1,
              0,
            ],
          },
        },
        convertedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "converted"] },
              1,
              0,
            ],
          },
        },
        rejectedLeads: {
          $sum: {
            $cond: [
              { $eq: ["$status", "rejected"] },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalLeads: 1,
        acceptedLeads: 1,
        convertedLeads: 1,
        rejectedLeads: 1,
        conversionPercentage: {
          $cond: [
            { $gt: ["$totalLeads", 0] },
            {
              $multiply: [
                {
                  $divide: [
                    "$convertedLeads",
                    "$totalLeads",
                  ],
                },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalLeads: 0,
      acceptedLeads: 0,
      convertedLeads: 0,
      rejectedLeads: 0,
      conversionPercentage: 0,
    }
  );
};