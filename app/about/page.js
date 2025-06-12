// File: app/about/page.js
"use client";

import React from "react";
import styled from "styled-components";
import SeoHead from "@/components/SeoHead";
import SiteContainer from "@/components/SiteContainer";
import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";
import AboutBanner from "@/images/HeroBanner.png";

const Banner = styled.section`
	position: relative;
	width: 100%;
	height: clamp(420px, 70vh, 580px);
`;

const Content = styled.section`
	background: ${({ theme }) => theme.colors.background};
	color: ${({ theme }) => theme.colors.text};
	padding: clamp(2rem, 5vw, 4rem) 1rem;
`;

const Section = styled.div`
	margin-bottom: 2.5rem;

	h2 {
		font-size: ${({ theme }) => theme.fontSizes["2xl"]};
		color: ${({ theme }) => theme.colors.primary};
		margin-bottom: 1rem;
	}
	p {
		line-height: 1.7;
		margin-bottom: 1rem;
	}
`;

const CTAButton = styled(Button)`
	&& {
		font-weight: 600;
		padding: 0 2rem;
	}
`;

export default function AboutPage() {
	return (
		<>
			<SeoHead
				title='AiVideomatic | About Us'
				description='Learn the mission and team behind AiVideomatic’s end-to-end AI video automation platform.'
				keywords='about AiVideomatic, mission, team'
			/>

			<Banner>
				<Image
					src={AboutBanner}
					alt='AiVideomatic banner'
					fill
					style={{ objectFit: "cover" }}
					priority
				/>
			</Banner>

			<Content>
				<SiteContainer>
					<Section>
						<h2>Our Story</h2>
						<p>
							AiVideomatic was founded in <strong>2024</strong> by a team
							frustrated with scattered editing tools and manual publishing. We
							set out to build a single, seamless workflow that handles
							everything from script to upload—so creators can focus on
							storytelling, not spreadsheets.
						</p>
					</Section>

					<Section>
						<h2>Mission</h2>
						<p>
							Our mission is simple:{" "}
							<em>let people tell stories while the robots do the busy work</em>
							. By combining OpenAI scripting, Runway’s Gen-4 Turbo for
							cinematic video, and ElevenLabs TTS for voiceover, we automate the
							full pipeline.
						</p>
					</Section>

					<Section>
						<h2>How It Works</h2>
						<p>
							1) You pick a topic, set your dates & frequency. 2) Our AI crafts
							an SEO-optimized script. 3) Runway generates a cinematic video up
							to 60s (soon 120s). 4) ElevenLabs adds a natural voiceover &
							music. 5) We automatically upload to YouTube—and soon Facebook,
							Instagram, TikTok and beyond—on your schedule.
						</p>
					</Section>

					<Section>
						<h2>Meet the Team</h2>
						<p>
							We’re a fully remote crew spread across 🇺🇸, 🇬🇧, 🇵🇱 and 🇵🇭. Our
							backers include people who supported Figma and Descript—so we know
							a bit about building tools people love.
						</p>
					</Section>

					<Section>
						<h2>Looking Ahead</h2>
						<p>
							Over the next year we’ll be adding multi-platform support
							(Facebook, Instagram, TikTok), deeper analytics dashboards, and
							customizable branding templates—so your videos look uniquely yours
							every time.
						</p>
					</Section>

					<Section style={{ textAlign: "center" }}>
						<Link href='/signup' passHref>
							<CTAButton type='primary' size='large'>
								Start Your Free Trial
							</CTAButton>
						</Link>
					</Section>
				</SiteContainer>
			</Content>
		</>
	);
}
