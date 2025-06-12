// app/components/ProtectedRoute.js
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children, adminOnly = false }) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (!user) {
				router.replace("/login");
			} else if (adminOnly && user.role !== "admin") {
				router.replace("/dashboard");
			}
		}
	}, [user, loading, adminOnly, router]);

	if (loading || !user) {
		return <p>Loading...</p>;
	}
	if (adminOnly && user.role !== "admin") {
		return <p>Redirecting...</p>;
	}
	return <>{children}</>;
}
