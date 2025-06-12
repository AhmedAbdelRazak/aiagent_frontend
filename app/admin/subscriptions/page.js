/* app/admin/subscriptions/page.js */
"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import {
	List,
	Card,
	Tag,
	Button,
	Spin,
	Empty,
	Modal,
	Form,
	Select,
	TimePicker,
	Switch,
	message,
	Typography,
} from "antd";
import {
	ScheduleOutlined,
	DeleteOutlined,
	EditOutlined,
	DownOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import SeoHead from "@/components/SeoHead";
import axios from "@/utils/api";

const { Text, Title } = Typography;

/* ───────────────────────────────────────────────────────────── */
/*  Styled‑components                                           */
/* ───────────────────────────────────────────────────────────── */
const Wrapper = styled.div`
	padding-right: 4px; /* keeps scrollbar off the edge */
`;

const Thumb = styled.img`
	width: 160px;
	aspect-ratio: 16 / 9;
	object-fit: cover;
	border-radius: 4px;
`;

function youtubeId(link = "") {
	try {
		const u = new URL(link);
		if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
		if (u.hostname === "youtu.be") return u.pathname.slice(1);
	} catch {
		/* ignore */
	}
	return null;
}
const thumbUrl = (id) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

/* ───────────────────────────────────────────────────────────── */
/*  Main page component                                         */
/* ───────────────────────────────────────────────────────────── */
export default function SchedulesPage() {
	/* pagination */
	const [schedules, setSchedules] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [loading, setLoading] = useState(false);

	/* modal state */
	const [editing, setEditing] = useState(null); // current schedule obj
	const [form] = Form.useForm();

	/* fetch helper */
	const fetchPage = async (p = 1) => {
		try {
			setLoading(true);
			const { data } = await axios.get(`/schedules?page=${p}&limit=20`);
			if (!data.success) throw new Error("Fetch failed");
			setSchedules((prev) => (p === 1 ? data.data : [...prev, ...data.data]));
			setPage(data.page);
			setPages(data.pages);
		} catch (e) {
			console.error(e);
			message.error("Could not load schedules.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPage(1);
	}, []);

	/* open edit modal */
	const openEdit = (sch) => {
		setEditing(sch);
		form.setFieldsValue({
			scheduleType: sch.scheduleType,
			timeOfDay: dayjs(sch.timeOfDay, "HH:mm"),
			active: sch.active,
		});
	};

	/* handle update submit */
	const onUpdate = async () => {
		try {
			const values = await form.validateFields();
			await axios.put(`/schedules/${editing._id}`, {
				scheduleType: values.scheduleType,
				timeOfDay: values.timeOfDay.format("HH:mm"),
				active: values.active,
			});
			message.success("Schedule updated");
			// refresh current list item locally
			setSchedules((prev) =>
				prev.map((s) =>
					s._id === editing._id
						? {
								...s,
								scheduleType: values.scheduleType,
								timeOfDay: values.timeOfDay.format("HH:mm"),
								active: values.active,
							}
						: s
				)
			);
			setEditing(null);
		} catch (e) {
			console.error(e);
			if (e?.errorFields) return; // form validation error
			message.error("Update failed");
		}
	};

	/* deletion */
	const confirmDelete = (sch) => {
		Modal.confirm({
			title: "Delete this schedule?",
			icon: <ExclamationCircleOutlined />,
			content: "This action is irreversible.",
			okText: "Delete",
			okType: "danger",
			onOk: async () => {
				try {
					await axios.delete(`/schedules/${sch._id}`);
					message.success("Schedule deleted");
					setSchedules((prev) => prev.filter((s) => s._id !== sch._id));
				} catch {
					message.error("Delete failed");
				}
			},
		});
	};

	/* render */
	return (
		<>
			<SeoHead title='Schedules / Subscriptions' />
			<Title level={2}>Schedules / Subscriptions</Title>

			{loading && schedules.length === 0 ? (
				<Spin size='large' />
			) : schedules.length === 0 ? (
				<Empty description='No schedules.' />
			) : (
				<Wrapper>
					<List
						dataSource={schedules}
						itemLayout='horizontal'
						renderItem={(item) => {
							const vidId = youtubeId(item.video?.youtubeLink || "");
							return (
								<List.Item
									key={item._id}
									style={{
										padding: "12px 8px",
										borderBottom: "1px solid rgba(0,0,0,0.05)",
									}}
								>
									<Card
										bordered={false}
										bodyStyle={{ padding: 0, width: "100%" }}
										style={{ width: "100%" }}
									>
										<div
											style={{
												display: "flex",
												flexWrap: "wrap",
												gap: 16,
											}}
										>
											{/* Thumbnail */}
											{vidId && (
												<Thumb
													src={thumbUrl(vidId)}
													alt={item.video?.seoTitle}
												/>
											)}

											{/* Info */}
											<div style={{ flex: 1, minWidth: 240 }}>
												<Text strong>{item.video?.seoTitle}</Text>
												<br />
												<Tag color='blue' icon={<ScheduleOutlined />}>
													{item.scheduleType.toUpperCase()}
												</Tag>
												<Tag>{item.timeOfDay}</Tag>
												{item.active ? (
													<Tag color='green'>Active</Tag>
												) : (
													<Tag color='red'>Paused</Tag>
												)}
												<br />
												<Text type='secondary' style={{ fontSize: 12 }}>
													Next run&nbsp;
													{dayjs(item.nextRun).format("YYYY‑MM‑DD HH:mm")}
												</Text>
											</div>

											{/* Actions */}
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													gap: 8,
													marginLeft: "auto",
												}}
											>
												<Button
													icon={<EditOutlined />}
													onClick={() => openEdit(item)}
												>
													Edit
												</Button>
												<Button
													danger
													icon={<DeleteOutlined />}
													onClick={() => confirmDelete(item)}
												>
													Delete
												</Button>
											</div>
										</div>
									</Card>
								</List.Item>
							);
						}}
					/>

					{/* Load more */}
					{page < pages && (
						<div style={{ textAlign: "center", padding: "1rem 0" }}>
							<Button
								type='primary'
								icon={<DownOutlined />}
								loading={loading}
								onClick={() => fetchPage(page + 1)}
							>
								Load more
							</Button>
						</div>
					)}
				</Wrapper>
			)}

			{/* Edit modal */}
			<Modal
				title='Edit Schedule'
				open={!!editing}
				onCancel={() => setEditing(null)}
				onOk={onUpdate}
				okText='Save'
			>
				<Form
					form={form}
					layout='vertical'
					initialValues={{
						scheduleType: "daily",
						timeOfDay: dayjs("14:00", "HH:mm"),
						active: true,
					}}
				>
					<Form.Item
						name='scheduleType'
						label='Frequency'
						rules={[{ required: true }]}
					>
						<Select>
							<Select.Option value='daily'>Daily</Select.Option>
							<Select.Option value='weekly'>Weekly</Select.Option>
							<Select.Option value='monthly'>Monthly</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name='timeOfDay'
						label='Time of day'
						rules={[{ required: true }]}
					>
						<TimePicker format='HH:mm' />
					</Form.Item>
					<Form.Item name='active' label='Active' valuePropName='checked'>
						<Switch />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
