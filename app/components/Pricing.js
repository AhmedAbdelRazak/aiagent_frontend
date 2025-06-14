"use client";

import React from "react";
import styled, { css } from "styled-components";
import { Card, Button } from "antd";
import Link from "next/link";
import { AiOutlineCheck } from "react-icons/ai";
import SiteContainer from "./SiteContainer";
import { plans } from "@/utils/plans";

const Section = styled.section`
	padding: 4rem 0;
	background: ${({ theme }) => theme.colors.background};
`;
const Title = styled.h2`
	text-align: center;
	color: ${({ theme }) => theme.colors.primary};
	font-size: ${({ theme }) => theme.fontSizes["2xl"]};
	margin-bottom: 3rem;
`;
const Cards = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 2rem;
`;
const StyledCard = styled(Card)`
	border-radius: 10px;
	${({ $highlight, theme }) =>
		$highlight &&
		css`
			border: 2px solid ${theme.colors.primary};
		`}
`;
const Price = styled.p`
	font-size: ${({ theme }) => theme.fontSizes.xl};
	font-weight: 700;
	margin-bottom: 1.5rem;
`;
const Feature = styled.li`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin: 0.5rem 0;
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export default function Pricing() {
	return (
		<Section id='pricing'>
			<SiteContainer>
				<Title>Our Plans</Title>
				<Cards>
					{plans.map((plan) => (
						<StyledCard
							key={plan.name}
							$highlight={plan.highlighted}
							title={plan.name}
							headStyle={{
								background: plan.highlighted ? "#FF3D3D" : undefined,
								color: plan.highlighted ? "#fff" : undefined,
								textAlign: "center",
							}}
							bodyStyle={{ textAlign: "center" }}
						>
							{plan.trial && (
								<p>
									<em>{plan.trial}</em>
								</p>
							)}
							<Price>
								{plan.priceMonthly === 0 ? "$0" : `$${plan.priceMonthly}`}
								<span style={{ fontSize: ".75rem", fontWeight: 400 }}>/mo</span>
							</Price>

							<ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
								{plan.features.map((f) => (
									<Feature key={f}>
										<AiOutlineCheck color='#22C55E' /> {f}
									</Feature>
								))}
							</ul>

							<Link href={plan.cta} passHref>
								<Button
									type='primary'
									size='large'
									style={{ marginTop: "1rem" }}
								>
									{plan.ctaText}
								</Button>
							</Link>
						</StyledCard>
					))}
				</Cards>
			</SiteContainer>
		</Section>
	);
}
