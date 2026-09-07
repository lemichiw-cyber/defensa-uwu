// ============================================================
// MiEvento Frontend — Main Application (ES Module)
// Deploy: GitHub Pages
// API: Railway (backend with AES-256-GCM encryption)
// ============================================================

import { auth, api, toast, showSplash, hideSplash, navigate, h, qs, clear, formatDate, formatTime, openModal } from "/js/utils.js";

// ── State ──────────────────────────────────────────────────
const state = {
  user: null,
  view: "landing",
  events: [],
  stats: { events: 0, guests: 0, reminders: 0 },
};

// ── Initialize ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", init);

async function init() {
  showSplash();

  if (auth.getToken()) {
    try {
      state.user = await auth.me();
      state.view = "dashboard";
    } catch {
      auth.clear();
      state.view = "landing";
    }
  }

  window.addEventListener("route-change", (e) => {
    state.view = e.detail;
    render();
  });

  render();
  hideSplash();
}

// ── Render ─────────────────────────────────────────────────
function render() {
  const root = qs("#app");
  clear(root);

  if (state.view === "landing") {
    root.appendChild(renderLanding());
  } else if (state.view === "login" || state.view === "register") {
    root.appendChild(renderAuth());
  } else if (state.view === "dashboard") {
    root.appendChild(renderDashboard());
  }
}

// ── Landing Page ───────────────────────────────────────────
function renderLanding() {
  const hero = h("section", { class: "hero" }, [
    h("div", { class: "hero-bg" }),
    h("div", { class: "hero-content" }, [
      h("span", { class: "hero-badge" }, "Welcome To Eduset"),
      h("h1", {}, "¡Que onda peblada!"),
      h("p", {}, "Plataforma educativa institucional para gestionar actividades académicas, exámenes, foros y más. Todo en un solo lugar."),
      h("div", { class: "hero-buttons" }, [
        h("button", { class: "btn btn-primary", onclick: () => navigate("dashboard") }, "Comenzar Ahora"),
        h("a", { class: "btn btn-outline", href: "#portfolio" }, "Ver Portafolio"),
      ]),
    ]),
  ]);

  const servicesSection = h("section", { class: "section", id: "services" }, [
    h("h2", { class: "section-title" }, "Services"),
    h("p", { class: "section-subtitle" }, "Todo lo que necesitas para tu vida académica"),
    h("div", { class: "services-grid" }, [
      h("div", { class: "service-card" }, [
        h("div", { class: "service-icon" }, "🎓"),
        h("h3", {}, "Para estudiantes"),
        h("p", {}, "Gestiona tus tareas, exámenes y calificaciones."),
      ]),
      h("div", { class: "service-card" }, [
        h("div", { class: "service-icon" }, "⚙️"),
        h("h3", {}, "Servicios"),
        h("p", {}, "Plataforma integral con foros, mensajería y clases en línea."),
      ]),
      h("div", { class: "service-card" }, [
        h("div", { class: "service-icon" }, "🎨"),
        h("h3", {}, "Diseño"),
        h("p", {}, "Interfaz moderna y responsiva."),
      ]),
    ]),
  ]);

  const statsBand = h("div", { class: "stats-band" }, [
    statItem("15+", "Módulos Activos"),
    statItem("100%", "Funcional"),
    statItem("24/7", "Disponibilidad"),
    statItem("∞", "Posibilidades"),
  ]);

  const portfolioSection = h("section", { class: "section", id: "portfolio" }, [
    h("h2", { class: "section-title" }, "Portfolio"),
    h("p", { class: "section-subtitle" }, "Explora los módulos de la plataforma"),
    h("div", { class: "portfolio-grid" }, [
      portfolioCard("Actividades", "Gestión", "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80"),
      portfolioCard("Exámenes", "Evaluaciones", "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80"),
      portfolioCard("Foros", "Comunidad", "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"),
      portfolioCard("Agenda", "Organización", "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80"),
      portfolioCard("Clases Online", "Videoconferencias", "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80"),
      portfolioCard("Visor Imagen", "Visualización", "https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&w=800&q=80"),
    ]),
  ]);

  const ctaSection = h("section", { class: "cta-section" }, [
    h("h2", {}, "¿Listo para comenzar?"),
    h("p", {}, "Accede ahora a la plataforma educativa."),
    h("button", { class: "btn btn-primary", onclick: () => navigate("dashboard") }, "Ir a la Plataforma"),
  ]);

  const footer = h("footer", { class: "footer" }, [
    h("div", { class: "footer-grid" }, [
      h("div", {}, [
        h("h4", {}, "Plataforma Educativa"),
        h("p", {}, "Plataforma educativa institucional diseñada para mejorar la experiencia de aprendizaje."),
      ]),
      h("div", {}, [
        h("h4", {}, "Acceso"),
        h("a", { href: "#", onclick: (e) => { e.preventDefault(); navigate("dashboard"); } }, "Acceder al Sistema →"),
      ]),
      h("div", {}, [
        h("h4", {}, "Contacto"),
        h("p", {}, "📧 contacto@plataforma.edu"),
        h("p", {}, "📞 +500 6767 8989"),
        h("p", {}, "📍 Instituto Nacional, Ciudad Obrera de Apopa"),
      ]),
    ]),
    h("div", { class: "footer-bottom" }, "© 2026 Plataforma Educativa. Todos los derechos reservados."),
  ]);

  const container = h("div", {});
  [hero, servicesSection, statsBand, portfolioSection, ctaSection, footer].forEach(el => container.appendChild(el));
  return container;
}

