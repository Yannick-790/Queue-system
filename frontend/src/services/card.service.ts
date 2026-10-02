import api from "./api";

export const CardService = {

  // =========================================================
  // GET ALL CARDS
  // =========================================================

  getCards() {
    return api.get("/cards");
  },


  // =========================================================
  // CREATE CARD BATCH
  // =========================================================

  createManyCards(
    startNumber: number,
    endNumber: number
  ) {
    return api.post("/cards/batch", {
      startNumber,
      endNumber,
    });
  },


  // =========================================================
  // REGISTER RFID TO EXISTING CARD
  // =========================================================

  registerRfid(
    cardId: string,
    rfidUid: string
  ) {
    return api.post(
      `/cards/${cardId}/register-rfid`,
      {
        rfidUid,
      }
    );
  },


  // =========================================================
  // FIND CARD BY RFID
  // =========================================================

  getCardByRfid(
    rfidUid: string
  ) {
    return api.get(
      `/cards/rfid/${encodeURIComponent(rfidUid)}`
    );
  },


  // =========================================================
  // GIVE CARD TO CUSTOMER
  // RFID SCAN
  // =========================================================

  assignCard(
    rfidUid: string
  ) {
    return api.post(
      `/cards/rfid/${encodeURIComponent(rfidUid)}/scan/take`
    );
  },


  // =========================================================
  // RETURN CARD
  // RFID SCAN
  // =========================================================

  returnCard(
    rfidUid: string
  ) {
    return api.post(
      `/cards/rfid/${encodeURIComponent(rfidUid)}/scan/return`
    );
  },


  // =========================================================
  // MARK CARD LOST
  // =========================================================

  markLost(
    cardId: string
  ) {
    return api.patch(
      `/cards/${cardId}/status`,
      {
        status: "LOST",
      }
    );
  },

};