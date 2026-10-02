import {
  CardStatus,
  DeskStatus,
  TicketStatus,
  Prisma,
} from "@prisma/client";

import { db } from "../../config/db";

import {
  broadcastCustomerCalled,
  broadcastQueueUpdate,
} from "../../websocket/display.gateway";

export class QueueService {

  // ============================================================
  // GET MY DESK / EMPLOYEE QUEUE
  // ============================================================

  static async getMyQueue(
    companyId: string,
    userId: string
  ) {

    const employee =
      await db.employee.findFirst({

        where: {
          userId,

          user: {
            companyId,
          },
        },

        include: {
          user: true,
          department: true,
          service: true,
          desk: true,
        },

      });


    if (!employee) {
      throw new Error(
        "Employee profile not found."
      );
    }


    if (!employee.serviceId || !employee.service) {
      throw new Error(
        "Employee is not assigned to a service."
      );
    }


    if (!employee.deskId || !employee.desk) {
      throw new Error(
        "Employee is not assigned to a desk."
      );
    }

    // After this point these are guaranteed to exist.
    const serviceId = employee.serviceId;
    const deskId = employee.deskId;


    // ----------------------------------------------------------
    // CURRENT CUSTOMER
    // ----------------------------------------------------------

    const currentSession =
      await db.serviceSession.findFirst({

        where: {

          employeeId:
            employee.id,

          deskId,

          finishedAt:
            null,

          ticket: {
            companyId,

            status:
              TicketStatus.SERVING,

            serviceId,
          },

        },

        include: {

          ticket: {
            include: {
              card: true,
              service: true,
            },
          },

        },

        orderBy: {
          startedAt: "desc",
        },

      });


    // ----------------------------------------------------------
    // NEXT CUSTOMER
    // ----------------------------------------------------------

    const nextCustomer =
      await db.ticket.findFirst({

        where: {

          companyId,

          serviceId,

          status:
            TicketStatus.WAITING,

        },

        orderBy: [

          {
            priority:
              "desc",
          },

          {
            createdAt:
              "asc",
          },

        ],

        include: {
          card: true,
          service: true,
        },

      });


    // ----------------------------------------------------------
    // WAITING COUNT
    // ----------------------------------------------------------

    const waitingCount =
      await db.ticket.count({

        where: {

          companyId,

          serviceId,

          status:
            TicketStatus.WAITING,

        },

      });


    // ----------------------------------------------------------
    // WAITING QUEUE
    // ----------------------------------------------------------

    const waitingQueue =
      await db.ticket.findMany({

        where: {

          companyId,

          serviceId,

          status:
            TicketStatus.WAITING,

        },

        orderBy: [

          {
            priority:
              "desc",
          },

          {
            createdAt:
              "asc",
          },

        ],

        take: 10,

        include: {
          card: true,
          service: true,
        },

      });


    return {

      employee: {

        id:
          employee.id,

        name:
          employee.user.name,

        status:
          employee.status,

      },

      desk: {

        id:
          employee.desk.id,

        name:
          employee.desk.name,

        status:
          employee.desk.status,

      },

      service: {

        id:
          employee.service.id,

        name:
          employee.service.name,

      },

      currentCustomer:
        currentSession
          ? {

              sessionId:
                currentSession.id,

              ticketId:
                currentSession.ticket.id,

              displayNumber:
                currentSession.ticket.displayNumber,

              ticketNumber:
                currentSession.ticket.ticketNumber,

              cardNumber:
                currentSession.ticket.card.cardNumber,

              priority:
                currentSession.ticket.priority,

              status:
                currentSession.ticket.status,

              startedAt:
                currentSession.startedAt,

            }
          : null,

      nextCustomer:
        nextCustomer
          ? {

              ticketId:
                nextCustomer.id,

              displayNumber:
                nextCustomer.displayNumber,

              ticketNumber:
                nextCustomer.ticketNumber,

              cardNumber:
                nextCustomer.card.cardNumber,

              priority:
                nextCustomer.priority,

              createdAt:
                nextCustomer.createdAt,

            }
          : null,

      waitingCount,

      waitingQueue:
        waitingQueue.map(
          (ticket) => ({

            ticketId:
              ticket.id,

            displayNumber:
              ticket.displayNumber,

            ticketNumber:
              ticket.ticketNumber,

            cardNumber:
              ticket.card.cardNumber,

            priority:
              ticket.priority,

            createdAt:
              ticket.createdAt,

          })
        ),

    };

  }


