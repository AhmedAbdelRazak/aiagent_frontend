/* ───────────────────────────────────────────────────────────── */
/*  File: app/privacy/PrivacyContent.js                         */
/*  Description: Pure UI for the Privacy Policy – runs client   */
/* ───────────────────────────────────────────────────────────── */
"use client";

import React from "react";
import styled from "styled-components";

const Wrapper = styled.section`
	max-width: 960px;
	margin: 0 auto;
	padding: clamp(3rem, 5vw, 5rem) 1rem;
	color: ${({ theme }) => theme.colors.text};
	line-height: 1.7;
	font-size: ${({ theme }) => theme.fontSizes.md};

	h1,
	h2 {
		color: ${({ theme }) => theme.colors.primary};
		line-height: 1.25;
		margin: 0 0 1.25rem;
	}
	h1 {
		text-align: center;
		font-size: ${({ theme }) => theme.fontSizes["2xl"]};
	}
	h2 {
		font-size: ${({ theme }) => theme.fontSizes.xl};
		margin-top: 2.25rem;
	}
	h3 {
		font-size: ${({ theme }) => theme.fontSizes.lg};
		margin: 1.75rem 0 1rem;
	}
	ul {
		list-style: disc inside;
		margin-left: 1rem;
	}
	a {
		color: ${({ theme }) => theme.colors.primary};
		text-decoration: underline;
	}
`;

export default function PrivacyContent() {
	return (
		<Wrapper>
			<h1>AiVideomatic — Privacy&nbsp;Policy</h1>
			<p>
				Last updated: <strong>12 June 2025</strong>
			</p>

			{/* 1. Introduction */}
			<h2>1.&nbsp;Introduction</h2>
			<p>
				AiVideomatic is committed to protecting your privacy. This Privacy
				Policy explains how we collect, use, disclose, and safeguard your
				information when you use the AiVideomatic platform (
				<strong>“Service”</strong>).
			</p>

			{/* 2. Information We Collect */}
			<h2>2.&nbsp;Information We Collect</h2>
			<h3>2.1 Information You Provide</h3>
			<ul>
				<li>Account details (name, email, hashed password).</li>
				<li>Billing &amp; subscription information.</li>
				<li>Uploaded prompts, media, and generated content.</li>
				<li>
					Encrypted OAuth tokens for connected platforms (YouTube, Facebook,
					Instagram).
				</li>
			</ul>

			<h3>2.2 Information We Collect Automatically</h3>
			<ul>
				<li>Usage metrics and feature interactions.</li>
				<li>Device and log data (IP, browser, OS).</li>
				<li>Cookies and similar technologies (see Section 6).</li>
			</ul>

			{/* 3. Legal Bases */}
			<h2>3.&nbsp;Legal Bases for Processing</h2>
			<ul>
				<li>Contractual necessity.</li>
				<li>Legitimate interests (security &amp; analytics).</li>
				<li>Consent (marketing emails, non‑essential cookies).</li>
				<li>Legal obligations.</li>
			</ul>

			{/* 4. Use of Data */}
			<h2>4.&nbsp;How We Use Your Information</h2>
			<ul>
				<li>Operate and maintain the Service.</li>
				<li>Generate AI videos and schedule uploads you request.</li>
				<li>Process payments and manage subscriptions.</li>
				<li>Send transactional messages.</li>
				<li>Improve performance and develop new features.</li>
				<li>Detect fraud and enforce policies.</li>
				<li>Comply with applicable laws.</li>
			</ul>

			{/* 5. Sharing */}
			<h2>5.&nbsp;How We Share Information</h2>
			<p>
				We never sell your data. We share it only with vetted service providers
				(hosting, payments, email), our limited Compliance Team, or when legally
				compelled.
			</p>

			{/* 6. Cookies */}
			<h2>6.&nbsp;Cookies &amp; Tracking</h2>
			<p>
				We use first‑party cookies for authentication and privacy‑respecting
				analytics. You may disable cookies, but the Service may not function
				fully.
			</p>

			{/* 7. Transfers */}
			<h2>7.&nbsp;International Transfers</h2>
			<p>
				Data may be processed in the United States with Standard Contractual
				Clauses as safeguards.
			</p>

			{/* 8. Retention */}
			<h2>8.&nbsp;Data Retention</h2>
			<ul>
				<li>User‑generated content: 18 months by default.</li>
				<li>Account records: life of account + 6 years.</li>
				<li>Revoked OAuth tokens: deleted immediately.</li>
			</ul>

			{/* 9. Security */}
			<h2>9.&nbsp;Security Measures</h2>
			<ul>
				<li>TLS 1.3 in transit, AES‑256 at rest.</li>
				<li>Tokens in hardware security modules.</li>
				<li>Role‑based access controls &amp; audits.</li>
			</ul>

			{/* 10. Rights */}
			<h2>10.&nbsp;Your Rights</h2>
			<p>
				GDPR and CCPA give you rights to access, correct, delete, or port your
				data. Email&nbsp;
				<a href='mailto:privacy@aivideomatic.com'>
					privacy@aivideomatic.com
				</a>{" "}
				to exercise any right.
			</p>

			{/* 11. Children's data */}
			<h2>11.&nbsp;Children&rsquo;s Privacy</h2>
			<p>
				The Service is not directed to children under 16 and we do not knowingly
				collect their data.
			</p>

			{/* 12. Changes */}
			<h2>12.&nbsp;Changes to This Policy</h2>
			<p>
				We will notify you of material changes 14 days before they take effect.
			</p>

			{/* 13. Contact */}
			<h2>13.&nbsp;Contact Us</h2>
			<p>
				Email&nbsp;
				<a href='mailto:privacy@aivideomatic.com'>
					privacy@aivideomatic.com
				</a>{" "}
				or write to: PO Box 322, Crestline, California 92325, USA.
			</p>
		</Wrapper>
	);
}
