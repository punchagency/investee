import axios from "axios";
// import { signout } from "./LoginServices";

const https =
  process.env.NODE_ENV === "production"
    ? axios.create({
        baseURL: "https://api079.perzsirentals.com/api/v1/",
        withCredentials: true,
      })
    : axios.create({
        baseURL: "http://localhost:5000/api/v1/",
        withCredentials: true,
      });

https.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await https.post("/auth/refresh-token");

        return https(originalRequest);
      } catch (refreshError) {
        // await signout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default https;
