import api from "./api";

export const ReportService = {

  queue() {
    return api.get("/reports/queue");
  },

  serviceTime() {
    return api.get("/reports/service-time");
  },

  employees() {
    return api.get("/reports/employees");
  },

  departments() {
    return api.get("/reports/departments");
  },

};