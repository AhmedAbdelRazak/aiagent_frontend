// app/ClientProviders.js
"use client";

import React from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { lightTheme } from "@/styles/theme";
import { AuthProvider } from "@/hooks/useAuth";
import NavMenu from "@/components/NavMenu";
import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/Footer";

const AdditionalGlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
`;

export default function ClientProviders({ children }) {
	return (
		<ThemeProvider theme={lightTheme}>
			<AdditionalGlobalStyle />
			<AuthProvider>
				<NavMenu />
				<main style={{ minHeight: "calc(100vh - 200px)" }}>{children}</main>
				<ChatWidget />
				<Footer />
			</AuthProvider>
		</ThemeProvider>
	);
}
