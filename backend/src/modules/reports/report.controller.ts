import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { ReportService } from "./report.service";


export class ReportController {


  static async queueStatistics(
    req: AuthenticatedRequest,
    res: Response
  ){

    try {

      const data =
        await ReportService.getQueueStatistics(
          req.user!.companyId
        );


      return res.json({

        success:true,

        data

      });


    }catch(error:any){

      return res.status(400).json({

        success:false,

        error:error.message

      });

    }

  }






  static async averageServiceTime(
    req: AuthenticatedRequest,
    res: Response
  ){

    try {


      const data =
        await ReportService.getAverageServiceTime(
          req.user!.companyId
        );


      return res.json({

        success:true,

        data

      });


    }catch(error:any){

      return res.status(400).json({

        success:false,

        error:error.message

      });

    }

  }







  static async employeePerformance(
    req: AuthenticatedRequest,
    res: Response
  ){

    try {


      const data =
        await ReportService.getEmployeePerformance(
          req.user!.companyId
        );


      return res.json({

        success:true,

        data

      });


    }catch(error:any){

      return res.status(400).json({

        success:false,

        error:error.message

      });

    }

  }







  static async departmentLoad(
    req: AuthenticatedRequest,
    res: Response
  ){

    try {


      const data =
        await ReportService.getDepartmentLoad(
          req.user!.companyId
        );


      return res.json({

        success:true,

        data

      });


    }catch(error:any){

      return res.status(400).json({

        success:false,

        error:error.message

      });

    }

  }



  static async averageWaitingTime(
  req: AuthenticatedRequest,
  res: Response
) {

  try {

    const data =
      await ReportService.getAverageWaitingTime(
        req.user!.companyId
      );

    return res.json({

      success: true,

      data

    });

  } catch (error: any) {

    return res.status(400).json({

      success: false,

      error: error.message

    });

  }

}


static async cardStatistics(
  req: AuthenticatedRequest,
  res: Response
){

  try {

    const data =
      await ReportService.getCardStatistics(
        req.user!.companyId
      );


    return res.json({

      success:true,

      data

    });


  }catch(error:any){

    return res.status(400).json({

      success:false,

      error:error.message

    });

  }

}

}


