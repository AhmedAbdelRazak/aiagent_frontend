// File: app/page.js (Home)
"use client";
import React from "react";
import SeoHead from "@/components/SeoHead";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";

export default function HomePage() {
	return (
		<div>
			<SeoHead
				title='AiVideomatic | End To End AI Video Creation'
				description='Automate your AI video production: script, cinematic video, voiceover, music & scheduled publishing—all in one flow.'
				keywords='AI video, automatic workflow, RunwayML, ElevenLabs, social media scheduling'
			/>
			<Hero />
			<Features />
			<HowItWorks />
			<CTA />
		</div>
	);
}
