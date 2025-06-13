// app/layout.js
import React from "react";
import ClientProviders from "./ClientProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<head>
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
				{/* ← Google domain verification here */}
				<meta
					name='google-site-verification'
					content='47ejHEFZmQ6Am644qP3hd1Y1v5WQk-6sroDUTF0RF5Q'
				/>
				<meta charSet='UTF-8' />
				{/* Default SEO tags; per-page tags override these */}
				<meta name='viewport' content='width=device-width, initial-scale=1' />
			</head>
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
