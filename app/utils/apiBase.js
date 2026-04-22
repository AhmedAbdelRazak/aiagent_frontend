// app/utils/apiBase.js
function normalizeLoopbackHost(rawUrl) {
  try {
    const url = new URL(rawUrl);
    // Keep loopback addressing consistent in local dev. Browsers can treat
    // `localhost` and `127.0.0.1` differently depending on resolution order.
    if (url.hostname === "localhost") url.hostname = "127.0.0.1";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return String(rawUrl || "")
      .trim()
      .replace(/\/+$/, "");
  }
}

export function getApiBase() {
  const raw = String(process.env.NEXT_PUBLIC_API_URL || "").trim();
  if (!raw) return "";
  const normalized = normalizeLoopbackHost(raw);
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

export function getSocketBase() {
  const apiBase = getApiBase();
  if (!apiBase) return "";
  return apiBase.replace(/\/api$/, "");
}
