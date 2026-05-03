/* app/admin/long-video/page.js */
"use client";

import { useEffect, useRef, useState } from "react";
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
  Divider,
  Space,
  Tag,
  Collapse,
} from "antd";
import dayjs from "dayjs";
import SeoHead from "@/components/SeoHead";
import { getApiBase } from "@/utils/apiBase";
import { getToken } from "@/utils/auth";
import {
  VideoCameraAddOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  BulbOutlined,
  GlobalOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const LONG_VIDEO_ENDPOINT = "long-video";

const DURATION_OPTIONS = [20, 45, 60, 90, 120, 180, 240, 300, 360];
const JOB_ID_STORAGE_KEY = "longVideoJobId";
const MAX_TRANSIENT_POLL_ERRORS = 6;

const PROGRESS_STAGES = [
  { min: 1, label: "Queued and initializing" },
  { min: 12, label: "Presenter + context prep" },
  { min: 18, label: "Script + SEO plan" },
  { min: 40, label: "Audio timing + visual plan" },
  { min: 50, label: "Rendering segments" },
  { min: 72, label: "Concatenating segments" },
  { min: 84, label: "Finalizing visuals" },
  { min: 92, label: "Mixing music" },
  { min: 96, label: "Final export" },
];

export default function AdminLongVideoPage() {
  const [form] = Form.useForm();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [jobId, setJobId] = useState(null);

  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [topic, setTopic] = useState("");
  const [finalUrl, setFinalUrl] = useState("");
  const [error, setError] = useState("");
  const [connectionNotice, setConnectionNotice] = useState("");
  const [meta, setMeta] = useState({});
  const [schedEnabled, setSchedEnabled] = useState(false);

  const pollRef = useRef(null);
  const pollErrorCountRef = useRef(0);
  const restoredJobRef = useRef(false);

  const clearSavedJobId = () => {
    try {
      localStorage.removeItem(JOB_ID_STORAGE_KEY);
    } catch {}
  };

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    setPolling(false);
  };

  const deriveProgressFromMeta = (nextStatus, nextMeta) => {
    const statusLabel = String(nextStatus || "").toLowerCase();
    if (statusLabel === "completed") return 100;
    if (statusLabel === "queued") return 1;
    if (!nextMeta) return 0;
    if (nextMeta.finalVideoUrl) return 100;
    if (nextMeta.timeline) return 40;
    if (nextMeta.script?.segments?.length) return 18;
    if (nextMeta.title) return 18;
    if (Array.isArray(nextMeta.topics) && nextMeta.topics.length) return 8;
    return 0;
  };

  const normalizeProgress = (nextStatus, nextPct, nextFinalUrl) => {
    const parsed = Number.parseFloat(nextPct);
    const base = Number.isFinite(parsed) ? parsed : 0;
    if (nextFinalUrl) return 100;
    const statusLabel = String(nextStatus || "").toLowerCase();
    if (statusLabel === "completed") return 100;
    return Math.max(0, Math.min(100, base));
  };

  const resolveStepLabel = (
    nextStatus,
    nextProgress,
    nextMeta,
    nextFinalUrl,
  ) => {
    const statusLabel = String(nextStatus || "").toLowerCase();
    if (nextFinalUrl || statusLabel === "completed") return "Completed";
    if (statusLabel === "failed") return "Failed";
    if (statusLabel === "queued") return "Queued";

    const pct = Number.isFinite(Number(nextProgress))
      ? Number(nextProgress)
      : 0;
    let label = "Running";
    for (const stage of PROGRESS_STAGES) {
      if (pct >= stage.min) label = stage.label;
    }

    if (nextMeta?.visualPlan) {
      const presenterCount = Array.isArray(
        nextMeta.visualPlan.presenterSegments,
      )
        ? nextMeta.visualPlan.presenterSegments.length
        : 0;
      const imageCount = Array.isArray(nextMeta.visualPlan.imageSegments)
        ? nextMeta.visualPlan.imageSegments.length
        : 0;
      if (presenterCount || imageCount) {
        return `${label} (Presenter ${presenterCount} / Images ${imageCount})`;
      }
    }

    return label;
  };

  useEffect(() => {
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (restoredJobRef.current) return;
    restoredJobRef.current = true;
    const storedJobId = localStorage.getItem(JOB_ID_STORAGE_KEY);
    if (storedJobId) {
      setJobId(storedJobId);
      startPolling(storedJobId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPolling = (id) => {
    stopPolling();
    pollErrorCountRef.current = 0;
    const apiBase = getApiBase();

    if (!apiBase) {
      const msg = "Backend API base is not configured.";
      setError(msg);
      messageApi.error(msg);
      return;
    }

    const pollOnce = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("No auth token, please log in again.");

        const res = await fetch(`${apiBase}/${LONG_VIDEO_ENDPOINT}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch job status.");
        const data = await res.json();
        pollErrorCountRef.current = 0;
        setConnectionNotice("");

        const rawPct =
          data.progressPct ??
          data.progress ??
          data.meta?.progressPct ??
          data.meta?.progress;
        const fallbackPct = deriveProgressFromMeta(data.status, data.meta);
        const parsedPct = Number.parseFloat(rawPct);
        const hasParsed = Number.isFinite(parsedPct);
        const useFallback = !hasParsed || (parsedPct <= 0 && fallbackPct > 0);
        const nextProgress = normalizeProgress(
          data.status,
          useFallback ? fallbackPct : parsedPct,
          data.finalVideoUrl,
        );
        const nextStep = resolveStepLabel(
          data.status,
          nextProgress,
          data.meta,
          data.finalVideoUrl,
        );
        setStatus(data.status);
        setProgress(nextProgress);
        setTopic(data.topic || "");
        setFinalUrl(data.finalVideoUrl || "");
        setError(data.error || "");
        setMeta({ ...(data.meta || {}), currentStep: nextStep });

        if (data.status === "completed" || data.status === "failed") {
          clearSavedJobId();
          stopPolling();
        }
      } catch (err) {
        const isNetworkError =
          err?.message === "Failed to fetch" ||
          /network|fetch/i.test(String(err?.message || ""));
        const msg = isNetworkError
          ? "Could not reach the backend API."
          : err?.message || "Polling failed";
        pollErrorCountRef.current += 1;

        if (pollErrorCountRef.current < MAX_TRANSIENT_POLL_ERRORS) {
          setError("");
          setConnectionNotice("Reconnecting to backend...");
          setMeta((prev) => ({
            ...(prev || {}),
            currentStep: "Waiting for backend reconnect",
          }));
          return;
        }

        stopPolling();
        setConnectionNotice("");
        setError(msg);
        messageApi.error(msg);
      }
    };

    setPolling(true);
    pollRef.current = setInterval(pollOnce, 20000);
    pollOnce();
  };

  const statusTag = () => {
    if (!status || status === "idle") return <Tag>idle</Tag>;
    if (status === "queued") return <Tag color="blue">queued</Tag>;
    if (status === "running") return <Tag color="gold">running</Tag>;
    if (status === "completed") return <Tag color="green">completed</Tag>;
    if (status === "failed") return <Tag color="red">failed</Tag>;
    return <Tag>{status}</Tag>;
  };

  const onFinish = async (values) => {
    setLoading(true);
    setStatus(null);
    setProgress(0);
    setFinalUrl("");
    setError("");
    setConnectionNotice("");
    setJobId(null);
    setTopic("");
    setMeta({});

    try {
      const token = getToken();
      if (!token) throw new Error("No auth token, please log in again.");
      const apiBase = getApiBase();
      if (!apiBase) throw new Error("Backend API base is not configured.");

      const payload = {
        preferredTopicHint: values.titlePrompt?.trim() || "",
        category: values.category || "Entertainment",
        language: values.language || "en",
        targetDurationSec: Number(values.duration),
      };
      if (values.voiceoverUrl?.trim())
        payload.voiceoverUrl = values.voiceoverUrl.trim();

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

      const res = await fetch(`${apiBase}/${LONG_VIDEO_ENDPOINT}`, {
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
      localStorage.setItem(JOB_ID_STORAGE_KEY, data.jobId);
      startPolling(data.jobId);

      messageApi.success("Real-studio long video job queued.");
    } catch (err) {
      const msg =
        err?.message === "Failed to fetch"
          ? "Could not reach the backend API."
          : err?.message || "Failed to start long video job.";
      setError(msg);
      messageApi.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const scriptSegments = Array.isArray(meta?.script?.segments)
    ? meta.script.segments
    : [];
  const displayProgress = normalizeProgress(status, progress, finalUrl);
  const stepLabel = resolveStepLabel(status, displayProgress, meta, finalUrl);

  return (
    <>
      {messageContextHolder}
      <SeoHead title="Admin | Long Video" />

      <Title level={3} style={{ marginBottom: 12 }}>
        Create Long Video
      </Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
        This page is currently pointed at the fixed real-presenter studio
        pipeline.
      </Text>

      <Card style={{ marginBottom: "1rem" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            category: "Entertainment",
            language: "en",
            duration: 60,
            startDate: dayjs(),
            scheduleType: "daily",
            time: dayjs().hour(14).minute(0),
          }}
        >
          <Divider orientation="left">Content</Divider>

          <Form.Item
            name="titlePrompt"
            label={
              <span>
                <BulbOutlined style={{ marginRight: 6 }} />
                Topic Hint (optional)
              </span>
            }
            tooltip="If empty, the orchestrator will pick a trending topic."
          >
            <TextArea
              rows={2}
              placeholder="Example: Avatar: Fire and Ash - what's new, who's new, and why this sequel might be the turning point"
            />
          </Form.Item>

          <Form.Item
            name="category"
            label={
              <span>
                <AppstoreOutlined style={{ marginRight: 6 }} />
                Category
              </span>
            }
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category">
              <Select.Option value="Other">
                Most Trending (All Topics)
              </Select.Option>
              <Select.Option value="Sports">Sports</Select.Option>
              <Select.Option value="Politics">Politics</Select.Option>
              <Select.Option value="Finance">Finance</Select.Option>
              <Select.Option value="Entertainment">Entertainment</Select.Option>
              <Select.Option value="Technology">Technology</Select.Option>
              <Select.Option value="Health">Health</Select.Option>
              <Select.Option value="World">World</Select.Option>
              <Select.Option value="Lifestyle">Lifestyle</Select.Option>
              <Select.Option value="Science">Science</Select.Option>
              <Select.Option value="Gaming">Gaming</Select.Option>
              <Select.Option value="Business">Business</Select.Option>
              <Select.Option value="Travel">Travel</Select.Option>
              <Select.Option value="FoodDrink">Food & Drink</Select.Option>
              <Select.Option value="PetsAndAnimals">
                Pets and Animals
              </Select.Option>
              <Select.Option value="CelebrityNews">
                Celebrity News
              </Select.Option>
              <Select.Option value="Climate">Climate</Select.Option>
              <Select.Option value="SocialIssues">Social Issues</Select.Option>
              <Select.Option value="Education">Education</Select.Option>
              <Select.Option value="Fashion">Fashion</Select.Option>
              <Select.Option value="Top5">Top 5</Select.Option>
            </Select>
          </Form.Item>

          <Space size="large" wrap>
            <Form.Item
              name="duration"
              label={
                <span>
                  <ClockCircleOutlined style={{ marginRight: 6 }} />
                  Content Duration (seconds)
                </span>
              }
              tooltip="Intro/outro are added automatically by the backend."
              rules={[{ required: true, message: "Select duration" }]}
            >
              <Select style={{ width: 220 }}>
                {DURATION_OPTIONS.map((sec) => (
                  <Select.Option key={sec} value={sec}>
                    {sec} seconds
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="language"
              label={
                <span>
                  <GlobalOutlined style={{ marginRight: 6 }} />
                  Language
                </span>
              }
            >
              <Select style={{ width: 220 }}>
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="es">Spanish</Select.Option>
                <Select.Option value="fr">French</Select.Option>
                <Select.Option value="de">German</Select.Option>
                <Select.Option value="ar">Arabic</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Divider orientation="left">Voice</Divider>

          <Form.Item
            name="voiceoverUrl"
            label="Narration Audio URL (optional)"
            tooltip="If provided, the backend will use your own narration audio for the content segments instead of generating TTS."
          >
            <Input placeholder="https://.../my-long-video-narration.wav" />
          </Form.Item>

          <Divider orientation="left">Scheduling</Divider>

          <Form.Item
            label={
              <span>
                <CalendarOutlined style={{ marginRight: 6 }} />
                Schedule this long video?
              </span>
            }
            valuePropName="checked"
          >
            <Switch checked={schedEnabled} onChange={setSchedEnabled} />
          </Form.Item>

          {schedEnabled && (
            <>
              <Form.Item
                name="startDate"
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
                name="endDate"
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
                name="scheduleType"
                label={
                  <span>
                    <ClockCircleOutlined style={{ marginRight: 6 }} />
                    Frequency
                  </span>
                }
                rules={[{ required: true, message: "Select a frequency" }]}
              >
                <Select style={{ width: 200 }}>
                  <Select.Option value="daily">Daily</Select.Option>
                  <Select.Option value="weekly">Weekly</Select.Option>
                  <Select.Option value="monthly">Monthly</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="time"
                label={
                  <span>
                    <FieldTimeOutlined style={{ marginRight: 6 }} />
                    Time of Day
                  </span>
                }
                rules={[{ required: true, message: "Pick a time" }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </>
          )}

          <Button
            type="primary"
            icon={<VideoCameraAddOutlined />}
            htmlType="submit"
            loading={loading}
          >
            Generate Long Video
          </Button>
        </Form>
      </Card>

      <Card>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text strong>Status:</Text>{" "}
            <span>{statusTag()}</span>
            {jobId && (
              <Text type="secondary" style={{ marginLeft: 10 }}>
                jobId: {jobId}
              </Text>
            )}
          </div>

          <div>
            <Text strong>Progress:</Text>
            <Progress
              percent={displayProgress}
              status={
                status === "failed"
                  ? "exception"
                  : status === "completed"
                    ? "success"
                    : "active"
              }
            />
          </div>

          <div>
            <Text strong>Pipeline:</Text> {stepLabel}
          </div>

          {topic && (
            <div>
              <Text strong>Topic:</Text> {topic}
            </div>
          )}

          {meta?.title && (
            <div>
              <Text strong>Video Title:</Text> {meta.title}
            </div>
          )}

          {meta?.topicReason && (
            <div>
              <Text strong>Topic Reason:</Text> {meta.topicReason}
            </div>
          )}

          {meta?.topicAngle && (
            <div>
              <Text strong>Topic Angle:</Text> {meta.topicAngle}
            </div>
          )}

          {scriptSegments.length > 0 && (
            <Collapse>
              <Panel
                header={`Script (${scriptSegments.length} segments)`}
                key="script"
              >
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {scriptSegments
                    .map((s) => {
                      const start =
                        typeof s.startSec === "number"
                          ? s.startSec.toFixed(2)
                          : "?";
                      const end =
                        typeof s.endSec === "number"
                          ? s.endSec.toFixed(2)
                          : "?";
                      return `[${start}s - ${end}s] ${s.text || ""}`;
                    })
                    .join("\n\n")}
                </div>
              </Panel>
              <Panel header="Raw Meta (debug)" key="meta">
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {JSON.stringify(meta || {}, null, 2)}
                </pre>
              </Panel>
            </Collapse>
          )}

          {finalUrl && (
            <>
              <div>
                <Text strong>Final Video:</Text>{" "}
                <a href={finalUrl} target="_blank" rel="noreferrer">
                  Download MP4
                </a>
              </div>

              <video
                src={finalUrl}
                controls
                style={{ width: "100%", maxHeight: 520, borderRadius: 10 }}
              />
            </>
          )}

          {error && (
            <Text type="danger" style={{ whiteSpace: "pre-wrap" }}>
              Error: {error}
            </Text>
          )}

          {connectionNotice && !error && (
            <Text type="secondary">{connectionNotice}</Text>
          )}

          {polling && !finalUrl && !error && !connectionNotice && (
            <Text type="secondary">Job is running... polling every 20s.</Text>
          )}
        </Space>
      </Card>
    </>
  );
}
