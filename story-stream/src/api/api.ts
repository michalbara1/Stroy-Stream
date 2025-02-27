import axios, { CanceledError } from "axios";
export const baseURL = 'http://localhost:3000'


export { CanceledError }
const api = axios.create({
    baseURL: "http://localhost:3000",
});

export default api;