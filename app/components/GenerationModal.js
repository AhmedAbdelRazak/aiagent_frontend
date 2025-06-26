// components/GenerationModal.jsx
import { useEffect, useRef, useState } from "react";
import {
	Modal,
	Steps,
	Typography,
	Progress,
	Row,
	Col,
	Alert,
	Tag,
	Divider,
	Space,
	FloatButton,
	Button,
} from "antd";
import {
	LoadingOutlined,
	CheckCircleOutlined,
	RocketOutlined,
	MergeCellsOutlined,
	VideoCameraOutlined,
	AudioOutlined,
	SyncOutlined,
	UploadOutlined,
	CalendarOutlined,
	SmileOutlined,
	YoutubeOutlined,
	ExclamationCircleOutlined,
	MinusOutlined,
	PlusOutlined,
	MinusCircleOutlined,
	PlayCircleOutlined,
} from "@ant-design/icons";

const { Step } = Steps;
const { Text, Paragraph, Link } = Typography;

/* ────────────────────────────────────────────
 * Backend phases – **keep in same order**
 * ──────────────────────────────────────────── */
const PHASE_DEFS = [
	{ key: "INIT", title: "Starting up", icon: <RocketOutlined /> },
	{
		key: "GENERATING_CLIPS",
		title: "Generating clips",
		icon: <VideoCameraOutlined />,
	},
	{
		key: "ASSEMBLING_VIDEO",
		title: "Assembling video",
		icon: <MergeCellsOutlined />,
	},
	{
		key: "ADDING_VOICE_MUSIC",
		title: "Adding voice & music",
		icon: <AudioOutlined />,
	},
	{ key: "SYNCING_VOICE_MUSIC", title: "Final sync", icon: <SyncOutlined /> },
	{
		key: "VIDEO_UPLOADED",
		title: "Uploaded to YouTube",
		icon: <UploadOutlined />,
	}, // optional
	{ key: "VIDEO_SCHEDULED", title: "Scheduled", icon: <CalendarOutlined /> }, // optional
	{ key: "COMPLETED", title: "Completed", icon: <SmileOutlined /> },
	{ key: "ERROR", title: "Failed", icon: <ExclamationCircleOutlined /> },
];

const phaseIndex = (p) => PHASE_DEFS.findIndex(({ key }) => key === p);

const STATUS_TEXT = {
	INIT: "Warming up the engines…",
	GENERATING_CLIPS: "Creating your video scenes",
	ASSEMBLING_VIDEO: "Stitching scenes together",
	ADDING_VOICE_MUSIC: "Recording voice‑over & mixing music",
	SYNCING_VOICE_MUSIC: "Syncing audio with visuals",
	VIDEO_UPLOADED: "Upload finished!",
	VIDEO_SCHEDULED: "Video scheduled for publishing",
	COMPLETED: "All done – enjoy your new video 🎬",
	ERROR: "Something went wrong 😕",
};

