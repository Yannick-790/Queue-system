import { db } from "../../config/db";

export class ServiceService {

  // Create service inside a department
  static async createService(
    companyId: string,
    data: {
      departmentId: string;
      name: string;
      description?: string | undefined;
    }
  ) {

    const department = await db.department.findFirst({
      where: {
        id: data.departmentId,
        building: {
          companyId,
        },
      },
    });


    if (!department) {
      throw new Error(
        "Department not found or does not belong to your company."
      );
    }


    return await db.service.create({
      data: {
        departmentId: data.departmentId,
        name: data.name,
        description: data.description ?? null,
      },
    });
  }



  // Get all services in a department
  static async getServicesByDepartment(
    companyId: string,
    departmentId: string
  ) {

    const department = await db.department.findFirst({
      where: {
        id: departmentId,
        building: {
          companyId,
        },
      },
    });


    if (!department) {
      throw new Error(
        "Department not found or does not belong to your company."
      );
    }


    return await db.service.findMany({
      where: {
        departmentId,
      },
      include: {
        employees: {
          include: {
            user: true,
          },
        },
        tickets: true,
      },
    });
  }



  // Update service name
  static async updateService(
    companyId: string,
    serviceId: string,
    data: {
      name: string;
      description?: string | undefined;
    }
  ) {

    const service = await db.service.findFirst({
      where: {
        id: serviceId,
        department: {
          building: {
            companyId,
          },
        },
      },
    });


    if (!service) {
      throw new Error(
        "Service not found or does not belong to your company."
      );
    }


    return await db.service.update({
      where: {
        id: serviceId,
      },
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
  }




  // Delete service
  static async deleteService(
    companyId: string,
    serviceId: string
  ) {

    const service = await db.service.findFirst({
      where: {
        id: serviceId,
        department: {
          building: {
            companyId,
          },
        },
      },
    });


    if (!service) {
      throw new Error(
        "Service not found or does not belong to your company."
      );
    }


    return await db.service.delete({
      where: {
        id: serviceId,
      },
    });
  }

  static async getAllServices(companyId: string) {

  return await db.service.findMany({
    where: {
      department: {
        building: {
          companyId,
        },
      },
    },
    include: {
      department: true,
    },
  });

}

}