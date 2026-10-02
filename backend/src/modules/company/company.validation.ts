import { z } from "zod";

export const buildingSchema = z.object({
    name: z.string().min(2).max(100),
    location: z.string().optional()
});

export const departmentSchema = z.object({
    buildingId: z.string().uuid(),
    name: z.string().min(2).max(100)
});

export const routingSchema = z.object({
    routingMode: z.enum([
        "FIXED_FLOW",
        "FLEXIBLE_FLOW"
    ])
});