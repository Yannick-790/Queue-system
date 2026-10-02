import { db } from "../../config/db";


export class NotificationService {


  // Create notification
  static async createNotification(
    userId: string,
    message: string,
    type: string
  ) {

    return await db.notification.create({

      data: {

        userId,

        message,

        type,

      },

    });

  }




  // Get all notifications for user
  static async getUserNotifications(
    userId: string
  ) {

    return await db.notification.findMany({

      where: {

        userId,

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  }





  // Mark notification as read
  static async markAsRead(
    userId: string,
    notificationId: string
  ) {


    const notification =
      await db.notification.findFirst({

        where: {

          id: notificationId,

          userId,

        },

      });



    if (!notification) {

      throw new Error(
        "Notification not found."
      );

    }



    return await db.notification.update({

      where: {

        id: notificationId,

      },

      data: {

        status: "READ",

      },

    });

  }





  // Delete notification
  static async deleteNotification(
    userId: string,
    notificationId: string
  ) {


    const notification =
      await db.notification.findFirst({

        where: {

          id: notificationId,

          userId,

        },

      });



    if (!notification) {

      throw new Error(
        "Notification not found."
      );

    }



    return await db.notification.delete({

      where: {

        id: notificationId,

      },

    });

  }




  // Helper functions for system events


  static async notifyLostCard(
    userId:string,
    cardNumber:string
  ){

    return this.createNotification(

      userId,

      `Card ${cardNumber} has been marked as lost.`,

      "LOST_CARD"

    );

  }





  static async notifyCardReturnReminder(
    userId:string,
    cardNumber:string
  ){

    return this.createNotification(

      userId,

      `Card ${cardNumber} has not been returned yet.`,

      "CARD_RETURN"

    );

  }





  static async notifyQueueAlert(
    userId:string,
    serviceName:string,
    count:number
  ){

    return this.createNotification(

      userId,

      `${serviceName} queue has ${count} waiting customers.`,

      "QUEUE_ALERT"

    );

  }


}