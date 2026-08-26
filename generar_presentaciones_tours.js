const pptxgen = require("pptxgenjs");

const BG = "0A0A0F";
const CARD = "16161F";
const PURPLE = "6C5CE7";
const PURPLE2 = "A78BFA";
const GREEN = "00D2A0";
const WHITE = "FFFFFF";
const GRAY = "9A9AB0";

function newPres() {
  const p = new pptxgen();
  p.layout = "LAYOUT_16x9";
  p.defineLayout({ name: "AXELIA", width: 10, height: 5.625 });
  return p;
}

function baseSlide(pres, title, subtitle) {
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addText("AxelIA", { x: 0.5, y: 0.35, w: 2.5, h: 0.5, fontSize: 18, bold: true, color: PURPLE2 });
  s.addText(title, { x: 0.5, y: 0.95, w: 9, h: 0.9, fontSize: 30, bold: true, color: WHITE });
  if (subtitle) s.addText(subtitle, { x: 0.5, y: 1.85, w: 9, h: 0.5, fontSize: 14, color: GRAY });
  return s;
}

function portada(pres) {
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addText("AxelIA", { x: 0.8, y: 1.2, w: 8.4, h: 1.4, fontSize: 64, bold: true, color: PURPLE2, align: "center" });
  s.addText("Automatización con IA para tu Empresa de Tours", { x: 0.8, y: 2.6, w: 8.4, h: 1.1, fontSize: 26, bold: true, color: WHITE, align: "center" });
  s.addText("Responde 24/7 en 3 idiomas · Reserva · Cobra · Te encuentra en Google y TikTok", { x: 0.8, y: 3.8, w: 8.4, h: 0.6, fontSize: 14, color: GRAY, align: "center" });
}

function quienesSomos(pres) {
  const s = baseSlide(pres, "Quiénes somos", "Somos la prueba de que funciona");
  s.addText([
    { text: "AxelIA crea equipos de agentes de IA para negocios.", options: { fontSize: 20, color: WHITE, breakLine: true } },
    { text: "No vendemos un chatbot suelto: montamos agentes que trabajan 24/7.", options: { fontSize: 16, color: GRAY, breakLine: true } },
    { text: "Este mismo sistema opera nuestro negocio todos los días.", options: { fontSize: 16, color: GREEN } },
  ], { x: 0.7, y: 2.4, w: 8.6, h: 2.6, valign: "top" });
}

function problema(pres) {
  const s = baseSlide(pres, "El problema que hoy te cuesta dinero", "Cada punto es plata que se pierde");
  const problems = [
    "WhatsApp colapsado en temporada alta (diciembre–enero)",
    "A veces te ocupas y tardas en responder → se pierden reservas",
    "Problemas con los idiomas: brasileños y anglos no logran comunicarse",
    "Ocupación y cupos sin confirmar (no-shows)",
    "Cobros de anticipos manuales, uno por uno",
  ];
  s.addText(problems.map(p => ({ text: "✗  " + p, options: { fontSize: 15, color: WHITE, breakLine: true, paraSpaceAfter: 10 } })),
    { x: 0.7, y: 2.3, w: 8.6, h: 3.0, valign: "top" });
}

function solucionCore(pres) {
  const s = baseSlide(pres, "La solución: tu agente de WhatsApp", "Responde por ti, a cualquier hora");
  const items = [
    "Responde 24/7 en español, inglés y portugués",
    "Informa tours, precios, horarios y disponibilidad",
    "Reserva, cobra el anticipo (Nequi) y confirma",
    "Recordatorio el día anterior: menos no-shows",
  ];
  s.addText(items.map(i => ({ text: "•  " + i, options: { fontSize: 16, color: WHITE, breakLine: true, paraSpaceAfter: 12 } })),
    { x: 0.7, y: 2.4, w: 8.6, h: 3.0, valign: "top" });
}

