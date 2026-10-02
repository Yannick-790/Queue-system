import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { CardController } from "./card.controller";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

// =========================================================
// CREATE
// =========================================================

// Create one card
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  CardController.createCard
);

// Create card range
router.post(
  "/batch",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  CardController.createManyCards
);

// =========================================================
// GET
// =========================================================

// Get all cards
router.get(
  "/",
  authenticate,
  CardController.getCards
);

// =========================================================
// RFID REGISTRATION
// =========================================================

// Register physical RFID UID to an existing card
//
// Example:
// POST /api/cards/UUID_OF_CARD/register-rfid
//
// Body:
// {
//   "rfidUid": "04A7913C826B80"
// }
router.post(
  "/:cardId/register-rfid",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  CardController.registerRfid
);

// =========================================================
// RFID SCANNER
// =========================================================

// Find card using RFID UID
//
// Example:
// GET /api/cards/rfid/04A7913C826B80
router.get(
  "/rfid/:rfidUid",
  authenticate,
  CardController.getCardByRfid
);

// =========================================================
// INTERNAL CARD ID
// =========================================================

// Find card using database UUID
router.get(
  "/:cardId",
  authenticate,
  CardController.getCardById
);

// =========================================================
// STATUS
// =========================================================

// Update card status manually
router.patch(
  "/:cardId/status",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER", "SECURITY"),
  CardController.updateStatus
);

// =========================================================
// DELETE
// =========================================================

router.delete(
  "/:cardId",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER"),
  CardController.deleteCard
);

// =========================================================
// SCAN TAKE
// =========================================================

// Scanner reads RFID → give card to customer
//
// Example:
// POST /api/cards/rfid/04A7913C826B80/scan/take
router.post(
  "/rfid/:rfidUid/scan/take",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER", "SECURITY"),
  CardController.scanTakeCard
);

// =========================================================
// SCAN RETURN
// =========================================================

// Scanner reads RFID → customer returned card
//
// Example:
// POST /api/cards/rfid/04A7913C826B80/scan/return
router.post(
  "/rfid/:rfidUid/scan/return",
  authenticate,
  authorizeRoles("ADMIN", "MANAGER", "SECURITY"),
  CardController.scanReturnCard
);

export default router;