  // ============================================================
  // GET NEXT CUSTOMER
  // ============================================================

  static async getNextCustomer(
    companyId: string,
    userId: string
  ) {

    const employee =
      await db.employee.findFirst({

        where: {

          userId,

          user: {
            companyId,
          },

        },

        include: {
          service: true,
        },

      });


    if (!employee) {
      throw new Error(
        "Employee profile not found."
      );
    }


    if (!employee.serviceId || !employee.service) {
      throw new Error(
        "Employee is not assigned to a service."
      );
    }

    const serviceId = employee.serviceId;


    const ticket =
      await db.ticket.findFirst({

        where: {

          companyId,

          serviceId,

          status:
            TicketStatus.WAITING,

        },

        orderBy: [

          {
            priority:
              "desc",
          },

          {
            createdAt:
              "asc",
          },

        ],

        include: {
          card: true,
        },

      });


    if (!ticket) {
      return null;
    }


    return ticket;

  }


  // ============================================================
  // CALL NEXT CUSTOMER
  // ============================================================

  static async callNext(
    companyId: string,
    userId: string
  ) {

    const employee =
      await db.employee.findFirst({

        where: {

          userId,

          user: {
            companyId,
          },

        },

        include: {

          desk: true,
          service: true,

        },

      });


    if (!employee) {
      throw new Error(
        "Employee profile not found."
      );
    }


    if (!employee.serviceId || !employee.service) {
      throw new Error(
        "Employee is not assigned to a service."
      );
    }


    if (!employee.deskId || !employee.desk) {
      throw new Error(
        "Employee is not assigned to a desk."
      );
    }


    // IMPORTANT:
    // These are now guaranteed to be strings.
    const deskId = employee.deskId;
    const serviceId = employee.serviceId;


    // ----------------------------------------------------------
    // DESK MUST BE AVAILABLE
    // ----------------------------------------------------------

    if (
      employee.desk.status !==
      DeskStatus.AVAILABLE
    ) {

      if (
        employee.desk.status ===
        DeskStatus.BUSY
      ) {

        throw new Error(
          "Desk is currently serving a customer."
        );

      }

      throw new Error(
        "Desk is not available."
      );

    }


    // ----------------------------------------------------------
    // CHECK ACTIVE SESSION
    // ----------------------------------------------------------

    const activeSession =
      await db.serviceSession.findFirst({

        where: {

          employeeId:
            employee.id,

          deskId,

          finishedAt:
            null,

        },

      });


    if (activeSession) {

      throw new Error(
        "Employee already has an active service session."
      );

    }


    // ----------------------------------------------------------
    // CLAIM NEXT TICKET
    // ----------------------------------------------------------

    const result =
      await db.$transaction(

        async (tx) => {

          const ticket =
            await tx.ticket.findFirst({

              where: {

                companyId,

                serviceId,

                status:
                  TicketStatus.WAITING,

              },

              orderBy: [

                {
                  priority:
                    "desc",
                },

                {
                  createdAt:
                    "asc",
                },

              ],

            });


          if (!ticket) {

            throw new Error(
              "No waiting customers."
            );

          }


          /*
           * Atomically claim the ticket.
           *
           * If another employee already claimed it,
           * updateMany() returns count = 0.
           */

          const claimed =
            await tx.ticket.updateMany({

              where: {

                id:
                  ticket.id,

                status:
                  TicketStatus.WAITING,

              },

              data: {

                status:
                  TicketStatus.SERVING,

              },

            });


          if (claimed.count !== 1) {

            throw new Error(
              "Customer was already called. Please call next again."
            );

          }


          // ----------------------------------------------------
          // CREATE SERVICE SESSION
          // ----------------------------------------------------

          const session =
            await tx.serviceSession.create({

              data: {

                ticketId:
                  ticket.id,

                employeeId:
                  employee.id,

                // FIX:
                // use the narrowed string instead of
                // employee.deskId (string | null)
                deskId,

              },

              include: {

                ticket: {
                  include: {
                    card: true,
                  },
                },

              },

            });


          // ----------------------------------------------------
          // DESK → BUSY
          // ----------------------------------------------------

          await tx.desk.update({

            where: {
              id:
                deskId,
            },

            data: {

              status:
                DeskStatus.BUSY,

            },

          });


          // ----------------------------------------------------
          // HISTORY
          // ----------------------------------------------------

          await tx.ticketHistory.create({

            data: {

              ticketId:
                ticket.id,

              userId,

              action:
                "CUSTOMER_CALLED",

            },

          });


          return {
            session,
            ticket,
          };

        },

        {
          isolationLevel:
            Prisma.TransactionIsolationLevel.Serializable,
        }

      );


    // ----------------------------------------------------------
    // BROADCAST TO PUBLIC DISPLAY
    // ----------------------------------------------------------

    broadcastCustomerCalled(

      companyId,

      {

        displayNumber:
          result.ticket.displayNumber,

        desk:
          employee.desk.name,

        service:
          employee.service.name,

      }

    );


    // ----------------------------------------------------------
    // BROADCAST QUEUE UPDATE
    // ----------------------------------------------------------

    broadcastQueueUpdate(

      companyId,

      {

        type:
          "CUSTOMER_CALLED",

        ticketId:
          result.ticket.id,

        displayNumber:
          result.ticket.displayNumber,

        deskId,

        serviceId,

      }

    );


    return result;

  }


