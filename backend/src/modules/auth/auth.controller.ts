import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation";


export class AuthController {



  // REGISTER USER WITH SELECTED ROLE
  static async register(
    req: Request,
    res: Response
  ) {

    try {


      const data =
        registerSchema.parse(req.body);



      const result =
        await AuthService.register(data);



      return res.status(201).json({

        success:true,

        message:
        "Account created. Verify your email.",

        data:result

      });



    } catch(error) {


      return res.status(400).json({

        success:false,

        error:
        error instanceof Error
        ? error.message
        :"Registration failed."

      });

    }

  }





  // LOGIN
 static async login(
  req: Request,
  res: Response
) {
  try {
    const data =
      loginSchema.parse(req.body);

    const ipAddress =
      req.ip ||
      req.socket.remoteAddress ||
      "unknown";

    const userAgent =
      req.get("user-agent") ||
      undefined;

    const result =
      await AuthService.login(
        data,
        ipAddress,
        userAgent
      );

    return res.status(200).json({
      success: true,

      message:
        "Login successful.",

      data: result,
    });

  } catch (error) {
    return res.status(401).json({
      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Invalid email or password.",
    });
  }
}




  // VERIFY EMAIL
  static async verifyEmail(
    req:Request,
    res:Response
  ){

    try {


      const token =
        String(req.params.token);



      const result =
        await AuthService.verifyEmail(token);



      return res.json({

        success:true,

        data:result

      });



    } catch(error) {


      return res.status(400).json({

        success:false,

        error:
        error instanceof Error
        ? error.message
        :"Verification failed."

      });

    }

  }





  // CURRENT USER
  static async me(
    req:AuthenticatedRequest,
    res:Response
  ){

    try {


      if(!req.user){

        return res.status(401).json({

          success:false,

          error:"Unauthorized."

        });

      }



      const user =
        await AuthService.me(
          req.user.userId
        );



      return res.json({

        success:true,

        data:user

      });



    } catch(error) {


      return res.status(404).json({

        success:false,

        error:
        error instanceof Error
        ? error.message
        :"User not found."

      });

    }

  }





  // LOGOUT
  static async logout(
    req:Request,
    res:Response
  ){

    return res.json({

      success:true,

      message:
      "Logged out successfully."

    });

  }





  // FORGOT PASSWORD
  static async forgotPassword(
    req:Request,
    res:Response
  ){

    try {


      const email =
        req.body.email;



      if(!email){

        return res.status(400).json({

          success:false,

          error:
          "Email is required."

        });

      }



      await AuthService.forgotPassword(email);



      return res.json({

        success:true,

        message:
        "If the email exists, a reset link was sent."

      });



    } catch(error) {


      return res.status(400).json({

        success:false,

        error:
        error instanceof Error
        ? error.message
        :"Password reset failed."

      });

    }

  }





  // RESET PASSWORD
  static async resetPassword(
    req:Request,
    res:Response
  ){

    try {


      const token =
        String(req.params.token);



      const password =
        req.body.password;



      if(!password){

        return res.status(400).json({

          success:false,

          error:
          "Password is required."

        });

      }



      const result =
        await AuthService.resetPassword(
          token,
          password
        );



      return res.json({

        success:true,

        data:result

      });



    } catch(error) {


      return res.status(400).json({

        success:false,

        error:
        error instanceof Error
        ? error.message
        :"Password reset failed."

      });

    }

  }


}