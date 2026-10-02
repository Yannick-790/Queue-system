import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { NotificationService } from "./notification.service";
import { string } from "zod";


export class NotificationController {


  // Get current user notifications
  static async getNotifications(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      const notifications =
        await NotificationService.getUserNotifications(
          req.user!.userId
        );


      return res.status(200).json({

        success: true,

        data: notifications,

      });


    } catch(error:any) {

      return res.status(400).json({

        success:false,

        error:error.message,

      });

    }

  }





  // Mark notification read
  static async markRead(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {

      const notificationId = String(req.params.notificationId);


      const notification =
        await NotificationService.markAsRead(

          req.user!.userId,

          notificationId

        );


      return res.status(200).json({

        success:true,

        data:notification,

      });



    } catch(error:any) {

      return res.status(400).json({

        success:false,

        error:error.message,

      });

    }

  }






  // Delete notification
  static async delete(
    req: AuthenticatedRequest,
    res: Response
  ) {

    try {
      
      const notificationId = String(req.params.notificationId);

      const notification =
        await NotificationService.deleteNotification(

          req.user!.userId,

          notificationId

        );



      return res.status(200).json({

        success:true,

        data:notification,

      });



    } catch(error:any) {

      return res.status(400).json({

        success:false,

        error:error.message,

      });

    }

  }



}