  // ============================================================
  // COMPLETE SERVICE
  // ============================================================

  static async completeService(
    companyId: string,
    userId: string,
    sessionId: string
  ) {

    const employee =
      await db.employee.findFirst({

        where: {

          userId,

          user: {
            companyId,
          },

        },

      });


    if (!employee) {
      throw new Error(
        "Employee profile not found."
      );
    }


    const session =
      await db.serviceSession.findFirst({

        where: {

          id:
            sessionId,

          employeeId:
            employee.id,

          finishedAt:
            null,

          ticket: {
            companyId,
          },

        },

        include: {

          ticket: true,
          desk: true,

        },

      });


    if (!session) {
      throw new Error(
        "Active service session not found."
      );
    }


    // IMPORTANT:
    // ServiceSession.deskId is nullable in Prisma.
    // We cannot use it until we verify it exists.
    if (!session.deskId) {
      throw new Error(
        "Active service session is not assigned to a desk."
      );
    }

    const deskId = session.deskId;


    const result =
      await db.$transaction(

        async (tx) => {

          await tx.serviceSession.update({

            where: {
              id:
                session.id,
            },

            data: {

              finishedAt:
                new Date(),

            },

          });


          const ticket =
            await tx.ticket.update({

              where: {
                id:
                  session.ticketId,
              },

              data: {

                status:
                  TicketStatus.COMPLETED,

              },

            });


          await tx.card.update({

            where: {
              id:
                ticket.cardId,
            },

            data: {

              status:
                CardStatus.RETURN_PENDING,

            },

          });


          await tx.desk.update({

            where: {

              // FIX:
              // session.deskId -> deskId
              id:
                deskId,

            },

            data: {

              status:
                DeskStatus.AVAILABLE,

            },

          });


          await tx.ticketHistory.create({

            data: {

              ticketId:
                session.ticketId,

              userId,

              action:
                "SERVICE_COMPLETED",

            },

          });


          return ticket;

        }

      );


    broadcastQueueUpdate(

      companyId,

      {

        type:
          "SERVICE_COMPLETED",

        ticketId:
          result.id,

        deskId,

        serviceId:
          employee.serviceId,

      }

    );


    return result;

  }


  // ============================================================
  // TRANSFER CUSTOMER
  // ============================================================

  static async transferCustomer(
    companyId: string,
    userId: string,
    ticketId: string,
    toServiceId: string
  ) {

    const employee =
      await db.employee.findFirst({

        where: {

          userId,

          user: {
            companyId,
          },

        },

      });


    if (!employee) {
      throw new Error(
        "Employee profile not found."
      );
    }


    const session =
      await db.serviceSession.findFirst({

        where: {

          employeeId:
            employee.id,

          ticketId,

          finishedAt:
            null,

          ticket: {
            companyId,
          },

        },

      });


    if (!session) {
      throw new Error(
        "This customer is not being served by you."
      );
    }


    if (!session.deskId) {
      throw new Error(
        "Service session is not assigned to a desk."
      );
    }

    const deskId = session.deskId;


    const destinationService =
      await db.service.findFirst({

        where: {

          id:
            toServiceId,

          department: {

            building: {

              companyId,

            },

          },

        },

      });


    if (!destinationService) {
      throw new Error(
        "Destination service not found."
      );
    }


    // Don't allow transfer to the same service.

    if (
      employee.serviceId ===
      toServiceId
    ) {

      throw new Error(
        "Customer is already in this service."
      );

    }


    const result =
      await db.$transaction(

        async (tx) => {

          await tx.serviceSession.update({

            where: {
              id:
                session.id,
            },

            data: {

              finishedAt:
                new Date(),

            },

          });


          const ticket =
            await tx.ticket.update({

              where: {

                id:
                  ticketId,

              },

              data: {

                serviceId:
                  toServiceId,

                status:
                  TicketStatus.WAITING,

              },

            });


          await tx.desk.update({

            where: {

              id:
                deskId,

            },

            data: {

              status:
                DeskStatus.AVAILABLE,

            },

          });


          await tx.ticketHistory.create({

            data: {

              ticketId,

              userId,

              action:
                "TRANSFERRED",

            },

          });


          return ticket;

        }

      );


    broadcastQueueUpdate(

      companyId,

      {

        type:
          "CUSTOMER_TRANSFERRED",

        ticketId,

        fromServiceId:
          employee.serviceId,

        toServiceId,

      }

    );


    return result;

  }


