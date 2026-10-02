import { db } from "../../config/db";

export class EmployeeService {
static async createEmployee(companyId: string, data: any) {

  // --------------------------------------------------
  // 1. Find registered user
  // --------------------------------------------------

  const user = await db.user.findFirst({
    where: {
      id: data.userId,
      companyId,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // --------------------------------------------------
  // 2. ADMIN cannot be an employee
  // --------------------------------------------------

  if (user.role === "ADMIN") {
    throw new Error(
      "Administrators cannot be assigned as employees."
    );
  }

  // --------------------------------------------------
  // 3. User must NOT already have an Employee record
  // --------------------------------------------------

  const existingEmployee = await db.employee.findUnique({
    where: {
      userId: data.userId,
    },
  });

  if (existingEmployee) {
    throw new Error(
      "This user already has an employee record. Use Assign Employee instead."
    );
  }

  // --------------------------------------------------
  // 4. Verify department belongs to company
  // --------------------------------------------------

  const department = await db.department.findFirst({
    where: {
      id: data.departmentId,
      building: {
        companyId,
      },
    },
  });

  if (!department) {
    throw new Error("Department not found.");
  }

  // --------------------------------------------------
  // 5. Verify service belongs to department
  // --------------------------------------------------

  if (data.serviceId) {

    const service = await db.service.findFirst({
      where: {
        id: data.serviceId,
        departmentId: data.departmentId,
      },
    });

    if (!service) {
      throw new Error(
        "Service not found in the selected department."
      );
    }
  }

  // --------------------------------------------------
  // 6. Create Employee
  // --------------------------------------------------

  return db.employee.create({
    data,
  });
}



  static async assignEmployee(
  companyId: string,
  employeeId: string,
  data: {
    departmentId: string;
    serviceId?: string | undefined;
    employeeNumber?: string | undefined;
  }
) {

  // --------------------------------------------------
  // 1. Find employee and verify company
  // --------------------------------------------------

  const employee = await db.employee.findFirst({
    where: {
      id: employeeId,

      user: {
        companyId,
      },
    },

    include: {
      user: true,
    },
  });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  // --------------------------------------------------
  // 2. ADMIN cannot be assigned
  // --------------------------------------------------

  if (employee.user.role === "ADMIN") {
    throw new Error(
      "Administrators cannot be assigned as employees."
    );
  }

  // --------------------------------------------------
  // 3. Verify department belongs to company
  // --------------------------------------------------

  const department = await db.department.findFirst({
    where: {
      id: data.departmentId,

      building: {
        companyId,
      },
    },
  });

  if (!department) {
    throw new Error("Department not found.");
  }

  // --------------------------------------------------
  // 4. Verify service belongs to department
  // --------------------------------------------------

  if (data.serviceId) {

    const service = await db.service.findFirst({
      where: {
        id: data.serviceId,
        departmentId: data.departmentId,
      },
    });

    if (!service) {
      throw new Error(
        "Service not found in the selected department."
      );
    }
  }

  // --------------------------------------------------
  // 5. Update existing employee
  // --------------------------------------------------

  return db.employee.update({
    where: {
      id: employeeId,
    },

    data: {
      departmentId: data.departmentId,
      serviceId: data.serviceId ?? null,
      employeeNumber:
        data.employeeNumber?.trim() || null,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      department: true,
      service: true,
    },
  });
}



static async createEmployeeByAdmin(
  companyId: string,
  data: {
    name: string;
    email: string;
    password: string;
    role: "EMPLOYEE" | "MANAGER" | "SECURITY";
    departmentId: string;
    serviceId?: string | undefined;
    employeeNumber?: string | undefined;
  }
) {
  // --------------------------------------------------
  // 1. Check email
  // --------------------------------------------------

  const existingUser = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  // --------------------------------------------------
  // 2. ADMIN cannot be created here
  // --------------------------------------------------

  

  // --------------------------------------------------
  // 3. Verify department belongs to company
  // --------------------------------------------------

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

  // --------------------------------------------------
  // 4. Verify service belongs to department
  // --------------------------------------------------

  if (data.serviceId) {
    const service = await db.service.findFirst({
      where: {
        id: data.serviceId,
        departmentId: data.departmentId,
      },
    });

    if (!service) {
      throw new Error(
        "Service not found in the selected department."
      );
    }
  }

  // --------------------------------------------------
  // 5. Hash password
  // --------------------------------------------------

  const bcrypt = await import("bcrypt");

  const passwordHash = await bcrypt.hash(
    data.password,
    10
  );

  // --------------------------------------------------
  // 6. Create User + Employee together
  // --------------------------------------------------

  const result = await db.$transaction(
    async (tx) => {
      const user = await tx.user.create({
        data: {
          companyId,

          name: data.name.trim(),

          email: data.email.trim().toLowerCase(),

          passwordHash,

          role: data.role,

          emailVerified: true,
        },
      });

      const employee = await tx.employee.create({
        data: {
          userId: user.id,

          departmentId: data.departmentId,

          serviceId: data.serviceId ?? null,

          employeeNumber:
            data.employeeNumber?.trim() || null,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },

          department: true,

          service: true,
        },
      });

      return employee;
    }
  );

  return result;
}

  static async getEmployeesByDepartment(
    companyId: string,
    departmentId: string
  ) {
    return db.employee.findMany({
      where: {
        departmentId,
        department: {
          building: {
            companyId,
          },
        },
      },
      include: {
        user: true,
        service: true,
      },
    });
  }

  static async getEmployeesByService(
    companyId: string,
    serviceId: string
  ) {
    return db.employee.findMany({
      where: {
        serviceId,
        department: {
          building: {
            companyId,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  static async updateEmployee(
    companyId: string,
    employeeId: string,
    data: any
  ) {

    const employee = await db.employee.findFirst({
      where: {
        id: employeeId,
        department: {
          building: {
            companyId,
          },
        },
      },
    });

    if (!employee) {
      throw new Error("Employee not found.");
    }

    return db.employee.update({
      where: {
        id: employeeId,
      },
      data,
    });
  }

  static async deleteEmployee(
    companyId: string,
    employeeId: string
  ) {

    const employee = await db.employee.findFirst({
      where: {
        id: employeeId,
        department: {
          building: {
            companyId,
          },
        },
      },
    });

    if (!employee) {
      throw new Error("Employee not found.");
    }

    return db.employee.delete({
      where: {
        id: employeeId,
      },
    });
  }




 static async getAllEmployees(companyId: string) {
  return db.employee.findMany({
    where: {
      OR: [
        // Match via Department -> Building -> Company
        {
          department: {
            building: {
              companyId,
            },
          },
        },
        // Match via User -> Company
        {
          user: {
            companyId,
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      department: true,
      service: true,
    },
  });
}

static async getAvailableUsers(companyId: string) {
  return await db.user.findMany({
    where: {
      companyId,

      role: {
        not: "ADMIN",
      },

      OR: [
        // Registered user has no Employee record yet
        {
          employee: null,
        },

        // Employee exists but has not been assigned
        {
          employee: {
            departmentId: null,
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,

      employee: {
        select: {
          id: true,
          departmentId: true,
          serviceId: true,
          employeeNumber: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
}
}