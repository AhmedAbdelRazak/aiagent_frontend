/* ───────────────────────────────────────────────────────────── */
/*  File: app/terms/TermsContent.js                              */
/*  Description: UI for Terms & Conditions (client‑side)         */
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
		margin: 0 0 1.25rem;
		line-height: 1.2;
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
				Last updated: <strong>12 June 2025</strong>
			</p>

			{/* 1 */}
			<h2>1. Acceptance of These Terms</h2>
			<p>
				By creating an account, connecting a third‑party service (e.g.,
				YouTube), purchasing a subscription, or otherwise using the AiVideomatic
				platform (<strong>“Service”</strong>), you agree to be bound by these
				Terms &amp; Conditions (<strong>“Terms”</strong>) and our{" "}
				<a href='/privacy'>Privacy Policy</a>. If you do not agree, do not use
				the Service.
			</p>

			{/* 2 */}
			<h2>2. The Service</h2>
			<p>
				AiVideomatic automates end‑to‑end AI‑driven video production (script,
				voice‑over, rendering, scheduling, publishing). Features may evolve over
				time.
			</p>

			{/* 3 */}
			<h2>3. Eligibility &amp; Account Security</h2>
			<p>
				You must be 18 or older and safeguard your credentials. You are
				responsible for activity under your account.
			</p>

			{/* 4 */}
			<h2>4. Subscriptions, Trials &amp; Payments</h2>
			<p>
				Plans auto‑renew unless canceled. Fees are exclusive of taxes. Trial
				accounts convert to paid unless canceled before the trial ends.
			</p>

			{/* 5 */}
			<h2>5. Ownership &amp; Intellectual Property</h2>
			<p>
				<strong>AiVideomatic IP</strong> remains ours.{" "}
				<strong>Your Content</strong> remains yours; you grant us a limited
				license to process it for the Service.
			</p>

			{/* 6 */}
			<h2>6. Generated Videos</h2>
			<p>
				Upon payment, you receive a perpetual, worldwide, royalty‑free license
				to use videos you generate.
			</p>

			{/* 7 */}
			<h2>7. Data Privacy &amp; Security</h2>
			<ul>
				<li>
					End‑to‑end TLS 1.3, AES‑256 at rest for credentials &amp; tokens.
				</li>
				<li>
					We never sell or share personal data with third parties for ads.
				</li>
				<li>Only a vetted Compliance Team has minimal, logged access.</li>
				<li>OAuth tokens are stored encrypted in HSMs—never your passwords.</li>
				<li>
					See our <a href='/privacy'>Privacy Policy</a> for full details.
				</li>
			</ul>

			{/* 8 */}
			<h2>8. Third‑Party Integrations</h2>
			<ul>
				<li>
					We request only the scopes needed to publish videos you authorize.
				</li>
				<li>Revoking OAuth access may disable certain functionality.</li>
			</ul>

			{/* 9 */}
			<h2>9. Compliance Review &amp; Content Moderation</h2>
			<p>
				To comply with laws (e.g., DMCA, DSA) we may review content solely to
				investigate alleged violations. Logs retained ≤12 months unless legally
				required.
			</p>

			{/* 10 */}
			<h2>10. Prohibited Conduct</h2>
			<ul>
				<li>Reverse‑engineering the Service.</li>
				<li>Unlawful, hateful, or violent content.</li>
				<li>Malware, phishing, or spam.</li>
				<li>Export‑control violations.</li>
				<li>Abusing rate limits or degrading service stability.</li>
			</ul>

			{/* 11 */}
			<h2>11. Term &amp; Termination</h2>
			<p>
				We may suspend or terminate accounts for breach. Certain clauses survive
				termination.
			</p>

			{/* 12 */}
			<h2>12. Disclaimers</h2>
			<p>
				Service provided <strong>“as is.”</strong> No guarantees on model
				accuracy or uptime.
			</p>

			{/* 13 */}
			<h2>13. Limitation of Liability</h2>
			<p>
				Liability capped at fees paid in the past 12 months; no indirect or
				consequential damages.
			</p>

			{/* 14 */}
			<h2>14. Indemnification</h2>
			<p>
				You will indemnify AiVideomatic against claims arising from your content
				or breach of these Terms.
			</p>

			{/* 15 */}
			<h2>15. Changes to Terms</h2>
			<p>
				We may update Terms with 14‑day notice. Continued use constitutes
				acceptance.
			</p>

			{/* 16 */}
			<h2>16. Governing Law &amp; Jurisdiction</h2>
			<p>
				Laws of Delaware, USA. Exclusive jurisdiction in Wilmington, Delaware
				courts.
			</p>

			{/* 17 */}
			<h2>17. Contact</h2>
			<p>
				Email <a href='mailto:legal@aivideomatic.com'>legal@aivideomatic.com</a>{" "}
				or write to: AiVideomatic LLC, PO Box 322 Crestline, CA 92325, USA.
			</p>
		</Wrapper>
	);
}
