// File: app/pricing/page.js
"use client";
import React from "react";
import SeoHead from "@/components/SeoHead";
import Pricing from "@/components/Pricing";
import Comparison from "@/components/Comparison";

export default function PricingPage() {
	return (
		<>
			<SeoHead
				title='AiVideomatic | Pricing'
				description='Choose the plan that fits your AI video automation needs: Free, Pro, or Premium.'
				keywords='AI video pricing, aivideomatic pricing, automatic video production cost'
			/>
			<Pricing />
			<Comparison />
		</>
	);
}
