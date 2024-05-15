import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://strapi-mdg8.onrender.com/api",
  timeout: 1000,
});

export default axiosInstance;
