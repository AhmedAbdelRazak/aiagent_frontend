// components/GenerationModal.jsx
import { useEffect, useRef, useState, useMemo } from "react";
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
	MinusCircleOutlined,
	PlayCircleOutlined,
} from "@ant-design/icons";

const { Step } = Steps;
const { Text, Paragraph, Link } = Typography;

/* ────────────────────────────────────────────
 * Backend phases (keep SAME order as backend)
 * ──────────────────────────────────────────── */
const PHASE_DEFS = [
	{ key: "INIT", title: "Starting Up", icon: <RocketOutlined /> },
	{
		key: "GENERATING_CLIPS",
		title: "Generating Clips",
		icon: <VideoCameraOutlined />,
	},
	{
		key: "ASSEMBLING_VIDEO",
		title: "Assembling Video",
		icon: <MergeCellsOutlined />,
	},
	{
		key: "ADDING_VOICE_MUSIC",
		title: "Adding Voice & Music",
		icon: <AudioOutlined />,
	},
	{ key: "SYNCING_VOICE_MUSIC", title: "Final Sync", icon: <SyncOutlined /> },
	{
		key: "VIDEO_UPLOADED",
		title: "Uploaded to YouTube",
		icon: <UploadOutlined />,
	},
	{ key: "VIDEO_SCHEDULED", title: "Scheduled", icon: <CalendarOutlined /> }, // optional
	{ key: "COMPLETED", title: "Completed", icon: <SmileOutlined /> },
	{ key: "ERROR", title: "Failed", icon: <ExclamationCircleOutlined /> }, // terminal
];

/* Helper */
const phaseIndex = (p) => PHASE_DEFS.findIndex(({ key }) => key === p);

/* Friendly, plain‑English status banner texts */
const STATUS_TEXT = {
	INIT: "Warming up the engines…",
	GENERATING_CLIPS: "Creating your video scenes",
	ASSEMBLING_VIDEO: "Stitching scenes together",
	ADDING_VOICE_MUSIC: "Recording voice‑over & mixing music",
	SYNCING_VOICE_MUSIC: "Syncing audio with visuals",
	VIDEO_UPLOADED: "Upload finished!",
	VIDEO_SCHEDULED: "Video scheduled for publishing",
	COMPLETED: "All done – enjoy your new video 🎬",
	ERROR: "Something went wrong 😕",
};

