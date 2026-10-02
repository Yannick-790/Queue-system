import { Response } from "express";
import { TicketStatus } from "@prisma/client";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { TicketService } from "./ticket.service";
import {
  createTicketSchema,
  transferTicketSchema,
  updateTicketStatusSchema,
} from "./ticket.validation";

export class TicketController {

  static async createTicket(req: AuthenticatedRequest, res: Response) {
    try {
      const data = createTicketSchema.parse(req.body);

      const ticket = await TicketService.createTicket(
        req.user!.companyId,
        data
      );

      return res.status(201).json({
        success: true,
        data: ticket,
      });

    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async waiting(req: AuthenticatedRequest, res: Response) {
    try {

      const tickets = await TicketService.getWaitingTickets(
        req.user!.companyId
      );

      return res.json({
        success: true,
        data: tickets,
      });

    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {

      const { status } = updateTicketStatusSchema.parse(req.body);

      const ticketId = String(req.params.ticketId);

      const ticket = await TicketService.updateStatus(
        req.user!.companyId,
        ticketId,
        status as TicketStatus
      );

      return res.json({
        success: true,
        data: ticket,
      });

    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async transfer(req: AuthenticatedRequest, res: Response) {
    try {

      const { serviceId } =
        transferTicketSchema.parse(req.body);

      const ticketId = String(req.params.ticketId);

      const ticket =
        await TicketService.transferTicket(
          req.user!.companyId,
          ticketId,
          serviceId
        );

      return res.json({
        success: true,
        data: ticket,
      });

    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async getTicket(req: AuthenticatedRequest, res: Response) {

    try {

      const ticketId = String(req.params.ticketId);

      const ticket =
        await TicketService.getTicket(
          ticketId,
          req.user!.companyId
        );

      return res.json({
        success: true,
        data: ticket,
      });

    } catch (err: any) {

      return res.status(400).json({
        success: false,
        error: err.message,
      });

    }

  }

}