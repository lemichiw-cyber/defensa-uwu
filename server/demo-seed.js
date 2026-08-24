// Genera datos de demostración atractivos: 6 eventos futuros con imágenes,
// invitados confirmados, tareas y recordatorios para el primer evento.
// Uso: npm run demo:seed
import { db } from "./db.js";

const dias = (n) => {
  const d = new Date(Date.now() + n * 86400000);
  return d.toISOString().slice(0, 10);
};

const eventos = [
  { t: "Concierto Sinfónico bajo las Estrellas", d: "Noche clásica al aire libre con orquesta en vivo.", f: dias(7),
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=640" },
  { t: "Expo Tecnología e Innovación 2026", d: "Startups, IA y demos en vivo de productos emergentes.", f: dias(14),
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640" },
  { t: "Festival Gastronómico Internacional", d: "Cocina de autor, food trucks y catas para paladares exigentes.", f: dias(21),
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640" },
  { t: "Maratón Ciudad 10K", d: "Carrera popular con ruta escénica y medalla para todos.", f: dias(30),
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640" },
  { t: "Gala de Cine Independiente", d: "Alfombra roja, proyecciones exclusivas y meet & greet.", f: dias(45),
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=640" },
  { t: "Retiro de Bienestar y Mindfulness", d: "Dos días de yoga, meditación y naturaleza.", f: dias(60),
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640" }
];

console.log("🎬 Generando datos demo…");
db.exec("BEGIN");
try {
  db.prepare("DELETE FROM reminders").run();
  db.prepare("DELETE FROM tasks").run();
  db.prepare("DELETE FROM guests").run();
  db.prepare("DELETE FROM events").run();

  const ins = db.prepare(
    `INSERT INTO events (user_id, title, description, date, time, location, image_url, status)
     VALUES ((SELECT id FROM users WHERE email='maria@mievento.com'),?,?,?,?,?,?,'proximo')`
  );

  for (const [i, ev] of eventos.entries()) {
    const hora = i % 2 === 0 ? "7:00 PM" : "11:00 AM";
    const lugar = ["Auditorio Nacional", "Centro de Convenciones", "Parque Central",
      "Estadio Olímpico", "Cine Plaza Mayor", "Resort Valle Verde"][i];
    const info = ins.run(ev.t, ev.d, ev.f, hora, lugar, ev.img);
    if (i === 0) {
      const idEv = Number(info.lastInsertRowid);
      const g = db.prepare("INSERT INTO guests (event_id,name,email,rsvp) VALUES (?,?,?,?)");
      g.run(idEv, "Laura Méndez", "laura@example.com", "confirmado");
      g.run(idEv, "Diego Torres", "diego@example.com", "pendiente");
      g.run(idEv, "Sofía Ruiz", "sofia@example.com", "confirmado");
      const tk = db.prepare("INSERT INTO tasks (event_id,title,done,due_date) VALUES (?,?,?,?)");
      tk.run(idEv, "Confirmar catering", 1, dias(5));
      tk.run(idEv, "Imprimir gafas", 0, dias(6));
      db.prepare("INSERT INTO reminders (event_id,message,remind_at) VALUES (?,?,datetime('now','+2 days'))")
        .run(idEv, "Enviar recordatorio a invitados");
    }
  }

  db.exec("COMMIT");
  console.log(`✨ ${eventos.length} eventos demo creados con fechas futuras.`);
} catch (e) {
  db.exec("ROLLBACK");
  console.error(e);
  process.exit(1);
}
