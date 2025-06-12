// app/components/Hero.js
"use client";

import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";
// relative path from app/components to app/images
import HeroBanner from "../images/HeroBanner.png";

const Section = styled.section`
	position: relative;
	width: 100%;
	overflow: hidden; /* no scrollbars */
	display: flex;
	align-items: center;
	justify-content: center;
	padding: clamp(4rem, 10vw, 8rem) 0;
	min-height: 480px;

	@media (max-width: 600px) {
		min-height: 200px;
		padding: clamp(1rem, 4vw, 2rem) 0;
	}
`;

const BgImage = styled(Image)`
	object-fit: cover;
	object-position: center;
	z-index: 0;
`;

const Overlay = styled.div`
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.3);
	z-index: 1;
`;

const Content = styled.div`
	position: relative;
	z-index: 2;
	max-width: 720px;
	width: 100%;
	text-align: center;
	padding: 0 ${({ theme }) => theme.containerPad};
	background: rgba(0, 0, 0, 0.2);
	padding: 5px;
`;

const Title = styled.h1`
	font-size: ${({ theme }) => theme.fontSizes["3xl"]};
	margin-bottom: 0.5rem;
	color: #fff;
	background: rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
	font-size: ${({ theme }) => theme.fontSizes.lg};
	margin-bottom: 2rem;
	color: ${({ theme }) => theme.colors.cardBg};
`;

const PrimaryButton = styled(Button).attrs({ size: "large" })`
	&& {
		background-color: ${({ theme }) => theme.colors.primary};
		border-color: ${({ theme }) => theme.colors.primary};
		color: #fff;
		font-weight: 500;
		&:hover,
		&:focus {
			filter: brightness(0.9);
		}
	}
`;

const SecondaryButton = styled(Button).attrs({
	size: "large",
	type: "default",
})`
	&& {
		background: transparent;
		border: 2px solid ${({ theme }) => theme.colors.secondary};
		color: ${({ theme }) => theme.colors.secondary};
		font-weight: 500;
		&:hover,
		&:focus {
			background: ${({ theme }) => theme.colors.secondary};
			color: #fff;
		}
	}
`;

const ButtonGroup = styled.div`
	display: inline-flex;
	gap: 1rem;
`;

export default function Hero() {
	return (
		<Section>
			<BgImage
				src={HeroBanner}
				alt='AI video workflow background'
				fill
				priority
			/>
			<Overlay />
			<Content>
				<Title>Automate Your AI Video Workflow</Title>
				<Subtitle>
					From prompt to published video — cinematic, SEO-optimized, scheduled.
				</Subtitle>
				<ButtonGroup>
					<Link href='/signup' passHref>
						<PrimaryButton>Get Started</PrimaryButton>
					</Link>
					<Link href='/pricing' passHref>
						<SecondaryButton>View Pricing</SecondaryButton>
					</Link>
				</ButtonGroup>
			</Content>
		</Section>
	);
}
