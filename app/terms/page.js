/* ───────────────────────────────────────────────────────────── */
/*  File: app/terms/page.js                                     */
/*  Server component – exports metadata & renders UI            */
/* ───────────────────────────────────────────────────────────── */
import TermsContent from "./TermsContent";

export const metadata = {
	title: "Terms & Conditions",
	description:
		"Read the full Terms and Conditions for using AiVideomatic, including security, privacy, subscription, and liability information.",
	keywords:
		"AiVideomatic terms, SaaS terms, video automation terms, user agreement",
};

export default function TermsPage() {
	return <TermsContent />;
}
