import { db } from "../../config/db";
import { DeskStatus } from "@prisma/client";

export class DeskService {

  // =====================================================
  // CREATE DESK
  // =====================================================

  static async createDesk(
    companyId: string,
   data: {
  departmentId: string;
  serviceId: string;
  name: string;
}


  ) {


    const service = await db.service.findFirst({
  where: {
    id: data.serviceId,
    departmentId: data.departmentId,
  },
});

if (!service) {
  throw new Error(
    "Service not found or does not belong to this department."
  );
}

    // Make sure department belongs to this company
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

    // Prevent duplicate desk name inside same department
    const existingDesk = await db.desk.findFirst({
      where: {
        departmentId: data.departmentId,
        name: data.name,
      },
    });

    if (existingDesk) {
      throw new Error(
        "A desk with this name already exists in this department."
      );
    }

   return await db.desk.create({
  data: {
    departmentId: data.departmentId,
    serviceId: data.serviceId,
    name: data.name,
    status: DeskStatus.OFFLINE,
  },

  include: {
    department: {
      include: {
        building: true,
        services: true,
      },
    },

    service: true,
  },
});
  }


  // =====================================================
  // GET DESKS BY DEPARTMENT
  // =====================================================

  static async getDesksByDepartment(
    companyId: string,
    departmentId: string
  ) {

    // Verify department belongs to company
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

    return await db.desk.findMany({
      where: {
        departmentId,
      },

      include: {
  service: {
    select: {
      id: true,
      name: true,
    },
  },

  department: {
    select: {
      id: true,
      name: true,

      building: {
              select: {
                id: true,
                name: true,
              },
            },

            services: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        name: "asc",
      },
    });
  }


  // =====================================================
  // GET ALL DESKS FOR COMPANY
  // =====================================================
static async getAllDesks(companyId: string) {

  return await db.desk.findMany({
    where: {
      department: {
        building: {
          companyId,
        },
      },
    },

    include: {
  service: {
    select: {
      id: true,
      name: true,
    },
  },

  department: {
    include: {
      building: {
        select: {
          id: true,
          name: true,
        },
      },

      services: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  employee: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
}


// =====================================================
// GET AVAILABLE DESKS FOR EMPLOYEE
// =====================================================

static async getAvailableDesks(
  companyId: string,
  employeeId: string
) {

  const employee = await db.employee.findFirst({
    where: {
      id: employeeId,
      user: {
        companyId,
      },
    },

    select: {
      id: true,
      departmentId: true,
      serviceId: true,
      deskId: true,
    },
  });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  if (!employee.departmentId || !employee.serviceId) {
    throw new Error(
      "Employee department or service is not assigned."
    );
  }

  return await db.desk.findMany({
    where: {
      departmentId: employee.departmentId,
      serviceId: employee.serviceId,

      status: DeskStatus.AVAILABLE,

      employee: null,
    },

    include: {
      department: {
        select: {
          id: true,
          name: true,

          building: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },

      service: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
}






// =====================================================
// CLAIM DESK
// =====================================================

static async claimDesk(
  companyId: string,
  employeeId: string,
  deskId: string
) {

  return await db.$transaction(async (tx) => {

    const employee = await tx.employee.findFirst({
      where: {
        id: employeeId,

        user: {
          companyId,
        },
      },

      select: {
        id: true,
        departmentId: true,
        serviceId: true,
        deskId: true,
      },
    });

    if (!employee) {
      throw new Error("Employee not found.");
    }

    if (!employee.departmentId || !employee.serviceId) {
      throw new Error(
        "Employee department or service is not assigned."
      );
    }

    // Employee already has a desk
    if (employee.deskId) {
      throw new Error(
        "You already have a desk."
      );
    }

    // Find the requested desk
    const desk = await tx.desk.findFirst({
      where: {
        id: deskId,

        departmentId: employee.departmentId,
        serviceId: employee.serviceId,

        status: DeskStatus.AVAILABLE,

        employee: null,
      },
    });

    if (!desk) {
      throw new Error(
        "This desk is no longer available."
      );
    }

    // Assign employee to desk
    await tx.employee.update({
      where: {
        id: employeeId,
      },

      data: {
        deskId: desk.id,
      },
    });

    // Mark desk busy
    await tx.desk.update({
      where: {
        id: desk.id,
      },

      data: {
        status: DeskStatus.BUSY,
      },
    });

    // Record assignment
    const assignment =
  await tx.deskAssignment.create({
    data: {
      deskId: desk.id,
      employeeId,
      startedAt: new Date(),
    },

        include: {
          desk: {
            include: {
              service: true,
              department: true,
            },
          },
        },
      });

    return assignment;
  });
}







// =====================================================
// RELEASE DESK
// =====================================================

static async releaseDesk(
  companyId: string,
  employeeId: string
) {

  return await db.$transaction(async (tx) => {

    const employee = await tx.employee.findFirst({
      where: {
        id: employeeId,

        user: {
          companyId,
        },
      },

      select: {
        id: true,
        deskId: true,
      },
    });

    if (!employee) {
      throw new Error("Employee not found.");
    }

    if (!employee.deskId) {
      throw new Error(
        "You do not currently have a desk."
      );
    }

    const deskId = employee.deskId;

    // Close assignment
    await tx.deskAssignment.updateMany({
      where: {
        employeeId,
        deskId,
        endedAt: null,
      },

      data: {
        endedAt: new Date(),
      },
    });

    // Remove employee from desk
    await tx.employee.update({
      where: {
        id: employeeId,
      },

      data: {
        deskId: null,
      },
    });

    // Make desk available again
    const desk = await tx.desk.update({
      where: {
        id: deskId,
      },

      data: {
        status: DeskStatus.AVAILABLE,
      },

      include: {
        service: true,
        department: true,
      },
    });

    return desk;
  });
}

static async assignEmployeeToDesk(
  companyId: string,
  employeeId: string,
  deskId: string
) {
  return await db.$transaction(async (tx) => {

    // =====================================================
    // FIND EMPLOYEE
    // =====================================================

    const employee = await tx.employee.findFirst({
      where: {
        id: employeeId,
        user: {
          companyId,
        },
      },
      include: {
        service: true,
        desk: true,
      },
    });

    if (!employee) {
      throw new Error("Employee not found.");
    }

    if (!employee.serviceId) {
      throw new Error(
        "Employee has no service assigned."
      );
    }

    // =====================================================
    // FIND DESK
    // =====================================================

    const desk = await tx.desk.findFirst({
      where: {
        id: deskId,
        department: {
          building: {
            companyId,
          },
        },
      },
      include: {
        service: true,
        employee: true,
      },
    });

    if (!desk) {
      throw new Error("Desk not found.");
    }

    // =====================================================
    // DESK MUST HAVE SERVICE
    // =====================================================

    if (!desk.serviceId) {
      throw new Error(
        "This desk has no service assigned."
      );
    }

    // =====================================================
    // SERVICE MUST MATCH
    // =====================================================

    if (employee.serviceId !== desk.serviceId) {
      throw new Error(
        "This desk belongs to a different service."
      );
    }

    // =====================================================
    // DESK ALREADY OCCUPIED
    // =====================================================

    if (
      desk.employee &&
      desk.employee.id !== employeeId
    ) {
      throw new Error(
        "This desk is currently occupied."
      );
    }

    // =====================================================
    // EMPLOYEE ALREADY HAS ANOTHER DESK
    // =====================================================

    if (
      employee.deskId &&
      employee.deskId !== deskId
    ) {

      // Close previous assignment
      await tx.deskAssignment.updateMany({
        where: {
          employeeId,
          deskId: employee.deskId,
          endedAt: null,
        },
        data: {
          endedAt: new Date(),
        },
      });

      // Release previous desk
      await tx.desk.update({
        where: {
          id: employee.deskId,
        },
        data: {
          status: DeskStatus.AVAILABLE,
        },
      });
    }

    // =====================================================
    // ASSIGN EMPLOYEE
    // =====================================================

    await tx.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        deskId,
      },
    });

    // =====================================================
    // MARK DESK BUSY
    // =====================================================

    await tx.desk.update({
      where: {
        id: deskId,
      },
      data: {
        status: DeskStatus.BUSY,
      },
    });

    // =====================================================
    // CREATE ASSIGNMENT HISTORY
    // =====================================================

    await tx.deskAssignment.create({
      data: {
        deskId,
        employeeId,
        startedAt: new Date(),
      },
    });

    // =====================================================
    // RETURN UPDATED EMPLOYEE
    // =====================================================

    return await tx.employee.findUnique({
      where: {
        id: employeeId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        service: true,

        desk: {
          include: {
            service: true,
            department: true,
          },
        },
      },
    });
  });
}



  // =====================================================
  // UPDATE DESK
  // =====================================================

  static async updateDesk(
  companyId: string,
  deskId: string,
  data: {
    name?: string | undefined;
    departmentId?: string | undefined;
    serviceId?: string | null | undefined;
  }
) {

  // Find desk and make sure it belongs to company
  const desk = await db.desk.findFirst({
    where: {
      id: deskId,

      department: {
        building: {
          companyId,
        },
      },
    },
  });

  if (!desk) {
    throw new Error(
      "Desk not found or does not belong to your company."
    );
  }


  // If moving desk to another department,
  // make sure the new department belongs to this company
  if (data.departmentId !== undefined) {

    const newDepartment =
      await db.department.findFirst({
        where: {
          id: data.departmentId,

          building: {
            companyId,
          },
        },
      });

    if (!newDepartment) {
      throw new Error(
        "New department not found or does not belong to your company."
      );
    }
  }


  // Determine which department the desk will belong to
  const targetDepartmentId =
    data.departmentId !== undefined
      ? data.departmentId
      : desk.departmentId;


  // Prevent duplicate desk name inside the target department
 if (data.serviceId !== undefined  && data.serviceId !== null) {
  const service = await db.service.findFirst({
    where: {
      id: data.serviceId,
      departmentId: targetDepartmentId,
    },
  });

  if (!service) {
    throw new Error(
      "Service not found or does not belong to the selected department."
    );
  }
}


  // Build Prisma update data WITHOUT undefined values
  const updateData = {
  ...(data.name !== undefined && {
    name: data.name,
  }),

  ...(data.departmentId !== undefined && {
    departmentId: data.departmentId,
  }),

  ...(data.serviceId !== undefined && {
    serviceId: data.serviceId,
  }),
};

  return await db.desk.update({
  where: {
    id: deskId,
  },

  data: updateData,

  include: {
    service: true,
    department: {
      include: {
        building: true,
        services: true,
      },
    },
  },
});
}

  // =====================================================
  // UPDATE DESK STATUS
  // =====================================================

  static async updateDeskStatus(
    companyId: string,
    deskId: string,
    status: DeskStatus
  ) {

    const desk = await db.desk.findFirst({
      where: {
        id: deskId,

        department: {
          building: {
            companyId,
          },
        },
      },
    });

    if (!desk) {
      throw new Error(
        "Desk not found or does not belong to your company."
      );
    }

    return await db.desk.update({
      where: {
        id: deskId,
      },

      data: {
        status,
      },

      include: {
        department: {
          include: {
            building: true,
            services: true,
          },
        },
      },
    });
  }


  // =====================================================
  // DELETE DESK
  // =====================================================

  static async deleteDesk(
    companyId: string,
    deskId: string
  ) {

    const desk = await db.desk.findFirst({
      where: {
        id: deskId,

        department: {
          building: {
            companyId,
          },
        },
      },
    });

    if (!desk) {
      throw new Error(
        "Desk not found or does not belong to your company."
      );
    }

    // Later we can prevent deletion if desk has service history.
    // For now, delete it.

    await db.desk.delete({
      where: {
        id: deskId,
      },
    });

    return true;
  }
}