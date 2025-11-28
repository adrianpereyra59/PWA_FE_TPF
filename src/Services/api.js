// Cliente API simple para tu backend (prefija /api)
const BASE = (import.meta.env.VITE_API_URL || "https://pw-be-be.vercel.app").replace(/\/$/, "");

let _AUTH_TOKEN = null;
export function setToken(token) {
  _AUTH_TOKEN = token;
  try {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  } catch (e) {}
}

function buildUrl(path) {
  if (!path) path = "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.startsWith("/api")) return `${BASE}${path}`;
  return `${BASE}/api${path}`;
}

async function request(path, { method = "GET", body = null, raw = false } = {}) {
  const token = _AUTH_TOKEN || (typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null);
  const headers = {};
  if (body !== null && !raw) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = buildUrl(path);
  const init = { method, headers, body: body !== null && !raw ? JSON.stringify(body) : body };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  init.signal = controller.signal;

  let res;
  try {
    res = await fetch(url, init);
  } catch (err) {
    clearTimeout(timeout);
    throw new Error("Network error or request timed out");
  }
  clearTimeout(timeout);

  const text = await res.text().catch(() => "");
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    const message = (data && (data.message || data.msg)) || res.statusText || `HTTP ${res.status}`;
    const err = new Error(message);
    err.response = data;
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function get(path) { return request(path, { method: "GET" }); }
export async function post(path, body, opts = {}) { return request(path, { method: "POST", body: body ?? null, raw: !!opts.raw }); }
export async function put(path, body) { return request(path, { method: "PUT", body: body ?? null }); }
export async function del(path) { return request(path, { method: "DELETE" }); }

export { BASE };
export default { request, get, post, put, del, setToken, BASE };