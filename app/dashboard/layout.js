/* app/admin/layout.js */
"use client";

import styled from "styled-components";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserSideMenu from "@/components/UserSideMenu";

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
		<ProtectedRoute>
			<Wrapper>
				<UserSideMenu />
				<Content>{children}</Content>
			</Wrapper>
		</ProtectedRoute>
	);
}
