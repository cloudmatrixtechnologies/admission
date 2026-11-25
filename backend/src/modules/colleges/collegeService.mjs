
import College from "./collegeModel.mjs";

const allowedCollegeFields = [
  "collegeName",
  "category",
  "description",
  "address",
  "district",
  "state",
  "pincode",
  "contactPerson",
  "mobileNumber",
  "email",
  "website",
  "establishedYear",
  "affiliation",
];

export const createCollege = async (collegeData, userId) => {
  const college = await College.create({
    ...collegeData,
    collegeAdmin: userId,
    createdBy: userId,
  });

  return college;
};

export const getPublishedColleges = async (filters = {}) => {
  const searchFilters = {
    status: "active",
    visibility: "published",
  };

  if (filters.category) {
    searchFilters.category = filters.category;
  }

  if (filters.district) {
    searchFilters.district = filters.district;
  }

  return College.find(searchFilters)
    .select("-createdBy -collegeAdmin")
    .sort({ createdAt: -1 })
    .lean();
};

export const getCollegeById = async (collegeId) => {
  return College.findOne({
    _id: collegeId,
    status: "active",
    visibility: "published",
  })
    .select("-createdBy -collegeAdmin")
    .lean();
};

export const getMyColleges = async (userId) => {
  return College.find({
    collegeAdmin: userId,
  })
    .sort({ createdAt: -1 })
    .lean();
};

export const updateCollege = async (
  collegeId,
  userId,
  updateData
) => {
  const safeUpdateData = {};

  for (const field of allowedCollegeFields) {
    if (Object.hasOwn(updateData, field)) {
      safeUpdateData[field] = updateData[field];
    }
  }

  return College.findOneAndUpdate(
    {
      _id: collegeId,
      collegeAdmin: userId,
    },
    {
      $set: safeUpdateData,
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};
