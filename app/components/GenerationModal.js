// components/GenerationModal.jsx
import React from "react";
import { Modal, Steps, Typography } from "antd";
import {
	LoadingOutlined,
	CheckCircleOutlined,
	RocketOutlined,
	MergeCellsOutlined,
	AudioOutlined,
	SyncOutlined,
	UploadOutlined,
	CalendarOutlined,
	SmileOutlined,
	YoutubeOutlined, // ← import the YouTube icon
} from "@ant-design/icons";

const { Step } = Steps;
const { Text, Paragraph, Link } = Typography;

/**
 * Ordered phases and icons
 */
const PHASES = [
	{ key: "INIT", title: "Initializing", icon: <RocketOutlined /> },
	{
		key: "GENERATING_CLIPS",
		title: "Generating Clips",
		icon: <MergeCellsOutlined />,
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

export default function GenerationModal({ open, phase, extra, onClose }) {
	const currentIndex = PHASES.findIndex((p) => p.key === phase);

	return (
		<Modal
			title='Video Generation Progress (~ 5 Minute Wait...)'
			open={open}
			footer={null}
			onCancel={onClose}
			width={600}
			destroyOnHidden
		>
			<Steps
				direction='vertical'
				current={currentIndex}
				labelPlacement='vertical'
			>
				{PHASES.map((step, i) => {
					let status = "wait";
					if (i < currentIndex) status = "finish";
					else if (i === currentIndex)
						status = phase === "COMPLETED" ? "finish" : "process";

					const icon =
						status === "finish" ? (
							<CheckCircleOutlined style={{ color: "#52c41a" }} />
						) : status === "process" ? (
							<LoadingOutlined />
						) : (
							step.icon
						);

					return (
						<Step
							key={step.key}
							title={step.title}
							icon={icon}
							status={status}
							description={
								i === currentIndex && extra.msg ? (
									<Text type='secondary'>{extra.msg}</Text>
								) : null
							}
						/>
					);
				})}
			</Steps>

			{phase === "COMPLETED" && extra.youtubeLink && (
				<div style={{ marginTop: 24, textAlign: "center" }}>
					<Paragraph>
						<YoutubeOutlined
							style={{
								fontSize: 32,
								color: "#FF0000",
								verticalAlign: "middle",
								marginRight: 8,
							}}
						/>
						<Text strong style={{ fontSize: 16 }}>
							Watch on YouTube
						</Text>
					</Paragraph>
					<Paragraph>
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
