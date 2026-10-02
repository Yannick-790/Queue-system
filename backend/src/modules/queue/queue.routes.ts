import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import { QueueController } from "./queue.controller";


const router = Router();


// ============================================================
// EMPLOYEE QUEUE
// ============================================================

router.get(
  "/my-queue",
  authenticate,
  QueueController.getMyQueue
);


router.get(
  "/next",
  authenticate,
  QueueController.getNextCustomer
);


// ============================================================
// CUSTOMER OPERATIONS
// ============================================================

router.post(
  "/call-next",
  authenticate,
  QueueController.callNext
);


router.post(
  "/complete",
  authenticate,
  QueueController.completeService
);


router.post(
  "/transfer",
  authenticate,
  QueueController.transfer
);


router.post(
  "/no-show",
  authenticate,
  QueueController.noShow
);


router.post(
  "/recall",
  authenticate,
  QueueController.recall
);


// ============================================================
// TICKET
// ============================================================

router.post(
  "/cancel",
  authenticate,
  QueueController.cancel
);


// ============================================================
// CARD
// ============================================================

router.post(
  "/return-card",
  authenticate,
  QueueController.returnCard
);


// ============================================================
// DESK
// ============================================================

router.post(
  "/desk/available",
  authenticate,
  QueueController.setDeskAvailable
);


router.post(
  "/desk/offline",
  authenticate,
  QueueController.setDeskOffline
);


export default router;