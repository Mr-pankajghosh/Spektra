
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const axiosInstance = axios.create({
  baseURL: `${baseURL}`,
  withCredentials: true,
});
