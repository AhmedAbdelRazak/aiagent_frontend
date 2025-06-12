// app/components/NavMenu.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import {
	AiOutlineMenu,
	AiOutlineClose,
	AiOutlineLogout,
	AiOutlineDashboard,
	AiOutlineLogin,
	AiOutlineUserAdd,
	AiOutlineSetting,
} from "react-icons/ai";
import SiteContainer from "./SiteContainer";
import { useAuth } from "@/hooks/useAuth";
import AILogo from "@/images/AILogo.png";

// ───────────────────────── Styled Components ─────────────────────────
const Nav = styled.nav`
	position: sticky;
	top: 0;
	left: 0;
	width: 100%;
	max-width: 100%;
	box-sizing: border-box;
	background: ${({ theme }) => theme.colors.background};
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	z-index: 1000;
`;

const Container = styled(SiteContainer)`
	width: 100%;
	max-width: 100%;
	padding: 0 5rem; /* keeps toggle inset */
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 75px;
	@media (max-width: 500px) {
		padding: 0 1rem;
	}
`;

const LogoLink = styled(Link)`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	text-decoration: none;
	color: inherit;
	flex-shrink: 1;
`;

const LogoImage = styled(Image)`
	border-radius: 4px;
`;

const linkCss = css`
	font-size: ${({ theme }) => theme.fontSizes.md};
	font-weight: 500;
	color: ${({ theme, $active }) =>
		$active ? theme.colors.primary : theme.colors.text};
	text-decoration: none;
	padding: 0.25rem 0;
	border-bottom: 2px solid
		${({ theme, $active }) => ($active ? theme.colors.primary : "transparent")};
	transition:
		color 0.2s,
		border-color 0.2s;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;

	&:hover {
		color: ${({ theme }) => theme.colors.primary};
		border-bottom-color: ${({ theme }) => theme.colors.primary};
	}
`;

const DesktopMenu = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	gap: 2rem;
	align-items: center;

	@media (max-width: ${({ theme }) => theme.breakpoints.md}) {
		display: none;
	}
`;

const DesktopLink = styled(Link)`
	${linkCss}
`;

const ToggleButton = styled.button`
	background: none;
	border: none;
	display: none;
	cursor: pointer;
	color: ${({ theme }) => theme.colors.secondary};

	@media (max-width: ${({ theme }) => theme.breakpoints.md}) {
		display: block;
	}
`;

const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	opacity: ${({ open }) => (open ? 1 : 0)};
	visibility: ${({ open }) => (open ? "visible" : "hidden")};
	transition: opacity 0.3s ease;
	z-index: 90;
`;

const Drawer = styled.aside`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	width: 80%;
	max-width: 280px;
	background: ${({ theme }) => theme.colors.cardBg};
	box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
	transform: translateX(${({ open }) => (open ? "0" : "100%")});
	transition: transform 0.3s ease;
	z-index: 95;
	display: flex;
	flex-direction: column;
	padding: 1.5rem;
	box-sizing: border-box;
`;

const CloseIcon = styled.button`
	background: none;
	border: none;
	align-self: flex-end;
	cursor: pointer;
	color: ${({ theme }) => theme.colors.text};
`;

const DrawerMenu = styled.ul`
	list-style: none;
	margin: 2rem 0 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	/* clear vertical spacing */
	> li {
		margin-top: 1rem;
	}
	> li:first-child {
		margin-top: 0;
	}
`;

const DrawerLink = styled(Link)`
	${linkCss}
	display: flex;
	width: 100%;
`;

const LogoutButton = styled.button`
	all: unset;
	${linkCss}
	color: ${({ theme }) => theme.colors.danger};
	cursor: pointer;

	&:hover {
		opacity: 0.8;
	}
`;

// ───────────────────────── Component ─────────────────────────
export default function NavMenu() {
	const [open, setOpen] = useState(false);
	const { user, logout } = useAuth();
	const pathname = usePathname();

	// auto-close drawer on route change
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	const commonLinks = [
		{ label: "Home", href: "/" },
		{ label: "Pricing", href: "/pricing" },
		{ label: "About", href: "/about" },
	];

	const authLinks = user
		? [
				{
					label: "Dashboard",
					href: "/dashboard",
					icon: <AiOutlineDashboard size={18} />,
				},
				...(user.role === "admin"
					? [
							{
								label: "Admin",
								href: "/admin",
								icon: <AiOutlineSetting size={18} />,
							},
						]
					: []),
			]
		: [
				{
					label: "Login",
					href: "/login",
					icon: <AiOutlineLogin size={18} />,
				},
				{
					label: "Signup",
					href: "/signup",
					icon: <AiOutlineUserAdd size={18} />,
				},
			];

	return (
		<Nav>
			<Container>
				<LogoLink href='/'>
					<LogoImage src={AILogo} alt='aivideomatic' width={100} height={100} />
				</LogoLink>

				<DesktopMenu>
					{commonLinks.map((item) => (
						<li key={item.href}>
							<DesktopLink href={item.href} $active={pathname === item.href}>
								{item.label}
							</DesktopLink>
						</li>
					))}
					{authLinks.map((item) => (
						<li key={item.href}>
							<DesktopLink href={item.href} $active={pathname === item.href}>
								{item.icon}
								{item.label}
							</DesktopLink>
						</li>
					))}
					{user && (
						<li>
							<LogoutButton onClick={logout}>
								<AiOutlineLogout size={18} /> Logout
							</LogoutButton>
						</li>
					)}
				</DesktopMenu>

				<ToggleButton
					aria-label={open ? "Close menu" : "Open menu"}
					onClick={() => setOpen((o) => !o)}
				>
					{open ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
				</ToggleButton>
			</Container>

			<Backdrop open={open} onClick={() => setOpen(false)} />

			<Drawer open={open}>
				<CloseIcon aria-label='Close menu' onClick={() => setOpen(false)}>
					<AiOutlineClose size={24} />
				</CloseIcon>

				<DrawerMenu>
					{commonLinks.map((item) => (
						<li key={item.href}>
							<DrawerLink href={item.href} $active={pathname === item.href}>
								{item.label}
							</DrawerLink>
						</li>
					))}
					{authLinks.map((item) => (
						<li key={item.href}>
							<DrawerLink href={item.href} $active={pathname === item.href}>
								{item.icon}
								{item.label}
							</DrawerLink>
						</li>
					))}
					{user && (
						<li>
							<LogoutButton
								onClick={() => {
									logout();
									setOpen(false);
								}}
							>
								<AiOutlineLogout size={18} /> Logout
							</LogoutButton>
						</li>
					)}
				</DrawerMenu>
			</Drawer>
		</Nav>
	);
}
