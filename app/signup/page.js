// File: app/signup/page.js
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
	const { signup } = useAuth();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values) => {
		setLoading(true);
		try {
			const { name, email, password, platforms, acceptedTermsAndConditions } =
				values;

			await signup(
				name,
				email,
				password,
				platforms,
				acceptedTermsAndConditions // NEW ARG
			);
			// signup() handles redirect on success
		} catch (err) {
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
					Sign Up
				</Title>

				<Form
					layout='vertical'
					onFinish={onFinish}
					initialValues={{ platforms: [], acceptedTermsAndConditions: false }}
				>
					{/* Name */}
					<Form.Item
						label='Name'
						name='name'
						rules={[{ required: true, message: "Please enter your name." }]}
					>
						<Input placeholder='Your name' />
					</Form.Item>

					{/* Email */}
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

					{/* Password */}
					<Form.Item
						label='Password'
						name='password'
						rules={[{ required: true, message: "Please enter a password." }]}
					>
						<Input.Password placeholder='••••••••' />
					</Form.Item>

					{/* Platforms */}
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

					{/* Terms & Conditions */}
					<Form.Item
						name='acceptedTermsAndConditions'
						valuePropName='checked'
						rules={[
							{
								validator: (_, checked) =>
									checked
										? Promise.resolve()
										: Promise.reject(
												new Error(
													"You must accept the Terms & Conditions to continue."
												)
											),
							},
						]}
					>
						<Checkbox>
							I have read and accept the&nbsp;
							<Link href='/terms' target='_blank'>
								Terms&nbsp;&amp;&nbsp;Conditions
							</Link>{" "}
							and&nbsp;
							<Link href='/privacy' target='_blank'>
								Privacy Policy
							</Link>
							.
						</Checkbox>
					</Form.Item>

					{/* Submit */}
					<Form.Item>
						<Button type='primary' htmlType='submit' loading={loading} block>
							Sign Up
						</Button>
					</Form.Item>

					<Form.Item style={{ marginBottom: 0 }}>
						<Link href='/login'>Already have an account? Login</Link>
					</Form.Item>
				</Form>
			</SignupContainer>
		</>
	);
}
