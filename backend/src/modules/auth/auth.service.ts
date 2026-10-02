import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { db } from "../../config/db";
import { Role } from "@prisma/client";

import {
  RegisterInput,
  LoginInput,
} from "./auth.validation";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/mail.service";


// ======================================================
// JWT CONFIG
// ======================================================

const JWT_SECRET: string =
  process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not configured."
  );
}

const JWT_EXPIRES_IN = "15m"; // 15 minutes


// ======================================================
// TOKEN HELPER
// ======================================================

function hashToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}


// ======================================================
// AUTH SERVICE
// ======================================================

export class AuthService {

  // ====================================================
  // REGISTER
  // ====================================================

  static async register(
    data: RegisterInput
  ) {

    // --------------------------------------------------
    // CHECK EXISTING USER
    // --------------------------------------------------

    const existingUser =
      await db.user.findUnique({
        where: {
          email: data.email,
        },
      });

    if (existingUser) {
      throw new Error(
        "Email already exists."
      );
    }


    // --------------------------------------------------
    // HASH PASSWORD
    // --------------------------------------------------

    const passwordHash =
      await bcrypt.hash(
        data.password,
        10
      );


    // --------------------------------------------------
    // EMAIL VERIFICATION TOKEN
    // --------------------------------------------------

    // Raw token is sent by email.
    // Only the hash is stored in the database.

    const verificationToken =
      crypto.randomUUID();

    const verificationTokenHash =
      hashToken(verificationToken);


    // ==================================================
    // ADMIN REGISTRATION
    // Creates a NEW company
    // ==================================================

    if (data.role === Role.ADMIN) {

      if (!data.companyName) {
        throw new Error(
          "Company name is required."
        );
      }

      // IMPORTANT:
      // Make companyName definitely a string.
      const companyName: string =
        data.companyName;


      // ------------------------------------------------
      // GENERATE COMPANY CODE
      // ------------------------------------------------

      const companyCode =
        crypto
          .randomBytes(4)
          .toString("hex")
          .toUpperCase();


      // ------------------------------------------------
      // CREATE COMPANY + ADMIN USER
      // ------------------------------------------------

      const result =
        await db.$transaction(
          async (tx) => {

            const company =
              await tx.company.create({

                data: {

                  name: companyName,

                  industry:
                    data.industry ?? null,

                  employeeInviteCode:
                    companyCode,

                  allowEmployeeRegistration:
                    true,

                },

              });


            const user =
              await tx.user.create({

                data: {

                  companyId:
                    company.id,

                  name:
                    data.name,

                  email:
                    data.email,

                  passwordHash,

                  role:
                    Role.ADMIN,

                  emailVerified:
                    false,

                },

              });


            // ------------------------------------------
            // CREATE EMAIL VERIFICATION TOKEN
            // ------------------------------------------

            await tx.emailVerificationToken.create({

              data: {

                userId:
                  user.id,

                tokenHash:
                  verificationTokenHash,

                expiresAt:
                  new Date(
                    Date.now() +
                    15 * 60 * 1000
                  ),

              },

            });


            return {
              company,
              user,
            };

          }
        );


      // ------------------------------------------------
      // SEND VERIFICATION EMAIL
      // ------------------------------------------------

      await sendVerificationEmail(
        result.user.email,
        verificationToken
      );


      // ------------------------------------------------
      // RESPONSE
      // ------------------------------------------------

      return {

        userId:
          result.user.id,

        companyId:
          result.company.id,

        companyCode,

        role:
          Role.ADMIN,

        message:
          "Admin account created. Verify email.",

      };

    }


    // ==================================================
    // OTHER ROLES
    // MANAGER / SECURITY / EMPLOYEE
    // ==================================================

    if (!data.companyName) {
      throw new Error(
        "Company name is required."
      );
    }


    if (!data.companyCode) {
      throw new Error(
        "Company code is required."
      );
    }


    // --------------------------------------------------
    // MAKE THEM DEFINITELY STRINGS
    // --------------------------------------------------

    const companyName: string =
      data.companyName;

    const companyCode: string =
      data.companyCode;


    // --------------------------------------------------
    // FIND COMPANY
    // --------------------------------------------------

    const company =
      await db.company.findFirst({

        where: {

          name:
            companyName,

          employeeInviteCode:
            companyCode,

        },

      });


    if (!company) {
      throw new Error(
        "Invalid company name or code."
      );
    }


    // --------------------------------------------------
    // CREATE USER + EMPLOYEE
    // --------------------------------------------------

    const result =
      await db.$transaction(
        async (tx) => {

          const user =
            await tx.user.create({

              data: {

                companyId:
                  company.id,

                name:
                  data.name,

                email:
                  data.email,

                passwordHash,

                role:
                  data.role,

                emailVerified:
                  false,

              },

            });


          const employee =
            await tx.employee.create({

              data: {

                userId:
                  user.id,

                departmentId:
                  data.departmentId ?? null,

                serviceId:
                  data.serviceId ?? null,

              },

            });


          // ------------------------------------------
          // CREATE EMAIL VERIFICATION TOKEN
          // ------------------------------------------

          await tx.emailVerificationToken.create({

            data: {

              userId:
                user.id,

              tokenHash:
                verificationTokenHash,

              expiresAt:
                new Date(
                  Date.now() +
                  15 * 60 * 1000
                ),

            },

          });


          return {
            user,
            employee,
          };

        }
      );


    // --------------------------------------------------
    // SEND VERIFICATION EMAIL
    // --------------------------------------------------

    await sendVerificationEmail(
      result.user.email,
      verificationToken
    );


    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return {

      userId:
        result.user.id,

      companyId:
        company.id,

      role:
        data.role,

      message:
        "Account created. Verify email.",

    };

  }


