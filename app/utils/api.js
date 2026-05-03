// app/utils/api.js
import axios from "axios";
import { getApiBase } from "./apiBase";
import { getToken } from "./auth";

const axiosClient = axios.create({
	headers: {
		"Content-Type": "application/json",
	},
});

axiosClient.interceptors.request.use(
	(config) => {
		const apiBase = getApiBase();
		if (apiBase) {
			config.baseURL = apiBase;
		}
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosClient;
