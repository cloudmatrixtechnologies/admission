import Pricing from "./pricingModel.mjs";
import College from "../colleges/collegeModel.mjs";
import Course from "../courses/courseModel.mjs";

const calculateTotalFee = (data) => {
  return (
    Number(data.tuitionFee || 0) +
    Number(data.hostelFee || 0) +
    Number(data.otherFees || 0)
  );
};

export const createPricing = async (pricingData, userId) => {
  const {
    college,
    course,
    academicYear,
    tuitionFee,
    hostelFee = 0,
    otherFees = 0,
  } = pricingData;

  const collegeData = await College.findOne({
    _id: college,
    collegeAdmin: userId,
  });

  if (!collegeData) {
    return null;
  }

  const courseData = await Course.findOne({
    _id: course,
    category: collegeData.category,
    status: "active",
  });

  if (!courseData) {
    throw Object.assign(
      new Error("Invalid course for this college category"),
      { statusCode: 400 }
    );
  }

  const existingPricing = await Pricing.findOne({
    college,
    course,
    academicYear,
  });

  if (existingPricing) {
    throw Object.assign(
      new Error("Pricing already exists for this course and academic year"),
      { statusCode: 409 }
    );
  }

  return Pricing.create({
    college,
    course,
    academicYear,
    tuitionFee,
    hostelFee,
    otherFees,
    totalFee: calculateTotalFee({
      tuitionFee,
      hostelFee,
      otherFees,
    }),
    createdBy: userId,
  });
};

export const getCollegePricing = async (collegeId, filters = {}) => {
  const searchFilters = {
    college: collegeId,
    status: "active",
  };

  if (filters.course) {
    searchFilters.course = filters.course;
  }

  if (filters.academicYear) {
    searchFilters.academicYear = filters.academicYear;
  }

  const college = await College.findOne({
    _id: collegeId,
    status: "active",
    visibility: "published",
  });

  if (!college) {
    return null;
  }

  return Pricing.find(searchFilters)
    .populate("course", "courseName courseCode category duration")
    .select("-createdBy")
    .sort({ academicYear: -1 })
    .lean();
};

export const getMyPricing = async (userId) => {
  const colleges = await College.find({
    collegeAdmin: userId,
  }).select("_id");

  const collegeIds = colleges.map((college) => college._id);

  return Pricing.find({
    college: { $in: collegeIds },
  })
    .populate("college", "collegeName")
    .populate("course", "courseName courseCode")
    .sort({ createdAt: -1 })
    .lean();
};

export const updatePricing = async (
  pricingId,
  userId,
  updateData
) => {
  const pricing = await Pricing.findOne({
    _id: pricingId,
  }).populate("college", "collegeAdmin");

  if (
    !pricing ||
    String(pricing.college.collegeAdmin) !== String(userId)
  ) {
    return null;
  }

  const allowedFields = [
    "academicYear",
    "tuitionFee",
    "hostelFee",
    "otherFees",
    "status",
  ];

  for (const field of allowedFields) {
    if (Object.hasOwn(updateData, field)) {
      pricing[field] = updateData[field];
    }
  }

  pricing.totalFee = calculateTotalFee({
    tuitionFee: pricing.tuitionFee,
    hostelFee: pricing.hostelFee,
    otherFees: pricing.otherFees,
  });

  await pricing.save();

  return pricing;
};

export const deletePricing = async (pricingId, userId) => {
  const pricing = await Pricing.findOne({
    _id: pricingId,
  }).populate("college", "collegeAdmin");

  if (
    !pricing ||
    String(pricing.college.collegeAdmin) !== String(userId)
  ) {
    return null;
  }

  pricing.status = "inactive";

  await pricing.save();

  return pricing;
};