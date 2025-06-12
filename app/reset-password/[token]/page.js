/* app/reset-password/[token]/page.js */
"use client";

import React, { useState } from "react";
import SeoHead from "@/components/SeoHead";
import styled from "styled-components";
import { Form, Input, Button, Typography, message } from "antd";
import { useParams, useRouter } from "next/navigation"; // ⬅️ useParams
import axios from "@/utils/api";

const { Title, Paragraph } = Typography;

const ResetContainer = styled.section`
	max-width: 400px;
	margin: 4rem auto;
	background: ${({ theme }) => theme.colors.cardBg};
	padding: 2rem;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export default function ResetTokenPage() {
	const [loading, setLoading] = useState(false);
	const { token } = useParams(); // ⬅️ dynamic route param
	const router = useRouter();

	const onFinish = async (values) => {
		setLoading(true);
		try {
			await axios.put(`/auth/reset-password/${token}`, {
				password: values.password,
			});
			message.success("Password reset successful! Redirecting to login...");
			setTimeout(() => router.push("/login"), 1500);
		} catch (err) {
			message.error(err?.response?.data?.error || "Reset failed");
		}
		setLoading(false);
	};

	return (
		<>
			<SeoHead
				title='AgentAI | Set New Password'
				description='Set a new password for your AgentAI account.'
				keywords='AgentAI reset password token'
			/>
			<ResetContainer>
				<Title level={2} style={{ textAlign: "center", marginBottom: "1rem" }}>
					Set New Password
				</Title>
				<Paragraph>
					Your token is valid for 1 hour. Enter a new password below.
				</Paragraph>
				<Form layout='vertical' onFinish={onFinish}>
					<Form.Item
						label='New Password'
						name='password'
						rules={[
							{ required: true, message: "Please enter a new password." },
							{ min: 6, message: "Password must be at least 6 characters." },
						]}
					>
						<Input.Password placeholder='••••••••' />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' loading={loading} block>
							Reset Password
						</Button>
					</Form.Item>
				</Form>
			</ResetContainer>
		</>
	);
}
