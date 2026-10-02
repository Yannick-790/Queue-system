import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";

import { EmployeeController } from "./employee.controller";

import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();


// ======================================================
// CREATE NEW EMPLOYEE
// ======================================================
// Decide who can create.
// Usually ADMIN + MANAGER.

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  EmployeeController.createEmployee
);


// ======================================================
// CREATE EMPLOYEE BY ADMIN
// ======================================================
// ADMIN ONLY

router.post(
  "/create",
  authenticate,
  authorizeRoles("ADMIN"),
  EmployeeController.createEmployeeByAdmin
);


// ======================================================
// AVAILABLE USERS
// ======================================================
// ADMIN + MANAGER

router.get(
  "/available-users",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  EmployeeController.getAvailableUsers
);


// ======================================================
// ALL EMPLOYEES
// ======================================================
// ADMIN + MANAGER

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  EmployeeController.getAllEmployees
);


// ======================================================
// EMPLOYEES BY DEPARTMENT
// ======================================================
// ADMIN + MANAGER

router.get(
  "/department/:departmentId",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  EmployeeController.getEmployeesByDepartment
);


// ======================================================
// EMPLOYEES BY SERVICE
// ======================================================
// ADMIN + MANAGER

router.get(
  "/service/:serviceId",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  EmployeeController.getEmployeesByService
);


// ======================================================
// ASSIGN EXISTING EMPLOYEE
// ======================================================
// ADMIN + MANAGER

router.put(
  "/:employeeId/assign",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  EmployeeController.assignEmployee
);


// ======================================================
// UPDATE EMPLOYEE
// ======================================================
// ADMIN + MANAGER

router.put(
  "/:employeeId",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  EmployeeController.updateEmployee
);


// ======================================================
// DELETE EMPLOYEE
// ======================================================
// ADMIN ONLY

router.delete(
  "/:employeeId",
  authenticate,
  authorizeRoles("ADMIN"),
  EmployeeController.deleteEmployee
);


export default router;