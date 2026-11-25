import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema(
  {
    followUpDate: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "missed"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const leadHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    previousStatus: {
      type: String,
    },

    newStatus: {
      type: String,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      immutable: true,
    },

    interestedCollege: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    interestedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],

    source: {
      type: String,
      enum: [
        "website",
        "wishlist",
        "direct",
        "telecaller",
        "other",
      ],
      default: "website",
    },

    status: {
      type: String,
      enum: [
        "new",
        "assigned",
        "contacted",
        "interested",
        "not_interested",
        "follow_up",
        "shared",
        "under_review",
        "accepted",
        "rejected",
        "re_requested",
        "converted",
        "closed",
      ],
      default: "new",
    },

    callStatus: {
      type: String,
      enum: [
        "not_called",
        "called",
        "connected",
        "not_connected",
        "interested",
        "not_interested",
        "follow_up_required",
      ],
      default: "not_called",
    },

    assignedTelecaller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedAdminRole: {
      type: String,
      enum: ["college_admin", "consultation_admin"],
      default: null,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    reviewRemarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    followUps: {
      type: [followUpSchema],
      default: [],
    },

    history: {
      type: [leadHistorySchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

leadSchema.index({
  student: 1,
  interestedCollege: 1,
});

leadSchema.index({
  assignedTelecaller: 1,
  status: 1,
});

leadSchema.index({
  assignedAdmin: 1,
  assignedAdminRole: 1,
  status: 1,
});

leadSchema.index({
  createdAt: -1,
});

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;