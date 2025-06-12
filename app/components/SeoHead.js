"use client";
import React from "react";
import Head from "next/head";

export default function SeoHead({ title, description, keywords }) {
	return (
		<Head>
			<title>{title || "AgentAI"}</title>
			<meta
				name='description'
				content={description || "AgentAI - AI‐powered social media posting"}
			/>
			<meta
				name='keywords'
				content={keywords || "AI, social media, scheduling"}
			/>
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			{/* Open Graph */}
			<meta property='og:title' content={title || "AgentAI"} />
			<meta
				property='og:description'
				content={description || "AgentAI - AI‐powered social media posting"}
			/>
			<meta property='og:type' content='website' />
			<meta property='og:url' content={process.env.NEXT_PUBLIC_CLIENT_URL} />
			<meta property='og:image' content='/logo.svg' />
			{/* Twitter Card */}
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={title || "AgentAI"} />
			<meta
				name='twitter:description'
				content={description || "AgentAI - AI‐powered social media posting"}
			/>
			<meta name='twitter:image' content='/logo.svg' />
			<link rel='icon' href='/favicon.ico' />
		</Head>
	);
}
