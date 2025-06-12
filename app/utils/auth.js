// utils/auth.js
import Cookies from "js-cookie";

export const setToken = (token) => {
	// Set token in cookie (expires in 7 days)
	Cookies.set("token", token, { expires: 7 });
};

export const removeToken = () => {
	Cookies.remove("token");
};

export const getToken = () => {
	return Cookies.get("token");
};

export const isAuthenticated = () => {
	return !!Cookies.get("token");
};
