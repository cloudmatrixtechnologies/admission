
import mongoose from "mongoose";

// Academic details for an individual student.
const academicSchema = new mongoose.Schema(
  {
    currentClass: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    board: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    passingYear: {
      type: Number,
      min: 1950,
      max: 2100,
    },

    marksPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    _id: false,
    strict: "throw",
  }
);

const studentSchema = new mongoose.Schema(
  {
    // Every student profile belongs to a parent account.
    parentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },

    // Null means the student does not yet have a separate login.
    studentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Verified student mobile number.
    // Optional temporarily for compatibility with existing records.
    studentMobile: {
      type: String,
      trim: true,
      immutable: true,
    },

    // Student personal details.
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return (
            value instanceof Date &&
            !Number.isNaN(value.getTime()) &&
            value < new Date()
          );
        },
        message: "Date of birth must be a valid past date.",
      },
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    religion: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    caste: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    community: {
      type: String,
      enum: ["OC", "BC", "MBC", "SC", "ST"],
    },

    motherTongue: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    // Academic information.
    academic: {
      type: academicSchema,
      default: () => ({}),
    },

    // Student profile status.
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

// Efficiently retrieve a parent's student profiles.
studentSchema.index({
  parentUser: 1,
  createdAt: -1,
});

// Prevent one student login from being linked to multiple profiles.
studentSchema.index(
  { studentUser: 1 },
  {
    unique: true,
    partialFilterExpression: {
      studentUser: { $type: "objectId" },
    },
  }
);

// Prevent duplicate student mobile numbers.
// Existing records without studentMobile are excluded.
studentSchema.index(
  { studentMobile: 1 },
  {
    unique: true,
    partialFilterExpression: {
      studentMobile: { $type: "string" },
    },
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
