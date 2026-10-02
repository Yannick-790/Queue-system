import rateLimit from "express-rate-limit";

// ======================================================
// LOGIN RATE LIMIT
// ======================================================

export const loginRateLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 10,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    message: {
      success: false,
      error:
        "Too many login attempts. Please try again later.",
    },
  });

// ======================================================
// REGISTER RATE LIMIT
// ======================================================

export const registerRateLimiter =
  rateLimit({
    windowMs:
      60 * 60 * 1000,

    limit: 5,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    message: {
      success: false,
      error:
        "Too many registration attempts. Please try again later.",
    },
  });

// ======================================================
// PASSWORD RESET REQUEST RATE LIMIT
// ======================================================

export const passwordResetRateLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 5,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    message: {
      success: false,
      error:
        "Too many password reset requests. Please try again later.",
    },
  });