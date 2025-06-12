/* app/admin/layout.js */
"use client";

import styled from "styled-components";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSideMenu from "@/components/AdminSideMenu";

const Wrapper = styled.div`
	display: flex;
`;
const Content = styled.main`
	flex: 1;
	padding: 2rem 2.5rem;
	max-width: 1400px;
`;

export default function AdminLayout({ children }) {
	return (
		<ProtectedRoute adminOnly={true}>
			<Wrapper>
				<AdminSideMenu />
				<Content>{children}</Content>
			</Wrapper>
		</ProtectedRoute>
	);
}
