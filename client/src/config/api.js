import axios from "axios";

const API = axios.create({
  baseURL: "https://eventra-backend-pr6v.onrender.com/api",
  withCredentials: true,
});

export default API;