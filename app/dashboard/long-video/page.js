/* app/dashboard/long-video/page.js */
"use client";

import { useEffect, useState, useRef } from "react";
import {
	Form,
	Input,
	Button,
	Select,
	Card,
	message,
	Switch,
	DatePicker,
	TimePicker,
	Progress,
	Typography,
} from "antd";
import dayjs from "dayjs";
import SeoHead from "@/components/SeoHead";
import {
	VideoCameraAddOutlined,
	ClockCircleOutlined,
	CalendarOutlined,
	FieldTimeOutlined,
	BulbOutlined,
	GlobalOutlined,
	SoundOutlined,
	FileImageOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { TextArea } = Input;
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL;

const DURATION_OPTIONS = [20, 45, 60, 120, 180, 240, 300];

export default function LongVideoPage() {
	const [loading, setLoading] = useState(false);
	const [polling, setPolling] = useState(false);
	const [jobId, setJobId] = useState(null);
	const [status, setStatus] = useState(null);
	const [progress, setProgress] = useState(0);
	const [topic, setTopic] = useState("");
	const [finalUrl, setFinalUrl] = useState("");
	const [error, setError] = useState("");
	const [schedEnabled, setSchedEnabled] = useState(false);
	const pollRef = useRef(null);

	const stopPolling = () => {
		if (pollRef.current) clearInterval(pollRef.current);
		pollRef.current = null;
		setPolling(false);
	};

	useEffect(() => {
		return () => stopPolling();
	}, []);

	const startPolling = (id) => {
		stopPolling();
		setPolling(true);
		pollRef.current = setInterval(async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("No auth token, please log in again.");
				const res = await fetch(`${API_ORIGIN}/long-video/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Failed to fetch job status.");
				const data = await res.json();
				setStatus(data.status);
				setProgress(data.progressPct || 0);
				setTopic(data.topic || "");
				setFinalUrl(data.finalVideoUrl || "");
				setError(data.error || "");
				if (data.status === "completed" || data.status === "failed") {
					stopPolling();
				}
			} catch (err) {
				stopPolling();
				message.error(err.message || "Polling failed");
			}
		}, 3000);
	};

	const onFinish = async (values) => {
		setLoading(true);
		setStatus(null);
		setProgress(0);
		setFinalUrl("");
		setError("");
		setJobId(null);
		setTopic("");

		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No auth token, please log in again.");

			const payload = {
				preferredTopicHint: values.titlePrompt?.trim() || "",
				language: values.language || "en",
				targetDurationSec: Number(values.duration),
				presenterImageUrl: values.presenterImageUrl?.trim() || "",
				voiceoverUrl: values.voiceoverUrl?.trim() || "",
				musicUrl: values.musicUrl?.trim() || "",
				dryRun: Boolean(values.dryRun),
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

			const res = await fetch(`${API_ORIGIN}/long-video`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || "Failed to start long video job.");
			}

			const data = await res.json();
			setJobId(data.jobId);
			setStatus(data.status);
			startPolling(data.jobId);
			message.success("Long video job queued.");
		} catch (err) {
			message.error(err.message || "Failed to start long video job.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<SeoHead title='Dashboard | Long Video' />
			<h2>Create Long Video</h2>

			<Card style={{ marginBottom: "1rem" }}>
				<Form
					layout='vertical'
					onFinish={onFinish}
					initialValues={{
						language: "en",
						duration: 180,
						startDate: dayjs(),
					}}
				>
					<Form.Item
						name='titlePrompt'
						label={
							<span>
								<BulbOutlined style={{ marginRight: 6 }} />
								Title Prompt (optional)
							</span>
						}
						tooltip='If empty, the orchestrator will pick a trending movie topic.'
					>
						<TextArea
							rows={2}
							placeholder='Example: The top reasons people are talking about Dune 2'
						/>
					</Form.Item>

					<Form.Item
						name='duration'
						label={
							<span>
								<ClockCircleOutlined style={{ marginRight: 6 }} />
								Duration (seconds)
							</span>
						}
						rules={[{ required: true, message: "Select duration" }]}
					>
						<Select style={{ width: 200 }}>
							{DURATION_OPTIONS.map((sec) => (
								<Select.Option key={sec} value={sec}>
									{sec} seconds
								</Select.Option>
							))}
						</Select>
					</Form.Item>

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
							<Select.Option value='en'>English</Select.Option>
							<Select.Option value='es'>Spanish</Select.Option>
							<Select.Option value='fr'>French</Select.Option>
							<Select.Option value='de'>German</Select.Option>
							<Select.Option value='ar'>Arabic</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name='presenterImageUrl'
						label={
							<span>
								<FileImageOutlined style={{ marginRight: 6 }} />
								Presenter Image URL (optional)
							</span>
						}
					>
						<Input placeholder='https://example.com/your-photo.png' />
					</Form.Item>

					<Form.Item
						name='voiceoverUrl'
						label={
							<span>
								<SoundOutlined style={{ marginRight: 6 }} />
								Voiceover URL (optional)
							</span>
						}
					>
						<Input placeholder='https://example.com/voiceover.mp3' />
					</Form.Item>

					<Form.Item
						name='musicUrl'
						label={
							<span>
								<SoundOutlined style={{ marginRight: 6 }} />
								Background Music URL (optional)
							</span>
						}
					>
						<Input placeholder='https://example.com/music.mp3' />
					</Form.Item>

					<Form.Item
						name='dryRun'
						label='Dry Run (no external calls)'
						valuePropName='checked'
					>
						<Switch />
					</Form.Item>

					<Form.Item
						label={
							<span>
								<CalendarOutlined style={{ marginRight: 6 }} />
								Schedule this long video?
							</span>
						}
						valuePropName='checked'
					>
						<Switch checked={schedEnabled} onChange={setSchedEnabled} />
					</Form.Item>

					{schedEnabled && (
						<>
							<Form.Item
								name='startDate'
								label={
									<span>
										<CalendarOutlined style={{ marginRight: 6 }} />
										Start Date
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
										End Date
									</span>
								}
							>
								<DatePicker />
							</Form.Item>
							<Form.Item
								name='scheduleType'
								label={
									<span>
										<ClockCircleOutlined style={{ marginRight: 6 }} />
										Frequency
									</span>
								}
								initialValue='daily'
								rules={[{ required: true, message: "Select a frequency" }]}
							>
								<Select style={{ width: 200 }}>
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
										Time of Day
									</span>
								}
								initialValue={dayjs().hour(14).minute(0)}
								rules={[{ required: true, message: "Pick a time" }]}
							>
								<TimePicker format='HH:mm' />
							</Form.Item>
						</>
					)}

					<Button
						type='primary'
						icon={<VideoCameraAddOutlined />}
						htmlType='submit'
						loading={loading}
					>
						Generate Long Video
					</Button>
				</Form>
			</Card>

			<Card>
				<Text strong>Status:</Text> {status || "idle"}
				<br />
				<Text strong>Progress:</Text>
				<Progress percent={progress} status={status === "failed" ? "exception" : "active"} />
				{topic && (
					<>
						<Text strong>Topic:</Text> {topic}
						<br />
					</>
				)}
				{finalUrl && (
					<>
						<Text strong>Final Video:</Text>{" "}
						<a href={finalUrl} target='_blank' rel='noreferrer'>
							Download MP4
						</a>
						<br />
					</>
				)}
				{error && (
					<Text type='danger'>
						Error: {error}
					</Text>
				)}
				{polling && !finalUrl && !error && (
					<Text type='secondary'>Job is running... polling every 3s.</Text>
				)}
			</Card>
		</>
	);
}
