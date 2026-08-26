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
  s.addText("AxelIA", { x: 0.8, y: 1.3, w: 8.4, h: 1.4, fontSize: 64, bold: true, color: PURPLE2, align: "center" });
  s.addText("Automatización con Agentes de IA para tu Empresa de Turismo", { x: 0.8, y: 2.7, w: 8.4, h: 1.1, fontSize: 26, bold: true, color: WHITE, align: "center" });
  s.addText("Tours · Reservas · Cobros · Atención 24/7 en 3 idiomas", { x: 0.8, y: 3.9, w: 8.4, h: 0.5, fontSize: 15, color: GRAY, align: "center" });
}

function quienesSomos(pres) {
  const s = baseSlide(pres, "Quiénes somos", "Somos la prueba de que funciona");
  s.addText([
    { text: "AxelIA crea ecosistemas de agentes de IA para PYMES.", options: { fontSize: 20, color: WHITE, breakLine: true } },
    { text: "No vendemos un chatbot suelto: montamos un equipo de agentes que trabaja 24/7.", options: { fontSize: 16, color: GRAY, breakLine: true } },
    { text: "Este mismo sistema opera nuestro negocio todos los días.", options: { fontSize: 16, color: GREEN } },
  ], { x: 0.7, y: 2.4, w: 8.6, h: 2.6, valign: "top" });
}

function problema(pres) {
  const s = baseSlide(pres, "El problema que hoy te cuesta dinero", "Cada punto es plata que se pierde cada día");
  const problems = [
    "WhatsApp colapsado en temporada alta (diciembre–enero)",
    "Turistas brasileños, chilenos y anglos que hablan portugués o inglés",
    "Preguntas repetitivas todo el día (seguridad, medusas, qué incluye el tour)",
    "No-shows: reservan el tour y no llegan",
    "Cobros de anticipos manuales, uno por uno",
    "Sin reseñas, sin datos, sin seguimiento",
  ];
  s.addText(problems.map(p => ({ text: "✗  " + p, options: { fontSize: 14, color: WHITE, breakLine: true, paraSpaceAfter: 8 } })),
    { x: 0.7, y: 2.3, w: 8.6, h: 3.0, valign: "top" });
}

function solucion(pres) {
  const s = baseSlide(pres, "La solución: tu ecosistema de agentes", "4 agentes que trabajan juntos, 24/7");
  const agents = [
    ["Recepcionista", "Responde WhatsApp en español, inglés y portugués, al instante", PURPLE],
    ["Reservas", "Agenda tours, confirma y reduce no-shows", PURPLE2],
    ["Cobros", "Envía link de pago y confirma anticipos", GREEN],
    ["Reportes", "Ventas diarias, tours más vendidos, alertas", GREEN],
  ];
  agents.forEach((a, i) => {
    const y = 2.25 + i * 0.72;
    s.addShape("roundRect", { x: 0.7, y: y, w: 8.6, h: 0.62, fill: { color: CARD }, line: { color: a[2], width: 1 }, rectRadius: 0.06 });
    s.addText(a[0], { x: 1.0, y: y + 0.1, w: 2.4, h: 0.42, fontSize: 14, bold: true, color: a[2] });
    s.addText(a[1], { x: 3.4, y: y + 0.1, w: 5.7, h: 0.42, fontSize: 12, color: WHITE });
  });
}

function seoQueEs(pres) {
  const s = baseSlide(pres, "El módulo que te hace visible en Google", "Qué es el SEO y por qué importa");
  s.addText([
    { text: "SEO = posicionamiento en buscadores. En simple: que cuando un turista escriba «tours en San Andrés» en Google, aparezca tu empresa.", options: { fontSize: 16, color: WHITE, breakLine: true, paraSpaceAfter: 10 } },
    { text: "La mayoría de turistas investiga en Google antes de escribir por WhatsApp. Si no apareces ahí, ese cliente nunca te escribe.", options: { fontSize: 16, color: GRAY, breakLine: true, paraSpaceAfter: 10 } },
    { text: "Nosotros te posicionamos en español, inglés y portugués — los tres idiomas de tu cliente.", options: { fontSize: 16, color: GREEN } },
  ], { x: 0.7, y: 2.4, w: 8.6, h: 2.6, valign: "top" });
}

