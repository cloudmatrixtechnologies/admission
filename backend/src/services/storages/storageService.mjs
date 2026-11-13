
const storageProvider = process.env.STORAGE_PROVIDER || "cloudinary";

let activeProvider;

if (storageProvider === "cloudinary") {
  activeProvider = await import("./cloudinaryStorage.mjs");
} else if (storageProvider === "aws") {
  activeProvider = await import("./s3Storage.mjs");
} else {
  throw new Error(
    `Unsupported storage provider: ${storageProvider}`
  );
}

export async function uploadStudentPhoto(fileBuffer, studentId) {
  return activeProvider.uploadStudentPhoto(fileBuffer, studentId);
}

export async function deleteStudentPhoto(storageKey) {
  return activeProvider.deleteStudentPhoto(storageKey);
}

export function generateStudentPhotoUrl(storageKey, format) {
  if (!activeProvider.generateStudentPhotoUrl) {
    throw new Error("PHOTO_VIEWING_NOT_SUPPORTED_BY_STORAGE_PROVIDER");
  }

  return activeProvider.generateStudentPhotoUrl(storageKey, format);
}
