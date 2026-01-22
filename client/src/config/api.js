import axios from "axios";

// Create an Axios instance
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.error('API URL is not configured. Check your .env file.');
}

const API = axios.create({
  baseURL: API_URL,
});

export default API;
