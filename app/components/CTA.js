// app/components/CTA.js
"use client";
import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import Link from "next/link";
// ← relative import from components → images folder
import CtaBanner from "../images/ScheduleYouVideo.png";

const Section = styled.section`
	position: relative;
	/* use the .src property of the imported image object */
	background-image: url(${CtaBanner.src});
	background-position: center;
	background-size: cover;
	/* NO overflow: hidden here */
	padding: clamp(4rem, 10vw, 8rem) 1rem;
	text-align: center;
	color: #fff;
	height: 700px;
`;

const Overlay = styled.div`
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.45);
`;

const Container = styled.div`
	position: relative;
	z-index: 1;
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
`;

const Title = styled.h2`
	font-size: ${({ theme }) => theme.fontSizes["2xl"]};
	margin-bottom: 1rem;
`;

const Subtitle = styled.p`
	font-size: ${({ theme }) => theme.fontSizes.md};
	margin-bottom: 2rem;
	color: ${({ theme }) => theme.colors.cardBg};
`;

const StyledButton = styled(Button)`
	&& {
		font-weight: 600;
		padding: 0 2.5rem;
		height: auto;
	}
`;

export default function CTA() {
	return (
		<Section>
			<Overlay />
			<Container>
				<Title>Ready to Revolutionize Your Video Content?</Title>
				<Subtitle>
					Start your free trial today and see the difference AiVideomatic makes.
				</Subtitle>
				<Link href='/signup' passHref>
					<StyledButton type='primary' size='large'>
						Get Started Now
					</StyledButton>
				</Link>
			</Container>
		</Section>
	);
}
