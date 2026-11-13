
import { fileTypeFromBuffer } from "file-type";
import { uploadStudentPhotoFile } from "./studentPhotoUpload.mjs";

const allowedImageTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

function createUploadError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

export function receiveAndValidateStudentPhoto(req, res, next) {
    uploadStudentPhotoFile(req, res, async (error) => {
        if (error) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return next(
                    createUploadError("Photo must not exceed 5 MB.", 413)
                );
            }

            if (error.code === "LIMIT_UNEXPECTED_FILE" ||
                error.code === "LIMIT_FILE_COUNT") {
                return next(
                    createUploadError("Upload one image using the photo field.", 400)
                );
            }

            if (error.message === "INVALID_STUDENT_PHOTO_TYPE") {
                return next(
                    createUploadError(
                        "Only JPEG, PNG, and WebP images are allowed.",
                        400
                    )
                );
            }

            return next(
                createUploadError("Unable to process uploaded photo.", 400)
            );
        }

        if (!req.file) {
            return next(
                createUploadError("Student photo is required.", 400)
            );
        }

        try {
            // Inspect actual file contents, not just the filename or MIME type.
            const detectedType = await fileTypeFromBuffer(req.file.buffer);

            if (!detectedType ||
                !allowedImageTypes.has(detectedType.mime) ||
                detectedType.mime !== req.file.mimetype) {
                return next(
                    createUploadError(
                        "Invalid image file. Upload a genuine JPEG, PNG, or WebP image.",
                        400
                    )
                );
            }

            req.studentPhotoFileType = detectedType;

            return next();
        } catch (validationError) {
            return next(validationError);
        }
    });
}

