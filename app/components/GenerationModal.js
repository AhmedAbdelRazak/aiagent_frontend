// components/GenerationModal.jsx
import { useEffect, useRef, useState } from "react";
import { Modal, Steps, Typography, Progress, Row, Col, Alert, Tag } from "antd";
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
} from "@ant-design/icons";

const { Step } = Steps;
const { Text, Paragraph, Link } = Typography;

/* ────────────────────────────────────────────
 * Backend phases in exact order
 * ──────────────────────────────────────────── */
const PHASE_DEFS = [
	{ key: "INIT", title: "Initializing Job", icon: <RocketOutlined /> },
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
	{
		key: "SYNCING_VOICE_MUSIC",
		title: "Syncing Audio",
		icon: <SyncOutlined />,
	},
	{
		key: "VIDEO_UPLOADED",
		title: "Uploaded to YouTube",
		icon: <UploadOutlined />,
	},
	{ key: "VIDEO_SCHEDULED", title: "Scheduled", icon: <CalendarOutlined /> }, // *optional*
	{ key: "COMPLETED", title: "Completed", icon: <SmileOutlined /> },
	{ key: "ERROR", title: "Failed", icon: <ExclamationCircleOutlined /> }, // terminal
];

/* quick helper */
const phaseIndex = (p) => PHASE_DEFS.findIndex(({ key }) => key === p);

export default function GenerationModal({ open, phase, extra = {}, onClose }) {
	/* ──────────────────────────────────────────
	 * Track the *last* main‑phase (ignore FALLBACK)
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
	 * Clip‑generation loop progress
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
	 * Collection of FALLBACK notices
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
	 *   Main stepper renderer
	 * ────────────────────────────────────────── */
	const renderMainSteps = () => (
		<Steps direction='vertical' current={currentIdx}>
			{PHASE_DEFS.map(({ key, title, icon }, idx) => {
				/* optional schedule logic */
				const isScheduleStep = key === "VIDEO_SCHEDULED";
				const scheduleSkipped =
					isScheduleStep && currentMainPhase === "COMPLETED" && !scheduleSeen;

				let status = "wait";
				if (scheduleSkipped)
					status = "finish"; // mark as completed‑skipped
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

				/* dynamic subtitle */
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
	 *   Segment mini‑stepper
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
						<Text strong>Clip progress</Text>
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
	 *   Fallback alerts
	 * ────────────────────────────────────────── */
	const renderFallbackAlerts = () =>
		fallbacks.length > 0 && (
			<>
				<Row style={{ marginTop: 24 }}>
					<Col span={24}>
						<Text strong>Fallbacks &amp; Auto‑recovery</Text>
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
	 *   Final YouTube link
	 * ────────────────────────────────────────── */
	const renderYoutubeLink = () =>
		currentMainPhase === "COMPLETED" &&
		extra.youtubeLink && (
			<div style={{ marginTop: 32, textAlign: "center" }}>
				<Paragraph>
					<YoutubeOutlined
						style={{ fontSize: 32, color: "#FF0000", marginRight: 8 }}
					/>
					<Text strong style={{ fontSize: 18 }}>
						Watch on YouTube
					</Text>
				</Paragraph>
				<Paragraph copyable={{ text: extra.youtubeLink }}>
					<Link
						href={extra.youtubeLink}
						target='_blank'
						rel='noopener noreferrer'
					>
						{extra.youtubeLink}
					</Link>
				</Paragraph>
			</div>
		);

	/* ──────────────────────────────────────────
	 *   Fatal error state
	 * ────────────────────────────────────────── */
	const renderErrorMessage = () =>
		currentMainPhase === "ERROR" && (
			<Alert
				style={{ marginTop: 24 }}
				showIcon
				type='error'
				message='Something went wrong.'
				description={
					<>
						Please refresh the page and try again. If the issue persists,&nbsp;
						<Link href='/contact'>contact support</Link>.
					</>
				}
			/>
		);

	/* ──────────────────────────────────────────
	 *   Render modal
	 * ────────────────────────────────────────── */
	return (
		<Modal
			title='Video Generation Progress (≈ 5‑7 minutes)'
			open={open}
			footer={null}
			onCancel={onClose}
			width={700}
			destroyOnClose
			maskClosable={false}
		>
			{renderMainSteps()}
			{renderSegmentStepper()}
			{renderFallbackAlerts()}
			{renderYoutubeLink()}
			{renderErrorMessage()}
		</Modal>
	);
}
