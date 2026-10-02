import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { TicketController } from "./ticket.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  TicketController.createTicket
);

router.get(
  "/waiting",
  authenticate,
  TicketController.waiting
);

router.get(
  "/:ticketId",
  authenticate,
  TicketController.getTicket
);

router.patch(
  "/:ticketId/status",
  authenticate,
  TicketController.updateStatus
);

router.patch(
  "/:ticketId/transfer",
  authenticate,
  TicketController.transfer
);

export default router;