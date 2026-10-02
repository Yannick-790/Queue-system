import { z } from "zod";


// ============================================================
// CALL NEXT
// ============================================================
//
// Employee, desk and service are determined by the authenticated
// user on the backend.
//
// Therefore the frontend sends no employeeId, deskId or serviceId.
//
// Empty body is valid.
//

export const callNextSchema = z.object({}).strict();


// ============================================================
// COMPLETE SERVICE
// ============================================================

export const completeSchema = z.object({

  sessionId: z
    .string()
    .uuid(),

}).strict();


// ============================================================
// TRANSFER CUSTOMER
// ============================================================

export const transferSchema = z.object({

  ticketId: z
    .string()
    .uuid(),

  toServiceId: z
    .string()
    .uuid(),

}).strict();


// ============================================================
// NO SHOW
// ============================================================

export const noShowSchema = z.object({

  ticketId: z
    .string()
    .uuid(),

}).strict();


// ============================================================
// CANCEL TICKET
// ============================================================

export const cancelSchema = z.object({

  ticketId: z
    .string()
    .uuid(),

}).strict();


// ============================================================
// RETURN CARD
// ============================================================

export const returnCardSchema = z.object({

  cardId: z
    .string()
    .uuid(),

}).strict();