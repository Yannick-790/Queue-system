import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  companyId: string;
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "MANAGER" | "SECURITY" | "EMPLOYEE";
}

export const AuthService = {

  async login(data: LoginData) {
    const res = await api.post("/auth/login", data);

    const token = res.data.data.token;

    localStorage.setItem("token", token);

    return res.data.data;
  },

  async register(data: RegisterData) {
    const res = await api.post("/auth/register", data);
    return res.data.data;
  },

  async me() {
    const res = await api.get("/auth/me");
    return res.data.data;
  },

  logout() {
    localStorage.removeItem("token");
  }

};