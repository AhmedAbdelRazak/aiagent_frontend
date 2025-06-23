// components/GenerationModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { Modal, Steps, Typography, Progress, Row, Col, Alert, Tag } from "antd";
import {
	LoadingOutlined,
	CheckCircleOutlined,
	RocketOutlined,
	PictureOutlined,
	MergeCellsOutlined,
	VideoCameraOutlined,
	AudioOutlined,
	SyncOutlined,
	UploadOutlined,
	CalendarOutlined,
	SmileOutlined,
	YoutubeOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Step } = Steps;
const { Text, Paragraph, Link } = Typography;

/* ──────────────────────────────────────────────
 * 1.  Single source‑of‑truth for *main* backend phases
 *     (order MUST match backend createVideo.js)
 *     NOTE:  repeatable "FALLBACK" events are *not*
 *            part of the main flow – they are shown
 *            separately in a warning list.
 * ────────────────────────────────────────────── */
const PHASE_DEFS = [
	{ key: "INIT", title: "Initialising", icon: <RocketOutlined /> },
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
	{ key: "VIDEO_SCHEDULED", title: "Scheduled", icon: <CalendarOutlined /> },
	{ key: "COMPLETED", title: "Completed", icon: <SmileOutlined /> },
	{ key: "ERROR", title: "Failed", icon: <ExclamationCircleOutlined /> }, // terminal
];

/* quick lookup */
const phaseIndex = (phase) => PHASE_DEFS.findIndex(({ key }) => key === phase);

/* ──────────────────────────────────────────────
 *    React component
 * ────────────────────────────────────────────── */
export default function GenerationModal({ open, phase, extra = {}, onClose }) {
	/* -----------------------------------------------------------------
	 *  Keep track of last *main* phase so that temporary FALLBACK
	 *  events do not move the main stepper backwards/forwards.
	 * ---------------------------------------------------------------- */
	const lastMainPhaseRef = useRef("INIT");
	useEffect(() => {
		if (phaseIndex(phase) !== -1 && phase !== "FALLBACK") {
			lastMainPhaseRef.current = phase;
		}
	}, [phase]);

	const currentMainPhase = lastMainPhaseRef.current;
	const currentIdx = phaseIndex(currentMainPhase);

	/* -----------------------------------------------------------------
	 *  Segment‑level progress (clip generation loop)
	 * ---------------------------------------------------------------- */
	let segDone = null;
	let segTotal = null;

	if (typeof extra.done === "number" && typeof extra.total === "number") {
		segDone = extra.done;
		segTotal = extra.total;
	} else if (extra.msg) {
		const m = /segment\s+(\d+)\s*\/\s*(\d+)/i.exec(extra.msg);
		if (m) {
			segDone = Number(m[1]);
			segTotal = Number(m[2]);
		}
	}

	/* -----------------------------------------------------------------
	 *  Collect FALLBACK events so the user can see what happened.
	 * ---------------------------------------------------------------- */
	const [fallbacks, setFallbacks] = useState([]);
	useEffect(() => {
		if (phase === "FALLBACK" && extra) {
			setFallbacks((prev) => [
				...prev,
				{
					segment: extra.segment,
					type: extra.type,
					reason: extra.reason,
				},
			]);
		}
		// Reset list for a new modal session
		if (!open) setFallbacks([]);
	}, [phase, extra, open]);

	/* -----------------------------------------------------------------
	 * helpers to pick icon / status for each main step
	 * ---------------------------------------------------------------- */
	const renderMainSteps = () => (
		<Steps direction='vertical' current={currentIdx}>
			{PHASE_DEFS.map(({ key, title, icon }, idx) => {
				let status = "wait";
				if (idx < currentIdx) status = "finish";
				else if (idx === currentIdx)
					status =
						key === "COMPLETED"
							? "finish"
							: key === "ERROR"
								? "error"
								: "process";

				const shownIcon =
					status === "finish" ? (
						<CheckCircleOutlined style={{ color: "#52c41a" }} />
					) : status === "process" ? (
						<LoadingOutlined />
					) : status === "error" ? (
						<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
					) : (
						icon
					);

				return (
					<Step
						key={key}
						title={title}
						icon={shownIcon}
						status={status}
						description={
							idx === currentIdx && extra.msg ? (
								<Text type='secondary'>{extra.msg}</Text>
							) : null
						}
					/>
				);
			})}
		</Steps>
	);

	/* -----------------------------------------------------------------
	 * segment stepper (visible only during clip‑generation loop)
	 * ---------------------------------------------------------------- */
	const renderSegmentStepper = () => {
		if (!segTotal || !segDone) return null;

		const items = Array.from({ length: segTotal }, (_, i) => {
			const idx = i + 1;
			let status = "wait";
			if (idx < segDone) status = "finish";
			else if (idx === segDone) status = "process";

			return (
				<Step
					key={idx}
					title={`#${idx}`}
					status={status}
					icon={
						status === "finish" ? (
							<CheckCircleOutlined style={{ color: "#1890ff" }} />
						) : status === "process" ? (
							<LoadingOutlined />
						) : (
							<VideoCameraOutlined />
						)
					}
				/>
			);
		});

		return (
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

	/* -----------------------------------------------------------------
	 *  Fallback / degraded‑path notifications
	 * ---------------------------------------------------------------- */
	const renderFallbackAlerts = () =>
		fallbacks.length > 0 && (
			<>
				<Row style={{ marginTop: 24 }}>
					<Col span={24}>
						<Text strong>Fallbacks &amp; Auto‑recovery</Text>
					</Col>
				</Row>
				{fallbacks.map(({ segment, type, reason }, idx) => (
					<Alert
						key={idx}
						type='warning'
						showIcon
						message={
							<>
								<Tag color='orange'>Segment&nbsp;{segment}</Tag>
								{reason || `Trigger ${type}`}
							</>
						}
						style={{ marginTop: 8 }}
					/>
				))}
			</>
		);

	/* -----------------------------------------------------------------
	 *  final YouTube link
	 * ---------------------------------------------------------------- */
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

	/* -----------------------------------------------------------------
	 *  fatal failure helper
	 * ---------------------------------------------------------------- */
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
						<Link href='/contact'>click here to contact us</Link>.
					</>
				}
			/>
		);

	/* -----------------------------------------------------------------
	 *  render modal
	 * ---------------------------------------------------------------- */
	return (
		<Modal
			title='Video Generation Progress (This may take ~5 – 7 minutes)'
			open={open}
			footer={null}
			onCancel={onClose}
			width={680}
			destroyOnHidden
		>
			{renderMainSteps()}
			{renderSegmentStepper()}
			{renderFallbackAlerts()}
			{renderYoutubeLink()}
			{renderErrorMessage()}
		</Modal>
	);
}
