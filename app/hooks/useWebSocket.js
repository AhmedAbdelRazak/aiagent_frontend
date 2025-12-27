"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getSocketBase } from "@/utils/apiBase";

export default function useWebSocket() {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const socketBase = getSocketBase();
		if (!socketBase) {
			console.warn("Missing NEXT_PUBLIC_API_URL; websocket disabled.");
			return () => {};
		}
		const s = io(socketBase, {
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
