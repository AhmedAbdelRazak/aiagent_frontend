// app/components/ChatWidget.js
"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Drawer, Button, Input } from "antd";
import { AiOutlineComment } from "react-icons/ai";
import useWebSocket from "@/hooks/useWebSocket";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.75; }
  100% { transform: scale(1); opacity: 1; }
`;

const ChatButton = styled(Button)`
	position: fixed !important;
	bottom: 2rem;
	right: 2rem;
	background-color: ${({ theme }) => theme.colors.primary} !important;
	color: #ffffff !important;
	border-radius: 50% !important;
	width: 60px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	animation: ${pulse} 2s infinite;
	z-index: 2000;
`;

const ChatDrawerContent = styled.div`
	padding: 1rem;
	display: flex;
	flex-direction: column;
	height: 100%;
`;

const MessagesContainer = styled.div`
	flex: 1;
	overflow-y: auto;
	margin-bottom: 1rem;
	display: flex;
	flex-direction: column;
`;

const MessageBubble = styled.div`
	background: ${({ mine, theme }) =>
		mine ? theme.colors.primary : theme.colors.cardBg};
	color: ${({ mine }) => (mine ? "#fff" : "#333")};
	padding: 0.5rem 1rem;
	border-radius: 20px;
	margin-bottom: 0.5rem;
	align-self: ${({ mine }) => (mine ? "flex-end" : "flex-start")};
	max-width: 75%;
	word-wrap: break-word;
`;

const InputContainer = styled.div`
	display: flex;
	gap: 0.5rem;
`;

export default function ChatWidget() {
	const [visible, setVisible] = useState(false);
	const [msgInput, setMsgInput] = useState("");
	const [messages, setMessages] = useState([]);
	const { socket, joinRoom, leaveRoom, sendMessage, listenToMessages } =
		useWebSocket();

	useEffect(() => {
		if (visible && socket) {
			// Join a shared "support_room". In production, use a unique room per user.
			joinRoom({ chatId: "support_room" });

			listenToMessages((incoming) => {
				setMessages((prev) => [
					...prev,
					{ content: incoming.content, mine: false },
				]);
			});
		}
		return () => {
			if (socket) {
				leaveRoom({ chatId: "support_room" });
			}
		};
	}, [visible, socket]);

	const handleSend = () => {
		const trimmed = msgInput.trim();
		if (!trimmed) return;
		sendMessage({ chatId: "support_room", content: trimmed });
		setMessages((prev) => [...prev, { content: trimmed, mine: true }]);
		setMsgInput("");
	};

	return (
		<>
			<ChatButton
				type='primary'
				shape='circle'
				onClick={() => setVisible(true)}
			>
				<AiOutlineComment size={28} />
			</ChatButton>

			<Drawer
				title='Support Chat'
				placement='right'
				closable
				onClose={() => setVisible(false)}
				open={visible}
				width={320}
				styles={{ body: { padding: 0 } }} // ← updated here
			>
				<ChatDrawerContent>
					<MessagesContainer>
						{messages.map((m, idx) => (
							<MessageBubble key={idx} mine={m.mine}>
								{m.content}
							</MessageBubble>
						))}
					</MessagesContainer>
					<InputContainer>
						<Input
							placeholder='Type a message...'
							value={msgInput}
							onChange={(e) => setMsgInput(e.target.value)}
							onPressEnter={handleSend}
						/>
						<Button type='primary' onClick={handleSend}>
							Send
						</Button>
					</InputContainer>
				</ChatDrawerContent>
			</Drawer>
		</>
	);
}
