import { z } from "zod";
import { PriorityLevel } from "@prisma/client";

export const createTicketSchema = z.object({
  cardId: z.string().uuid(),
  serviceId: z.string().uuid(),
  priority: z.nativeEnum(PriorityLevel).optional(),
});

export const transferTicketSchema = z.object({
  serviceId: z.string().uuid(),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum([
    "WAITING",
    "SERVING",
    "COMPLETED",
    "TRANSFERRED",
    "CANCELLED",
    "NO_SHOW",
  ]),
});