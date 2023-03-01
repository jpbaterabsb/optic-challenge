import axios from "axios";

export const rest = axios.create({baseURL: process.env.REACT_APP_BACKEND_URL});