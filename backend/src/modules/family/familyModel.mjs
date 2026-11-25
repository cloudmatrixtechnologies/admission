
import mongoose from "mongoose";

const parentDetailsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    mobileNumber: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    annualIncome: {
      type: Number,
      min: 0,
      max: 1000000000,
    },
    education: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false, strict: "throw" }
);

const guardianDetailsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    relationship: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    mobileNumber: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false, strict: "throw" }
);

const siblingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    education: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false, strict: "throw" }
);

const familySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      immutable: true,
    },

    father: {
      type: parentDetailsSchema,
      default: () => ({}),
    },

    mother: {
      type: parentDetailsSchema,
      default: () => ({}),
    },

    guardian: {
      type: guardianDetailsSchema,
      default: undefined,
    },

    siblings: {
      type: [siblingSchema],
      default: [],
    },

    annualFamilyIncome: {
      type: Number,
      min: 0,
      max: 1000000000,
    },

    totalFamilyMembers: {
      type: Number,
      min: 1,
      max: 100,
    },


    residentialAddress: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    district: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    pincode: {
      type: String,
      trim: true,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

// Each student can have only one family details document.
familySchema.index({ student: 1 }, { unique: true });

const Family = mongoose.model("Family", familySchema);

export default Family;
