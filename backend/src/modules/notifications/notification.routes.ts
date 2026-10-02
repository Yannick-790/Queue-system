import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { NotificationController } from "./notification.controller";


const router = Router();


router.get(
  "/",
  authenticate,
  NotificationController.getNotifications
);


router.patch(
  "/:notificationId/read",
  authenticate,
  NotificationController.markRead
);


router.delete(
  "/:notificationId",
  authenticate,
  NotificationController.delete
);



export default router;