function seoIncluye(pres) {
  const s = baseSlide(pres, "Qué incluye el módulo SEO + Analytics", "Para qué te sirve en concreto");
  const items = [
    ["Posicionamiento trilingüe", "Apareces cuando buscan tours en español, inglés o portugués.", PURPLE],
    ["GA4 + Search Console", "Medimos el tráfico real que llega a tu sitio, sin humo.", PURPLE2],
    ["Dashboard mensual", "Ves qué buscan, qué tours venden y dónde conviene invertir.", GREEN],
  ];
  items.forEach((a, i) => {
    const y = 2.25 + i * 0.85;
    s.addShape("roundRect", { x: 0.7, y: y, w: 8.6, h: 0.72, fill: { color: CARD }, line: { color: a[2], width: 1 }, rectRadius: 0.06 });
    s.addText(a[0], { x: 1.0, y: y + 0.08, w: 3.0, h: 0.4, fontSize: 14, bold: true, color: a[2] });
    s.addText(a[1], { x: 4.1, y: y + 0.08, w: 5.0, h: 0.56, fontSize: 12, color: WHITE });
  });
  s.addText("SEO trae el tráfico → el agente lo convierte en reserva.", { x: 0.7, y: 4.85, w: 8.6, h: 0.4, fontSize: 14, bold: true, color: GREEN, align: "center" });
}

function flujo(pres) {
  const s = baseSlide(pres, "Cómo funciona", "El camino del turista, automatizado de punta a punta");
  const flow = [
    "Turista escribe por WhatsApp (español, inglés o portugués)",
    "↓  El agente responde en 3 segundos con tours y precios",
    "↓  Agenda y confirma la reserva",
    "↓  Envía el link de pago y asegura el anticipo",
    "↓  Recordatorio automático el día anterior (menos no-shows)",
    "↓  Reseña post-servicio + reporte diario",
  ];
  s.addText(flow.map(f => ({ text: f, options: { fontSize: 15, color: f.startsWith("↓") ? GRAY : WHITE, breakLine: true, paraSpaceAfter: 6 } })),
    { x: 0.7, y: 2.3, w: 8.6, h: 3.0, valign: "top" });
}

function retorno(pres, conSEO) {
  const s = baseSlide(pres, "El retorno", "Se paga solo");
  const roi = [
    "+1 reserva por día que hoy pierdes por no responder a tiempo",
    "−30% no-shows con recordatorios automáticos",
    "0 mensajes sin responder, 24/7, en 3 idiomas",
    "Reporte diario de ventas sin esfuerzo",
  ];
  if (conSEO) roi.push("Clientes que te encuentran en Google en 3 idiomas");
  s.addText(roi.map(r => ({ text: r, options: { fontSize: 17, color: GREEN, bold: true, breakLine: true, paraSpaceAfter: 12 } })),
    { x: 0.7, y: 2.4, w: 8.6, h: 3.0, valign: "top" });
}

function inversionCore(pres) {
  const s = baseSlide(pres, "Inversión", "Clara y sin letra pequeña");
  s.addText([
    { text: "Turismo Pro", options: { fontSize: 26, bold: true, color: PURPLE2, breakLine: true } },
    { text: "4 agentes + WhatsApp + reservas + cobros + reportes", options: { fontSize: 14, color: GRAY, breakLine: true } },
    { text: "$5.500.000 COP", options: { fontSize: 28, bold: true, color: GREEN, breakLine: true } },
    { text: "pago único · implementación 14–21 días", options: { fontSize: 12, color: GRAY, breakLine: true } },
    { text: "Mantenimiento: $350.000 COP/mes", options: { fontSize: 14, color: GRAY } },
  ], { x: 0.7, y: 2.3, w: 8.6, h: 3.0, valign: "top" });
}

