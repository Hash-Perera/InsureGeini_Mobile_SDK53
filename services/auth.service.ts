import { BASE_URL } from "@/constants/server";
import axios from "axios";

export const AuthService = {
  async login(values: any) {
    return await axios.post(`${BASE_URL}/auth/login`, values);
  },
};
