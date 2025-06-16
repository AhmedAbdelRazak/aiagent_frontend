/* ──────────────────────────────────────────────────────────────
   File: app/terms/page.js   (SERVER COMPONENT)
   Exports metadata and renders the Terms & Conditions UI
   ──────────────────────────────────────────────────────────── */
import TermsContent from "./TermsContent";

export const metadata = {
	title: "Terms & Conditions",
	description:
		"Read the full Terms and Conditions for using AiVideomatic, including security, subscription, liability, and Google API compliance information.",
	keywords:
		"AiVideomatic terms, SaaS terms, video automation terms, user agreement",
	alternates: { canonical: "/terms" },
};

export default function TermsPage() {
	return <TermsContent />;
}
