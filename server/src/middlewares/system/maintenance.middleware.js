import jwt from "jsonwebtoken";
import SystemSettings from "../../models/SystemSettings.model.js";

let cachedMaintenanceMode = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5000;

const isBypassedPath = (path = "") => {
  return (
    path === "/health" ||
    path === "/api/v1/auth/login" ||
    path === "/api/v1/auth/refresh-token" ||
    path === "/api/v1/auth/logout"
  );
};

const readMaintenanceMode = async () => {
  const now = Date.now();

  if (cachedMaintenanceMode !== null && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedMaintenanceMode;
  }

  const settings = await SystemSettings.getSingleton();
  cachedMaintenanceMode = settings.maintenanceMode;
  cacheTimestamp = now;

  return cachedMaintenanceMode;
};

export const invalidateMaintenanceCache = () => {
  cachedMaintenanceMode = null;
  cacheTimestamp = 0;
};

export const enforceMaintenanceMode = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS" || isBypassedPath(req.path)) {
      return next();
    }

    const maintenanceMode = await readMaintenanceMode();
    if (!maintenanceMode) {
      return next();
    }

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(503).json({
        success: false,
        message: "Platform is in maintenance mode. Only admins can access right now.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (decoded?.role === "admin") {
        return next();
      }
    } catch {
      // fall through to maintenance response
    }

    return res.status(503).json({
      success: false,
      message: "Platform is in maintenance mode. Only admins can access right now.",
    });
  } catch (error) {
    return next(error);
  }
};
