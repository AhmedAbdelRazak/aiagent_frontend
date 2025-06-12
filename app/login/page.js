// app/login/page.js
"use client";

import React, { useState } from "react";
import SeoHead from "@/components/SeoHead";
import styled from "styled-components";
import { Form, Input, Button, Typography, message } from "antd";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const { Title } = Typography;

const LoginContainer = styled.section`
	max-width: 400px;
	margin: 4rem auto;
	background: ${({ theme }) => theme.colors.cardBg};
	padding: 2rem;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export default function LoginPage() {
	const { login } = useAuth();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values) => {
		setLoading(true);
		try {
			await login(values.email, values.password);
			message.success("Logged in successfully!");
		} catch (err) {
			message.error(err?.response?.data?.error || "Login failed");
		}
		setLoading(false);
	};

	return (
		<>
			<SeoHead
				title='AgentAI | Login'
				description='Login to AgentAI to manage your AI‐powered social media schedules.'
				keywords='AgentAI login, AI social media login'
			/>
			<LoginContainer>
				<Title level={2} style={{ textAlign: "center", marginBottom: "1rem" }}>
					Login
				</Title>
				<Form layout='vertical' onFinish={onFinish}>
					<Form.Item
						label='Email'
						name='email'
						rules={[
							{ required: true, message: "Please enter your email." },
							{ type: "email", message: "Please enter a valid email." },
						]}
					>
						<Input placeholder='you@example.com' />
					</Form.Item>
					<Form.Item
						label='Password'
						name='password'
						rules={[{ required: true, message: "Please enter your password." }]}
					>
						<Input.Password placeholder='••••••••' />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' loading={loading} block>
							Login
						</Button>
					</Form.Item>
					<Form.Item>
						<Link href='/forgot-password'>Forgot password?</Link>
					</Form.Item>
					<Form.Item>
						<Link href='/signup'>Don’t have an account? Sign up</Link>
					</Form.Item>
				</Form>
			</LoginContainer>
		</>
	);
}
