import express from "express";
import { protect } from "../middlewares/auth/auth.middleware.js";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.use(protect);

notificationRouter.get("/", getMyNotifications);
notificationRouter.put("/:id/read", markNotificationRead);
notificationRouter.put("/read-all", markAllNotificationsRead);
notificationRouter.delete("/:id", deleteNotification);
notificationRouter.delete("/", clearAllNotifications);

export default notificationRouter;
