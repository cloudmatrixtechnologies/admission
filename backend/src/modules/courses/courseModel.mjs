import mongoose from "mongoose";

export const courseCategories = [
  "Engineering",
  "Arts & Science",
  "Diploma",
  "ITI",
  "Paramedical",
  "Polytechnic",
];

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    courseCode: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 50,
    },

    category: {
      type: String,
      required: true,
      enum: courseCategories,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    duration: {
      type: Number,
      min: 1,
      max: 10,
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
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

courseSchema.index(
  { category: 1, courseName: 1 },
  { unique: true }
);

courseSchema.index({
  category: 1,
  status: 1,
});

const Course = mongoose.model("Course", courseSchema);

export default Course;