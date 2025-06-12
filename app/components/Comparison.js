import React from "react";
import styled from "styled-components";
import {
	AiOutlineVideoCamera,
	AiOutlineClockCircle,
	AiOutlineDollar,
} from "react-icons/ai";

const Section = styled.section`
	padding: 4rem 2rem;
	background: ${({ theme }) => theme.colors.cardBg};
`;
const Title = styled.h2`
	text-align: center;
	color: ${({ theme }) => theme.colors.primary};
	font-size: ${({ theme }) => theme.fontSizes["2xl"]};
	margin-bottom: 2rem;
`;
const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
`;
const Th = styled.th`
	border-bottom: 2px solid ${({ theme }) => theme.colors.border};
	padding: 1rem;
	text-align: left;
	font-weight: bold;
`;
const Td = styled.td`
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
	padding: 1rem;
	vertical-align: top;
`;
const IconCell = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const data = [
	{
		name: "AiVideomatic",
		duration: "60s (soon 120s)",
		quality: "Cinematic (Runway Gen-4 Turbo)",
		automation: "Full pipeline & scheduling",
		price: "$0.08–$0.10/sec",
	},
	{
		name: "Google Veo",
		duration: "8s per clip",
		quality: "Hyper-realistic",
		automation: "Generation only",
		price: "$0.35/sec",
	},
	{
		name: "Runway Gen-4",
		duration: "10s per clip",
		quality: "High-fidelity",
		automation: "Video only",
		price: "$0.05/sec",
	},
	{
		name: "HeyGen Pro",
		duration: "Unlimited (avatar videos)",
		quality: "Avatar presenters",
		automation: "No scheduling",
		price: "$0.0033/sec",
	},
	{
		name: "Elai.io",
		duration: "Unlimited (avatar videos)",
		quality: "Presenter style",
		automation: "Manual upload",
		price: "$0.0098/sec",
	},
];

export default function Comparison() {
	return (
		<Section>
			<Title>Platform Comparison</Title>
			<Table>
				<thead>
					<tr>
						<Th>Platform</Th>
						<Th>
							<IconCell>
								<AiOutlineClockCircle /> Max Duration
							</IconCell>
						</Th>
						<Th>
							<IconCell>
								<AiOutlineVideoCamera /> Quality
							</IconCell>
						</Th>
						<Th>Automation</Th>
						<Th>
							<IconCell>
								<AiOutlineDollar /> Cost
							</IconCell>
						</Th>
					</tr>
				</thead>
				<tbody>
					{data.map((row, i) => (
						<tr key={i}>
							<Td>{row.name}</Td>
							<Td>{row.duration}</Td>
							<Td>{row.quality}</Td>
							<Td>{row.automation}</Td>
							<Td>{row.price}</Td>
						</tr>
					))}
				</tbody>
			</Table>
		</Section>
	);
}
