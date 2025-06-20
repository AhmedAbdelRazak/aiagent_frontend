// components/GenerationModal.jsx

import React from "react";
import { Modal, Steps, Typography, Progress } from "antd";
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

/*
 * 1.  Single‑source‑of‑truth for every backend phase
 *     ------------------------------------------------
 *     – Order here **must exactly match** the order the backend
 *       reports them in createVideo.js (sendPhase(...)).
 *     – If you ever add / rename a phase backend‑side, just
 *       update this table and the UI stays in sync.
 */
const PHASE_DEFS = [
	{ key: "INIT", title: "Initializing", icon: <RocketOutlined /> },
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
		title: "Syncing Voice & Music",
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

/*
 * 2.  Helper to convert phase → index   (‑1 if unknown)
 */
function phaseIndex(phase) {
	return PHASE_DEFS.findIndex(({ key }) => key === phase);
}

/*
 * 3.  The component
 */
export default function GenerationModal({ open, phase, extra = {}, onClose }) {
	const currentIdx = phaseIndex(phase);

	// Render -------------------------------------------------------------------
	return (
		<Modal
			title='Video Generation Progress (≈ 5‑6 min)'
			open={open}
			footer={null}
			onCancel={onClose}
			width={640}
			destroyOnClose
		>
			{/* Visual stepper ------------------------------------------------------ */}
			<Steps direction='vertical' current={currentIdx}>
				{PHASE_DEFS.map(({ key, title, icon }, idx) => {
					// work out status & icon for each row
					let status = "wait";
					if (idx < currentIdx) status = "finish";
					else if (idx === currentIdx)
						status = phase === "COMPLETED" ? "finish" : "process";

					const rowIcon =
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
							icon={rowIcon}
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

			{/* Optional progress bar from backend (extra.total / extra.done) ------- */}
			{typeof extra.total === "number" && typeof extra.done === "number" && (
				<div style={{ marginTop: 24 }}>
					<Progress
						percent={Math.min(
							100,
							Math.round((extra.done / extra.total) * 100)
						)}
						showInfo
					/>
				</div>
			)}

			{/* Final YouTube link -------------------------------------------------- */}
			{phase === "COMPLETED" && extra.youtubeLink && (
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
			)}
		</Modal>
	);
}
