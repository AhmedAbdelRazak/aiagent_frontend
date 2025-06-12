/* app/admin/all-videos/page.js */
"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { List, Button, Spin, Typography, Empty, Tag, message } from "antd";
import { DownOutlined, YoutubeOutlined } from "@ant-design/icons";
import SeoHead from "@/components/SeoHead";
import axios from "@/utils/api";

const { Text, Title, Paragraph } = Typography;

/* ───────────────────────────────────────────────────────────── */
const Layout = styled.div`
	display: flex;
	gap: 1.5rem;
	flex-wrap: wrap;

	@media (max-width: 960px) {
		flex-direction: column;
	}
`;

const PlayerWrapper = styled.div`
	flex: 3 1 640px;
	min-width: 300px;
`;

const Sidebar = styled.div`
	flex: 1 1 280px;
	max-width: 380px;
	min-width: 220px;
	background: ${({ theme }) => theme.colors.background};
	border-left: 1px solid ${({ theme }) => theme.colors.border};
	overflow-y: auto;
	max-height: calc(100vh - 160px);
	padding: 0 8px 0 12px; /* left padding widened */
`;

const Thumb = styled.img`
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	border-radius: 4px;
`;

const ActiveItem = styled.div`
	border: 2px solid ${({ theme }) => theme.colors.primary};
	border-radius: 4px;
	padding: 2px;
`;

/* ───────────────────────────────────────────────────────────── */
function youTubeId(link = "") {
	try {
		const u = new URL(link);
		if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
		if (u.hostname === "youtu.be") return u.pathname.slice(1);
	} catch {
		/* ignore */
	}
	return null;
}
const thumbUrl = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/* ───────────────────────────────────────────────────────────── */
export default function AllVideos() {
	const [videos, setVideos] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [current, setCurrent] = useState(null);

	const fetchPage = async (p = 1) => {
		try {
			setLoading(true);
			const { data } = await axios.get(`/videos?page=${p}&limit=20`);
			if (!data.success) throw new Error("Request failed");
			setVideos((prev) => (p === 1 ? data.data : [...prev, ...data.data]));
			setPage(data.page);
			setPages(data.pages);
			if (p === 1 && data.data.length) setCurrent(data.data[0]);
		} catch (e) {
			console.error(e);
			message.error("Could not load videos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPage(1);
	}, []);

	return (
		<>
			<SeoHead title='All Videos' />
			<Title level={2}>All Videos</Title>

			{loading && !videos.length ? (
				<Spin size='large' />
			) : videos.length === 0 ? (
				<Empty description='No videos found.' />
			) : (
				<Layout>
					{/* ───────── Left: Player ───────── */}
					<PlayerWrapper>
						{current && youTubeId(current.youtubeLink) ? (
							<>
								<iframe
									width='100%'
									height='400'
									src={`https://www.youtube.com/embed/${youTubeId(
										current.youtubeLink
									)}?modestbranding=1&rel=0`}
									title={current.seoTitle}
									frameBorder='0'
									allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
									allowFullScreen
									style={{ borderRadius: 8, background: "#000" }}
								/>
								<Title level={4} style={{ marginTop: 12 }}>
									{current.seoTitle}
								</Title>

								{/* SEO description */}
								<Paragraph>{current.seoDescription}</Paragraph>

								{/* Tags */}
								{current.tags && current.tags.length > 0 && (
									<div style={{ marginTop: 8 }}>
										<Text strong>Tags:</Text>
										<div style={{ marginTop: 4 }}>
											{current.tags.map((t) => (
												<Tag key={t}>{t}</Tag>
											))}
										</div>
									</div>
								)}

								{/* YouTube link with icon */}
								{current.youtubeLink && (
									<div style={{ marginTop: 12 }}>
										<YoutubeOutlined
											style={{ fontSize: 18, color: "#ff0000", marginRight: 6 }}
										/>
										<a
											href={current.youtubeLink}
											target='_blank'
											rel='noopener noreferrer'
										>
											Open on YouTube
										</a>
									</div>
								)}
							</>
						) : (
							<p>No video selected.</p>
						)}
					</PlayerWrapper>

					{/* ───────── Right: List ───────── */}
					<Sidebar>
						<List
							itemLayout='vertical'
							dataSource={videos}
							renderItem={(item) => {
								const id = youTubeId(item.youtubeLink);
								if (!id) return null;
								const isActive = current?._id === item._id;

								const inner = (
									<>
										<Thumb src={thumbUrl(id)} alt={item.seoTitle} />
										<div style={{ padding: "4px 0" }}>
											<Text strong ellipsis>
												{item.seoTitle}
											</Text>
											<br />
											<Text type='secondary' style={{ fontSize: 12 }}>
												{item.user?.name} ({item.user?.email})
											</Text>
										</div>
									</>
								);

								return (
									<List.Item
										key={item._id}
										style={{ cursor: "pointer" }}
										onClick={() => setCurrent(item)}
									>
										{isActive ? <ActiveItem>{inner}</ActiveItem> : inner}
									</List.Item>
								);
							}}
						/>

						{page < pages && (
							<div style={{ textAlign: "center", padding: "1rem 0" }}>
								<Button
									type='primary'
									icon={<DownOutlined />}
									loading={loading}
									onClick={() => fetchPage(page + 1)}
								>
									Load more
								</Button>
							</div>
						)}
					</Sidebar>
				</Layout>
			)}
		</>
	);
}