function statItem(value, label) {
  return h("div", { class: "stat-item" }, [
    h("div", { class: "value" }, value),
    h("div", { class: "label" }, label),
  ]);
}

function portfolioCard(title, subtitle, imgUrl) {
  return h("div", { class: "portfolio-card", onclick: () => navigate("dashboard") }, [
    h("img", { src: imgUrl, alt: title, loading: "lazy" }),
    h("div", { class: "portfolio-overlay" }, [
      h("h3", {}, title),
      h("span", {}, subtitle),
      h("button", { class: "btn btn-sm btn-primary" }, "Acceder"),
    ]),
  ]);
}

// ── Auth Page ──────────────────────────────────────────────
function renderAuth() {
  let mode = "login";

  const switchTab = (newMode) => {
    mode = newMode;
    nameGroup.classList.toggle("hidden", mode !== "register");
    submitBtn.textContent = mode === "login" ? "Iniciar sesión" : "Crear cuenta";
    tabLogin.classList.toggle("active", mode === "login");
    tabRegister.classList.toggle("active", mode === "register");
    errorMsg.classList.add("hidden");
  };

  const nameGroup = h("div", { class: "form-group hidden" }, [
    h("label", { class: "form-label" }, "Nombre completo"),
    h("input", { class: "form-input", id: "auth-name", placeholder: "Tu nombre", autocomplete: "name" }),
  ]);

  const tabLogin = h("button", { class: "auth-tab active", onclick: () => switchTab("login") }, "Entrar");
  const tabRegister = h("button", { class: "auth-tab", onclick: () => switchTab("register") }, "Registrarse");
  const errorMsg = h("div", { class: "form-error hidden", id: "auth-error" });

  const submitBtn = h("button", { class: "btn btn-primary btn-full btn-lg", type: "submit" }, "Iniciar sesión");

  const form = h("form", {
    onsubmit: async (e) => {
      e.preventDefault();
      const email = qs("#auth-email").value;
      const password = qs("#auth-password").value;

      try {
        if (mode === "login") {
          state.user = await auth.login(email, password);
        } else {
          const name = qs("#auth-name").value;
          state.user = await auth.register(name, email, password);
        }
        toast(mode === "login" ? "Bienvenido!" : "Cuenta creada!", "success");
        navigate("dashboard");
      } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove("hidden");
      }
    },
  }, [
    nameGroup,
    h("div", { class: "form-group" }, [
      h("label", { class: "form-label" }, "Correo electrónico"),
      h("input", { class: "form-input", id: "auth-email", type: "email", placeholder: "tu@ejemplo.com", autocomplete: "email", required: "true" }),
    ]),
    h("div", { class: "form-group" }, [
      h("label", { class: "form-label" }, "Contraseña"),
      h("input", { class: "form-input", id: "auth-password", type: "password", placeholder: "••••••••", autocomplete: mode === "login" ? "current-password" : "new-password", required: "true" }),
    ]),
    errorMsg,
    submitBtn,
  ]);

  const fillDemo = () => {
    qs("#auth-email").value = "maria@mievento.com";
    qs("#auth-password").value = "demo1234";
  };

  return h("div", { class: "auth-page" }, [
    h("div", { class: "auth-card" }, [
      h("div", { class: "auth-left" }, [
        h("div", {}, [
          h("div", { class: "logo" }, "M"),
          h("h2", {}, "Bienvenido a la Plataforma"),
          h("p", {}, "Gestiona actividades, exámenes, foros y clases en línea."),
          h("ul", { class: "features" }, [
            h("li", {}, "Actividades y agenda"),
            h("li", {}, "Foro estudiantil"),
            h("li", {}, "Videollamadas en vivo"),
            h("li", {}, "Panel para administradores"),
          ]),
        ]),
        h("p", { class: "text-sm opacity-70" }, "Plataforma Educativa"),
      ]),
      h("div", { class: "auth-right" }, [
        h("h1", {}, "MiEvento"),
        h("p", { class: "subtitle" }, mode === "login" ? "Accede a tu panel" : "Crea tu cuenta"),
        h("div", { class: "auth-tabs" }, [tabLogin, tabRegister]),
        form,
        h("div", { class: "text-center mt-4" }, [
          h("button", { class: "text-sm text-blue-600 font-semibold hover:underline", onclick: fillDemo }, "Usar cuenta demo"),
          h("p", { class: "text-xs text-gray-500 mt-2" }, [
            "Admin: maria@mievento.com / demo1234 · ",
            h("br", {}, null),
            "Usuario: carlos@mievento.com / demo1234",
          ]),
        ]),
      ]),
    ]),
  ]);
}

