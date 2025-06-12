/* app/components/UserSideMenu.js */
"use client";

import Link from "next/link";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import {
	FaTachometerAlt,
	FaPlusCircle,
	FaVideo,
	FaUsers,
	FaKey,
} from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";

/* ───────────────────────────────────────────────────────────── */
/*  Styled‑components                                           */
/* ───────────────────────────────────────────────────────────── */
const Drawer = styled.aside`
	width: 240px;
	min-height: 100vh;
	background: ${({ theme }) => theme.colors.background};
	border-right: 1px solid ${({ theme }) => theme.colors.border};
	padding: 1rem 0;
	position: sticky;
	top: 0;
`;

const Menu = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`;

const Item = styled.li`
	a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		color: ${({ theme, $active }) =>
			$active ? theme.colors.primary : theme.colors.text};
		font-weight: 500;
		text-decoration: none;
		transition: background 0.15s;

		&:hover {
			background: ${({ theme }) => theme.colors.backgroundHover};
		}
	}
`;

const IconBox = styled.span`
	display: flex;
	align-items: center;
	font-size: 1rem;
`;

/* ───────────────────────────────────────────────────────────── */
/*  Component                                                   */
/* ───────────────────────────────────────────────────────────── */
export default function AdminSideMenu() {
	const pathname = usePathname();

	/** Helper: pathname starts with link (handles nested routes) */
	const isActive = (href) =>
		pathname === href || pathname.startsWith(`${href}/`);

	const links = [
		{
			href: "/dashboard/overview",
			label: "Overview",
			icon: <FaTachometerAlt />,
		},
		{
			href: "/dashboard/new-video",
			label: "New Video",
			icon: <FaPlusCircle />,
		},
		{ href: "/dashboard/all-videos", label: "All Videos", icon: <FaVideo /> },
		{
			href: "/dashboard/subscriptions",
			label: "Subscriptions",
			icon: <MdSubscriptions />,
		},
		{
			href: "/dashboard/update-password",
			label: "Update Profile",
			icon: <FaKey />,
		},
	];

	return (
		<Drawer>
			<Menu>
				{links.map(({ href, label, icon }) => (
					<Item key={href} $active={isActive(href)}>
						<Link
							href={href}
							aria-current={isActive(href) ? "page" : undefined}
						>
							<IconBox>{icon}</IconBox>
							{label}
						</Link>
					</Item>
				))}
			</Menu>
		</Drawer>
	);
}
