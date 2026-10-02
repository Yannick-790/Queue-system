import { Router } from "express";

import { CompanyController } from "./company.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";


const router = Router();


// ======================================================
// AUTHENTICATION
// ======================================================

router.use(authenticate);


// ======================================================
// COMPANY SETUP
// ======================================================

// Update company information
router.patch(
  "/",
  authorizeRoles("ADMIN"),
  CompanyController.updateCompany
);


// Complete entire setup
router.post(
  "/complete-setup",
  authorizeRoles("ADMIN"),
  CompanyController.completeSetup
);


// Check setup status
router.get(
  "/setup-status",
  authorizeRoles("ADMIN", "MANAGER"),
  CompanyController.getSetupStatus
);


// ======================================================
// INVITE CODE
// ======================================================

router.post(
  "/generate-invite-code",
  authorizeRoles("ADMIN"),
  CompanyController.generateInviteCode
);


// ======================================================
// CARDS
// ======================================================

router.post(
  "/generate-cards",
  authorizeRoles("ADMIN"),
  CompanyController.generateCards
);


// ======================================================
// COMPANY INFORMATION
// ======================================================

router.get(
  "/",
  CompanyController.getCompanyDetails
);


router.get(
  "/departments/:departmentId/services",
  CompanyController.getServicesByDepartment
);

// ======================================================
// BUILDINGS
// ======================================================

router.post(
  "/buildings",
  authorizeRoles("ADMIN", "MANAGER"),
  CompanyController.createBuilding
);


router.get(
  "/buildings",
  CompanyController.getBuildings
);


// ======================================================
// DEPARTMENTS
// ======================================================

router.post(
  "/departments",
  authorizeRoles("ADMIN", "MANAGER"),
  CompanyController.createDepartment
);


router.get(
  "/departments",
  CompanyController.getDepartments
);


router.get(
  "/buildings/:buildingId/departments",
  CompanyController.getDepartmentsByBuilding
);


// ======================================================
// QUEUE CONFIGURATION
// ======================================================

router.patch(
  "/routing-mode",
  authorizeRoles("ADMIN"),
  CompanyController.updateRoutingMode
);


export default router;