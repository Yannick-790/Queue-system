import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import { ReportController } from "./report.controller";


const router = Router();


router.get(
  "/queue",
  authenticate,
  ReportController.queueStatistics
);


router.get(
  "/cards",
  authenticate,
  ReportController.cardStatistics
);


router.get(
  "/service-time",
  authenticate,
  ReportController.averageServiceTime
);


router.get(
  "/waiting-time",
  authenticate,
  ReportController.averageWaitingTime
);


router.get(
  "/employees",
  authenticate,
  ReportController.employeePerformance
);


router.get(
  "/departments",
  authenticate,
  ReportController.departmentLoad
);


export default router;