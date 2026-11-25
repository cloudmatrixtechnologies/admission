const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function requireTrustedOrigin(req, res, next) {
  try {
    // Requests that do not change server data do not need this check.
    if (SAFE_METHODS.has(req.method)) {
      return next();
    }

    const origin = req.get("Origin");

    // Allow Postman and command-line requests that do not send an Origin.
    if (!origin) {
      return next();
    }

    const allowedOrigins = (process.env.FRONTEND_URLS || "http://localhost:5173")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    // Reject browser requests from origins outside our frontend allowlist.
    if (!allowedOrigins.includes(origin)) {
      return res.status(403).json({
        success: false,
        message: "Request origin is not allowed.",
      });
    }

    // Require the custom header for browser-originated state-changing requests.
    if (req.get("X-CSRF-Protection") !== "1") {
      return res.status(403).json({
        success: false,
        message: "CSRF protection header is missing or invalid.",
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}