// ── Dashboard ──────────────────────────────────────────────
function renderDashboard() {
  const header = renderHeader();
  const layout = h("div", { class: "layout" }, [
    renderSidebar(),
    h("main", { class: "main-content" }, [
      h("h1", { class: "page-title" }, `Hola, ${state.user?.name || "Usuario"} 👋`),
      h("p", { class: "page-subtitle" }, "Gestiona tus eventos y actividades desde aquí."),
      h("div", { class: "stats-grid" }, [
        statCard("📅", state.stats.events, "Eventos", "blue"),
        statCard("👥", state.stats.guests, "Invitados", "green"),
        statCard("⏰", state.stats.reminders, "Recordatorios", "orange"),
      ]),
      h("div", { class: "mb-6" }, [
        h("div", { class: "flex justify-between items-center mb-4" }, [
          h("h2", { class: "text-lg font-bold" }, "Próximos eventos"),
          h("button", { class: "btn btn-primary", onclick: () => openNewEventModal() }, "+ Nuevo Evento"),
        ]),
        h("div", { class: "events-list", id: "events-list" }),
      ]),
    ]),
  ]);

  const container = h("div", {});
  container.appendChild(header);
  container.appendChild(layout);

  loadEvents();

  return container;
}

function renderHeader() {
  return h("header", { class: "header" }, [
    h("div", { class: "header-brand" }, [
      h("div", { class: "logo" }, "M"),
      "MiEvento",
    ]),
    h("nav", { class: "header-nav" }, [
      h("a", { class: "active", href: "#" }, "Dashboard"),
      h("a", { href: "#" }, "Eventos"),
      h("a", { href: "#" }, "Calendario"),
    ]),
    h("div", { class: "header-actions" }, [
      h("span", { class: "text-sm text-gray-600" }, state.user?.name || ""),
      h("button", { class: "btn btn-sm btn-outline", onclick: () => { auth.logout(); navigate("landing"); } }, "Cerrar sesión"),
    ]),
  ]);
}

function renderSidebar() {
  return h("aside", { class: "sidebar" }, [
    h("div", { class: "sidebar-section" }, "Navegación"),
    sidebarItem("inicio", "🏠", "Inicio", true),
    sidebarItem("eventos", "📅", "Eventos"),
    sidebarItem("invitados", "👥", "Invitados"),
    sidebarItem("tareas", "✅", "Tareas"),
    sidebarItem("recordatorios", "⏰", "Recordatorios"),
    h("div", { class: "sidebar-section" }, "Administración"),
    sidebarItem("usuarios", "👤", "Usuarios"),
    sidebarItem("configuracion", "⚙️", "Configuración"),
    h("div", { class: "sidebar-footer" }, [
      h("button", { class: "btn btn-sm btn-ghost w-full", onclick: () => { auth.logout(); navigate("landing"); } }, "🚪 Cerrar sesión"),
    ]),
  ]);
}

function sidebarItem(id, icon, label, active = false) {
  return h("div", { class: `sidebar-item ${active ? "active" : ""}` }, [
    h("span", { class: "icon" }, icon),
    h("span", { class: "sidebar-label" }, label),
  ]);
}

function statCard(icon, value, label, color) {
  return h("div", { class: "stat-card" }, [
    h("div", { class: `stat-icon ${color}` }, icon),
    h("div", { class: "stat-info" }, [
      h("div", { class: "stat-value" }, value ?? 0),
      h("div", { class: "stat-label" }, label),
    ]),
  ]);
}

// ── Events CRUD ────────────────────────────────────────────
async function loadEvents() {
  try {
    const [{ events }, statsRes] = await Promise.all([
      api.get("/events?status=proximo"),
      api.get("/stats"),
    ]);
    state.events = events;
    state.stats = statsRes;
    renderEventsList(events);
  } catch (err) {
    toast("Error al cargar eventos", "error");
  }
}

