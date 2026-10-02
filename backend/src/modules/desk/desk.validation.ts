import { z } from "zod";
import { DeskStatus } from "@prisma/client";


// =====================================================
// CREATE DESK
// =====================================================

export const createDeskSchema = z.object({
  departmentId: z.string().uuid(),

  name: z
    .string()
    .min(1, "Desk name is required.")
    .trim(),

  // Optional:
  // If provided, this makes the desk fixed to a service.
  serviceId: z.string().uuid(),
});


// =====================================================
// UPDATE DESK
// =====================================================

export const updateDeskSchema = z.object({
  name: z
    .string()
    .min(1, "Desk name cannot be empty.")
    .trim()
    .optional(),

  departmentId: z
    .string()
    .uuid()
    .optional(),

  // Optional fixed service.
  // Can also be removed to make the desk flexible.
  serviceId: z
    .string()
    .uuid()
    .nullable()
    .optional(),
});


// =====================================================
// UPDATE DESK STATUS
// =====================================================

export const updateDeskStatusSchema = z.object({
  status: z.nativeEnum(DeskStatus),
});