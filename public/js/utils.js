const API_BASE = "https://defensa-uwu-3.onrender.com/api";

export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = localStorage.getItem("mievento_token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || `Error ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) =>
    apiRequest(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) =>
    apiRequest(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => apiRequest(path, { method: "DELETE" }),
};

export const auth = {
  getToken: () => localStorage.getItem("mievento_token"),
  setToken: (t) => localStorage.setItem("mievento_token", t),
  clear: () => localStorage.removeItem("mievento_token"),

  async login(email, password) {
    const { token, user } = await api.post("/auth/login", { email, password });
    this.setToken(token);
    return user;
  },

  async register(name, email, password) {
    const { token, user } = await api.post("/auth/register", { name, email, password });
    this.setToken(token);
    return user;
  },

  async me() {
    const { user } = await api.get("/auth/me");
    return user;
  },

  logout() {
    this.clear();
    window.location.reload();
  },
};

export function toast(message, variant = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const el = document.createElement("div");
  el.className = `toast ${variant}`;
  el.innerHTML = `
    <span>${variant === "success" ? "✓" : variant === "error" ? "✕" : "ℹ"}</span>
    <span>${message}</span>
  `;
  container.appendChild(el);

  setTimeout(() => {
    el.classList.add("fade-out");
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

export function showSplash() {
  document.getElementById("splash")?.classList.remove("hidden");
}

export function hideSplash() {
  document.getElementById("splash")?.classList.add("hidden");
}

let currentRoute = null;

export function navigate(route) {
  currentRoute = route;
  window.dispatchEvent(new CustomEvent("route-change", { detail: route }));
}

export function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (v !== null && v !== undefined) {
      el.setAttribute(k, v);
    }
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return el;
}

export function qs(sel, root = document) {
  return root.querySelector(sel);
}

export function clear(el) {
  if (el) el.innerHTML = "";
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

export function formatTime(timeStr) {
  return timeStr;
}

export function openModal(title, content, footer) {
  const overlay = h("div", { class: "modal-overlay" }, [
    h("div", { class: "modal" }, [
      h("div", { class: "modal-header" }, [
        h("h3", {}, title),
        h("button", {
          class: "modal-close",
          onclick: () => overlay.remove(),
        }, "✕"),
      ]),
      h("div", { class: "modal-body" }, content),
      footer ? h("div", { class: "modal-footer" }, footer) : null,
    ]),
  ]);
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
  return overlay;
}