function renderEventsList(events) {
  const list = qs("#events-list");
  clear(list);

  if (events.length === 0) {
    list.appendChild(h("div", { class: "card text-center p-8 text-gray-500" }, "No hay eventos próximos. ¡Crea uno!"));
    return;
  }

  events.forEach((ev) => {
    list.appendChild(h("div", { class: "event-card" }, [
      h("img", { class: "event-image", src: ev.image || "", alt: ev.title, onerror: "this.style.display='none'" }),
      h("div", { class: "event-info" }, [
        h("div", { class: "event-title" }, ev.title),
        h("div", { class: "event-meta" }, [
          h("span", {}, `📅 ${formatDate(ev.date)}`),
          h("span", {}, `🕐 ${formatTime(ev.time)}`),
          h("span", {}, `📍 ${ev.location}`),
          h("span", { class: `badge badge-${ev.status}` }, ev.status),
        ]),
      ]),
      h("div", { class: "event-actions" }, [
        h("button", { class: "btn btn-sm btn-outline", onclick: () => openEditEventModal(ev) }, "Editar"),
        h("button", { class: "btn btn-sm btn-danger", onclick: () => deleteEvent(ev.id) }, "Eliminar"),
      ]),
    ]));
  });
}

function openNewEventModal() {
  const form = h("form", {
    onsubmit: async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {
        title: fd.get("title"),
        description: fd.get("description"),
        date: fd.get("date"),
        time: fd.get("time"),
        location: fd.get("location"),
        image_url: fd.get("image_url"),
        status: "proximo",
      };
      try {
        await api.post("/events", data);
        toast("Evento creado correctamente", "success");
        e.target.closest(".modal-overlay").remove();
        loadEvents();
      } catch (err) {
        toast(err.message, "error");
      }
    },
  }, [
    formGroup("Título", h("input", { class: "form-input", name: "title", required: "true" })),
    formGroup("Descripción", h("textarea", { class: "form-textarea", name: "description" })),
    h("div", { class: "grid grid-2 gap-3" }, [
      formGroup("Fecha", h("input", { class: "form-input", name: "date", type: "date", required: "true" })),
      formGroup("Hora", h("input", { class: "form-input", name: "time", type: "time", required: "true" })),
    ]),
    formGroup("Ubicación", h("input", { class: "form-input", name: "location", required: "true" })),
    formGroup("URL de imagen", h("input", { class: "form-input", name: "image_url", type: "url" })),
  ]);

  openModal("Nuevo Evento", form, [
    h("button", { class: "btn btn-outline", type: "button", onclick: () => qs(".modal-overlay").remove() }, "Cancelar"),
    h("button", { class: "btn btn-primary", type: "submit" }, "Crear Evento"),
  ]);
}

function openEditEventModal(ev) {
  const form = h("form", {
    onsubmit: async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {
        title: fd.get("title"),
        description: fd.get("description"),
        date: fd.get("date"),
        time: fd.get("time"),
        location: fd.get("location"),
        image_url: fd.get("image_url"),
      };
      try {
        await api.patch(`/events/${ev.id}`, data);
        toast("Evento actualizado correctamente", "success");
        e.target.closest(".modal-overlay").remove();
        loadEvents();
      } catch (err) {
        toast(err.message, "error");
      }
    },
  }, [
    formGroup("Título", h("input", { class: "form-input", name: "title", value: ev.title, required: "true" })),
    formGroup("Descripción", h("textarea", { class: "form-textarea", name: "description" }, ev.description || "")),
    h("div", { class: "grid grid-2 gap-3" }, [
      formGroup("Fecha", h("input", { class: "form-input", name: "date", type: "date", value: ev.date, required: "true" })),
      formGroup("Hora", h("input", { class: "form-input", name: "time", type: "time", value: ev.time, required: "true" })),
    ]),
    formGroup("Ubicación", h("input", { class: "form-input", name: "location", value: ev.location, required: "true" })),
    formGroup("URL de imagen", h("input", { class: "form-input", name: "image_url", type: "url", value: ev.image || "" })),
  ]);

  openModal("Editar Evento", form, [
    h("button", { class: "btn btn-outline", type: "button", onclick: () => qs(".modal-overlay").remove() }, "Cancelar"),
    h("button", { class: "btn btn-primary", type: "submit" }, "Guardar Cambios"),
  ]);
}

async function deleteEvent(id) {
  if (!confirm("¿Eliminar este evento?")) return;
  try {
    await api.delete(`/events/${id}`);
    toast("Evento eliminado correctamente", "success");
    loadEvents();
  } catch (err) {
    toast(err.message, "error");
  }
}

function formGroup(label, input) {
  return h("div", { class: "form-group" }, [
    h("label", { class: "form-label" }, label),
    input,
  ]);
}
