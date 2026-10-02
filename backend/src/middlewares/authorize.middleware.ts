import { Response, NextFunction } from "express";
import { Role } from "@prisma/client";

import {
  AuthenticatedRequest,
} from "./auth.middleware";

// ======================================================
// AUTHORIZE
// ======================================================

export const authorize = (
  ...allowedRoles: Role[]
) => {

  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized.",
      });
    }

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        error:
          "You do not have permission to perform this action.",
      });
    }

    next();
  };
};