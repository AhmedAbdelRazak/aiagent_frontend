// app/hooks/useAuth.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "@/utils/api"; // your axios instance with baseURL
import { useRouter } from "next/navigation";

const AuthContext = createContext();

/**
 * AuthProvider wraps your app and provides:
 *   - user (object or null)
 *   - loading (boolean)
 *   - login(email,password)
 *   - signup(name,email,password,platforms)
 *   - logout()
 */
export function AuthProvider({ children }) {
	const router = useRouter();
	const [user, setUser] = useState(null); // e.g. { id, name, email, role, platforms }
	const [loading, setLoading] = useState(true);

	// ─── 1) On mount, try to load existing token & fetch profile ───
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			// 1a) Set Authorization header for all axios calls
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

			// 1b) Fetch the user’s profile from the new endpoint
			axios
				.get("/auth/profile")
				.then((res) => {
					setUser(res.data.data); // { id, name, email, role, platforms }
				})
				.catch((err) => {
					console.error("Profile fetch error:", err);
					localStorage.removeItem("token");
					setUser(null);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			// No token → not logged in
			setLoading(false);
		}
	}, []);

	// ─── 2) signup(...) now calls POST /auth/register,
	//       stores token, fetches profile, and redirects ───
	const signup = async (name, email, password, platforms) => {
		const res = await axios.post("/auth/register", {
			name,
			email,
			password,
			platforms,
		});
		// backend returns { success:true, data: { id, name, email, role, platforms, token } }
		const {
			id,
			name: userName,
			email: userEmail,
			role,
			platforms: userPlatforms,
			token,
		} = res.data.data;

		// 2a) Save token
		localStorage.setItem("token", token);

		// 2b) Set auth header
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

		// 2c) Set user state
		setUser({
			id,
			name: userName,
			email: userEmail,
			role,
			platforms: userPlatforms,
		});

		// 2d) Redirect
		router.push("/dashboard");
	};

	// ─── 3) login(...) now calls POST /auth/login,
	//       stores token, fetches profile, and redirects ───
	const login = async (email, password) => {
		const res = await axios.post("/auth/login", { email, password });
		// backend returns { success:true, data: { id, name, email, role, platforms, token } }
		const {
			id,
			name: userName,
			email: userEmail,
			role,
			platforms: userPlatforms,
			token,
		} = res.data.data;

		// 3a) Save token
		localStorage.setItem("token", token);

		// 3b) Set auth header
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

		// 3c) Set user state
		setUser({
			id,
			name: userName,
			email: userEmail,
			role,
			platforms: userPlatforms,
		});

		// 3d) Redirect
		router.push("/dashboard");
	};

	// ─── 4) logout() clears everything and sends user to login ───
	const logout = () => {
		localStorage.removeItem("token");
		delete axios.defaults.headers.common["Authorization"];
		setUser(null);
		router.push("/login");
	};

	return (
		<AuthContext.Provider value={{ user, loading, signup, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
