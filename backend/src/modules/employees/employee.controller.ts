import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { EmployeeService } from "./employee.service";
import {
  createEmployeeSchema,
  createEmployeeByAdminSchema,
  updateEmployeeSchema,
  assignEmployeeSchema,
} from "./employee.validation";


export class EmployeeController {


  static async createEmployee(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const data = createEmployeeSchema.parse(req.body);

      const employee = await EmployeeService.createEmployee(
        req.user!.companyId,
        data
      );

      return res.status(201).json(employee);

    } catch (err: any) {

      return res.status(400).json({
        error: err.message
      });

    }
  }


  static async assignEmployee(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const employeeId = String(
      req.params.employeeId
    );

    const data = assignEmployeeSchema.parse(
      req.body
    );

    const employee =
      await EmployeeService.assignEmployee(
        req.user!.companyId,
        employeeId,
        data
      );

    return res.json({
      success: true,
      data: employee,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      error: error.message,
    });

  }
}


static async createEmployeeByAdmin(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const data =
      createEmployeeByAdminSchema.parse(
        req.body
      );

    const employee =
      await EmployeeService.createEmployeeByAdmin(
        req.user!.companyId,
        data
      );

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: employee,
    });

  } catch (error: any) {
    console.error(
      "Error creating employee:",
      error
    );

    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}



  static async getEmployeesByDepartment(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const departmentId = String(req.params.departmentId);


      const employees =
        await EmployeeService.getEmployeesByDepartment(
          req.user!.companyId,
          departmentId
        );


      return res.json(employees);


    } catch (err: any) {

      return res.status(400).json({
        error: err.message
      });

    }
  }






  static async getEmployeesByService(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const serviceId = String(req.params.serviceId);


      const employees =
        await EmployeeService.getEmployeesByService(
          req.user!.companyId,
          serviceId
        );


      return res.json(employees);


    } catch (err: any) {

      return res.status(400).json({
        error: err.message
      });

    }
  }






  static async updateEmployee(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const employeeId = String(req.params.employeeId);


      const data = updateEmployeeSchema.parse(req.body);


      const employee =
        await EmployeeService.updateEmployee(
          req.user!.companyId,
          employeeId,
          data
        );


      return res.json(employee);


    } catch (err: any) {

      return res.status(400).json({
        error: err.message
      });

    }
  }







  static async deleteEmployee(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {

      const employeeId = String(req.params.employeeId);


      await EmployeeService.deleteEmployee(
        req.user!.companyId,
        employeeId
      );


      return res.json({
        success: true,
      });


    } catch (err: any) {

      return res.status(400).json({
        error: err.message,
      });

    }
  }



  static async getAllEmployees(req: AuthenticatedRequest, res: Response) {

try{

const employees =
await EmployeeService.getAllEmployees(
req.user!.companyId
);


res.json({
data:employees
});


}catch(error){

res.status(500).json({
message:"Failed to fetch employees"
});

}

}


static async getAvailableUsers(
  req: AuthenticatedRequest,
  res: Response
) {

  try {

    const users =
      await EmployeeService.getAvailableUsers(
        req.user!.companyId
      );

    return res.json({
      data: users,
    });

  } catch (error: any) {

    return res.status(400).json({
      error: error.message,
    });

  }

}



}