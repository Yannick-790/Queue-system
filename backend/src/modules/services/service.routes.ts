import { Router } from "express";
import { ServiceController } from "./service.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();


// Create service
router.post(
  "/",
  authenticate,
  ServiceController.createService
);


router.get(
  "/",
  authenticate,
  ServiceController.getAllServices
);


// Get services by department
router.get(
  "/department/:departmentId",
  authenticate,
  ServiceController.getServicesByDepartment
);


// Update service
router.put(
  "/:serviceId",
  authenticate,
  ServiceController.updateService
);


// Delete service
router.delete(
  "/:serviceId",
  authenticate,
  ServiceController.deleteService
);


export default router;