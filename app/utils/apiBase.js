// app/utils/apiBase.js
function trimTrailingSlashes(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "");
}

function isLoopbackHost(hostname) {
  const host = String(hostname || "")
    .replace(/^\[|\]$/g, "")
    .toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "0.0.0.0"
  );
}

function getBrowserOrigin() {
  if (typeof window === "undefined") return "";
  try {
    return trimTrailingSlashes(window.location?.origin || "");
  } catch {
    return "";
  }
}

function buildApiBase(origin) {
  const normalizedOrigin = trimTrailingSlashes(origin);
  return normalizedOrigin ? `${normalizedOrigin}/api` : "";
}

function normalizeLoopbackHost(rawUrl) {
  try {
    const url = new URL(rawUrl);
    // Keep loopback addressing consistent in local dev. Browsers can treat
    // `localhost` and `127.0.0.1` differently depending on resolution order.
    if (url.hostname === "localhost") url.hostname = "127.0.0.1";
    return trimTrailingSlashes(url.toString());
  } catch {
    return trimTrailingSlashes(rawUrl);
  }
}

function shouldPreferSameOriginApi(rawUrl) {
  const browserOrigin = getBrowserOrigin();
  if (!browserOrigin) return false;
  try {
    const browserUrl = new URL(browserOrigin);
    const apiUrl = new URL(rawUrl);
    return isLoopbackHost(apiUrl.hostname) && !isLoopbackHost(browserUrl.hostname);
  } catch {
    return false;
  }
}

export function getApiBase() {
  const raw = trimTrailingSlashes(process.env.NEXT_PUBLIC_API_URL || "");
  if (raw) {
    const normalized = normalizeLoopbackHost(raw);
    const apiBase = normalized.endsWith("/api")
      ? normalized
      : `${normalized}/api`;
    if (shouldPreferSameOriginApi(apiBase)) {
      return buildApiBase(getBrowserOrigin());
    }
    return apiBase;
  }

  return buildApiBase(getBrowserOrigin());
}

export function getSocketBase() {
  const apiBase = getApiBase();
  if (!apiBase) return getBrowserOrigin();
  return apiBase.replace(/\/api$/, "");
}
