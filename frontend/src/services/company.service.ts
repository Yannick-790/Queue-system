import api from "./api";

export const CompanyService = {

  getCompany() {
    return api.get("/company");
  },

  getBuildings() {
    return api.get("/company/buildings");
  },

  createBuilding(data: any) {
    return api.post("/company/buildings", data);
  },

  createDepartment(data: any) {
    return api.post("/company/departments", data);
  },

  getDepartments(buildingId: string) {
    return api.get(`/company/buildings/${buildingId}/departments`);
  },

  updateRoutingMode(routingMode: string) {
    return api.patch("/company/routing-mode", {
      routingMode,
    });
  },

};