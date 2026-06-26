import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const setupProfile = (profileData) =>
  API.post("/profile", profileData);

export const sendMessage = (userMessage) =>
  API.post("/chat", { userMessage });

export const getHistory = () =>
  API.get("/history");

export const clearSession = () =>
  API.post("/clear");