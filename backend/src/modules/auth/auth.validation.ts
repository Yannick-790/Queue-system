import { z } from "zod";
import { Role } from "@prisma/client";

// ======================================================
// REGISTER USER
//
// ADMIN:
//   - Creates a new company
//   - companyName required
//   - companyCode NOT required
//
// MANAGER / SECURITY / EMPLOYEE:
//   - Join an existing company
//   - companyName required
//   - companyCode required
// ======================================================

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100),

    email: z
      .string()
      .email("Invalid email")
      .transform((value) => value.trim().toLowerCase()),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .regex(
        /[A-Z]/,
        "Password must contain one uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain one lowercase letter"
      )
      .regex(
        /[0-9]/,
        "Password must contain one number"
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain one special symbol"
      ),

    // USER SELECTS THIS ON THE FRONTEND
    role: z.nativeEnum(Role),

    // Used by ADMIN and joining users
    companyName: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(150)
      .optional(),

    // ADMIN can provide industry
    industry: z
      .string()
      .max(100)
      .optional(),

    // Required when joining an existing company
    companyCode: z
      .string()
      .min(4, "Company code must be at least 4 characters")
      .optional(),

    // Optional job assignment
    departmentId: z
      .string()
      .optional(),

    serviceId: z
      .string()
      .optional(),
  })
  .superRefine((data, ctx) => {
    // ==================================================
    // ADMIN
    // ==================================================

    if (data.role === Role.ADMIN) {
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Company name is required for ADMIN registration.",
        });
      }

      // Admin creates the company, therefore no company
      // code is required.
    }

    // ==================================================
    // MANAGER / SECURITY / EMPLOYEE
    // ==================================================

    if (
      data.role === Role.MANAGER ||
      data.role === Role.SECURITY ||
      data.role === Role.EMPLOYEE
    ) {
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Company name is required.",
        });
      }

      if (!data.companyCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyCode"],
          message:
            "Company code is required when joining an existing company.",
        });
      }
    }
  });

// ======================================================
// LOGIN
// ======================================================

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .transform((value) => value.trim().toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required"),
});

// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .transform((value) => value.trim().toLowerCase()),
});

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),
});

// ======================================================
// TYPES
// ======================================================

export type RegisterInput =
  z.infer<typeof registerSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;

export type ForgotPasswordInput =
  z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordInput =
  z.infer<typeof resetPasswordSchema>;