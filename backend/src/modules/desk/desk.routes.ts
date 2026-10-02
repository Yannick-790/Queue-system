import { Router } from "express";

import { DeskController } from "./desk.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

router.use(authenticate);


// ======================================================
// DESKS
// ======================================================

// Get all desks
router.get(
  "/",
  authorizeRoles("ADMIN", "MANAGER"),
  DeskController.getAllDesks
);

// Create desk
router.post(
  "/",
  authorizeRoles("ADMIN", "MANAGER"),
  DeskController.createDesk
);

// Get desks belonging to department
router.get(
  "/department/:departmentId",
  authorizeRoles("ADMIN", "MANAGER"),
  DeskController.getDesksByDepartment
);


// ======================================================
// EMPLOYEE DESK WORKFLOW
// ======================================================

// Get available desks for employee
router.get(
  "/available/:employeeId",
  authorizeRoles("ADMIN", "MANAGER", "EMPLOYEE"),
  DeskController.getAvailableDesks
);


// Admin / Manager assigns employee to desk
router.post(
  "/:deskId/assign/:employeeId",
  authorizeRoles("ADMIN", "MANAGER"),
  DeskController.assignEmployeeToDesk
);

// Employee claims a desk
router.post(
  "/:deskId/claim/:employeeId",
  authorizeRoles("ADMIN", "MANAGER", "EMPLOYEE"),
  DeskController.claimDesk
);

// Employee releases desk
router.post(
  "/release/:employeeId",
  authorizeRoles("ADMIN", "MANAGER", "EMPLOYEE"),
  DeskController.releaseDesk
);


// ======================================================
// ADMIN / MANAGER MANAGEMENT
// ======================================================

// Update desk
router.patch(
  "/:deskId",
  authorizeRoles("ADMIN", "MANAGER"),
  DeskController.updateDesk
);

// Update desk status
router.patch(
  "/:deskId/status",
  authorizeRoles("ADMIN", "MANAGER"),
  DeskController.updateDeskStatus
);

// Delete desk
router.delete(
  "/:deskId",
  authorizeRoles("ADMIN", "MANAGER"),
  DeskController.deleteDesk
);

export default router;