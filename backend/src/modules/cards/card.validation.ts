import { z } from "zod";

export const createCardSchema = z.object({
  cardNumber: z
    .string()
    .min(1)
    .max(20),

  rfidUid: z
    .string()
    .min(1)
    .max(100)
    .optional(),
});

export const createManyCardsSchema = z.object({
  startNumber: z.number().int().positive(),
  endNumber: z.number().int().positive(),
});

export const updateCardStatusSchema = z.object({
  status: z.enum([
    "AVAILABLE_AT_SECURITY",
    "WITH_CUSTOMER",
    "RETURN_PENDING",
    "LOST",
  ]),
});

export const registerRfidSchema = z.object({
  rfidUid: z
    .string()
    .trim()
    .min(1)
    .max(100),
});