  // ============================================================
  // NO SHOW
  // ============================================================

  static async noShow(
    companyId: string,
    userId: string,
    ticketId: string
  ) {

    const employee =
      await db.employee.findFirst({

        where: {

          userId,

          user: {
            companyId,
          },

        },

      });


    if (!employee) {
      throw new Error(
        "Employee profile not found."
      );
    }


    const session =
      await db.serviceSession.findFirst({

        where: {

          employeeId:
            employee.id,

          ticketId,

          finishedAt:
            null,

          ticket: {
            companyId,
          },

        },

      });


    if (!session) {
      throw new Error(
        "This customer is not currently being served by you."
      );
    }


    if (!session.deskId) {
      throw new Error(
        "Service session is not assigned to a desk."
      );
    }

    const deskId = session.deskId;


    const result =
      await db.$transaction(

        async (tx) => {

          await tx.serviceSession.update({

            where: {

              id:
                session.id,

            },

            data: {

              finishedAt:
                new Date(),

            },

          });


          const ticket =
            await tx.ticket.update({

              where: {

                id:
                  ticketId,

              },

              data: {

                status:
                  TicketStatus.NO_SHOW,

              },

            });


          await tx.card.update({

            where: {

              id:
                ticket.cardId,

            },

            data: {

              status:
                CardStatus.RETURN_PENDING,

            },

          });


          await tx.desk.update({

            where: {

              id:
                deskId,

            },

            data: {

              status:
                DeskStatus.AVAILABLE,

            },

          });


          await tx.ticketHistory.create({

            data: {

              ticketId,

              userId,

              action:
                "NO_SHOW",

            },

          });


          return ticket;

        }

      );


    broadcastQueueUpdate(

      companyId,

      {

        type:
          "CUSTOMER_NO_SHOW",

        ticketId,

        deskId,

        serviceId:
          employee.serviceId,

      }

    );


    return result;

  }


  // ============================================================
  // RECALL CUSTOMER
  // ============================================================

  static async recallCustomer(
    companyId: string,
    userId: string
  ) {

    const employee =
      await db.employee.findFirst({

        where: {

          userId,

          user: {
            companyId,
          },

        },

        include: {

          desk: true,
          service: true,

        },

      });


    if (!employee) {
      throw new Error(
        "Employee profile not found."
      );
    }


    if (!employee.deskId || !employee.desk) {
      throw new Error(
        "Employee is not assigned to a desk."
      );
    }


    if (!employee.serviceId || !employee.service) {
      throw new Error(
        "Employee is not assigned to a service."
      );
    }


    const deskId = employee.deskId;
    const serviceId = employee.serviceId;


    const session =
      await db.serviceSession.findFirst({

        where: {

          employeeId:
            employee.id,

          deskId,

          finishedAt:
            null,

          ticket: {

            companyId,

            status:
              TicketStatus.SERVING,

          },

        },

        include: {

          ticket: true,

        },

        orderBy: {

          startedAt:
            "desc",

        },

      });


    if (!session) {
      throw new Error(
        "There is no active customer to recall."
      );
    }


    await db.ticketHistory.create({

      data: {

        ticketId:
          session.ticketId,

        userId,

        action:
          "CUSTOMER_RECALLED",

      },

    });


    broadcastCustomerCalled(

      companyId,

      {

        displayNumber:
          session.ticket.displayNumber,

        desk:
          employee.desk.name,

        service:
          employee.service.name,

      }

    );


    broadcastQueueUpdate(

      companyId,

      {

        type:
          "CUSTOMER_RECALLED",

        ticketId:
          session.ticketId,

        displayNumber:
          session.ticket.displayNumber,

        deskId,

        serviceId,

      }

    );


    return session.ticket;

  }


