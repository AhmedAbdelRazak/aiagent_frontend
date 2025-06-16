// File: app/page.js
"use client";

import React from "react";
import SeoHead from "@/components/SeoHead";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import DataAccess from "@/components/DataAccess"; // ← NEW
import CTA from "@/components/CTA";

export default function HomePage() {
	return (
		<>
			<SeoHead
				title='AiVideomatic | End‑to‑End AI Video Creation'
				description='Automate your AI video production: script, cinematic video, voiceover, music & scheduled publishing—all in one flow.'
				keywords='AI video, automatic workflow, RunwayML, ElevenLabs, social media scheduling'
			/>
			<Hero />
			<Features />
			<HowItWorks />
			<DataAccess /> {/* satisfies Google’s ‘explain data use’ rule */}
			<CTA />
		</>
	);
}