export default function GenerationModal({ open, phase, extra = {}, onClose }) {
	/* ──────────────────────────────────────────
	 * Remember the last *main* phase (ignore FALLBACK)
	 * ────────────────────────────────────────── */
	const lastMainPhaseRef = useRef("INIT");
	useEffect(() => {
		if (phaseIndex(phase) !== -1 && phase !== "FALLBACK") {
			lastMainPhaseRef.current = phase;
		}
	}, [phase]);
	const currentMainPhase = lastMainPhaseRef.current;
	const currentIdx = phaseIndex(currentMainPhase);

	/* ──────────────────────────────────────────
	 * Segment progress (from GENERATING_CLIPS)
	 * ────────────────────────────────────────── */
	const [segDone, segTotal] = (() => {
		if (typeof extra.done === "number" && typeof extra.total === "number") {
			return [extra.done, extra.total];
		}
		if (extra.msg) {
			const m = /segment\s+(\d+)\s*\/\s*(\d+)/i.exec(extra.msg);
			if (m) return [Number(m[1]), Number(m[2])];
		}
		return [null, null];
	})();

	/* ──────────────────────────────────────────
	 * Store FALLBACK notifications
	 * ────────────────────────────────────────── */
	const [fallbacks, setFallbacks] = useState([]);
	useEffect(() => {
		if (phase === "FALLBACK" && extra?.segment) {
			setFallbacks((prev) => [
				...prev,
				{ segment: extra.segment, type: extra.type, reason: extra.reason },
			]);
		}
		if (!open) setFallbacks([]);
	}, [phase, extra, open]);

	/* ──────────────────────────────────────────
	 * Track whether VIDEO_SCHEDULED ever arrived
	 * ────────────────────────────────────────── */
	const [scheduleSeen, setScheduleSeen] = useState(false);
	useEffect(() => {
		if (phase === "VIDEO_SCHEDULED") setScheduleSeen(true);
		if (!open) setScheduleSeen(false);
	}, [phase, open]);

	/* ──────────────────────────────────────────
	 * Banner at top: plain English status
	 * ────────────────────────────────────────── */
	const renderStatusBanner = () => {
		const text = STATUS_TEXT[currentMainPhase] || "Working…";
		const Icon =
			currentMainPhase === "ERROR"
				? ExclamationCircleOutlined
				: currentMainPhase === "COMPLETED"
					? CheckCircleOutlined
					: PlayCircleOutlined;
		return (
			<Space
				style={{
					width: "100%",
					padding: "8px 0 20px 0",
					justifyContent: "center",
				}}
			>
				<Icon
					style={{
						fontSize: 18,
						color:
							currentMainPhase === "ERROR"
								? "#ff4d4f"
								: currentMainPhase === "COMPLETED"
									? "#52c41a"
									: "#1890ff",
					}}
				/>
				<Text strong>{text}</Text>
			</Space>
		);
	};

	/* ──────────────────────────────────────────
	 * Primary stepper (vertical)
	 * ────────────────────────────────────────── */
	const renderMainSteps = () => (
		<Steps direction='vertical' current={currentIdx}>
			{PHASE_DEFS.map(({ key, title, icon }, idx) => {
				const isScheduleStep = key === "VIDEO_SCHEDULED";
				const scheduleSkipped =
					isScheduleStep && currentMainPhase === "COMPLETED" && !scheduleSeen;

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

	/* ──────────────────────────────────────────
	 * Mini‑stepper for segment loop
	 * ────────────────────────────────────────── */
	const renderSegmentStepper = () => {
		if (!segTotal || !segDone) return null;

		const items = Array.from({ length: segTotal }, (_, i) => {
			const n = i + 1;
			const st = n < segDone ? "finish" : n === segDone ? "process" : "wait";
			const ic =
				st === "finish" ? (
					<CheckCircleOutlined style={{ color: "#1890ff" }} />
				) : st === "process" ? (
					<LoadingOutlined />
				) : (
					<VideoCameraOutlined />
				);
			return <Step key={n} title={`#${n}`} status={st} icon={ic} />;
		});

		return (
			<>
				<Row style={{ marginTop: 24 }}>
					<Col span={24}>
						<Text strong>Clip progress</Text>
					</Col>
				</Row>
				<Steps
					size='small'
					current={segDone - 1}
					progressDot
					responsive={false}
				>
					{items}
				</Steps>
				<Progress
					style={{ marginTop: 8 }}
					percent={Math.round((segDone / segTotal) * 100)}
					size='small'
				/>
			</>
		);
	};

	/* ──────────────────────────────────────────
	 * Fallback alerts
	 * ────────────────────────────────────────── */
	const renderFallbackAlerts = () =>
		fallbacks.length > 0 && (
			<>
				<Row style={{ marginTop: 24 }}>
					<Col span={24}>
						<Text strong>Auto‑recovery events</Text>
					</Col>
				</Row>
				{fallbacks.map(({ segment, type, reason }, i) => (
					<Alert
						key={i}
						type='warning'
						showIcon
						message={
							<>
								<Tag color='orange'>Segment {segment}</Tag>
								{reason || `Fallback (${type})`}
							</>
						}
						style={{ marginTop: 8 }}
					/>
				))}
			</>
		);

	/* ──────────────────────────────────────────
	 * YouTube link display
	 * ────────────────────────────────────────── */
	const youtubeLink =
		extra.youtubeLink ||
		(currentMainPhase === "COMPLETED" &&
			extra?.phases?.find?.((p) => p.extra?.youtubeLink)?.extra?.youtubeLink); // guard if link came earlier

	const renderYoutubeLink = () =>
		youtubeLink && (
			<div style={{ marginTop: 32, textAlign: "center" }}>
				<Paragraph>
					<YoutubeOutlined style={{ fontSize: 32, color: "#FF0000" }} />
				</Paragraph>
				<Paragraph>
					<Text strong style={{ fontSize: 18 }}>
						Your video is live on YouTube
					</Text>
				</Paragraph>
				<Paragraph copyable={{ text: youtubeLink }}>
					<Link href={youtubeLink} target='_blank' rel='noopener noreferrer'>
						{youtubeLink}
					</Link>
				</Paragraph>
			</div>
		);

	/* ──────────────────────────────────────────
	 * Error state message
	 * ────────────────────────────────────────── */
	const renderErrorMessage = () =>
		currentMainPhase === "ERROR" && (
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
		);

	/* ──────────────────────────────────────────
	 * Modal props
	 * ────────────────────────────────────────── */
	const isTerminal =
		currentMainPhase === "COMPLETED" || currentMainPhase === "ERROR";

	return (
		<Modal
			title='Video Generation Progress (≈ 5‑7 min)'
			open={open}
			footer={null}
			onCancel={isTerminal ? onClose : undefined}
			closable={isTerminal}
			width={720}
			destroyOnClose
			maskClosable={false}
		>
			{renderStatusBanner()}
			{renderMainSteps()}
			{renderSegmentStepper()}
			{renderFallbackAlerts()}
			{renderYoutubeLink()}
			{renderErrorMessage()}
			{isTerminal && <Divider />}
			{isTerminal && (
				<Row justify='center' style={{ marginTop: 12 }}>
					<Col>
						<Text type='secondary'>
							You may safely close this window or start another generation.
						</Text>
					</Col>
				</Row>
			)}
		</Modal>
	);
}