  // ====================================================
  // VERIFY EMAIL
  // ====================================================

  static async verifyEmail(
    token: string
  ) {

    // Hash the token received from the URL.
    // Database stores only the hash.

    const tokenHash =
      hashToken(token);


    // --------------------------------------------------
    // FIND VALID VERIFICATION TOKEN
    // --------------------------------------------------

    const verificationToken =
      await db.emailVerificationToken.findFirst({

        where: {

          tokenHash,

          expiresAt: {
            gt: new Date(),
          },

          usedAt: null,

        },

        include: {

          user: true,

        },

      });


    if (!verificationToken) {

      throw new Error(
        "Invalid or expired verification token."
      );

    }


    // --------------------------------------------------
    // VERIFY USER + CONSUME TOKEN + AUDIT
    // --------------------------------------------------

    await db.$transaction([

      db.user.update({

        where: {

          id:
            verificationToken.userId,

        },

        data: {

          emailVerified:
            true,

        },

      }),

      db.emailVerificationToken.update({

        where: {

          id:
            verificationToken.id,

        },

        data: {

          usedAt:
            new Date(),

        },

      }),

      db.securityEvent.create({

        data: {

          userId:
            verificationToken.userId,

          companyId:
            verificationToken.user.companyId,

          type:
            "EMAIL_VERIFIED",

        },

      }),

    ]);


    return {

      message:
        "Email verified successfully.",

    };

  }


  // ====================================================
  // LOGIN
  // ====================================================

