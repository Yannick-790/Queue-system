import api from "./api";

export const NotificationService = {

  getAll() {
    return api.get("/notifications");
  },

  markRead(id: string) {
    return api.patch(`/notifications/${id}/read`);
  },

  delete(id: string) {
    return api.delete(`/notifications/${id}`);
  },

};