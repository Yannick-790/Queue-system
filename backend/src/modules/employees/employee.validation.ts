import { z } from "zod";

export const createEmployeeSchema = z.object({
  userId: z.string().uuid(),
  departmentId: z.string().uuid(),
  serviceId: z.string().uuid().optional(),
  employeeNumber: z.string().max(50).optional(),
});

export const createEmployeeByAdminSchema = z.object({
  name: z.string().min(2).max(100),

  email: z.string().email(),

  password: z.string().min(6),

  role: z.enum([
    "EMPLOYEE",
    "MANAGER",
    "SECURITY",
  ]),

  departmentId: z.string().uuid(),

  serviceId: z.string().uuid().optional(),

  employeeNumber: z
    .string()
    .max(50)
    .optional(),
});

export const updateEmployeeSchema = z.object({
  departmentId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  employeeNumber: z.string().max(50).optional(),
});


export const assignEmployeeSchema = z.object({
  departmentId: z.string().uuid(),
  serviceId: z.string().uuid().optional(),
  employeeNumber: z.string().max(50).optional(),
});



