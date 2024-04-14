import axios from "axios";

export const apiClient = axios.create({
  baseURL: `http://10.0.2.2:8080`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
