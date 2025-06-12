"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function useWebSocket() {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const s = io(`${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}`, {
			transports: ["websocket"],
		});
		setSocket(s);
		return () => {
			s.disconnect();
		};
	}, []);

	const joinRoom = ({ chatId }) => {
		if (socket) socket.emit("joinRoom", { chatId });
	};

	const leaveRoom = ({ chatId }) => {
		if (socket) socket.emit("leaveRoom", { chatId });
	};

	const sendMessage = (messageData) => {
		if (socket) socket.emit("sendMessage", messageData);
	};

	const listenToMessages = (callback) => {
		if (socket) {
			socket.on("receiveMessage", (data) => {
				callback({ content: data.message?.content || data.content });
			});
		}
	};

	return { socket, joinRoom, leaveRoom, sendMessage, listenToMessages };
}
