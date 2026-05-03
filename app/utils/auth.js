// utils/auth.js
import Cookies from "js-cookie";

const TOKEN_COOKIE = "token";

function cookieOptions() {
	const secure =
		process.env.NODE_ENV === "production" ||
		(typeof window !== "undefined" && window.location.protocol === "https:");
	return {
		expires: 7,
		sameSite: "lax",
		secure,
		path: "/",
	};
}

function clearLegacyToken() {
	try {
		localStorage.removeItem(TOKEN_COOKIE);
	} catch {}
}

export const setToken = (token) => {
	Cookies.set(TOKEN_COOKIE, token, cookieOptions());
	clearLegacyToken();
};

export const removeToken = () => {
	Cookies.remove(TOKEN_COOKIE, { path: "/" });
	clearLegacyToken();
};

export const getToken = () => {
	const cookieToken = Cookies.get(TOKEN_COOKIE);
	if (cookieToken) return cookieToken;

	try {
		const legacyToken = localStorage.getItem(TOKEN_COOKIE);
		if (legacyToken) {
			setToken(legacyToken);
			return legacyToken;
		}
	} catch {}
	return "";
};

export const isAuthenticated = () => {
	return !!getToken();
};
