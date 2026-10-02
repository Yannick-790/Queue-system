import { db } from "../../config/db";
import { TicketStatus } from "@prisma/client";


export class ReportService {


  // ============================
  // QUEUE STATISTICS
  // ============================

  static async getQueueStatistics(
    companyId:string
  ){

    const tickets =
      await db.ticket.groupBy({

        by:[
          "status"
        ],

        where:{
          companyId
        },

        _count:{
          id:true
        }

      });


    return tickets;

  }






  // ============================
  // AVERAGE SERVICE TIME
  // ============================

  static async getAverageServiceTime(
    companyId:string
  ){

    const sessions =
      await db.serviceSession.findMany({

        where:{
          ticket:{
            companyId
          },

          finishedAt:{
            not:null
          }
        },

        select:{
          startedAt:true,
          finishedAt:true
        }

      });



    if(
      sessions.length === 0
    ){

      return {
        averageMinutes:0
      };

    }



    let total = 0;



    sessions.forEach(session=>{

      const start =
        session.startedAt.getTime();


      const end =
        session.finishedAt!.getTime();


      total +=
        (end-start)
        /
        60000;

    });



    return {

      averageMinutes:
        Math.round(
          total / sessions.length
        )

    };


  }







  // ============================
  // EMPLOYEE PERFORMANCE
  // ============================

  static async getEmployeePerformance(
    companyId:string
  ){

    const employees =
      await db.employee.findMany({

        where:{
          department:{
            building:{
              companyId
            }
          }
        },

        include:{

          user:true,

          sessions:{
            where:{
              finishedAt:{
                not:null
              }
            }
          }

        }

      });



    return employees.map(employee=>({

      employee:
      employee.user.name,


      completedCustomers:
      employee.sessions.length


    }));

  }







  // ============================
  // BUSY DEPARTMENTS
  // ============================

 static async getDepartmentLoad(
  companyId: string
) {

  const departments =
    await db.department.findMany({

      where: {
        building: {
          companyId
        }
      },

      include: {

        services: {

          include: {

            tickets: {

              where: {
                status:
                  TicketStatus.WAITING
              }

            }

          }

        }

      }

    });


  return departments.map(
    department => ({

      department:
        department.name,

      waitingCustomers:
        department.services.reduce(
          (total, service) =>
            total + service.tickets.length,
          0
        )

    })
  );

}


static async getAverageWaitingTime(
  companyId: string
) {

  const sessions =
    await db.serviceSession.findMany({

      where: {

        ticket: {
          companyId
        },

        finishedAt: {
          not: null
        }

      },

      include: {

        ticket: {
          select: {
            createdAt: true
          }
        }

      }

    });


  if (sessions.length === 0) {

    return {
      averageMinutes: 0
    };

  }


  let total = 0;


  sessions.forEach(session => {

    const created =
      session.ticket.createdAt.getTime();

    const started =
      session.startedAt.getTime();

    total +=
      (started - created) / 60000;

  });


  return {

    averageMinutes:
      Math.round(
        total / sessions.length
      )

  };

}


  // ============================
// CARD STATISTICS
// ============================

static async getCardStatistics(
  companyId: string
){

  const cards =
    await db.card.groupBy({

      by:[
        "status"
      ],

      where:{
        companyId
      },

      _count:{
        id:true
      }

    });



  return cards;

}

}









