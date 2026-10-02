import { z } from "zod";


export const createServiceSchema = z.object({
  departmentId: z.string().uuid({
    message: "Invalid department ID",
  }),

  name: z.string()
    .min(2, "Service name must contain at least 2 characters")
    .max(100, "Service name is too long"),

  description: z.string()
    .max(500, "Description is too long")
    .optional(),
});



export const updateServiceSchema = z.object({
  name: z.string()
    .min(2, "Service name must contain at least 2 characters")
    .max(100, "Service name is too long"),
});