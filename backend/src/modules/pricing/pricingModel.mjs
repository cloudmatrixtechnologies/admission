import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    tuitionFee: {
      type: Number,
      required: true,
      min: 0,
    },

    hostelFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherFees: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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

pricingSchema.index(
  {
    college: 1,
    course: 1,
    academicYear: 1,
  },
  { unique: true }
);

pricingSchema.index({
  college: 1,
  status: 1,
});

pricingSchema.index({
  course: 1,
  academicYear: 1,
});

const Pricing = mongoose.model("Pricing", pricingSchema);

export default Pricing;