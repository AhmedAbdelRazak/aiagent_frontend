/* ──────────────────────────────────────────────────────────────
   File: app/privacy/PrivacyContent.js
   Clean version — no citation placeholders
   ──────────────────────────────────────────────────────────── */
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
		margin: 0 0 1.25rem;
		line-height: 1.25;
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
				Last updated:&nbsp;<strong>15 June 2025</strong>
			</p>

			{/* 1 */}
			<h2>1.&nbsp;Introduction</h2>
			<p>
				AiVideomatic (“we”, “our”, “us”) respects your privacy. This Policy
				describes how we collect, use, and safeguard information when you use
				the AiVideomatic platform (<strong>“Service”</strong>).
			</p>

			{/* 2 */}
			<h2>2.&nbsp;Information We Collect</h2>
			<h3>2.1&nbsp;Information You Provide</h3>
			<ul>
				<li>Account data — name, email, hashed password.</li>
				<li>Billing &amp; subscription details.</li>
				<li>Uploaded prompts, media, and generated videos.</li>
				<li>
					Encrypted OAuth tokens for connected platforms (YouTube, Facebook,
					Instagram).
				</li>
			</ul>

			<h3>2.2&nbsp;Information Collected Automatically</h3>
			<ul>
				<li>Usage metrics and feature interactions.</li>
				<li>Device &amp; log data (IP, browser, OS).</li>
				<li>First‑party cookies (authentication, analytics).</li>
			</ul>

			{/* 3 */}
			<h2>3.&nbsp;Legal Bases</h2>
			<ul>
				<li>Contractual necessity.</li>
				<li>Legitimate interests (security &amp; analytics).</li>
				<li>Consent (marketing email, non‑essential cookies).</li>
				<li>Legal obligations.</li>
			</ul>

			{/* 4 */}
			<h2>4.&nbsp;How We Use Your Information</h2>
			<ul>
				<li>Operate and maintain the Service.</li>
				<li>Generate AI videos and schedule uploads you request.</li>
				<li>Process payments and manage subscriptions.</li>
				<li>Send transactional emails and notifications.</li>
				<li>Improve performance and develop new features.</li>
				<li>Detect fraud and enforce policies.</li>
				<li>Comply with applicable laws.</li>
			</ul>

			{/* 5 */}
			<h2>5.&nbsp;Sharing of Information</h2>
			<p>
				We <strong>never</strong> sell your data. We share it only with vetted
				processors (hosting, payments, email) under strict confidentiality or
				when legally compelled.
			</p>

			{/* 6 */}
			<h2>6.&nbsp;Cookies &amp; Analytics</h2>
			<p>
				We use first‑party cookies for authentication and privacy‑respecting
				analytics (no cross‑site tracking). You may disable cookies, but some
				features may not work.
			</p>

			{/* 7 */}
			<h2>7.&nbsp;International Transfers</h2>
			<p>
				Data may be processed in the United States. We rely on Standard
				Contractual Clauses and equivalent safeguards.
			</p>

			{/* 8 */}
			<h2>8.&nbsp;Data Retention</h2>
			<ul>
				<li>User‑generated content: 18 months (or until you delete it).</li>
				<li>Account records: life of account + 6 years (legal retention).</li>
				<li>Revoked OAuth tokens: deleted immediately.</li>
			</ul>

			{/* 9 */}
			<h2>9.&nbsp;Security Measures</h2>
			<ul>
				<li>TLS 1.3 in transit, AES‑256 at rest.</li>
				<li>OAuth tokens stored in hardware security modules.</li>
				<li>Role‑based access controls and regular audits.</li>
			</ul>

			{/* 10 */}
			<h2>10.&nbsp;Your Rights</h2>
			<p>
				Under GDPR, CCPA and similar laws you may access, correct, delete or
				port your data. Email&nbsp;
				<a href='mailto:privacy@aivideomatic.com'>
					privacy@aivideomatic.com
				</a>{" "}
				to exercise any right.
			</p>

			{/* 11 */}
			<h2>11.&nbsp;Children’s Privacy</h2>
			<p>
				The Service is not directed to children under 16 and we do not knowingly
				collect their data.
			</p>

			{/* 12 */}
			<h2>12.&nbsp;Google API Services &amp; Limited‑Use Disclosure</h2>
			<p>
				AiVideomatic’s use of information received from Google APIs will adhere
				to the{" "}
				<a
					href='https://developers.google.com/terms/api-services-user-data-policy'
					target='_blank'
					rel='noopener noreferrer'
				>
					Google API Services User Data Policy
				</a>{" "}
				(including the Limited‑Use requirements). We only access Google user
				data to upload videos to YouTube and show the connected e‑mail address
				inside your dashboard. We never use this data for advertising and never
				share it with unaffiliated third parties.
			</p>

			{/* 13 */}
			<h2>13.&nbsp;YouTube API Services</h2>
			<p>
				When you connect your YouTube account, the Service is also governed by
				the{" "}
				<a
					href='https://www.youtube.com/t/terms'
					target='_blank'
					rel='noopener noreferrer'
				>
					YouTube Terms of Service
				</a>{" "}
				and the{" "}
				<a
					href='https://developers.google.com/youtube/terms/api-services-terms-of-service'
					target='_blank'
					rel='noopener noreferrer'
				>
					YouTube API Services Terms of Service
				</a>
				. You may revoke the app’s access at any time from your Google
				Account → Security → Third‑party access.
			</p>

			{/* 14 */}
			<h2>14.&nbsp;Data Deletion &amp; Revocation</h2>
			<p>
				You can delete your AiVideomatic account (and all associated data) from
				the <strong>Profile → Danger Zone</strong> in the dashboard or by
				emailing&nbsp;
				<a href='mailto:privacy@aivideomatic.com'>privacy@aivideomatic.com</a>.
				After deletion, backups are purged within 30 days. To revoke Google
				access, visit{" "}
				<a
					href='https://myaccount.google.com/permissions'
					target='_blank'
					rel='noopener noreferrer'
				>
					https://myaccount.google.com/permissions
				</a>{" "}
				and remove “AiVideomatic”.
			</p>

			{/* 15 */}
			<h2>15.&nbsp;Changes to This Policy</h2>
			<p>
				We will post any changes on this page and notify you by email at least
				14 days before they take effect.
			</p>

			{/* 16 */}
			<h2>16.&nbsp;Contact Us</h2>
			<p>
				Email&nbsp;
				<a href='mailto:privacy@aivideomatic.com'>
					privacy@aivideomatic.com
				</a>{" "}
				or write to: PO Box 322, Crestline, California 92325, USA.
			</p>
		</Wrapper>
	);
}
