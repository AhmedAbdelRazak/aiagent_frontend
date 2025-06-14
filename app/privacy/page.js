/* ───────────────────────────────────────────────────────────── */
/*  File: app/privacy/page.js                                   */
/*  Server component – only exports metadata & imports UI       */
/* ───────────────────────────────────────────────────────────── */
import PrivacyContent from "@/components/PrivacyContent";

export const metadata = {
	title: "Privacy Policy",
	description:
		"Learn how AiVideomatic collects, uses, stores, and protects your personal information—including end‑to‑end encryption for social‑platform OAuth tokens and strict compliance access.",
	keywords:
		"AiVideomatic privacy, GDPR, CCPA, data protection, cookie policy, end‑to‑end encryption",
};

export default function PrivacyPage() {
	return <PrivacyContent />;
}
