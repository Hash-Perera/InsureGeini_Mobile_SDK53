import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/server";

const httpClient = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor - Attach Token
httpClient.interceptors.request.use(
  async (config) => {
    const userDetails = await AsyncStorage.getItem("userDetails");

    if (userDetails) {
      const { token } = JSON.parse(userDetails);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
