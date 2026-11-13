
import cloudinary from "../../config/cloudinary.mjs";

const STUDENT_PHOTO_FOLDER = "admission-panel/students";

const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp"];

// Upload a student photo as an authenticated Cloudinary asset.
export async function uploadStudentPhoto(fileBuffer, studentId) {
  if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
    throw new Error("INVALID_IMAGE_BUFFER");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: STUDENT_PHOTO_FOLDER,
        public_id: `${studentId}-${Date.now()}`,
        resource_type: "image",
        type: "authenticated",
        allowed_formats: ALLOWED_FORMATS,
        transformation: [
          {
            width: 600,
            height: 600,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result?.public_id || !result?.format) {
          return reject(new Error("PHOTO_UPLOAD_FAILED"));
        }

        resolve({
          storageKey: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

// Generate a temporary signed URL for viewing an authenticated photo.
export function generateStudentPhotoUrl(storageKey, format) {
  if (
    !storageKey ||
    typeof storageKey !== "string" ||
    !ALLOWED_FORMATS.includes(format)
  ) {
    throw new Error("INVALID_STUDENT_PHOTO_DETAILS");
  }

  const expiresAt = Math.floor(Date.now() / 1000) + 300;

  return cloudinary.utils.private_download_url(
    storageKey,
    format,
    {
      resource_type: "image",
      type: "authenticated",
      expires_at: expiresAt,
      attachment: false,
    }
  );
}

// Delete an authenticated student photo.
export async function deleteStudentPhoto(storageKey) {
  if (!storageKey || typeof storageKey !== "string") {
    return;
  }

  const result = await cloudinary.uploader.destroy(storageKey, {
    resource_type: "image",
    type: "authenticated",
    invalidate: true,
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("PHOTO_DELETE_FAILED");
  }
}
