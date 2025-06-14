/* app/pricing/page.js ------------------------------------------------------ */

import Pricing from "@/components/Pricing";
import Comparison from "@/components/Comparison";

export const metadata = {
	title: "Pricing",
	description:
		"Choose the plan that fits your AI video automation needs: Free, Pro, or Premium.",
	keywords:
		"AI video pricing, aivideomatic pricing, automatic video production cost",
};

export default function PricingPage() {
	return (
		<>
			<Pricing />
			<Comparison />
		</>
	);
}
