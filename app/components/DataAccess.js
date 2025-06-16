// File: app/components/DataAccess.js
"use client";

import React from "react";
import styled from "styled-components";
import { AiOutlineSafetyCertificate } from "react-icons/ai";

const Section = styled.section`
	background: ${({ theme }) => theme.colors.background};
	padding: clamp(3rem, 6vw, 8rem) 1rem;
`;

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
`;

const Title = styled.h2`
	font-size: ${({ theme }) => theme.fontSizes["2xl"]};
	margin-bottom: 1rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const List = styled.ul`
	margin-top: 1rem;
	padding-left: 1.25rem;
	line-height: 1.6;
	li {
		margin-bottom: 0.75rem;
	}
	code {
		background: ${({ theme }) => theme.colors.cardBg};
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-size: 90%;
	}
`;

export default function DataAccess() {
	return (
		<Section id='data-use'>
			<Container>
				<Title>
					<AiOutlineSafetyCertificate size={28} />
					Why AiVideomatic needs Google access
				</Title>
				<p>
					We use Google OAuth 2.0 so you can securely publish finished videos
					straight to your YouTube channel without sharing your password. You
					may revoke access at any time from your Google Account → Security →
					Third‑party access.
				</p>

				<h3>Exact scopes requested &amp; purpose</h3>
				<List>
					<li>
						<code>https://www.googleapis.com/auth/youtube.upload</code> – upload
						the final rendered video you explicitly approve.
					</li>
					<li>
						<code>https://www.googleapis.com/auth/youtube.readonly</code> – read
						basic channel metadata to avoid scheduling conflicts.
					</li>
					<li>
						<code>profile</code> / <code>email</code> – show your channel name
						inside the dashboard and send you rendering notifications.
					</li>
				</List>

				<p>
					**We never read, modify or delete any other content** in your Google
					account. For full details, read our&nbsp;
					<a href='/privacy'>Privacy Policy</a>.
				</p>
			</Container>
		</Section>
	);
}
