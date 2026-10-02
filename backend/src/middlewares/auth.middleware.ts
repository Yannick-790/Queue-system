import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { db } from "../config/db";
import { Role } from "@prisma/client";

// ======================================================
// TOKEN PAYLOAD
// ======================================================

export interface TokenPayload {
  userId: string;
  companyId: string;
  role: Role;
  sessionId: string;
}

// ======================================================
// AUTHENTICATED REQUEST
// ======================================================

export interface AuthenticatedRequest
  extends Request {
  user?: TokenPayload;
}

// ======================================================
// JWT SECRET
// ======================================================

const JWT_SECRET =
  process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not configured."
  );
}

// ======================================================
// AUTHENTICATE
// ======================================================

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {

  const authHeader =
    req.headers.authorization;

  // --------------------------------------------------
  // NO AUTHORIZATION HEADER
  // --------------------------------------------------

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      error:
        "Access denied. No token provided.",
    });
  }

  // --------------------------------------------------
  // EXTRACT TOKEN
  // --------------------------------------------------

  const token =
    authHeader.substring(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      error:
        "Invalid authorization header.",
    });
  }

  // --------------------------------------------------
  // VERIFY JWT
  // --------------------------------------------------

  try {

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    if (
      typeof decoded === "string"
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid token.",
      });
    }

    // ------------------------------------------------
    // CHECK REQUIRED CLAIMS
    // ------------------------------------------------

    if (
      typeof decoded.userId !== "string" ||
      typeof decoded.companyId !== "string" ||
      typeof decoded.role !== "string" ||
      typeof decoded.sessionId !== "string"
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload.",
      });
    }

    // ------------------------------------------------
    // CHECK ROLE
    // ------------------------------------------------

    if (
      !Object.values(Role).includes(
        decoded.role as Role
      )
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid user role.",
      });
    }

    // ------------------------------------------------
    // CHECK SERVER SESSION
    // ------------------------------------------------

    const session =
      await db.userSession.findUnique({
        where: {
          id: decoded.sessionId,
        },
      });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Session is no longer valid.",
      });
    }

    // ------------------------------------------------
    // SESSION BELONGS TO USER
    // ------------------------------------------------

    if (
      session.userId !== decoded.userId
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid session.",
      });
    }

    // ------------------------------------------------
    // SESSION EXPIRED
    // ------------------------------------------------

    if (
      session.expiresAt <= new Date()
    ) {
      return res.status(401).json({
        success: false,
        error: "Session has expired.",
      });
    }

    // ------------------------------------------------
    // ATTACH USER
    // ------------------------------------------------

    req.user = {
      userId: decoded.userId,
      companyId: decoded.companyId,
      role: decoded.role as Role,
      sessionId: decoded.sessionId,
    };

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      error:
        "Invalid or expired authentication token.",
    });

  }
};