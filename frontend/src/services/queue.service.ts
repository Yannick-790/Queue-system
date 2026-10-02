import api from "./api";


// ============================================================
// QUEUE SERVICE
// ============================================================

export const QueueService = {

  // ==========================================================
  // CREATE TICKET
  // ==========================================================

  createTicket(data: any) {
    return api.post(
      "/tickets",
      data
    );
  },


  // ==========================================================
  // GET MY QUEUE
  // Employee + desk + service + current customer + waiting
  // ==========================================================

  getMyQueue() {
    return api.get(
      "/queue/my-queue"
    );
  },


  // ==========================================================
  // GET NEXT CUSTOMER
  // Does NOT call the customer.
  // Only previews who is next.
  // ==========================================================

  getNextCustomer() {
    return api.get(
      "/queue/next"
    );
  },


  // ==========================================================
  // CALL NEXT CUSTOMER
  // Backend gets employee/desk/service from authenticated user.
  // ==========================================================

  callNext() {
    return api.post(
      "/queue/call-next"
    );
  },


  // ==========================================================
  // COMPLETE SERVICE
  // ==========================================================

  complete(
    sessionId: string
  ) {
    return api.post(
      "/queue/complete",
      {
        sessionId,
      }
    );
  },


  // ==========================================================
  // TRANSFER CUSTOMER
  // ==========================================================

  transfer(
    ticketId: string,
    toServiceId: string
  ) {
    return api.post(
      "/queue/transfer",
      {
        ticketId,
        toServiceId,
      }
    );
  },


  // ==========================================================
  // NO SHOW
  // ==========================================================

  noShow(
    ticketId: string
  ) {
    return api.post(
      "/queue/no-show",
      {
        ticketId,
      }
    );
  },


  // ==========================================================
  // RECALL CUSTOMER
  // Calls the currently serving customer again.
  // ==========================================================

  recall() {
    return api.post(
      "/queue/recall"
    );
  },


  // ==========================================================
  // CANCEL TICKET
  // ==========================================================

  cancel(
    ticketId: string
  ) {
    return api.post(
      "/queue/cancel",
      {
        ticketId,
      }
    );
  },


  // ==========================================================
  // RETURN CARD
  // Security returns card to available pool.
  // ==========================================================

  returnCard(
    cardId: string
  ) {
    return api.post(
      "/queue/return-card",
      {
        cardId,
      }
    );
  },


  // ==========================================================
  // SET DESK AVAILABLE
  // ==========================================================

  setDeskAvailable() {
    return api.post(
      "/queue/desk/available"
    );
  },


  // ==========================================================
  // SET DESK OFFLINE
  // ==========================================================

  setDeskOffline() {
    return api.post(
      "/queue/desk/offline"
    );
  },

};