  static async login(
    data: LoginInput,
    ipAddress?: string,
    userAgent?: string
  ) {

    const now = new Date();


    // --------------------------------------------------
    // FIND USER
    // --------------------------------------------------

    const user =
      await db.user.findUnique({

        where: {

          email:
            data.email,

        },

      });


    // --------------------------------------------------
    // USER DOES NOT EXIST
    // --------------------------------------------------

    if (!user) {

      // We still record the attempt,
      // but DO NOT reveal whether the account exists.

      await db.loginAttempt.create({

        data: {

          email:
            data.email,

          ipAddress:
            ipAddress ?? "unknown",

          userAgent:
            userAgent ?? null,

          success:
            false,

          reason:
            "INVALID_CREDENTIALS",

        },

      });


      throw new Error(
        "Invalid email or password."
      );

    }


    // --------------------------------------------------
    // CHECK ACCOUNT LOCK
    // --------------------------------------------------

    if (
      user.lockedUntil &&
      user.lockedUntil > now
    ) {

      const remainingMs =
        user.lockedUntil.getTime() -
        now.getTime();

      const remainingMinutes =
        Math.ceil(
          remainingMs / 60000
        );


      await db.securityEvent.create({

        data: {

          userId:
            user.id,

          companyId:
            user.companyId,

          type:
            "RATE_LIMITED",

          ipAddress:
            ipAddress ?? null,

          userAgent:
            userAgent ?? null,

          metadata: {

            reason:
              "ACCOUNT_LOCKED",

            remainingMinutes,

          },

        },

      });


      throw new Error(
        `Too many failed login attempts. Try again in ${remainingMinutes} minute(s).`
      );

    }


    // --------------------------------------------------
    // PASSWORD
    // --------------------------------------------------

    const validPassword =
      await bcrypt.compare(
        data.password,
        user.passwordHash
      );


    // --------------------------------------------------
    // WRONG PASSWORD
    // --------------------------------------------------

    if (!validPassword) {

      const failedAttempts =
        user.failedLoginAttempts + 1;


      let lockMinutes = 0;


      /*
       * Progressive lockout:
       *
       * 3 failures  → 5 minutes
       * 6 failures  → 15 minutes
       * 9 failures  → 30 minutes
       * 12 failures → 60 minutes
       * 15+         → 120 minutes
       */

      if (failedAttempts >= 15) {

        lockMinutes = 120;

      } else if (failedAttempts >= 12) {

        lockMinutes = 60;

      } else if (failedAttempts >= 9) {

        lockMinutes = 30;

      } else if (failedAttempts >= 6) {

        lockMinutes = 15;

      } else if (failedAttempts >= 3) {

        lockMinutes = 5;

      }


      const lockedUntil =
        lockMinutes > 0
          ? new Date(
              now.getTime() +
              lockMinutes * 60 * 1000
            )
          : null;


      // ------------------------------------------------
      // UPDATE USER + LOGIN AUDIT + SECURITY AUDIT
      // ------------------------------------------------

      await db.$transaction(
        async (tx) => {

          await tx.user.update({

            where: {

              id:
                user.id,

            },

            data: {

              failedLoginAttempts:
                failedAttempts,

              lastFailedLoginAt:
                now,

              ...(lockedUntil
                ? {
                    lockedUntil,
                  }
                : {}),

            },

          });


          await tx.loginAttempt.create({

            data: {

              userId:
                user.id,

              email:
                user.email,

              ipAddress:
                ipAddress ?? "unknown",

              userAgent:
                userAgent ?? null,

              success:
                false,

              reason:
                lockedUntil
                  ? "ACCOUNT_LOCKED"
                  : "INVALID_PASSWORD",

            },

          });


          await tx.securityEvent.create({

            data: {

              userId:
                user.id,

              companyId:
                user.companyId,

              type:
                lockedUntil
                  ? "ACCOUNT_LOCKED"
                  : "LOGIN_FAILED",

              ipAddress:
                ipAddress ?? null,

              userAgent:
                userAgent ?? null,

              metadata: {

                failedAttempts,

                lockMinutes,

              },

            },

          });

        }
      );


      if (lockedUntil) {

        throw new Error(
          `Too many failed login attempts. Your account is locked for ${lockMinutes} minutes.`
        );

      }


      throw new Error(
        "Invalid email or password."
      );

    }


    // --------------------------------------------------
    // EMAIL VERIFICATION
    // --------------------------------------------------

    if (!user.emailVerified) {

      // Create a new verification token.

      const verificationToken =
        crypto.randomUUID();

      const verificationTokenHash =
        hashToken(
          verificationToken
        );


      await db.emailVerificationToken.create({

        data: {

          userId:
            user.id,

          tokenHash:
            verificationTokenHash,

          expiresAt:
            new Date(
              Date.now() +
              15 * 60 * 1000
            ),

        },

      });


      await sendVerificationEmail(
        user.email,
        verificationToken
      );


      throw new Error(
        "Your email is not verified. A new verification link has been sent to your email."
      );

    }


    // --------------------------------------------------
    // SUCCESSFUL LOGIN
    // --------------------------------------------------

    const result =
      await db.$transaction(
        async (tx) => {

          // --------------------------------------------
          // RESET FAILED LOGIN COUNTER
          // --------------------------------------------

          const updatedUser =
            await tx.user.update({

              where: {

                id:
                  user.id,

              },

              data: {

                failedLoginAttempts:
                  0,

                lockedUntil:
                  null,

                lastFailedLoginAt:
                  null,

                lastLoginAt:
                  now,

                lastLoginIp:
                  ipAddress ?? null,

              },

            });


          // --------------------------------------------
          // LOGIN AUDIT
          // --------------------------------------------

          await tx.loginAttempt.create({

            data: {

              userId:
                user.id,

              email:
                user.email,

              ipAddress:
                ipAddress ?? "unknown",

              userAgent:
                userAgent ?? null,

              success:
                true,

              reason:
                "LOGIN_SUCCESS",

            },

          });


          // --------------------------------------------
          // SECURITY AUDIT
          // --------------------------------------------

          await tx.securityEvent.create({

            data: {

              userId:
                user.id,

              companyId:
                user.companyId,

              type:
                "LOGIN_SUCCESS",

              ipAddress:
                ipAddress ?? null,

              userAgent:
                userAgent ?? null,

            },

          });


          // --------------------------------------------
          // CREATE SESSION
          // --------------------------------------------

          const session =
            await tx.userSession.create({

              data: {

                userId:
                  user.id,

                ipAddress:
                  ipAddress ?? null,

                userAgent:
                  userAgent ?? null,

                expiresAt:
                  new Date(
                    now.getTime() +
                    7 *
                    24 *
                    60 *
                    60 *
                    1000
                  ),

              },

            });


          return {

            user:
              updatedUser,

            session,

          };

        }
      );


    // --------------------------------------------------
    // CREATE SHORT-LIVED ACCESS TOKEN
    // --------------------------------------------------

    const token =
      jwt.sign(

        {

          userId:
            result.user.id,

          companyId:
            result.user.companyId,

          role:
            result.user.role,

          sessionId:
            result.session.id,

        },

        JWT_SECRET,

        {

          expiresIn:
            JWT_EXPIRES_IN,

        }

      );


    return {

      token,

      sessionId:
        result.session.id,

      user: {

        id:
          result.user.id,

        name:
          result.user.name,

        email:
          result.user.email,

        companyId:
          result.user.companyId,

        role:
          result.user.role,

      },

    };

  }


