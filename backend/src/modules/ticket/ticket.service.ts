import {
  CardStatus,
  PriorityLevel,
  TicketStatus,
} from "@prisma/client";
import { db } from "../../config/db";

export class TicketService {

  static async createTicket(
    companyId: string,
    data: {
      cardId: string;
      serviceId: string;
      priority?: PriorityLevel | undefined;
    }
  ) {

    const card = await db.card.findFirst({
      where: {
        id: data.cardId,
        companyId,
        status: CardStatus.AVAILABLE_AT_SECURITY,
      },
    });

    if (!card) {
      throw new Error("Card is unavailable.");
    }

    const service = await db.service.findFirst({
      where: {
        id: data.serviceId,
        department: {
          building: {
            companyId,
          },
        },
      },
    });

    if (!service) {
      throw new Error("Service not found.");
    }

    const count = await db.ticket.count({
      where: {
        companyId,
      },
    });

    const ticketNumber = (count + 1)
      .toString()
      .padStart(6, "0");

    const ticket = await db.ticket.create({
      data: {
        companyId,
        cardId: card.id,
        serviceId: service.id,
        ticketNumber,
        displayNumber: card.cardNumber,
        priority: data.priority ?? PriorityLevel.NORMAL,
      },
    });

    await db.card.update({
      where: {
        id: card.id,
      },
      data: {
        status: CardStatus.WITH_CUSTOMER,
      },
    });

    return ticket;
  }

  static async getWaitingTickets(companyId: string) {
    return db.ticket.findMany({
      where: {
        companyId,
        status: TicketStatus.WAITING,
      },
      include: {
        card: true,
        service: true,
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "asc" },
      ],
    });
  }

  static async updateStatus(
    companyId: string,
    ticketId: string,
    status: TicketStatus
  ) {

    const ticket = await db.ticket.findFirst({
      where: {
        id: ticketId,
        companyId,
      },
    });

    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    const updated = await db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status,
      },
    });

    if (status === TicketStatus.COMPLETED) {

      await db.card.update({
        where: {
          id: ticket.cardId,
        },
        data: {
          status: CardStatus.RETURN_PENDING,
        },
      });

    }

    return updated;
  }

  static async transferTicket(
    companyId: string,
    ticketId: string,
    serviceId: string
  ) {

    const service = await db.service.findFirst({
      where: {
        id: serviceId,
        department: {
          building: {
            companyId,
          },
        },
      },
    });

    if (!service) {
      throw new Error("Destination service not found.");
    }

    return db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        serviceId,
        status: TicketStatus.TRANSFERRED,
      },
    });
  }

  static async getTicket(ticketId: string, companyId: string) {
    return db.ticket.findFirst({
      where: {
        id: ticketId,
        companyId,
      },
      include: {
        card: true,
        service: true,
        history: true,
      },
    });
  }
}