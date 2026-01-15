/* app/admin/shorts-from-long/page.js */
"use client";

import { useEffect, useState } from "react";
import {
	Form,
	Select,
	Button,
	Card,
	message,
	Typography,
	Divider,
	Switch,
	Tag,
	Collapse,
	Space,
} from "antd";
import SeoHead from "@/components/SeoHead";
import axios from "@/utils/api";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const CLIP_COUNT_OPTIONS = [3, 4, 5, 6];

export default function ShortsFromLongAdmin() {
	const [videos, setVideos] = useState([]);
	const [selectedVideoId, setSelectedVideoId] = useState("");
	const [loadingVideos, setLoadingVideos] = useState(false);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [generating, setGenerating] = useState(false);
	const [shortsDetails, setShortsDetails] = useState(null);
	const [forceRegenerate, setForceRegenerate] = useState(false);
	const [maxClips, setMaxClips] = useState(4);

	const fetchLongVideos = async () => {
		setLoadingVideos(true);
		try {
			const { data } = await axios.get(
				`/videos?isLongVideo=true&limit=50&page=1`
			);
			if (!data?.success) throw new Error("Failed to load videos.");
			setVideos(Array.isArray(data.data) ? data.data : []);
		} catch (err) {
			message.error(err.message || "Failed to load long videos.");
		} finally {
			setLoadingVideos(false);
		}
	};

	const fetchShortsDetails = async (videoId) => {
		if (!videoId) return;
		setLoadingDetails(true);
		try {
			const { data } = await axios.get(`/long-video/${videoId}/shorts`);
			if (!data?.success) throw new Error("Failed to load shorts status.");
			setShortsDetails(data.shortsDetails || null);
		} catch (err) {
			message.error(err.message || "Failed to load shorts status.");
		} finally {
			setLoadingDetails(false);
		}
	};

	useEffect(() => {
		fetchLongVideos();
	}, []);

	const onGenerate = async () => {
		if (!selectedVideoId) {
			message.error("Select a long video first.");
			return;
		}
		setGenerating(true);
		try {
			const { data } = await axios.post(
				`/long-video/${selectedVideoId}/shorts`,
				{
					maxClips,
					forceRegenerate,
				}
			);
			if (!data?.success) throw new Error(data?.error || "Generation failed.");
			setShortsDetails(data.shortsDetails || null);
			message.success(`Generated ${data.generatedCount || 0} shorts.`);
		} catch (err) {
			message.error(err.message || "Failed to generate shorts.");
		} finally {
			setGenerating(false);
		}
	};

	const clipCandidates = Array.isArray(shortsDetails?.clipCandidates)
		? shortsDetails.clipCandidates
		: [];

	return (
		<>
			<SeoHead title='Admin | Shorts From Long' />
			<Title level={3} style={{ marginBottom: 12 }}>
				Generate Shorts From Long Video
			</Title>

			<Card style={{ marginBottom: "1rem" }}>
				<Form layout='vertical'>
					<Form.Item label='Select long video'>
						<Select
							loading={loadingVideos}
							placeholder='Pick a long video'
							onChange={(value) => {
								setSelectedVideoId(value);
								fetchShortsDetails(value);
							}}
							value={selectedVideoId || undefined}
							showSearch
							optionFilterProp='label'
						>
							{videos.map((video) => (
								<Select.Option
									key={video._id}
									value={video._id}
									label={video.seoTitle}
								>
									{video.seoTitle || video.topic || "Untitled"}{" "}
									{video.createdAt
										? `(${new Date(video.createdAt).toLocaleDateString()})`
										: ""}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Space size='large' wrap>
						<Form.Item label='How many shorts?'>
							<Select
								style={{ width: 180 }}
								value={maxClips}
								onChange={(value) => setMaxClips(value)}
							>
								{CLIP_COUNT_OPTIONS.map((count) => (
									<Select.Option key={count} value={count}>
										{count} shorts
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item label='Force regenerate existing clips'>
							<Switch
								checked={forceRegenerate}
								onChange={setForceRegenerate}
							/>
						</Form.Item>
					</Space>

					<Button
						type='primary'
						loading={generating}
						onClick={onGenerate}
					>
						Generate Shorts
					</Button>
				</Form>
			</Card>

			<Card loading={loadingDetails}>
				<Space direction='vertical' style={{ width: "100%" }}>
					{shortsDetails?.angle && (
						<div>
							<Text strong>Angle:</Text> {shortsDetails.angle}
						</div>
					)}

					{Array.isArray(shortsDetails?.titleCandidates) &&
						shortsDetails.titleCandidates.length > 0 && (
							<div>
								<Text strong>Title candidates:</Text>
								<div style={{ marginTop: 6 }}>
									{shortsDetails.titleCandidates.map((t) => (
										<Tag key={t}>{t}</Tag>
									))}
								</div>
							</div>
						)}

					{Array.isArray(shortsDetails?.thumbnailTextCandidates) &&
						shortsDetails.thumbnailTextCandidates.length > 0 && (
							<div>
								<Text strong>Thumbnail text candidates:</Text>
								<div style={{ marginTop: 6 }}>
									{shortsDetails.thumbnailTextCandidates.map((t) => (
										<Tag key={t}>{t}</Tag>
									))}
								</div>
							</div>
						)}

					<Divider />

					{clipCandidates.length === 0 ? (
						<Text type='secondary'>
							No shorts details available yet for this video.
						</Text>
					) : (
						<Collapse>
							{clipCandidates.map((clip, idx) => {
								const status =
									clip.status === "uploaded"
										? "green"
										: clip.status === "ready"
											? "blue"
											: clip.status === "failed"
												? "red"
												: "default";
								return (
									<Panel
										header={
											<Space>
												<Text strong>
													Clip #{idx + 1} (segment {clip.segmentIndex})
												</Text>
												<Tag color={status}>{clip.status || "pending"}</Tag>
											</Space>
										}
										key={clip.id || idx}
									>
										<div style={{ marginBottom: 8 }}>
											<Text strong>Type:</Text> {clip.type || "context_needed"}
										</div>
										<div style={{ marginBottom: 8 }}>
											<Text strong>Target seconds:</Text>{" "}
											{clip.targetSeconds || 25}
										</div>
										<div style={{ marginBottom: 8 }}>
											<Text strong>Open loop:</Text>{" "}
											{clip.openLoop ? "Yes" : "No"}
										</div>
										<div style={{ marginBottom: 8 }}>
											<Text strong>Line:</Text>
											<div style={{ marginTop: 6 }}>{clip.line}</div>
										</div>
										{clip.publicUrl && (
											<div style={{ marginBottom: 8 }}>
												<Text strong>Local MP4:</Text>{" "}
												<a
													href={clip.publicUrl}
													target='_blank'
													rel='noreferrer'
												>
													Download clip
												</a>
											</div>
										)}
										{clip.youtubeLink && (
											<div style={{ marginBottom: 8 }}>
												<Text strong>YouTube:</Text>{" "}
												<a
													href={clip.youtubeLink}
													target='_blank'
													rel='noreferrer'
												>
													Open on YouTube
												</a>
											</div>
										)}
										{clip.lastError && (
											<Text type='danger'>{clip.lastError}</Text>
										)}
									</Panel>
								);
							})}
						</Collapse>
					)}
				</Space>
			</Card>
		</>
	);
}
