/* ──────────────────────────────────────────────────────────────
   File: app/privacy/page.js   (SERVER COMPONENT)
   Exports metadata and renders the Privacy Policy UI
   ──────────────────────────────────────────────────────────── */
import PrivacyContent from "./PrivacyContent";

export const metadata = {
	title: "Privacy Policy",
	description:
		"Learn how AiVideomatic collects, uses, stores, and protects your information, including Google OAuth data and YouTube channel data.",
	keywords:
		"AiVideomatic privacy, GDPR, CCPA, Google API Services, Limited Use, YouTube API, data protection",
	alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
	return <PrivacyContent />;
}
