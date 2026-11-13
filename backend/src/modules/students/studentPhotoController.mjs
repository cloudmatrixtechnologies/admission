import {
    uploadStudentPhoto,
    deleteStudentPhoto,
} from "../../services/storages/storageService.mjs";

export async function uploadStudentPhotoController(req, res, next) {
    let uploadedPhoto;

    try {
        const student = req.studentProfile;

        // Upload the new photo to storage.
        uploadedPhoto = await uploadStudentPhoto(
            req.file.buffer,
            student._id.toString()
        );

        const oldStorageKey = student.photo?.storageKey;

        student.photo = {
            storageKey: uploadedPhoto.storageKey,
            format: uploadedPhoto.format,
        };

        await student.save();

        // Delete the old photo only after the new photo is saved.
        if (
            oldStorageKey &&
            oldStorageKey !== uploadedPhoto.storageKey
        ) {
            try {
                await deleteStudentPhoto(oldStorageKey);
            } catch (deleteError) {
                console.error("Old student photo cleanup failed:", deleteError);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Student photo uploaded successfully.",
            student: {
                id: student._id,
                photo: {
                    available: true,
                    url: `/api/students/${student._id}/photo`,
                },
            },
        });
    } catch (error) {
        // If the upload succeeded but MongoDB save failed,
        // remove the newly uploaded photo to avoid an orphaned asset.
        if (uploadedPhoto?.storageKey) {
            try {
                await deleteStudentPhoto(uploadedPhoto.storageKey);
            } catch (deleteError) {
                console.error("New student photo cleanup failed:", deleteError);
            }
        }

        console.error("Student photo upload failed:", error);

        return next(
            Object.assign(
                new Error("Unable to upload student photo. Please try again."),
                { statusCode: 502 }
            )
        );
    }
}