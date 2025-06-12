// File: app/components/Features.js
import React from "react";
import styled from "styled-components";
import {
	AiOutlineSchedule,
	AiOutlineBulb,
	AiOutlineSound,
	AiOutlineUpload,
} from "react-icons/ai";

const Section = styled.section`
	background: ${({ theme }) => theme.colors.background};
	padding: clamp(3rem, 5vw, 6rem) 1rem;
`;
const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
`;
const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 2rem;
`;
const Card = styled.div`
	background: ${({ theme }) => theme.colors.cardBg};
	padding: 2rem;
	border-radius: 1rem;
	text-align: center;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
	transition:
		transform 0.3s,
		box-shadow 0.3s;
	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
	}
`;
const IconWrapper = styled.div`
	font-size: 2.5rem;
	color: ${({ theme }) => theme.colors.primary};
	margin-bottom: 1rem;
`;
const Title = styled.h3`
	font-size: ${({ theme }) => theme.fontSizes["xl"]};
	margin-bottom: 0.75rem;
`;
const Desc = styled.p`
	font-size: ${({ theme }) => theme.fontSizes.md};
	color: ${({ theme }) => theme.colors.mutedText};
	line-height: 1.5;
`;

const features = [
	{
		icon: <AiOutlineBulb />,
		title: "Smart Scripts",
		desc: "AI-generated SEO-optimized video scripts.",
	},
	{
		icon: <AiOutlineSound />,
		title: "Natural Voiceover",
		desc: "ElevenLabs TTS for studio-quality audio.",
	},
	{
		icon: <AiOutlineSchedule />,
		title: "Auto Scheduling",
		desc: "Set your publish cadence: daily, weekly, monthly.",
	},
	{
		icon: <AiOutlineUpload />,
		title: "Multi-Platform",
		desc: "One-click upload to YouTube. SOON Facebook & Instagram.",
	},
];

export default function Features() {
	return (
		<Section>
			<Container>
				<Grid>
					{features.map((f, i) => (
						<Card key={i}>
							<IconWrapper>{f.icon}</IconWrapper>
							<Title>{f.title}</Title>
							<Desc>{f.desc}</Desc>
						</Card>
					))}
				</Grid>
			</Container>
		</Section>
	);
}
