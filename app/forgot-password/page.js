// app/forgot-password/page.js
"use client";

import React from "react";
import SeoHead from "@/components/SeoHead";
import styled from "styled-components";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "@/utils/api";

const { Title, Paragraph } = Typography;

const ResetInitiateContainer = styled.section`
	max-width: 400px;
	margin: 4rem auto;
	background: ${({ theme }) => theme.colors.cardBg};
	padding: 2rem;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export default function ForgotPasswordPage() {
	const onFinish = async (values) => {
		try {
			await axios.post("/auth/forgot-password", { email: values.email });
			message.success("Password reset email sent. Check your inbox.");
		} catch (err) {
			message.error(err?.response?.data?.error || "Error sending reset link");
		}
	};

	return (
		<>
			<SeoHead
				title='AgentAI | Reset Password'
				description='Request a password reset link for your AgentAI account.'
				keywords='AgentAI reset password'
			/>
			<ResetInitiateContainer>
				<Title level={2} style={{ textAlign: "center", marginBottom: "1rem" }}>
					Forgot Password
				</Title>
				<Paragraph>
					Enter your email address below and we'll send you a link to reset your
					password.
				</Paragraph>
				<Form layout='vertical' onFinish={onFinish}>
					<Form.Item
						label='Email'
						name='email'
						rules={[
							{ required: true, message: "Please enter your email." },
							{ type: "email", message: "Enter a valid email." },
						]}
					>
						<Input placeholder='you@example.com' />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' block>
							Send Reset Link
						</Button>
					</Form.Item>
				</Form>
			</ResetInitiateContainer>
		</>
	);
}
