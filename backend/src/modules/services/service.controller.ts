import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { ServiceService } from "./service.service";
import {
  createServiceSchema,
  updateServiceSchema,
} from "./service.validation";


export class ServiceController {


  // Create service
  static async createService(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const companyId = req.user!.companyId;

      const data = createServiceSchema.parse(req.body);


      const service = await ServiceService.createService(
        companyId,
        data
      );


      return res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
      });


    } catch (error) {

      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create service",
      });

    }
  }






  // Get services by department
  static async getServicesByDepartment(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const companyId = req.user!.companyId;

      const departmentId = String(req.params.departmentId);


      if (!departmentId) {
        return res.status(400).json({
          success: false,
          error: "Department ID is required",
        });
      }


      const services =
        await ServiceService.getServicesByDepartment(
          companyId,
          departmentId
        );


      return res.status(200).json({
        success: true,
        data: services,
      });


    } catch (error) {

      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get services",
      });

    }
  }








  // Update service
  static async updateService(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const companyId = req.user!.companyId;

      const serviceId = String(req.params.serviceId);


      if (!serviceId) {
        return res.status(400).json({
          success: false,
          error: "Service ID is required",
        });
      }


      const data = updateServiceSchema.parse(req.body);


      const service =
        await ServiceService.updateService(
          companyId,
          serviceId,
          data
        );


      return res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: service,
      });


    } catch (error) {

      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update service",
      });

    }
  }








  // Delete service
  static async deleteService(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const companyId = req.user!.companyId;

      const serviceId = String(req.params.serviceId);


      if (!serviceId) {
        return res.status(400).json({
          success: false,
          error: "Service ID is required",
        });
      }


      await ServiceService.deleteService(
        companyId,
        serviceId
      );


      return res.status(200).json({
        success: true,
        message: "Service deleted successfully",
      });


    } catch (error) {

      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete service",
      });

    }
  }

  static async getAllServices(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const companyId = req.user!.companyId;

    const services = await ServiceService.getAllServices(companyId);

    return res.status(200).json({
      success: true,
      data: services,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed"
    });
  }
}

}