import { Response } from 'express';
import { CompanyService } from './company.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class CompanyController {
  // Get full company hierarchy (Buildings -> Departments -> Services & Desks)
  static async getCompanyDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const companyId = req.user!.companyId;
      const details = await CompanyService.getCompanyDetails(companyId);
      return res.status(200).json(details);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Buildings
  static async createBuilding(req: AuthenticatedRequest, res: Response) {
    try {
      const companyId = req.user!.companyId;
      const building = await CompanyService.createBuilding(companyId, req.body);
      return res.status(201).json({ message: 'Building created successfully', building });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async getBuildings(req: AuthenticatedRequest, res: Response) {
    try {
      const companyId = req.user!.companyId;
      const buildings = await CompanyService.getBuildings(companyId);
      return res.status(200).json(buildings);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Departments
static async createDepartment(req: AuthenticatedRequest, res: Response) {
  try {
    const companyId = req.user!.companyId;

    const department =
      await CompanyService.createDepartment(
        companyId,
        req.body
      );

    return res.status(201).json({
      message: "Department created successfully",
      department,
    });

  } catch (err: any) {

    return res.status(400).json({
      error: err.message,
    });

  }
}



static async getDepartments(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const companyId = req.user!.companyId;

    const departments =
      await CompanyService.getDepartments(
        companyId
      );


    return res.status(200).json(
      departments
    );


  } catch (err: any) {

    return res.status(400).json({
      error: err.message,
    });

  }
}



static async getDepartmentsByBuilding(
  req: AuthenticatedRequest,
  res: Response
) {

  try {

    const companyId = req.user!.companyId;

    const { buildingId } = req.params;


    if (!buildingId || Array.isArray(buildingId)) {

      return res.status(400).json({
        error: "Invalid building ID",
      });

    }


    const departments =
      await CompanyService.getDepartmentsByBuilding(
        companyId,
        buildingId
      );


    return res.status(200).json(
      departments
    );


  } catch (err: any) {

    return res.status(400).json({
      error: err.message,
    });

  }

}

  // Routing Mode Toggle (FIXED_FLOW vs FLEXIBLE_FLOW)
 static async updateRoutingMode(
req: AuthenticatedRequest,
res: Response
) {

try {


const companyId = req.user!.companyId;


const { routingMode } = req.body;



if(
routingMode !== "FIXED_FLOW" &&
routingMode !== "FLEXIBLE_FLOW"
){

return res.status(400).json({

success:false,

error:
"Routing mode must be FIXED_FLOW or FLEXIBLE_FLOW."

});

}



const updated =
await CompanyService.updateRoutingMode(
companyId,
routingMode
);



return res.status(200).json({

success:true,

message:
"Routing mode updated successfully.",

data:updated

});



}
catch(err:any){


return res.status(400).json({

success:false,

error:err.message

});


}

}

static async updateCompany(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const companyId = req.user!.companyId;

    const company =
      await CompanyService.updateCompany(
        companyId,
        req.body
      );

    return res.json({
      success: true,
      message: "Company updated successfully.",
      data: company,
    });

  } catch (err: any) {

    return res.status(400).json({
      success: false,
      error: err.message,
    });

  }
}


static async generateInviteCode(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const companyId = req.user!.companyId;

    const result =
      await CompanyService.generateInviteCode(
        companyId
      );

    return res.json({
      success: true,
      data: result,
    });

  } catch (err: any) {

    return res.status(400).json({
      success: false,
      error: err.message,
    });

  }
}






static async generateCards(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const companyId = req.user!.companyId;

    const { quantity } = req.body;

    const result =
      await CompanyService.generateCards(
        companyId,
        quantity
      );

    return res.json({
      success: true,
      message: "Cards generated successfully.",
      data: result,
    });

  } catch (err: any) {

    return res.status(400).json({
      success: false,
      error: err.message,
    });

  }
}

static async getSetupStatus(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const companyId = req.user!.companyId;

    const status =
      await CompanyService.getSetupStatus(
        companyId
      );

    return res.status(200).json({
      success: true,
      data: status,
    });

  } catch (err: any) {

    return res.status(400).json({
      success: false,
      error: err.message,
    });

  }
}


static async completeSetup(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const companyId = req.user!.companyId;

    const company =
      await CompanyService.completeSetup(companyId);

    return res.status(200).json({
      success: true,
      message: "Company setup completed successfully.",
      data: company,
    });

  } catch (err: any) {

    return res.status(400).json({
      success: false,
      error: err.message,
    });

  }
}


static async getServicesByDepartment(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const companyId = req.user!.companyId;
    const departmentId = String(req.params.departmentId);

    if (!departmentId) {
      return res.status(400).json({
        error: "Invalid department ID.",
      });
    }

    const services =
      await CompanyService.getServicesByDepartment(
        companyId,
        departmentId
      );

    return res.status(200).json({
      data: services,
    });

  } catch (err: any) {
    return res.status(400).json({
      error: err.message,
    });
  }
}

}