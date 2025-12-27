// app/utils/api.js
import axios from "axios";
import Cookies from "js-cookie";
import { getApiBase } from "./apiBase";

const axiosClient = axios.create({
	baseURL: getApiBase(),
	headers: {
		"Content-Type": "application/json",
	},
});

axiosClient.interceptors.request.use(
	(config) => {
		const token = Cookies.get("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosClient;