  // ============================================================
  // SET DESK AVAILABLE
  // ============================================================

  static async setDeskAvailable(
    companyId: string,
    userId: string
  ) {

    const employee =
      await db.employee.findFirst({

        where: {

          userId,

          user: {
            companyId,
          },

        },

      });


    if (!employee) {
      throw new Error(
        "Employee profile not found."
      );
    }


    if (!employee.deskId) {
      throw new Error(
        "Employee is not assigned to a desk."
      );
    }

    const deskId = employee.deskId;


    const activeSession =
      await db.serviceSession.findFirst({

        where: {

          employeeId:
            employee.id,

          finishedAt:
            null,

        },

      });


    if (activeSession) {
      throw new Error(
        "Cannot make desk available while serving a customer."
      );
    }


    const desk =
      await db.desk.update({

        where: {

          id:
            deskId,

        },

        data: {

          status:
            DeskStatus.AVAILABLE,

        },

      });


    broadcastQueueUpdate(

      companyId,

      {

        type:
          "DESK_STATUS_CHANGED",

        deskId:
          desk.id,

        status:
          desk.status,

      }

    );


    return desk;

  }


  // ============================================================
  // SET DESK OFFLINE
  // ============================================================

  static async setDeskOffline(
    companyId: string,
    userId: string
  ) {

    const employee =
      await db.employee.findFirst({

        where: {

          userId,

          user: {
            companyId,
          },

        },

      });


    if (!employee) {
      throw new Error(
        "Employee profile not found."
      );
    }


    if (!employee.deskId) {
      throw new Error(
        "Employee is not assigned to a desk."
      );
    }

    const deskId = employee.deskId;


    const activeSession =
      await db.serviceSession.findFirst({

        where: {

          employeeId:
            employee.id,

          finishedAt:
            null,

        },

      });


    if (activeSession) {
      throw new Error(
        "Cannot take desk offline while serving a customer."
      );
    }


    const desk =
      await db.desk.update({

        where: {

          id:
            deskId,

        },

        data: {

          status:
            DeskStatus.OFFLINE,

        },

      });


    broadcastQueueUpdate(

      companyId,

      {

        type:
          "DESK_STATUS_CHANGED",

        deskId:
          desk.id,

        status:
          desk.status,

      }

    );


    return desk;

  }


  // ============================================================
  // CANCEL TICKET
  // ============================================================

  static async cancelTicket(
    companyId: string,
    userId: string,
    ticketId: string
  ) {

    const ticket =
      await db.ticket.findFirst({

        where: {

          id:
            ticketId,

          companyId,

        },

      });


    if (!ticket) {
      throw new Error(
        "Ticket not found."
      );
    }


    if (
      ticket.status ===
      TicketStatus.COMPLETED
    ) {

      throw new Error(
        "Completed ticket cannot be cancelled."
      );

    }


    if (
      ticket.status ===
      TicketStatus.CANCELLED
    ) {

      throw new Error(
        "Ticket is already cancelled."
      );

    }


    const result =
      await db.$transaction(

        async (tx) => {

          await tx.card.update({

            where: {

              id:
                ticket.cardId,

            },

            data: {

              status:
                CardStatus.AVAILABLE_AT_SECURITY,

            },

          });


          const updated =
            await tx.ticket.update({

              where: {

                id:
                  ticketId,

              },

              data: {

                status:
                  TicketStatus.CANCELLED,

              },

            });


          await tx.ticketHistory.create({

            data: {

              ticketId,

              userId,

              action:
                "CANCELLED",

            },

          });


          return updated;

        }

      );


    broadcastQueueUpdate(

      companyId,

      {

        type:
          "TICKET_CANCELLED",

        ticketId,

      }

    );


    return result;

  }


  // ============================================================
  // RETURN CARD
  // ============================================================

  static async returnCard(
    companyId: string,
    cardId: string
  ) {

    const card =
      await db.card.findFirst({

        where: {

          id:
            cardId,

          companyId,

        },

      });


    if (!card) {
      throw new Error(
        "Card not found."
      );
    }


    const updated =
      await db.card.update({

        where: {

          id:
            cardId,

        },

        data: {

          status:
            CardStatus.AVAILABLE_AT_SECURITY,

        },

      });


    return updated;

  }

}