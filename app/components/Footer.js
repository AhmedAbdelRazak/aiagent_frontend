// app/components/Footer.js
import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import {
	AiOutlineFacebook,
	AiOutlineTwitter,
	AiOutlineInstagram,
	AiOutlineLinkedin,
} from "react-icons/ai";
import AILogo from "@/images/AILogo.png";

const FooterContainer = styled.footer`
	background: ${({ theme }) => theme.colors.background};
	color: ${({ theme }) => theme.colors.text};
	padding: clamp(3rem, 5vw, 5rem) 1rem;
`;

const Inner = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 2rem;

	@media (max-width: 640px) {
		text-align: center;
	}
`;

const Col = styled.div``;

const LogoCol = styled(Col)`
	display: flex;
	flex-direction: column;

	img {
		width: 50%;
		object-fit: cover;
	}

	p {
		font-size: ${({ theme }) => theme.fontSizes.sm};
		line-height: 1.6;
		max-width: 260px;
	}

	@media (max-width: 640px) {
		align-items: center;
	}
`;

const Title = styled.h4`
	font-size: ${({ theme }) => theme.fontSizes.lg};
	color: ${({ theme }) => theme.colors.primary};
	margin-bottom: 1rem;
`;

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`;

const ListItem = styled.li`
	margin-bottom: 0.5rem;
`;

const FooterLink = styled(Link)`
	color: inherit;
	font-size: ${({ theme }) => theme.fontSizes.sm};
	text-decoration: none;
	transition: color 0.2s;

	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

const SocialList = styled.div`
	display: flex;
	gap: 1rem;

	a {
		color: ${({ theme }) => theme.colors.text};
		font-size: 1.5rem;
		transition: color 0.2s;

		&:hover {
			color: ${({ theme }) => theme.colors.primary};
		}
	}

	@media (max-width: 640px) {
		justify-content: center;
	}
`;

const Bottom = styled.div`
	margin-top: clamp(2rem, 5vw, 3rem);
	border-top: 1px solid ${({ theme }) => theme.colors.border};
	padding-top: clamp(1rem, 3vw, 2rem);
	font-size: ${({ theme }) => theme.fontSizes.xs};
	color: ${({ theme }) => theme.colors.mutedText};
	text-align: center;
`;

export default function Footer() {
	return (
		<FooterContainer>
			<Inner>
				{/* Logo & Tagline */}
				<LogoCol>
					<Link href='/' aria-label='AiVideomatic Home'>
						<Image
							src={AILogo}
							alt='AiVideomatic logo'
							width={120}
							height={150}
						/>
					</Link>
					<p>
						Automate your entire AI video creation workflow—from script to
						publish—so you can focus on storytelling.
					</p>
				</LogoCol>

				{/* Company Links */}
				<Col>
					<Title>Company</Title>
					<List>
						<ListItem>
							<FooterLink href='/'>Home</FooterLink>
						</ListItem>
						<ListItem>
							<FooterLink href='/about'>About</FooterLink>
						</ListItem>
						<ListItem>
							<FooterLink href='/pricing'>Pricing</FooterLink>
						</ListItem>
						<ListItem>
							<FooterLink href='/terms'>Terms of Service</FooterLink>
						</ListItem>
						<ListItem>
							<FooterLink href='/privacy'>Privacy Policy</FooterLink>
						</ListItem>
					</List>
				</Col>

				{/* Resources Links */}
				<Col>
					<Title>Resources</Title>
					<List>
						<ListItem>
							<FooterLink href='/blog'>Blog</FooterLink>
						</ListItem>
						<ListItem>
							<FooterLink href='/support'>Support</FooterLink>
						</ListItem>
						<ListItem>
							<FooterLink href='/contact'>Contact Us</FooterLink>
						</ListItem>
						<ListItem>
							<FooterLink href='/docs'>Documentation</FooterLink>
						</ListItem>
					</List>
				</Col>

				{/* Social Icons */}
				<Col>
					<Title>Follow Us</Title>
					<SocialList>
						<a href='https://facebook.com/yourpage' aria-label='Facebook'>
							<AiOutlineFacebook />
						</a>
						<a href='https://twitter.com/yourhandle' aria-label='Twitter'>
							<AiOutlineTwitter />
						</a>
						<a href='https://instagram.com/yourhandle' aria-label='Instagram'>
							<AiOutlineInstagram />
						</a>
						<a
							href='https://linkedin.com/company/yourcompany'
							aria-label='LinkedIn'
						>
							<AiOutlineLinkedin />
						</a>
					</SocialList>
				</Col>
			</Inner>

			<Bottom>
				© {new Date().getFullYear()} AiVideomatic. All rights reserved.
			</Bottom>
		</FooterContainer>
	);
}
