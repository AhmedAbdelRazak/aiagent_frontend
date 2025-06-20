// components/GenerationModal.jsx
import React from "react";
import { Modal, Steps, Typography, Progress, Row, Col } from "antd";
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
} from "@ant-design/icons";

const { Step } = Steps;
const { Text, Paragraph, Link } = Typography;

/* ──────────────────────────────────────────────
 * 1.  Single source‑of‑truth for backend phases
 *     (order MUST match createVideo.js)
 * ────────────────────────────────────────────── */
const PHASE_DEFS = [
	{ key: "INIT", title: "Initialising", icon: <RocketOutlined /> },
	{
		key: "USING_UPLOADED_IMAGE",
		title: "Applying Seed Image",
		icon: <PictureOutlined />,
	},
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
];

/* quick lookup */
const phaseIndex = (phase) => PHASE_DEFS.findIndex(({ key }) => key === phase);

/* ──────────────────────────────────────────────
 *    React component
 * ────────────────────────────────────────────── */
export default function GenerationModal({ open, phase, extra = {}, onClose }) {
	// high‑level phase position
	const currentIdx = phaseIndex(phase);

	/* ------------------------------------------------------------
	 * Segment‑level progress
	 *  – backend currently sends messages like:
	 *        "Rendering segment 3/6"
	 *  – OPTIONALLY you can also send   extra.done / extra.total
	 * ---------------------------------------------------------- */
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

	/* ------------------------------------------------------------
	 * helpers to pick icon / status for each main step
	 * ---------------------------------------------------------- */
	const renderMainSteps = () => (
		<Steps direction='vertical' current={currentIdx}>
			{PHASE_DEFS.map(({ key, title, icon }, idx) => {
				let status = "wait";
				if (idx < currentIdx) status = "finish";
				else if (idx === currentIdx)
					status = phase === "COMPLETED" ? "finish" : "process";

				const shownIcon =
					status === "finish" ? (
						<CheckCircleOutlined style={{ color: "#52c41a" }} />
					) : status === "process" ? (
						<LoadingOutlined />
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

	/* ------------------------------------------------------------
	 * segment stepper (visible only during clip‑generation loop)
	 * ---------------------------------------------------------- */
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

	/* ------------------------------------------------------------
	 * final YouTube link
	 * ---------------------------------------------------------- */
	const renderYoutubeLink = () =>
		phase === "COMPLETED" &&
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

	/* ------------------------------------------------------------
	 * render modal
	 * ---------------------------------------------------------- */
	return (
		<Modal
			title='Video Generation Progress (This may take ~5 to 7 minutes)'
			open={open}
			footer={null}
			onCancel={onClose}
			width={680}
			destroyOnClose
		>
			{renderMainSteps()}
			{renderSegmentStepper()}
			{renderYoutubeLink()}
		</Modal>
	);
}
