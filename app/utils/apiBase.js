// app/utils/apiBase.js
export function getApiBase() {
	const raw = String(process.env.NEXT_PUBLIC_API_URL || "").trim();
	if (!raw) return "";
	const trimmed = raw.replace(/\/+$/, "");
	return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export function getSocketBase() {
	const apiBase = getApiBase();
	if (!apiBase) return "";
	return apiBase.replace(/\/api$/, "");
}