function solucionCompleta(pres) {
  const s = baseSlide(pres, "Tu ecosistema de agentes", "3 módulos que trabajan juntos");
  const mods = [
    ["Módulo 1 · Atención & Ventas", "WhatsApp 24/7 trilingüe: informa, reserva y cobra", PURPLE],
    ["Módulo 2 · SEO + GEO", "Te encuentra en Google y en la IA cuando buscan tours", PURPLE2],
    ["Módulo 3 · Video & Redes", "Clips y reels de tus tours para TikTok/IG", GREEN],
  ];
  mods.forEach((a, i) => {
    const y = 2.25 + i * 0.85;
    s.addShape("roundRect", { x: 0.7, y: y, w: 8.6, h: 0.72, fill: { color: CARD }, line: { color: a[2], width: 1 }, rectRadius: 0.06 });
    s.addText(a[0], { x: 1.0, y: y + 0.1, w: 3.4, h: 0.5, fontSize: 14, bold: true, color: a[2] });
    s.addText(a[1], { x: 4.5, y: y + 0.1, w: 4.6, h: 0.52, fontSize: 12, color: WHITE });
  });
}

function seoQueEs(pres) {
  const s = baseSlide(pres, "Módulo 2 — SEO: que te encuentren", "Qué es y por qué importa");
  s.addText([
    { text: "SEO = aparecer en Google cuando te buscan.", options: { fontSize: 16, color: WHITE, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Hoy la mayoría busca «tours en San Andrés» en Google antes de escribir. Si no apareces, ese cliente nunca te escribe.", options: { fontSize: 16, color: GRAY, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Te posicionamos en español, inglés y portugués — y también en ChatGPT/Perplexity.", options: { fontSize: 16, color: GREEN } },
  ], { x: 0.7, y: 2.4, w: 8.6, h: 2.6, valign: "top" });
}

function videoRedes(pres) {
  const s = baseSlide(pres, "Módulo 3 — Video & Redes", "Para TikTok e Instagram");
  s.addText([
    { text: "Te producimos clips y reels de tus tours, listos para subir.", options: { fontSize: 16, color: WHITE, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Tú haces el live o subes el video con tu toque personal.", options: { fontSize: 16, color: GRAY, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Cada mensaje que llega, el agente lo convierte en reserva.", options: { fontSize: 16, color: GREEN } },
  ], { x: 0.7, y: 2.4, w: 8.6, h: 2.6, valign: "top" });
}

function flujo(pres) {
  const s = baseSlide(pres, "Cómo funciona", "De la búsqueda a la reserva, sin que dejes de atender");
  const flow = [
    "Turista busca «tours San Andrés» o ve tu video en TikTok",
    "↓  Escribe al WhatsApp (español, inglés o portugués)",
    "↓  El agente responde en segundos con tours, precios y disponibilidad",
    "↓  Agenda, cobra el anticipo y confirma",
    "↓  Recordatorio el día anterior (menos no-shows)",
    "↓  Reporte de ocupación y ventas",
  ];
  s.addText(flow.map(f => ({ text: f, options: { fontSize: 14, color: f.startsWith("↓") ? GRAY : WHITE, breakLine: true, paraSpaceAfter: 6 } })),
    { x: 0.7, y: 2.3, w: 8.6, h: 3.0, valign: "top" });
}

function retorno(pres) {
  const s = baseSlide(pres, "El retorno", "Se paga solo");
  const roi = [
    "Una salida de tu yate se alquila a $1.400.000",
    "4 salidas = $5.600.000 → pagan todo el sistema",
    "1 salida al mes cubre 4 meses de mantenimiento",
    "Cada reserva que no se te escapa es ganancia",
  ];
  s.addText(roi.map(r => ({ text: r, options: { fontSize: 17, color: GREEN, bold: true, breakLine: true, paraSpaceAfter: 12 } })),
    { x: 0.7, y: 2.4, w: 8.6, h: 3.0, valign: "top" });
}

function inversionCore(pres) {
  const s = baseSlide(pres, "Inversión", "Clara y sin letra pequeña");
  s.addText([
    { text: "Atención & Ventas", options: { fontSize: 26, bold: true, color: PURPLE2, breakLine: true } },
    { text: "Agente WhatsApp trilingüe + reservas + cobros + reportes", options: { fontSize: 14, color: GRAY, breakLine: true } },
    { text: "$5.500.000 COP", options: { fontSize: 28, bold: true, color: GREEN, breakLine: true } },
    { text: "pago único · implementación 14–21 días", options: { fontSize: 12, color: GRAY, breakLine: true } },
    { text: "Mantenimiento: $350.000 COP/mes", options: { fontSize: 14, color: GRAY } },
  ], { x: 0.7, y: 2.3, w: 8.6, h: 3.0, valign: "top" });
}

function inversionCompleta(pres) {
  const s = baseSlide(pres, "Inversión", "3 módulos, claros y sin letra pequeña");
  const mods = [
    ["Módulo 1", "Atención & Ventas", "$5.500.000 COP", "+ $350.000/mes", PURPLE],
    ["Módulo 2", "SEO + GEO", "$1.800.000", "COP/mes", PURPLE2],
    ["Módulo 3", "Video & Redes", "$1.000.000", "COP/mes", GREEN],
  ];
  mods.forEach((m, i) => {
    const x = 0.7 + i * 2.95;
    s.addShape("roundRect", { x: x, y: 2.4, w: 2.8, h: 2.3, fill: { color: CARD }, line: { color: m[4], width: 1 }, rectRadius: 0.06 });
    s.addText(m[0], { x: x + 0.15, y: 2.55, w: 2.5, h: 0.35, fontSize: 12, bold: true, color: m[4] });
    s.addText(m[1], { x: x + 0.15, y: 2.9, w: 2.5, h: 0.5, fontSize: 15, bold: true, color: WHITE });
    s.addText(m[2], { x: x + 0.15, y: 3.45, w: 2.5, h: 0.45, fontSize: 19, bold: true, color: GREEN });
    s.addText(m[3], { x: x + 0.15, y: 3.9, w: 2.5, h: 0.35, fontSize: 12, color: GRAY });
  });
  s.addText("Implementación: 14–21 días · Primera semana para mapear tus tours, precios y preguntas frecuentes", { x: 0.7, y: 4.85, w: 8.6, h: 0.4, fontSize: 11, color: GRAY, align: "center" });
}

function cta(pres) {
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addText("¿Empezamos con un piloto de 7 días gratis?", { x: 0.8, y: 1.8, w: 8.4, h: 1.2, fontSize: 32, bold: true, color: WHITE, align: "center" });
  s.addText("Montamos el agente de WhatsApp con tus tours más vendidos, y ves cómo responde en vivo, sin pagar nada.", { x: 0.8, y: 3.0, w: 8.4, h: 0.9, fontSize: 15, color: GRAY, align: "center" });
  s.addText("axelia.tech · WhatsApp +57 302 406 3534", { x: 0.8, y: 4.2, w: 8.4, h: 0.5, fontSize: 14, color: PURPLE2, align: "center" });
}

// ===== VERSIÓN CORE (solo atención) =====
const core = newPres();
portada(core);
quienesSomos(core);
problema(core);
solucionCore(core);
flujo(core);
retorno(core);
inversionCore(core);
cta(core);
core.writeFile({ fileName: "C:/Users/alexa/AxelIA_Presentacion_Tours_Core.pptx" }).then(() => {
  console.log("✅ Core: AxelIA_Presentacion_Tours_Core.pptx");
});

// ===== VERSIÓN COMPLETA (3 módulos) =====
const completa = newPres();
portada(completa);
quienesSomos(completa);
problema(completa);
solucionCompleta(completa);
seoQueEs(completa);
videoRedes(completa);
flujo(completa);
retorno(completa);
inversionCompleta(completa);
cta(completa);
completa.writeFile({ fileName: "C:/Users/alexa/AxelIA_Presentacion_Tours_Completa.pptx" }).then(() => {
  console.log("✅ Completa: AxelIA_Presentacion_Tours_Completa.pptx");
});
