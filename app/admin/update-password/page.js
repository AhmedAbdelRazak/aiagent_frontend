/* app/admin/update-password/page.js – “Profile” page */
"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import {
	Form,
	Input,
	Button,
	Select,
	Typography,
	Spin,
	message,
	Modal,
	Upload,
} from "antd";
import {
	UserOutlined,
	MailOutlined,
	SaveOutlined,
	LockOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import SeoHead from "@/components/SeoHead";
import axios from "@/utils/api";

const { Title, Paragraph } = Typography;
const { Option } = Select;

/* ───────────────────────────────────────────────────────────── */
const Wrapper = styled.section`
	max-width: 540px;
	margin: 3rem auto;
	background: ${({ theme }) => theme.colors.cardBg};
	padding: 2rem;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

/* ───────────────────────────────────────────────────────────── */
/* helper: file → base64 */
const fileToBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
	});

/* ───────────────────────────────────────────────────────────── */
export default function ProfilePage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [user, setUser] = useState(null);
	const [fileList, setFileList] = useState([]);
	const [imageInfo, setImageInfo] = useState(null); // { public_id, url } | null
	const [form] = Form.useForm();

	/* fetch profile */
	const loadProfile = async () => {
		try {
			const { data } = await axios.get("/users/me");
			setUser(data.data);
			form.setFieldsValue(data.data);

			/* pre‑populate existing avatar */
			if (data.data.profileImage?.url) {
				const { public_id, url } = data.data.profileImage;
				setImageInfo({ public_id, url });
				setFileList([
					{
						uid: public_id,
						name: "profile.jpg",
						status: "done",
						url,
						public_id,
					},
				]);
			}
		} catch (e) {
			message.error("Could not load profile.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ───────────────────────────────────────── image upload */
	const beforeUpload = (file) => {
		if (file.size / 1024 / 1024 > 5) {
			message.error("Image must be smaller than 5 MB.");
			return Upload.LIST_IGNORE;
		}
		return true;
	};

	const handleCustomRequest = async ({ file, onSuccess, onError }) => {
		try {
			/* if an old image exists, remove it first */
			if (imageInfo?.public_id) {
				await axios.post("/removeimage", { public_id: imageInfo.public_id });
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
			setImageInfo({ public_id: data.public_id, url: data.url });
			onSuccess(data, file);
		} catch (err) {
			console.error(err);
			message.error("Upload failed");
			onError(err);
		}
	};

	const handleRemove = async (file) => {
		try {
			await axios.post("/removeimage", { public_id: file.public_id });
			setFileList([]);
			setImageInfo(null);
		} catch (err) {
			message.error("Could not remove image");
		}
	};

	/* ───────────────────────────────────────── submit handler */
	const onFinish = async (values) => {
		try {
			setSaving(true);

			/* only send changed scalar fields */
			const changed = {};
			for (const key of Object.keys(values)) {
				if (values[key] !== user[key]) changed[key] = values[key];
			}

			/* include avatar if it changed (add / replace / remove) */
			const sameImage =
				JSON.stringify(imageInfo) === JSON.stringify(user.profileImage);
			if (!sameImage) changed.profileImage = imageInfo || {};

			if (Object.keys(changed).length === 0) {
				message.info("Nothing to update.");
				return;
			}

			const { data } = await axios.put("/users/me", changed);
			message.success("Profile updated.");
			setUser(data.data);
		} catch (e) {
			message.error(e?.response?.data?.error || "Update failed");
		} finally {
			setSaving(false);
		}
	};

	/* password modal */
	const [showPw, setShowPw] = useState(false);
	const [pwEmail, setPwEmail] = useState("");
	const sendReset = async () => {
		try {
			await axios.post("/auth/forgot-password", { email: pwEmail });
			message.success("Reset link sent to your e‑mail.");
			setShowPw(false);
		} catch (e) {
			message.error(e?.response?.data?.error || "Failed to send reset.");
		}
	};

	return (
		<>
			<SeoHead title='Update Profile' />
			<Title level={2} style={{ textAlign: "center" }}>
				Update Profile
			</Title>

			{loading ? (
				<div style={{ textAlign: "center", marginTop: 64 }}>
					<Spin size='large' />
				</div>
			) : (
				<Wrapper>
					{/* ─────────── Avatar upload ─────────── */}
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

					<Form
						form={form}
						layout='vertical'
						onFinish={onFinish}
						initialValues={user}
					>
						<Form.Item
							label='Name'
							name='name'
							rules={[{ required: true, message: "Name is required" }]}
						>
							<Input prefix={<UserOutlined />} />
						</Form.Item>

						<Form.Item
							label='Email'
							name='email'
							rules={[
								{ required: true, message: "Email is required" },
								{ type: "email", message: "Invalid email" },
							]}
						>
							<Input prefix={<MailOutlined />} />
						</Form.Item>

						<Form.Item label='Connected Platforms' name='platforms'>
							<Select mode='multiple' allowClear placeholder='Select platforms'>
								<Option value='youtube'>YouTube</Option>
								<Option value='facebook'>Facebook</Option>
								<Option value='instagram'>Instagram</Option>
								<Option value='runwayml'>RunwayML</Option>
							</Select>
						</Form.Item>

						<Form.Item>
							<Button
								type='primary'
								htmlType='submit'
								icon={<SaveOutlined />}
								loading={saving}
								block
							>
								Save Changes
							</Button>
						</Form.Item>
					</Form>

					<Paragraph type='secondary' style={{ marginTop: 32 }}>
						Need to change your password?
					</Paragraph>
					<Button
						icon={<LockOutlined />}
						onClick={() => {
							form
								.validateFields(["email"])
								.then(() => {
									setPwEmail(form.getFieldValue("email"));
									setShowPw(true);
								})
								.catch(() => {});
						}}
					>
						Send password‑reset link
					</Button>
				</Wrapper>
			)}

			{/* Password reset modal */}
			<Modal
				open={showPw}
				title='Send password‑reset e‑mail?'
				onOk={sendReset}
				onCancel={() => setShowPw(false)}
				okText='Send'
				okButtonProps={{ icon: <LockOutlined /> }}
			>
				<p>
					We will send a one‑hour password reset link to <b>{pwEmail}</b>.
					Continue?
				</p>
			</Modal>
		</>
	);
}
