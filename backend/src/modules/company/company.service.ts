import { db } from '../../config/db';

import * as crypto from "crypto";

export class CompanyService {
  // --- BUILDINGS ---

  static async createBuilding(companyId: string, data: { name: string; location?: string }) {
    return await db.building.create({
      data: {
        companyId,
        name: data.name,
        location: data.location ?? null,
      },
    });
  }

  static async getBuildings(companyId: string) {
    return await db.building.findMany({
      where: { companyId },
      include: {
        departments: {
          include: {
            services: true,
            desks: true,
          },
        },
      },
    });
  }

  // --- DEPARTMENTS ---

  static async createDepartment(companyId: string, data: { buildingId: string; name: string }) {
    // Ensure building belongs to the requesting company
    const building = await db.building.findFirst({
      where: { id: data.buildingId, companyId },
    });

    if (!building) {
      throw new Error('Building not found or does not belong to your company');
    }

    return await db.department.create({
      data: {
        buildingId: data.buildingId,
        name: data.name,
      },
    });
  }




  static async getDepartments(
  companyId: string
) {

  return await db.department.findMany({

    where: {

      building: {
        companyId,
      },

    },


    include: {

      building: {
        select: {
          id: true,
          name: true,
        },
      },


      services: true,


      desks: true,

    },

  });

}

  static async getDepartmentsByBuilding(
  companyId: string,
  buildingId: string
) {

  const building = await db.building.findFirst({
    where: {
      id: buildingId,
      companyId,
    },
  });

  if (!building) {
    throw new Error(
      "Building not found or does not belong to your company."
    );
  }


  return await db.department.findMany({
    where: {
      buildingId,
    },
    select: {
      id: true,
      name: true,
      buildingId: true,

      building: {
        select: {
          name: true,
        },
      },
    },
  });
}

  // --- COMPANY CONFIG ---

  static async updateRoutingMode(companyId: string, routingMode: 'FIXED_FLOW' | 'FLEXIBLE_FLOW') {
    return await db.company.update({
      where: { id: companyId },
      data: { routingMode },
    });
  }


    static async getSetupStatus(companyId: string) {

  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },

    select: {
      id: true,
      name: true,
      industry: true,
      setupCompleted: true,
      routingMode: true,
    },
  });

  if (!company) {
    throw new Error("Company not found.");
  }

  return company;
}

    static async getCompanyDetails(companyId: string) {
    return await db.company.findUnique({
      where: { id: companyId },
      include: {
        buildings: {
          include: {
            departments: {
              include: {
                services: true,
                desks: true,
              },
            },
          },
        },

        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },

        cards: true,
        tickets: true,
      },
    });
  }


  


static async updateCompany(
  companyId: string,
  data: {
    name?: string;
    industry?: string;
    routingMode?: "FIXED_FLOW" | "FLEXIBLE_FLOW";
    allowEmployeeRegistration?: boolean;
    employeeInviteCode?: string;
  }
) {
  return await db.company.update({
    where: {
      id: companyId,
    },
    data,
  });
}




static async generateCards(
  companyId: string,
  quantity: number
) {
  const cards = [];

  for (let i = 1; i <= quantity; i++) {
    cards.push({
      companyId,
      cardNumber: String(i).padStart(3, "0"),
    });
  }

  await db.card.createMany({
    data: cards,
  });

  return {
    generated: quantity,
  };
}



static async validateInviteCode(
  companyName: string,
  inviteCode: string
) {
  const company =
    await db.company.findFirst({
      where: {
        name: companyName,
      },
    });

  if (!company) {
    throw new Error("Company not found.");
  }

  if (!company.allowEmployeeRegistration) {
    throw new Error(
      "Employee registration is disabled."
    );
  }

  if (
    company.employeeInviteCode !==
    inviteCode
  ) {
    throw new Error(
      "Invalid invite code."
    );
  }

  return company;
}


static async generateInviteCode(companyId: string) {

  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company) {
    throw new Error("Company not found.");
  }

  let inviteCode = "";
  let exists = true;

  while (exists) {

    inviteCode = crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase();

    const existingCompany =
      await db.company.findUnique({
        where: {
          employeeInviteCode: inviteCode,
        },
      });

    exists = !!existingCompany;
  }

  await db.company.update({
    where: {
      id: companyId,
    },
    data: {
      employeeInviteCode: inviteCode,
    },
  });

  return {
    inviteCode,
  };
}

static async completeSetup(companyId: string) {

  const company =
    await db.company.findUnique({
      where: {
        id: companyId,
      },

      include: {
        buildings: {
          include: {
            departments: {
              include: {
                services: true,
              },
            },
          },
        },
      },
    });


  if (!company) {
    throw new Error("Company not found.");
  }


  // ====================================================
  // VALIDATE COMPANY
  // ====================================================

  if (!company.name) {
    throw new Error(
      "Company name is required."
    );
  }


  // ====================================================
  // VALIDATE BUILDINGS
  // ====================================================

  if (company.buildings.length === 0) {
    throw new Error(
      "Create at least one building before completing setup."
    );
  }


  // ====================================================
  // VALIDATE DEPARTMENTS
  // ====================================================

  const hasDepartments =
    company.buildings.some(
      (building) =>
        building.departments.length > 0
    );


  if (!hasDepartments) {
    throw new Error(
      "Create at least one department before completing setup."
    );
  }


  // ====================================================
  // VALIDATE SERVICES
  // ====================================================

  const hasServices =
    company.buildings.some(
      (building) =>
        building.departments.some(
          (department) =>
            department.services.length > 0
        )
    );


  if (!hasServices) {
    throw new Error(
      "Create at least one service before completing setup."
    );
  }


  // ====================================================
  // VALIDATE ROUTING MODE
  // ====================================================

  if (!company.routingMode) {
    throw new Error(
      "Configure the queue routing mode before completing setup."
    );
  }


  // ====================================================
  // COMPLETE SETUP
  // ====================================================

  const updatedCompany =
    await db.company.update({

      where: {
        id: companyId,
      },

      data: {
        setupCompleted: true,
      },

    });


  return updatedCompany;
}



static async getServicesByDepartment(
  companyId: string,
  departmentId: string
) {
  // First make sure the department belongs to this company
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

  // Get services belonging to that department
  return await db.service.findMany({
    where: {
      departmentId,
    },
    orderBy: {
      name: "asc",
    },
  });
}
}

