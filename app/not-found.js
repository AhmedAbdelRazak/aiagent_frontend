// app/not-found.js
"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
	min-height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Title = styled.h1`
	font-size: ${({ theme }) => theme.fontSizes["2xl"]};
	color: ${({ theme }) => theme.colors.danger};
	margin-bottom: 1rem;
`;

export default function NotFoundPage() {
	return (
		<Container>
			<Title>404 - Page Not Found</Title>
			<Link href='/'>Go back home</Link>
		</Container>
	);
}
