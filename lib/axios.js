import axios from "axios";

export const apiClient = axios.create({
  baseURL: `http://192.168.1.64:8080`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
