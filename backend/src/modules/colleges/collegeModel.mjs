
import mongoose from "mongoose";

const collegeCategories = [
  "Engineering",
  "Arts & Science",
  "Diploma",
  "ITI",
  "Paramedical",
  "Polytechnic",
];

const collegeSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      required: true,
      enum: collegeCategories,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    pincode: {
      type: String,
      trim: true,
      match: [/^[0-9]{6}$/, "Enter a valid 6-digit pincode."],
    },

    contactPerson: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    mobileNumber: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, "Enter a valid mobile number."],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    website: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    establishedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },

    affiliation: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    collegeAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    visibility: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

collegeSchema.index({
  category: 1,
  visibility: 1,
  status: 1,
});

collegeSchema.index({
  collegeAdmin: 1,
  createdAt: -1,
});

const College = mongoose.model("College", collegeSchema);

export default College;
