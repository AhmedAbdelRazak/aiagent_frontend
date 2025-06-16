/* ──────────────────────────────────────────────────────────────
   File: app/terms/TermsContent.js
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
		font-size: ${({ theme }) => theme.fontSizes["2xl"]};
		text-align: center;
	}
	h2 {
		font-size: ${({ theme }) => theme.fontSizes.xl};
		margin-top: 2.5rem;
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

export default function TermsContent() {
	return (
		<Wrapper>
			<h1>AiVideomatic — Terms &amp; Conditions</h1>
			<p>
				Last updated:&nbsp;<strong>15 June 2025</strong>
			</p>

			{/* 1 */}
			<h2>1.&nbsp;Acceptance of These Terms</h2>
			<p>
				By creating an account, connecting a third‑party service (e.g.,
				YouTube), purchasing a subscription, or otherwise using the AiVideomatic
				platform (<strong>“Service”</strong>), you agree to be bound by these
				Terms & Conditions (<strong>“Terms”</strong>) and our{" "}
				<a href='/privacy'>Privacy Policy</a>. If you do not agree, do not use
				the Service.
			</p>

			{/* 2 */}
			<h2>2.&nbsp;The Service</h2>
			<p>
				AiVideomatic automates end‑to‑end AI‑driven video production (script,
				voice‑over, rendering, scheduling, publishing). Features may evolve over
				time; material changes will be announced 14 days in advance.
			</p>

			{/* 3 */}
			<h2>3.&nbsp;Eligibility &amp; Account Security</h2>
			<p>
				You must be at least 18 years old and safeguard your credentials. You
				are responsible for all activity that occurs under your account.
			</p>

			{/* 4 */}
			<h2>4.&nbsp;Subscriptions, Trials &amp; Payments</h2>
			<p>
				Plans auto‑renew unless cancelled before the end of the current billing
				term. Fees are exclusive of taxes. Trials convert to paid plans unless
				cancelled before trial expiry.
			</p>

			{/* 5 */}
			<h2>5.&nbsp;Ownership &amp; Intellectual Property</h2>
			<p>
				<strong>AiVideomatic IP</strong> remains ours.{" "}
				<strong>Your Content</strong> remains yours; you grant us a limited
				licence solely to operate the Service.
			</p>

			{/* 6 */}
			<h2>6.&nbsp;Generated Videos</h2>
			<p>
				Upon payment, you receive a perpetual, worldwide, royalty‑free licence
				to use videos generated via the Service.
			</p>

			{/* 7 */}
			<h2>7.&nbsp;Data Privacy &amp; Security</h2>
			<ul>
				<li>TLS 1.3 in transit, AES‑256 at rest.</li>
				<li>OAuth tokens are encrypted in hardware security modules.</li>
				<li>
					We never sell or share personal data for advertising. See our{" "}
					<a href='/privacy'>Privacy Policy</a> for details.
				</li>
			</ul>

			{/* 8 */}
			<h2>8.&nbsp;Third‑Party Integrations</h2>
			<ul>
				<li>
					We request only the minimum OAuth scopes required (see Privacy
					Policy).
				</li>
				<li>
					Revoking OAuth access may disable related functionality (e.g.,
					uploading to YouTube).
				</li>
			</ul>

			{/* 9 */}
			<h2>9.&nbsp;Compliance Review &amp; Content Moderation</h2>
			<p>
				To comply with law (e.g., DMCA, EU DSA) we may review content solely to
				investigate alleged violations. Logs are retained no longer than
				12 months unless legally required.
			</p>

			{/* 10 */}
			<h2>10.&nbsp;Prohibited Conduct</h2>
			<ul>
				<li>Reverse‑engineering the Service.</li>
				<li>Unlawful, hateful, or violent content.</li>
				<li>Malware, phishing, or spam.</li>
				<li>Export‑control violations.</li>
				<li>Abusing rate limits or degrading service stability.</li>
			</ul>

			{/* 11 */}
			<h2>11.&nbsp;Term &amp; Termination</h2>
			<p>
				We may suspend or terminate accounts for material breach. Sections
				related to IP, privacy, disclaimers and liability survive termination.
			</p>

			{/* 12 */}
			<h2>12.&nbsp;Disclaimers</h2>
			<p>
				Service is provided <strong>“as is.”</strong> We do not guarantee model
				accuracy or uninterrupted uptime.
			</p>

			{/* 13 */}
			<h2>13.&nbsp;Limitation of Liability</h2>
			<p>
				Liability is capped at fees paid in the previous 12 months; no indirect
				or consequential damages.
			</p>

			{/* 14 */}
			<h2>14.&nbsp;Indemnification</h2>
			<p>
				You will indemnify AiVideomatic for claims arising from your content or
				breach of these Terms.
			</p>

			{/* 15 */}
			<h2>15.&nbsp;Changes to Terms</h2>
			<p>
				We may update Terms with 14 days’ notice. Continued use constitutes
				acceptance.
			</p>

			{/* 16 */}
			<h2>16.&nbsp;Governing Law &amp; Jurisdiction</h2>
			<p>
				Laws of Delaware, USA. Exclusive jurisdiction in Wilmington, Delaware
				courts.
			</p>

			{/* 17 */}
			<h2>17.&nbsp;Google API Services &amp; Limited‑Use</h2>
			<p>
				AiVideomatic’s use of information received from Google APIs will adhere
				to the{" "}
				<a
					href='https://developers.google.com/terms/api-services-user-data-policy'
					target='_blank'
					rel='noopener noreferrer'
				>
					Google API Services User Data Policy
				</a>{" "}
				(including the Limited‑Use requirements). We only access, use, and store
				Google user data (limited to the upload + e‑mail scopes) solely to
				provide the features you initiate. We never transfer it to unaffiliated
				third parties.
			</p>

			{/* 18 */}
			<h2>18.&nbsp;YouTube API Services Terms</h2>
			<p>
				If you connect a YouTube channel, your use is also governed by the{" "}
				<a
					href='https://www.youtube.com/t/terms'
					target='_blank'
					rel='noopener noreferrer'
				>
					YouTube Terms of Service
				</a>{" "}
				and the{" "}
				<a
					href='https://developers.google.com/youtube/terms/api-services-terms-of-service'
					target='_blank'
					rel='noopener noreferrer'
				>
					YouTube API Services Terms of Service
				</a>
				.
			</p>

			{/* 19 */}
			<h2>19.&nbsp;Data Deletion &amp; Revocation</h2>
			<p>
				You may delete your AiVideomatic account (and all associated data) from
				the <strong>Profile → Danger Zone</strong> section of the dashboard or
				by emailing&nbsp;
				<a href='mailto:privacy@aivideomatic.com'>privacy@aivideomatic.com</a>.
				To revoke Google access, visit{" "}
				<a
					href='https://myaccount.google.com/permissions'
					target='_blank'
					rel='noopener noreferrer'
				>
					Google Account → Security → Third‑party access
				</a>{" "}
				and remove “AiVideomatic”.
			</p>

			{/* 20 */}
			<h2>20.&nbsp;Contact</h2>
			<p>
				Email&nbsp;
				<a href='mailto:legal@aivideomatic.com'>legal@aivideomatic.com</a> or
				write to: AiVideomatic LLC, PO Box 322, Crestline, CA 92325, USA.
			</p>
		</Wrapper>
	);
}
