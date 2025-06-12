// app/layout.js
import React from "react";
import Head from "next/head";
import ClientProviders from "./ClientProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<Head>
				<title>AgentAI | AI‐Powered Social Media Posting</title>
				<meta
					name='description'
					content='AgentAI schedules and posts videos to YouTube, Facebook, and Instagram using AI.'
				/>
				<meta
					name='keywords'
					content='AI, social media, scheduling, YouTube, Facebook, Instagram, AgentAI, SaaS'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<body>
				<GoogleOAuthProvider
					clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
				>
					<ClientProviders>{children}</ClientProviders>
				</GoogleOAuthProvider>
			</body>
		</html>
	);
}
