import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  // You can add default headers here if needed
  // headers: { "Content-Type": "application/json" }
});

export default API;
