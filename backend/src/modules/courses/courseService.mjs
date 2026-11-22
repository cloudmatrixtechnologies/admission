import Course from "./courseModel.mjs";

const allowedCourseFields = [
  "courseName",
  "courseCode",
  "category",
  "description",
  "duration",
  "status",
];

export const createCourse = async (courseData, userId) => {
  const course = await Course.create({
    ...courseData,
    createdBy: userId,
  });

  return course;
};

export const getActiveCourses = async (filters = {}) => {
  const searchFilters = {
    status: "active",
  };

  if (filters.category) {
    searchFilters.category = filters.category;
  }

  return Course.find(searchFilters)
    .select("-createdBy")
    .sort({ courseName: 1 })
    .lean();
};

export const getCourseById = async (courseId) => {
  return Course.findOne({
    _id: courseId,
    status: "active",
  })
    .select("-createdBy")
    .lean();
};

export const getAllCourses = async (filters = {}) => {
  const searchFilters = {};

  if (filters.category) {
    searchFilters.category = filters.category;
  }

  if (filters.status) {
    searchFilters.status = filters.status;
  }

  return Course.find(searchFilters)
    .sort({ createdAt: -1 })
    .lean();
};

export const updateCourse = async (courseId, updateData) => {
  const safeUpdateData = {};

  for (const field of allowedCourseFields) {
    if (Object.hasOwn(updateData, field)) {
      safeUpdateData[field] = updateData[field];
    }
  }

  return Course.findByIdAndUpdate(
    courseId,
    {
      $set: safeUpdateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteCourse = async (courseId) => {
  return Course.findByIdAndUpdate(
    courseId,
    {
      $set: {
        status: "inactive",
      },
    },
    {
      new: true,
    }
  );
};