export default function GenerationModal({ open, phase, extra = {}, onClose }) {
	/* ───────── minimise / restore ───────── */
	const [minimised, setMinimised] = useState(false);
	const showModal = open && !minimised;

	/* ───────── track “main” phase (ignore FALLBACK) ───────── */
	const lastMainPhase = useRef("INIT");
	useEffect(() => {
		if (phaseIndex(phase) !== -1 && phase !== "FALLBACK")
			lastMainPhase.current = phase;
	}, [phase]);
	const currentPhase = lastMainPhase.current;
	const currentIdx = phaseIndex(currentPhase);

	/* ───────── segment progress (GENERATING_CLIPS) ───────── */
	const segDone = Number.isFinite(extra.done) ? extra.done : null;
	const segTotal = Number.isFinite(extra.total) ? extra.total : null;

	/* ───────── accumulate FALLBACK events ───────── */
	const [fallbacks, setFallbacks] = useState([]);
	useEffect(() => {
		if (phase === "FALLBACK" && extra?.segment) {
			setFallbacks((f) => [
				...f,
				{ segment: extra.segment, type: extra.type, reason: extra.reason },
			]);
		}
		if (!open) setFallbacks([]);
	}, [phase, extra, open]);

	/* ───────── remember if we ever saw VIDEO_SCHEDULED ───────── */
	const [scheduleSeen, setScheduleSeen] = useState(false);
	useEffect(() => {
		if (phase === "VIDEO_SCHEDULED") setScheduleSeen(true);
		if (!open) setScheduleSeen(false);
	}, [phase, open]);

	/* ───────── remember YouTube link once it appears ───────── */
	const youtubeLinkRef = useRef(null);
	useEffect(() => {
		if (extra.youtubeLink) youtubeLinkRef.current = extra.youtubeLink;
		if (phase === "COMPLETED" && !youtubeLinkRef.current && extra?.phases) {
			const hit = extra.phases.find((p) => p.extra?.youtubeLink);
			if (hit) youtubeLinkRef.current = hit.extra.youtubeLink;
		}
		if (!open) youtubeLinkRef.current = null;
	}, [phase, extra, open]);

	/* ───────── banner (plain English status) ───────── */
	const Banner = () => {
		const txt = STATUS_TEXT[currentPhase] || "Working…";
		const Ico =
			currentPhase === "ERROR"
				? ExclamationCircleOutlined
				: currentPhase === "COMPLETED"
					? CheckCircleOutlined
					: PlayCircleOutlined;
		return (
			<Space
				style={{
					width: "100%",
					padding: "8px 0 20px",
					justifyContent: "center",
				}}
			>
				<Ico
					style={{
						fontSize: 18,
						color:
							currentPhase === "ERROR"
								? "#ff4d4f"
								: currentPhase === "COMPLETED"
									? "#52c41a"
									: "#1890ff",
					}}
				/>
				<Text strong>{txt}</Text>
			</Space>
		);
	};

	/* ───────── main vertical steps ───────── */
	const MainSteps = () => (
		<Steps direction='vertical' current={currentIdx}>
			{PHASE_DEFS.map(({ key, title, icon }, idx) => {
				const scheduleSkipped =
					key === "VIDEO_SCHEDULED" &&
					currentPhase === "COMPLETED" &&
					!scheduleSeen;

				let status = "wait";
				if (scheduleSkipped) status = "finish";
				else if (idx < currentIdx) status = "finish";
				else if (idx === currentIdx)
					status =
						key === "COMPLETED"
							? "finish"
							: key === "ERROR"
								? "error"
								: "process";

				const iconNode = scheduleSkipped ? (
					<MinusCircleOutlined style={{ color: "#d9d9d9" }} />
				) : status === "finish" ? (
					<CheckCircleOutlined style={{ color: "#52c41a" }} />
				) : status === "process" ? (
					<LoadingOutlined />
				) : status === "error" ? (
					<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
				) : (
					icon
				);

				const desc = scheduleSkipped
					? "Not scheduled"
					: idx === currentIdx && extra.msg
						? extra.msg
						: null;

				return (
					<Step
						key={key}
						title={title}
						icon={iconNode}
						status={status}
						description={desc && <Text type='secondary'>{desc}</Text>}
					/>
				);
			})}
		</Steps>
	);

	/* ───────── segment mini‑stepper ───────── */
	const SegmentSteps = () =>
		segTotal && segDone ? (
			<>
				<Row style={{ marginTop: 24 }}>
					<Col span={24}>
						<Text strong>Clip progress</Text>
					</Col>
				</Row>
				<Steps
					size='small'
					current={segDone - 1}
					progressDot
					responsive={false}
				>
					{Array.from({ length: segTotal }, (_, i) => {
						const n = i + 1;
						const st =
							n < segDone ? "finish" : n === segDone ? "process" : "wait";
						const ic =
							st === "finish" ? (
								<CheckCircleOutlined style={{ color: "#1890ff" }} />
							) : st === "process" ? (
								<LoadingOutlined />
							) : (
								<VideoCameraOutlined />
							);
						return <Step key={n} title={`#${n}`} status={st} icon={ic} />;
					})}
				</Steps>
				<Progress
					style={{ marginTop: 8 }}
					percent={Math.round((segDone / segTotal) * 100)}
					size='small'
				/>
			</>
		) : null;

	/* ───────── fallback alerts ───────── */
	const FallbackAlerts = () =>
		fallbacks.length ? (
			<>
				<Row style={{ marginTop: 24 }}>
					<Col span={24}>
						<Text strong>Auto‑recovery events</Text>
					</Col>
				</Row>
				{fallbacks.map(({ segment, type, reason }, i) => (
					<Alert
						key={i}
						type='warning'
						showIcon
						message={
							<>
								<Tag color='orange'>Segment {segment}</Tag>
								{reason || `Fallback (${type})`}
							</>
						}
						style={{ marginTop: 8 }}
					/>
				))}
			</>
		) : null;

	/* ───────── YouTube link block ───────── */
	const YoutubeBlock = () =>
		youtubeLinkRef.current ? (
			<div style={{ marginTop: 32, textAlign: "center" }}>
				<Paragraph>
					<YoutubeOutlined style={{ fontSize: 32, color: "#FF0000" }} />
				</Paragraph>
				<Paragraph>
					<Text strong style={{ fontSize: 18 }}>
						Your video is live on YouTube
					</Text>
				</Paragraph>
				<Paragraph copyable={{ text: youtubeLinkRef.current }}>
					<Link
						href={youtubeLinkRef.current}
						target='_blank'
						rel='noopener noreferrer'
					>
						{youtubeLinkRef.current}
					</Link>
				</Paragraph>
			</div>
		) : null;

	/* ───────── error message ───────── */
	const ErrorBlock = () =>
		currentPhase === "ERROR" ? (
			<Alert
				style={{ marginTop: 24 }}
				showIcon
				type='error'
				message='Generation failed'
				description={
					<>
						We couldn’t finish this video. Please try again or&nbsp;
						<Link href='/contact'>contact support</Link>.
					</>
				}
			/>
		) : null;

	const isTerminal = currentPhase === "COMPLETED" || currentPhase === "ERROR";

	/* ───────── header with minimise button (AntD ≥ 5.8) ───────── */
	const Header = (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<span>Video generation progress (≈ 5‑7 min)</span>
			<Button
				type='text'
				size='small'
				icon={minimised ? <PlusOutlined /> : <MinusOutlined />}
				aria-label={minimised ? "Restore" : "Minimise"}
				onClick={() => setMinimised((m) => !m)}
			/>
		</div>
	);

	return (
		<>
			{/* ---------- main modal ---------- */}
			<Modal
				title={Header}
				open={showModal}
				footer={null}
				onCancel={isTerminal ? onClose : undefined}
				closable={isTerminal}
				width={720}
				destroyOnClose
				maskClosable={false}
				modalRender={(node) => (
					/* slight height clamp when open; no effect when collapsed */
					<div style={{ maxHeight: "80vh", overflow: "auto" }}>{node}</div>
				)}
			>
				<Banner />
				<MainSteps />
				<SegmentSteps />
				<FallbackAlerts />
				<YoutubeBlock />
				<ErrorBlock />
				{isTerminal && (
					<>
						<Divider />
						<Row justify='center' style={{ marginTop: 12 }}>
							<Col>
								<Text type='secondary'>
									You may safely close this window or start another generation.
								</Text>
							</Col>
						</Row>
					</>
				)}
			</Modal>

			{/* ---------- floating restore button when minimised ---------- */}
			{open && minimised && (
				<FloatButton
					icon={<PlayCircleOutlined />}
					type='primary'
					tooltip='Show generation progress'
					onClick={() => setMinimised(false)}
				/>
			)}
		</>
	);
}