function inversionCompleta(pres) {
  const s = baseSlide(pres, "Inversión", "Dos módulos, claros y sin letra pequeña");

  // Módulo 1
  s.addShape("roundRect", { x: 0.7, y: 2.3, w: 4.2, h: 2.5, fill: { color: CARD }, line: { color: PURPLE, width: 1 }, rectRadius: 0.06 });
  s.addText("Módulo 1 · Ecosistema de agentes", { x: 0.95, y: 2.5, w: 3.7, h: 0.4, fontSize: 15, bold: true, color: PURPLE2 });
  s.addText("4 agentes + WhatsApp + reservas + cobros + reportes", { x: 0.95, y: 3.0, w: 3.7, h: 0.7, fontSize: 12, color: GRAY });
  s.addText("$5.500.000 COP", { x: 0.95, y: 3.7, w: 3.7, h: 0.5, fontSize: 22, bold: true, color: GREEN });
  s.addText("pago único · Mantenimiento $350.000 COP/mes", { x: 0.95, y: 4.25, w: 3.7, h: 0.4, fontSize: 11, color: GRAY });

  // Módulo 2
  s.addShape("roundRect", { x: 5.1, y: 2.3, w: 4.2, h: 2.5, fill: { color: CARD }, line: { color: GREEN, width: 1 }, rectRadius: 0.06 });
  s.addText("Módulo 2 · SEO + Analytics", { x: 5.35, y: 2.5, w: 3.7, h: 0.4, fontSize: 15, bold: true, color: GREEN });
  s.addText("Posicionamiento Google ES/EN/PT + GA4/Search Console + dashboard mensual", { x: 5.35, y: 3.0, w: 3.7, h: 0.7, fontSize: 12, color: GRAY });
  s.addText("$1.800.000 COP", { x: 5.35, y: 3.7, w: 3.7, h: 0.5, fontSize: 22, bold: true, color: GREEN });
  s.addText("mensual", { x: 5.35, y: 4.25, w: 3.7, h: 0.4, fontSize: 11, color: GRAY });
}

function cta(pres) {
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addText("¿Empezamos con un piloto de 7 días gratis?", { x: 0.8, y: 1.8, w: 8.4, h: 1.2, fontSize: 32, bold: true, color: WHITE, align: "center" });
  s.addText("Montamos el agente de WhatsApp con tus 3 tours más vendidos y ves los resultados en vivo, sin pagar nada.", { x: 0.8, y: 3.0, w: 8.4, h: 0.9, fontSize: 15, color: GRAY, align: "center" });
  s.addText("axelia.tech · WhatsApp +57 302 406 3534", { x: 0.8, y: 4.2, w: 8.4, h: 0.5, fontSize: 14, color: PURPLE2, align: "center" });
}

// ===== VERSIÓN CORE (sin SEO) =====
const core = newPres();
portada(core);
quienesSomos(core);
problema(core);
solucion(core);
flujo(core);
retorno(core, false);
inversionCore(core);
cta(core);
core.writeFile({ fileName: "C:/Users/alexa/AxelIA_Presentacion_Turismo_SinSEO.pptx" }).then(() => {
  console.log("✅ Versión SIN SEO: AxelIA_Presentacion_Turismo_SinSEO.pptx");
});

// ===== VERSIÓN COMPLETA (con SEO) =====
const completa = newPres();
portada(completa);
quienesSomos(completa);
problema(completa);
solucion(completa);
seoQueEs(completa);
seoIncluye(completa);
flujo(completa);
retorno(completa, true);
inversionCompleta(completa);
cta(completa);
completa.writeFile({ fileName: "C:/Users/alexa/AxelIA_Presentacion_Turismo_ConSEO.pptx" }).then(() => {
  console.log("✅ Versión CON SEO: AxelIA_Presentacion_Turismo_ConSEO.pptx");
});
