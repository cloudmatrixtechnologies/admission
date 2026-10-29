
export function allowRoles(...allowedRoles) {
  return function roleAuthorization(req, res, next) {
    // requireAuth must run before this middleware.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource.",
      });
    }

    return next();
  };
}
