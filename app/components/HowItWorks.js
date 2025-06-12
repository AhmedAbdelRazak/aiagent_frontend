// app/components/HowItWorks.js
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import ProcessImage from "../images/FullCycleProcessImage.png";

const Section = styled.section`
	padding: clamp(3rem, 6vw, 8rem) 1rem;
	background: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
	align-items: center;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		text-align: center;
	}
`;

const TextContent = styled.div`
	h2 {
		font-size: ${({ theme }) => theme.fontSizes["2xl"]};
		margin-bottom: 1rem;
	}
	p {
		font-size: ${({ theme }) => theme.fontSizes.md};
		color: ${({ theme }) => theme.colors.text};
		line-height: 1.6;
	}
`;

const ImageWrapper = styled.div`
	text-align: right;

	@media (max-width: 768px) {
		text-align: center;
		margin-top: 2rem;
	}
`;

export default function HowItWorks() {
	return (
		<Section>
			<Container>
				<Grid>
					<TextContent>
						<h2>How It Works</h2>
						<p>
							AiVideomatic takes your topic and turns it into a fully-produced,
							cinematic video—complete with SEO-optimized script, studio-quality
							voiceover, background music, and automatic scheduling to all your
							channels. Simply set your dates & frequency, and let our AI
							pipeline handle the rest.
						</p>
					</TextContent>
					<ImageWrapper>
						<Image
							src={ProcessImage}
							alt='AI video creation process'
							width={500}
							height={400}
							style={{ maxWidth: "100%", height: "auto" }}
						/>
					</ImageWrapper>
				</Grid>
			</Container>
		</Section>
	);
}
