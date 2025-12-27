/* app/dashboard/new-video/page.js */
"use client";

import { useEffect, useState, useRef } from "react";
import {
	Form,
	Input,
	Button,
	Select,
	Card,
	message,
	TimePicker,
	DatePicker,
	Switch,
	Typography,
	Spin,
	Upload,
} from "antd";
import dayjs from "dayjs";
import axios from "@/utils/api";
import SeoHead from "@/components/SeoHead";
import { getApiBase } from "@/utils/apiBase";
import styled from "styled-components";
import {
	DisconnectOutlined,
	AppstoreOutlined,
	ColumnWidthOutlined,
	ClockCircleOutlined,
	BulbOutlined,
	GlobalOutlined,
	FlagOutlined,
	CalendarOutlined,
	SyncOutlined,
	FieldTimeOutlined,
	FileTextOutlined,
	VideoCameraAddOutlined,
	PlusOutlined,
	LoadingOutlined,
} from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import GenerationModal from "@/components/GenerationModal";

const { Text } = Typography;
const { TextArea } = Input;

const Row = styled.div`
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
`;

const API_BASE = getApiBase();

/* helper: file → base64 */
const fileToBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
	});

export default function NewVideo() {
	/* ───────────────────────────────
	 * Local state
	 * ─────────────────────────────── */
	const [loading, setLoading] = useState(false); // pre‑flight call / validation
	const [generating, setGenerating] = useState(false); // true while SSE stream active
	const [schedEnabled, setSchedEnabled] = useState(false);
	const [profileLoading, setProfileLoading] = useState(true);
	const [savingTokens, setSavingTokens] = useState(false);
	const [userProfile, setUserProfile] = useState(null);

	/* image upload */
	const [fileList, setFileList] = useState([]);
	const [videoImage, setVideoImage] = useState(null); // { public_id, url } | null

	/* SSE + modal */
	const [modalOpen, setModalOpen] = useState(false);
	const [phase, setPhase] = useState("INIT");
	const [extra, setExtra] = useState({});
	const sseReaderRef = useRef(null);

	/* ───────────────────────────────
	 * Fetch user profile once
	 * ─────────────────────────────── */
	useEffect(() => {
		(async () => {
			try {
				setProfileLoading(true);
				const res = await axios.get("/auth/profile");
				setUserProfile(res.data.data);
			} catch {
				message.error("Failed to load user profile.");
			} finally {
				setProfileLoading(false);
			}
		})();
	}, []);

	/* ───────────────────────────────
	 * Google‑OAuth helper
	 * ─────────────────────────────── */
	const googleLogin = useGoogleLogin({
		flow: "auth-code",
		access_type: "offline",
		prompt: "consent",
		include_granted_scopes: false,
		scope:
			"https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.email",
		redirect_uri: "https://aivideomatic.com/api/youtube/callback",
		onSuccess: async (codeResponse) => {
			try {
				setSavingTokens(true);
				await axios.post("/youtube/exchange-code", { code: codeResponse.code });
				message.success("YouTube account connected!");
				const profileRes = await axios.get("/auth/profile");
				setUserProfile(profileRes.data.data);
			} catch {
				message.error("Failed to save YouTube tokens.");
			} finally {
				setSavingTokens(false);
			}
		},
		onError: () => {
			message.error("Google sign‑in failed or was cancelled.");
		},
	});

	/* ───────────────────────────────
	 * Image‑upload helpers
	 * ─────────────────────────────── */
	const beforeUpload = (file) => {
		if (file.size / 1024 / 1024 > 5) {
			message.error("Image must be smaller than 5 MB.");
			return Upload.LIST_IGNORE;
		}
		return true;
	};
	const handleCustomRequest = async ({ file, onSuccess, onError }) => {
		try {
			if (videoImage?.public_id) {
				await axios.post("/removeimage", { public_id: videoImage.public_id });
			}
			const base64 = await fileToBase64(file);
			const { data } = await axios.post("/uploadimage", { image: base64 });

			const uploaded = {
				uid: data.public_id,
				name: file.name,
				status: "done",
				url: data.url,
				public_id: data.public_id,
			};
			setFileList([uploaded]);
			setVideoImage({ public_id: data.public_id, url: data.url });
			onSuccess(data, file);
		} catch (err) {
			onError(err);
			message.error("Upload failed");
		}
	};
	const handleRemove = async (file) => {
		try {
			await axios.post("/removeimage", { public_id: file.public_id });
			setFileList([]);
			setVideoImage(null);
		} catch {
			message.error("Could not remove image");
		}
	};

	/* ───────────────────────────────
	 * Helper – close SSE cleanly
	 * ─────────────────────────────── */
	const cancelStream = () => {
		try {
			sseReaderRef.current?.cancel?.();
		} catch {}
		sseReaderRef.current = null;
	};

	/* ───────────────────────────────
	 * Form submit  ➜  kick off backend
	 * ─────────────────────────────── */
	const onFinish = async (values) => {
		/* Already generating?  Just reopen modal. */
		if (generating) {
			setModalOpen(true);
			return;
		}

		setModalOpen(true);
		setPhase("INIT");
		setExtra({});
		setLoading(true);
		setGenerating(true);

		cancelStream(); // safety

		const processBuffer = () => {
			const parts = buffer.split(/\r?\n\r?\n/);
			buffer = parts.pop(); // keep trailing partial
			parts.forEach((chunk) => {
				if (chunk.startsWith("data:")) {
					try {
						const { phase: p, extra: e } = JSON.parse(
							chunk.replace(/^data:/, "")
						);
						setPhase(p);
						setExtra(e || {});
						if (p === "COMPLETED" || p === "ERROR") setGenerating(false);
					} catch {
						console.warn("Malformed SSE chunk:", chunk);
					}
				}
			});
		};

		try {
			const payload = {
				category: values.category,
				ratio: values.ratio,
				duration: Number(values.duration),
				language: values.language,
				country: values.country,
				...(values.description?.trim() && {
					description: values.description.trim(),
				}),
				...(values.customPrompt?.trim() && {
					customPrompt: values.customPrompt.trim(),
				}),
				...(videoImage && { videoImage }),
				youtubeAccessToken: userProfile?.youtubeAccessToken || "",
				youtubeRefreshToken: userProfile?.youtubeRefreshToken || "",
				youtubeTokenExpiresAt: userProfile?.youtubeTokenExpiresAt || null,
				youtubeEmail: userProfile?.youtubeEmail || "",
			};

			if (schedEnabled) {
				payload.schedule = {
					type: values.scheduleType,
					timeOfDay: dayjs(values.time).format("HH:mm"),
					startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
					...(values.endDate && {
						endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
					}),
				};
			}

			const token = localStorage.getItem("token");
			if (!token) throw new Error("No auth token, please log in again.");
			if (!API_BASE)
				throw new Error(
					"Missing NEXT_PUBLIC_API_URL (example: http://127.0.0.1:8102/api)"
				);

			const res = await fetch(`${API_BASE}/videos`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});
			if (!res.body) throw new Error("Server does not support streaming.");

			/* ‑‑‑ Stream Reader */
			const reader = res.body.getReader();
			sseReaderRef.current = reader;
			const decoder = new TextDecoder("utf-8");
			let buffer = "";

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const parts = buffer.split("\n\n");
				buffer = parts.pop();

				parts.forEach((chunk) => {
					if (chunk.startsWith("data:")) {
						try {
							const { phase: p, extra: e } = JSON.parse(
								chunk.replace(/^data:/, "")
							);
							setPhase(p);
							setExtra(e || {});
							/* Terminate generating flag on completion / error */
							if (p === "COMPLETED" || p === "ERROR") {
								setGenerating(false);
							}
						} catch {
							console.warn("Malformed SSE chunk:", chunk);
						}
					}
				});
			}
			processBuffer();
			reader.releaseLock();
		} catch (err) {
			message.error(err.message || "Error starting generation");
			setGenerating(false);
		} finally {
			setLoading(false);
		}
	};

	/* cleanup on unmount */
	useEffect(() => cancelStream, []);

	/* ───────────────────────────────
	 * UI helpers
	 * ─────────────────────────────── */
	if (profileLoading) {
		return (
			<div style={{ textAlign: "center", marginTop: "3rem" }}>
				<Spin size='large' />
			</div>
		);
	}

	const isAdmin = userProfile?.role === "admin";
	const hasYouTube = Boolean(userProfile?.youtubeRefreshToken);
	const buttonLabel = generating ? "Progressing…" : "Generate";
	const buttonIcon = generating ? (
		<LoadingOutlined />
	) : (
		<VideoCameraAddOutlined />
	);

	return (
		<>
			<SeoHead title='Admin | New Video' />
			<h2>Create AI Video</h2>

			<Card>
				{/* YouTube Connect */}
				<div style={{ marginBottom: "1rem" }}>
					<Text type='warning'>
						<DisconnectOutlined style={{ marginRight: 6 }} />
						{hasYouTube
							? `YouTube (${userProfile.youtubeEmail}) is connected.`
							: "You haven't connected YouTube—videos will generate but not upload."}
					</Text>
					<br />
					<Button
						type='primary'
						onClick={() => googleLogin()}
						loading={savingTokens}
						style={{ marginTop: 8 }}
					>
						{hasYouTube ? "Re-connect YouTube" : "Connect YouTube"}
					</Button>
				</div>

				<Form
					layout='vertical'
					onFinish={onFinish}
					disabled={generating} /* lock inputs while generating */
					initialValues={{
						startDate: dayjs(),
						language: "English",
						country: "all countries",
					}}
				>
					{/* Category */}
					<Form.Item
						name='category'
						label={
							<span>
								<AppstoreOutlined style={{ marginRight: 6 }} />
								Category
							</span>
						}
						rules={[{ required: true, message: "Please select a category" }]}
					>
						<Select placeholder='Select category'>
							<Select.Option value='Other'>
								Most Trending (All Topics)
							</Select.Option>
							<Select.Option value='Sports'>Sports</Select.Option>
							<Select.Option value='Politics'>Politics</Select.Option>
							<Select.Option value='Finance'>Finance</Select.Option>
							<Select.Option value='Entertainment'>Entertainment</Select.Option>
							<Select.Option value='Technology'>Technology</Select.Option>
							<Select.Option value='Health'>Health</Select.Option>
							<Select.Option value='World'>World</Select.Option>
							<Select.Option value='Lifestyle'>Lifestyle</Select.Option>
							<Select.Option value='Science'>Science</Select.Option>

							{/* 9 new categories */}
							<Select.Option value='Gaming'>Gaming</Select.Option>
							<Select.Option value='Business'>Business</Select.Option>
							<Select.Option value='Travel'>Travel</Select.Option>
							<Select.Option value='FoodDrink'>Food & Drink</Select.Option>
							<Select.Option value='PetsAndAnimals'>
								Pets and Animals
							</Select.Option>
							<Select.Option value='CelebrityNews'>
								Celebrity News
							</Select.Option>
							<Select.Option value='Climate'>Climate</Select.Option>
							<Select.Option value='SocialIssues'>Social Issues</Select.Option>
							<Select.Option value='Education'>Education</Select.Option>
							<Select.Option value='Fashion'>Fashion</Select.Option>
							<Select.Option value='Top5'>Top 5</Select.Option>
						</Select>
					</Form.Item>

					{/* Aspect Ratio & Duration */}
					<Row>
						<Form.Item
							name='ratio'
							label={
								<span>
									<ColumnWidthOutlined style={{ marginRight: 6 }} />
									Aspect Ratio
								</span>
							}
							initialValue='1280:720'
							rules={[{ required: true, message: "Select a ratio" }]}
						>
							<Select style={{ width: 200 }}>
								<Select.Option value='1280:720'>1280×720</Select.Option>
								<Select.Option value='720:1280'>
									720×1280 (portrait)
								</Select.Option>
								<Select.Option value='1104:832'>1104×832</Select.Option>
								<Select.Option value='832:1104'>832×1104</Select.Option>
								<Select.Option value='960:960'>960×960 (square)</Select.Option>
								<Select.Option value='1584:672'>1584×672</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item
							name='duration'
							label={
								<span>
									<ClockCircleOutlined style={{ marginRight: 6 }} />
									Duration (seconds)
								</span>
							}
							initialValue='10'
							rules={[{ required: true, message: "Select duration" }]}
						>
							<Select style={{ width: 140 }}>
								{Array.from({ length: 9 }, (_, i) => 5 + i * 5).map((sec) => (
									<Select.Option key={sec} value={String(sec)}>
										{sec} s
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Row>

					{/* Cover / Seed Image (optional) */}
					<Form.Item
						label={
							<span>
								<PlusOutlined style={{ marginRight: 6 }} />
								Cover / Seed Image (optional)
							</span>
						}
						help={
							<div>
								If provided, this image will be used as the visual seed for
								RunwayML generation; otherwise the AI agent will choose
								{/* <div
									style={{
										fontWeight: "bold",
										color: "lightseagreen",
										textTransform: "uppercase",
									}}
								>
									It is recommended to let the AI agent choose and learn!
								</div> */}
							</div>
						}
					>
						<Upload
							listType='picture-card'
							fileList={fileList}
							beforeUpload={beforeUpload}
							customRequest={handleCustomRequest}
							onRemove={handleRemove}
							maxCount={1}
						>
							{fileList.length === 0 && (
								<div>
									<PlusOutlined />
									<div style={{ marginTop: 8 }}>Upload</div>
								</div>
							)}
						</Upload>
					</Form.Item>

					{/* Custom Runway Prompt */}
					<Form.Item
						name='customPrompt'
						label={
							<span>
								<BulbOutlined style={{ marginRight: 6 }} />
								Custom Runway Prompt (optional)
							</span>
						}
						tooltip='This text is used directly for the Runway image if provided.'
					>
						<TextArea
							rows={3}
							placeholder="E.g., 'A serene beach at sunset with calm narration.'"
						/>
					</Form.Item>

					{/* Language & Country */}
					<Row>
						<Form.Item
							name='language'
							label={
								<span>
									<GlobalOutlined style={{ marginRight: 6 }} />
									Language
								</span>
							}
						>
							<Select style={{ width: 200 }}>
								<Select.Option value='English'>English</Select.Option>
								<Select.Option value='العربية'>العربية</Select.Option>
								<Select.Option value='Deutsch'>Deutsch</Select.Option>
								<Select.Option value='Français'>Français</Select.Option>
								<Select.Option value='हिंदी'>हिंदी</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item
							name='country'
							label={
								<span>
									<FlagOutlined style={{ marginRight: 6 }} />
									Country
								</span>
							}
						>
							<Select style={{ width: 200 }}>
								<Select.Option value='all countries'>
									All Countries
								</Select.Option>
								<Select.Option value='US'>United States</Select.Option>
								<Select.Option value='DE'>Germany</Select.Option>
								<Select.Option value='FR'>France</Select.Option>
								<Select.Option value='GB'>UK</Select.Option>
								<Select.Option value='AU'>Australia</Select.Option>
								<Select.Option value='KW'>Kuwait</Select.Option>
								<Select.Option value='AE'>UAE</Select.Option>
								<Select.Option value='SA'>KSA</Select.Option>
								<Select.Option value='IN'>India</Select.Option>
								<Select.Option value='EG'>Egypt</Select.Option>
							</Select>
						</Form.Item>
					</Row>

					{/* Scheduling Controls */}
					<Form.Item
						label={
							<span>
								<CalendarOutlined style={{ marginRight: 6 }} />
								Schedule this video?
							</span>
						}
						valuePropName='checked'
					>
						<Switch checked={schedEnabled} onChange={setSchedEnabled} />
					</Form.Item>

					{schedEnabled && (
						<>
							<Row>
								<Form.Item
									name='startDate'
									label={
										<span>
											<CalendarOutlined style={{ marginRight: 6 }} />
											Start Date
										</span>
									}
									rules={[{ required: true, message: "Pick a start date" }]}
								>
									<DatePicker />
								</Form.Item>
								<Form.Item
									name='endDate'
									label={
										<span>
											<CalendarOutlined style={{ marginRight: 6 }} />
											End Date
										</span>
									}
								>
									<DatePicker />
								</Form.Item>
							</Row>
							<Row>
								<Form.Item
									name='scheduleType'
									label={
										<span>
											<SyncOutlined style={{ marginRight: 6 }} />
											Frequency
										</span>
									}
									initialValue='daily'
									rules={[{ required: true, message: "Select a frequency" }]}
								>
									<Select style={{ width: 150 }}>
										<Select.Option value='daily'>Daily</Select.Option>
										<Select.Option value='weekly'>Weekly</Select.Option>
										<Select.Option value='monthly'>Monthly</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item
									name='time'
									label={
										<span>
											<FieldTimeOutlined style={{ marginRight: 6 }} />
											Time of Day
										</span>
									}
									initialValue={dayjs().hour(14).minute(0)}
									rules={[{ required: true, message: "Pick a time" }]}
								>
									<TimePicker format='HH:mm' />
								</Form.Item>
							</Row>
						</>
					)}

					{/* Internal Notes */}
					<Form.Item
						name='description'
						label={
							<span>
								<FileTextOutlined style={{ marginRight: 6 }} />
								Internal Notes
							</span>
						}
					>
						<Input.TextArea rows={2} placeholder='(Optional)' />
					</Form.Item>

					{/* Submit */}
					<Button
						type='primary'
						icon={buttonIcon}
						htmlType='submit'
						loading={loading && !generating}
					>
						{buttonLabel}
					</Button>
				</Form>
			</Card>

			{/* Progress Modal */}
			<GenerationModal
				open={modalOpen}
				phase={phase}
				extra={extra}
				onClose={() => setModalOpen(false)}
			/>
		</>
	);
}
