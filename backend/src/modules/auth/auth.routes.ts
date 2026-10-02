import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  loginRateLimiter,
  registerRateLimiter,
  passwordResetRateLimiter,
} from "../../middlewares/rate-limit.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

const router = Router();

// ======================================================
// REGISTER
// One registration endpoint.
//
// ADMIN
//   → creates a new company
//
// MANAGER / SECURITY / EMPLOYEE
//   → joins an existing company using company code
// ======================================================

router.post(
  "/register",
  registerRateLimiter,
  AuthController.register
);

// ======================================================
// LOGIN
// ======================================================

router.post(
  "/login",
  loginRateLimiter,
  AuthController.login
);

// ======================================================
// EMAIL VERIFICATION
// ======================================================

router.get(
  "/verify/:token",
  AuthController.verifyEmail
);

// ======================================================
// CURRENT USER
// ======================================================

router.get(
  "/me",
  authenticate,
  AuthController.me
);

// ======================================================
// FORGOT PASSWORD
// ======================================================

router.post(
  "/forgot-password",
  passwordResetRateLimiter,
  AuthController.forgotPassword
);

// ======================================================
// RESET PASSWORD
// ======================================================

router.post(
  "/reset-password/:token",
  passwordResetRateLimiter,
  AuthController.resetPassword
);

// ======================================================
// LOGOUT
// ======================================================

router.post(
  "/logout",
  authenticate,
  AuthController.logout
);

export default router;