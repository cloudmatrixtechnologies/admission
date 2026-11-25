
const refreshToken = process.env.REFRESH_TOKEN;
console.log("Token length:", refreshToken?.length);
console.log(
  "Valid token format:",
  /^[A-Za-z0-9_-]{80,100}$/.test(refreshToken?.trim() || "")
);

if (!refreshToken) {
  console.error("REFRESH_TOKEN environment variable is missing.");
  process.exit(1);
}

const url = "http://127.0.0.1:8000/api/auth/refresh";

async function sendRefreshRequest(requestName) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const data = await response.json();

    return {
      request: requestName,
      status: response.status,
      response: data,
    };
  } catch (error) {
  return {
    request: requestName,
    error: error.message,
    cause: error.cause?.message,
    code: error.cause?.code,
  };
}
}

console.log("Sending both refresh requests concurrently...\n");

const results = await Promise.all([
  sendRefreshRequest("Request A"),
  sendRefreshRequest("Request B"),
]);

for (const result of results) {
  console.log(JSON.stringify(result, null, 2));
}

console.log("\nConcurrent refresh test completed.");

