import { Response } from "express";
import { DeskStatus } from "@prisma/client";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { DeskService } from "./desk.service";
import {
  createDeskSchema,
  updateDeskSchema,
  updateDeskStatusSchema,
} from "./desk.validation";

export class DeskController {

  // Create Desk
  static async createDesk(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const companyId = req.user!.companyId;

      const data = createDeskSchema.parse(req.body);

      const desk = await DeskService.createDesk(
        companyId,
        data
      );

      return res.status(201).json({
        success: true,
        message: "Desk created successfully.",
        data: desk,
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create desk.",
      });
    }
  }





  // Get Desks by Department
  static async getDesksByDepartment(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const companyId = req.user!.companyId;

      const departmentId = String(req.params.departmentId);

      if (!departmentId) {
        return res.status(400).json({
          success: false,
          error: "Department ID is required.",
        });
      }

      const desks =
        await DeskService.getDesksByDepartment(
          companyId,
          departmentId
        );

      return res.status(200).json({
        success: true,
        data: desks,
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve desks.",
      });
    }
  }





  // Update Desk
  static async updateDesk(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const companyId = req.user!.companyId;

      const deskId = String(req.params.deskId);

      if (!deskId) {
        return res.status(400).json({
          success: false,
          error: "Desk ID is required.",
        });
      }

      const data = updateDeskSchema.parse(req.body);

      const desk = await DeskService.updateDesk(
        companyId,
        deskId,
        data
      );

      return res.status(200).json({
        success: true,
        message: "Desk updated successfully.",
        data: desk,
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update desk.",
      });
    }
  }





  // Update Desk Status
  // Update Desk Status
static async updateDeskStatus(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const companyId = req.user!.companyId;

    const deskId = String(req.params.deskId);

    if (!deskId) {
      return res.status(400).json({
        success: false,
        error: "Desk ID is required.",
      });
    }

    const data =
      updateDeskStatusSchema.parse(req.body);

    const desk =
      await DeskService.updateDeskStatus(
        companyId,
        deskId,
        data.status
      );

    return res.status(200).json({
      success: true,
      message: "Desk status updated successfully.",
      data: desk,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update desk status.",
    });
  }
}





  // Delete Desk
  static async deleteDesk(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const companyId = req.user!.companyId;

      const deskId = String(req.params.deskId);

      if (!deskId) {
        return res.status(400).json({
          success: false,
          error: "Desk ID is required.",
        });
      }

      await DeskService.deleteDesk(
        companyId,
        deskId
      );

      return res.status(200).json({
        success: true,
        message: "Desk deleted successfully.",
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete desk.",
      });
    }
  }



  // Get all desks belonging to company
static async getAllDesks(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const companyId = req.user!.companyId;

    const desks =
      await DeskService.getAllDesks(companyId);

    return res.status(200).json({
      success: true,
      data: desks,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to retrieve desks.",
    });
  }
}


// =====================================================
// GET AVAILABLE DESKS FOR EMPLOYEE
// =====================================================

static async getAvailableDesks(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const companyId = req.user!.companyId;
    const employeeId = String(req.params.employeeId);

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: "Employee ID is required.",
      });
    }

    const desks = await DeskService.getAvailableDesks(
      companyId,
      employeeId
    );

    return res.status(200).json({
      success: true,
      data: desks,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to retrieve available desks.",
    });
  }
}


// =====================================================
// CLAIM DESK
// =====================================================

static async claimDesk(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const companyId = req.user!.companyId;
    const employeeId = String(req.params.employeeId);
    const deskId = String(req.params.deskId);

    if (!employeeId || !deskId) {
      return res.status(400).json({
        success: false,
        error: "Employee ID and desk ID are required.",
      });
    }

    const assignment = await DeskService.claimDesk(
      companyId,
      employeeId,
      deskId
    );

    return res.status(200).json({
      success: true,
      message: "Desk claimed successfully.",
      data: assignment,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to claim desk.",
    });
  }
}


// =====================================================
// RELEASE DESK
// =====================================================

static async releaseDesk(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const companyId = req.user!.companyId;
    const employeeId = String(req.params.employeeId);

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: "Employee ID is required.",
      });
    }

    const desk = await DeskService.releaseDesk(
      companyId,
      employeeId
    );

    return res.status(200).json({
      success: true,
      message: "Desk released successfully.",
      data: desk,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to release desk.",
    });
  }
}


// =====================================================
// ASSIGN EMPLOYEE TO DESK
// =====================================================

static async assignEmployeeToDesk(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const companyId = req.user!.companyId;

    const employeeId = String(req.params.employeeId);
    const deskId = String(req.params.deskId);

    if (!employeeId || !deskId) {
      return res.status(400).json({
        success: false,
        error: "Employee ID and desk ID are required.",
      });
    }

    const employee = await DeskService.assignEmployeeToDesk(
      companyId,
      employeeId,
      deskId
    );

    return res.status(200).json({
      success: true,
      message: "Employee assigned to desk successfully.",
      data: employee,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to assign employee to desk.",
    });
  }
}
}