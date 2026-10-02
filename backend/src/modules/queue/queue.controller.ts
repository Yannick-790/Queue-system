import { Response } from "express";

import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

import { QueueService } from "./queue.service";

import {
  completeSchema,
  transferSchema,
  noShowSchema,
  cancelSchema,
  returnCardSchema,
} from "./queue.validation";


export class QueueController {


  // ============================================================
  // GET MY QUEUE
  // ============================================================

  static async getMyQueue(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const result =
        await QueueService.getMyQueue(

          req.user.companyId,

          req.user.userId

        );


      return res.status(200).json({

        success: true,

        data: result,

      });

    } catch (error: any) {

      console.error(
        "GET MY QUEUE ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to load employee queue.",

      });

    }

  }


  // ============================================================
  // GET NEXT CUSTOMER
  // ============================================================

  static async getNextCustomer(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const result =
        await QueueService.getNextCustomer(

          req.user.companyId,

          req.user.userId

        );


      return res.status(200).json({

        success: true,

        data: result,

      });

    } catch (error: any) {

      console.error(
        "GET NEXT CUSTOMER ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to get next customer.",

      });

    }

  }


  // ============================================================
  // CALL NEXT CUSTOMER
  // ============================================================

  static async callNext(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      /*
       * No employeeId, deskId or serviceId are accepted
       * from the frontend.
       *
       * QueueService determines them from req.user.
       */


      const result =
        await QueueService.callNext(

          req.user.companyId,

          req.user.userId

        );


      return res.status(200).json({

        success: true,

        message:
          "Customer called successfully.",

        data: result,

      });

    } catch (error: any) {

      console.error(
        "CALL NEXT ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to call next customer.",

      });

    }

  }


  // ============================================================
  // COMPLETE SERVICE
  // ============================================================

  static async completeService(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const data =
        completeSchema.parse(
          req.body
        );


      const result =
        await QueueService.completeService(

          req.user.companyId,

          req.user.userId,

          data.sessionId

        );


      return res.status(200).json({

        success: true,

        message:
          "Service completed.",

        data: result,

      });

    } catch (error: any) {

      console.error(
        "COMPLETE SERVICE ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to complete service.",

      });

    }

  }


  // ============================================================
  // TRANSFER CUSTOMER
  // ============================================================

  static async transfer(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const data =
        transferSchema.parse(
          req.body
        );


      const result =
        await QueueService.transferCustomer(

          req.user.companyId,

          req.user.userId,

          data.ticketId,

          data.toServiceId

        );


      return res.status(200).json({

        success: true,

        message:
          "Customer transferred.",

        data: result,

      });

    } catch (error: any) {

      console.error(
        "TRANSFER CUSTOMER ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to transfer customer.",

      });

    }

  }


  // ============================================================
  // NO SHOW
  // ============================================================

  static async noShow(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const data =
        noShowSchema.parse(
          req.body
        );


      const result =
        await QueueService.noShow(

          req.user.companyId,

          req.user.userId,

          data.ticketId

        );


      return res.status(200).json({

        success: true,

        message:
          "Customer marked as no show.",

        data: result,

      });

    } catch (error: any) {

      console.error(
        "NO SHOW ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to mark customer as no show.",

      });

    }

  }


  // ============================================================
  // RECALL CUSTOMER
  // ============================================================

  static async recall(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const result =
        await QueueService.recallCustomer(

          req.user.companyId,

          req.user.userId

        );


      return res.status(200).json({

        success: true,

        message:
          "Customer recalled successfully.",

        data: result,

      });

    } catch (error: any) {

      console.error(
        "RECALL CUSTOMER ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to recall customer.",

      });

    }

  }


  // ============================================================
  // SET DESK AVAILABLE
  // ============================================================

  static async setDeskAvailable(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const result =
        await QueueService.setDeskAvailable(

          req.user.companyId,

          req.user.userId

        );


      return res.status(200).json({

        success: true,

        message:
          "Desk is now available.",

        data: result,

      });

    } catch (error: any) {

      console.error(
        "SET DESK AVAILABLE ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to make desk available.",

      });

    }

  }


  // ============================================================
  // SET DESK OFFLINE
  // ============================================================

  static async setDeskOffline(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const result =
        await QueueService.setDeskOffline(

          req.user.companyId,

          req.user.userId

        );


      return res.status(200).json({

        success: true,

        message:
          "Desk is now offline.",

        data: result,

      });

    } catch (error: any) {

      console.error(
        "SET DESK OFFLINE ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to take desk offline.",

      });

    }

  }


  // ============================================================
  // CANCEL TICKET
  // ============================================================

  static async cancel(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const data =
        cancelSchema.parse(
          req.body
        );


      const result =
        await QueueService.cancelTicket(

          req.user.companyId,

          req.user.userId,

          data.ticketId

        );


      return res.status(200).json({

        success: true,

        message:
          "Ticket cancelled.",

        data: result,

      });

    } catch (error: any) {

      console.error(
        "CANCEL TICKET ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to cancel ticket.",

      });

    }

  }


  // ============================================================
  // RETURN CARD
  // ============================================================

  static async returnCard(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
        });
      }


      const data =
        returnCardSchema.parse(
          req.body
        );


      const result =
        await QueueService.returnCard(

          req.user.companyId,

          data.cardId

        );


      return res.status(200).json({

        success: true,

        message:
          "Card returned successfully.",

        data: result,

      });

    } catch (error: any) {

      console.error(
        "RETURN CARD ERROR:",
        error
      );

      return res.status(400).json({

        success: false,

        error:
          error?.message ||
          "Unable to return card.",

      });

    }

  }

}