  // ====================================================
  // CURRENT USER
  // ====================================================

  static async me(
    userId: string
  ) {

    const user =
      await db.user.findUnique({

        where: {

          id:
            userId,

        },

        select: {

          id:
            true,

          name:
            true,

          email:
            true,

          companyId:
            true,

          role:
            true,


          employee: {

            select: {

              id:
                true,

              departmentId:
                true,

              serviceId:
                true,

              deskId:
                true,


              desk: {

                select: {

                  id:
                    true,

                  name:
                    true,

                  status:
                    true,

                },

              },

            },

          },

        },

      });


    if (!user) {

      throw new Error(
        "User not found."
      );

    }


    return user;

  }


  // ====================================================
  // FORGOT PASSWORD
  // ====================================================

  static async forgotPassword(
    email: string
  ) {

    const user =
      await db.user.findUnique({

        where: {

          email,

        },

      });


    // Do not reveal whether the email exists.

    if (!user) {

      return;

    }


    // --------------------------------------------------
    // GENERATE PASSWORD RESET TOKEN
    // --------------------------------------------------

    const token =
      crypto.randomUUID();

    const tokenHash =
      hashToken(token);


    // --------------------------------------------------
    // STORE RESET TOKEN
    // --------------------------------------------------

    await db.passwordResetToken.create({

      data: {

        userId:
          user.id,

        tokenHash,

        expiresAt:
          new Date(
            Date.now() +
            15 * 60 * 1000
          ),

      },

    });


    // --------------------------------------------------
    // SECURITY AUDIT
    // --------------------------------------------------

    await db.securityEvent.create({

      data: {

        userId:
          user.id,

        companyId:
          user.companyId,

        type:
          "PASSWORD_RESET_REQUESTED",

      },

    });


    // --------------------------------------------------
    // SEND EMAIL
    // --------------------------------------------------

    await sendPasswordResetEmail(
      user.email,
      token
    );

  }


  // ====================================================
  // RESET PASSWORD
  // ====================================================

  static async resetPassword(
    token: string,
    password: string
  ) {

    const tokenHash =
      hashToken(token);


    // --------------------------------------------------
    // FIND VALID RESET TOKEN
    // --------------------------------------------------

    const resetToken =
      await db.passwordResetToken.findFirst({

        where: {

          tokenHash,

          expiresAt: {

            gt:
              new Date(),

          },

          usedAt:
            null,

        },

        include: {

          user:
            true,

        },

      });


    if (!resetToken) {

      throw new Error(
        "Invalid or expired reset token."
      );

    }


    // --------------------------------------------------
    // HASH NEW PASSWORD
    // --------------------------------------------------

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );


    // --------------------------------------------------
    // UPDATE PASSWORD + CONSUME TOKEN
    // --------------------------------------------------

    await db.$transaction([

      db.user.update({

        where: {

          id:
            resetToken.userId,

        },

        data: {

          passwordHash,

        },

      }),


      db.passwordResetToken.update({

        where: {

          id:
            resetToken.id,

        },

        data: {

          usedAt:
            new Date(),

        },

      }),


      db.securityEvent.create({

        data: {

          userId:
            resetToken.userId,

          companyId:
            resetToken.user.companyId,

          type:
            "PASSWORD_RESET_COMPLETED",

        },

      }),

    ]);


    return {

      message:
        "Password updated successfully.",

    };

  }

}
