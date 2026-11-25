
import fs from "node:fs";

const imagePath = process.argv[2];
const cookie = process.env.ADMISSION_COOKIE;

if (!imagePath || !cookie) {
  console.log("Usage: node test-photo-mime.mjs <PNG-file-path>");
  console.log("Set ADMISSION_COOKIE before running.");
  process.exit(1);
}

const studentId = "6ae203665a5c9016e7cba4ec";

try {
  const imageBuffer = fs.readFileSync(imagePath);

  // Deliberately declare PNG bytes as JPEG.
  const imageBlob = new Blob([imageBuffer], {
    type: "image/jpeg",
  });

  const formData = new FormData();
  formData.append("photo", imageBlob, "test.png");

  const response = await fetch(
    `http://localhost:8000/api/students/${studentId}/photo`,
    {
      method: "PUT",
      headers: {
        Cookie: cookie,
      },
      body: formData,
    }
  );

  console.log("HTTP Status:", response.status);
  console.log("Response:", await response.json());
} catch (error) {
  console.error("Test failed:", error);
  console.error("Cause:", error.cause);
}
