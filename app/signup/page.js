// app/signup/page.js
"use client";

import React, { useState } from "react";
import SeoHead from "@/components/SeoHead";
import styled from "styled-components";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const { Title } = Typography;

const SignupContainer = styled.section`
	max-width: 500px;
	margin: 4rem auto;
	background: ${({ theme }) => theme.colors.cardBg};
	padding: 2rem;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export default function SignupPage() {
	// Now simply useAuth().signup(...) which handles both storing token and redirect
	const { signup } = useAuth();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values) => {
		setLoading(true);
		try {
			const { name, email, password, platforms } = values;
			// This calls our updated signup in AuthProvider:
			await signup(name, email, password, platforms);
			// On success, signup(...) does the redirect. No need to setLoading(false) here.
		} catch (err) {
			// If backend returned a JSON error, err.response.data.error will be available.
			message.error(
				err?.response?.data?.error || err.message || "Signup failed"
			);
			setLoading(false);
		}
	};

	return (
		<>
			<SeoHead
				title='AgentAI | Signup'
				description='Create your AgentAI account to begin scheduling AI posts.'
				keywords='AgentAI signup, AI social media signup'
			/>
			<SignupContainer>
				<Title level={2} style={{ textAlign: "center", marginBottom: "1rem" }}>
					Sign Up
				</Title>
				<Form layout='vertical' onFinish={onFinish}>
					<Form.Item
						label='Name'
						name='name'
						rules={[{ required: true, message: "Please enter your name." }]}
					>
						<Input placeholder='Your name' />
					</Form.Item>

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

					<Form.Item
						label='Password'
						name='password'
						rules={[{ required: true, message: "Please enter a password." }]}
					>
						<Input.Password placeholder='••••••••' />
					</Form.Item>

					<Form.Item
						name='platforms'
						label='Platform(s) you want to post to:'
						rules={[
							{ required: true, message: "Select at least one platform." },
						]}
					>
						<Checkbox.Group>
							<Checkbox value='youtube' style={{ lineHeight: "2" }}>
								YouTube
							</Checkbox>
							<Checkbox value='facebook' style={{ lineHeight: "2" }}>
								Facebook
							</Checkbox>
							<Checkbox value='instagram' style={{ lineHeight: "2" }}>
								Instagram
							</Checkbox>
						</Checkbox.Group>
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit' loading={loading} block>
							Sign Up
						</Button>
					</Form.Item>

					<Form.Item>
						<Link href='/login'>Already have an account? Login</Link>
					</Form.Item>
				</Form>
			</SignupContainer>
		</>
	);
}
