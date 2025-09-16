"use client";
import axios from "axios";

let production = process.env.NEXT_PUBLIC_PRODUCTION;

const baseURL =
  production === "true"
    ? "https://bunika-n66gh.ondigitalocean.app/user/zidika"
    : "http://localhost:3001/user/zidika";

const backupUrl1 = "https://bunika.cyclic.app/user/zidika";
const backupUrl2 = "https://bunika-api.onrender.com/user/zidika";
let instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    const mtoken = localStorage.getItem("token");

    if (mtoken) {
      config.headers["Authorization"] = `Bearer ${mtoken}`;
    }
    let bid = process.env.NEXT_PUBLIC_STORE_ID;
    config.headers["business"] = bid;
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (config) => {
    return config;
  },

  async (error) => {
    let config = error.config;
    if (!config || config.baseURL === backupUrl2) {
      return Promise.reject(error);
    }
    if (config.response) {
      return config;
    }

    if (config.baseURL === backupUrl1) config.baseURL = backupUrl2;
    else config.baseURL = backupUrl1;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1000);
    });

    try {
      const retryResponse = await instance(config);
      return retryResponse;
    } catch (retryError) {
      return Promise.reject(retryError);
    }
  }
);

export default instance;
export const URL = baseURL;
