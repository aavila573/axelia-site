const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.defineLayout({ name: "AXELIA", width: 10, height: 5.625 });

const BG = "0A0A0F";
const CARD = "16161F";
const PURPLE = "6C5CE7";
const PURPLE2 = "A78BFA";
const GREEN = "00D2A0";
const WHITE = "FFFFFF";
const GRAY = "9A9AB0";

// Cada slide: título arriba (y 0.5–1.1), contenido abajo (y 1.5–5.2)
function baseSlide(title, subtitle) {
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addText("AxelIA", { x: 0.5, y: 0.35, w: 2.5, h: 0.5, fontSize: 18, bold: true, color: PURPLE2 });
  s.addText(title, { x: 0.5, y: 0.95, w: 9, h: 0.9, fontSize: 30, bold: true, color: WHITE });
  if (subtitle) s.addText(subtitle, { x: 0.5, y: 1.85, w: 9, h: 0.5, fontSize: 14, color: GRAY });
  return s;
}

// 1. Portada
let s = pres.addSlide();
s.background = { color: BG };
s.addText("AxelIA", { x: 0.8, y: 1.3, w: 8.4, h: 1.4, fontSize: 64, bold: true, color: PURPLE2, align: "center" });
s.addText("Automatización con Agentes de IA para tu Empresa de Turismo", { x: 0.8, y: 2.7, w: 8.4, h: 1.1, fontSize: 26, bold: true, color: WHITE, align: "center" });
s.addText("Tours · Reservas · Cobros · Atención 24/7 en 3 idiomas", { x: 0.8, y: 3.9, w: 8.4, h: 0.5, fontSize: 15, color: GRAY, align: "center" });

// 2. Quiénes somos
s = baseSlide("Quiénes somos", "Somos la prueba de que funciona");
s.addText([
  { text: "AxelIA crea ecosistemas de agentes de IA para PYMES.", options: { fontSize: 20, color: WHITE, breakLine: true } },
  { text: "No vendemos un chatbot suelto: montamos un equipo de agentes que trabaja 24/7.", options: { fontSize: 16, color: GRAY, breakLine: true } },
  { text: "Este mismo sistema opera nuestro negocio todos los días.", options: { fontSize: 16, color: GREEN } },
], { x: 0.7, y: 2.4, w: 8.6, h: 2.6, valign: "top" });

// 3. El problema
s = baseSlide("El problema que hoy te cuesta dinero", "Cada punto es plata que se pierde cada día");
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

// 4. La solución
s = baseSlide("La solución: tu ecosistema de agentes", "4 agentes que trabajan juntos, 24/7");
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

// 5. El flujo
s = baseSlide("Cómo funciona", "El camino del turista, automatizado de punta a punta");
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

// 6. El retorno
s = baseSlide("El retorno", "Se paga solo");
const roi = [
  "+1 reserva por día que hoy pierdes por no responder a tiempo",
  "−30% no-shows con recordatorios automáticos",
  "0 mensajes sin responder, 24/7, en 3 idiomas",
  "Reporte diario de ventas sin esfuerzo",
];
s.addText(roi.map(r => ({ text: r, options: { fontSize: 17, color: GREEN, bold: true, breakLine: true, paraSpaceAfter: 14 } })),
  { x: 0.7, y: 2.4, w: 8.6, h: 3.0, valign: "top" });

// 7. Inversión
s = baseSlide("Inversión", "Clara y sin letra pequeña");
s.addText([
  { text: "Turismo Pro", options: { fontSize: 26, bold: true, color: PURPLE2, breakLine: true } },
  { text: "4 agentes + WhatsApp + reservas + cobros + reportes", options: { fontSize: 14, color: GRAY, breakLine: true } },
  { text: "$5.500.000 COP", options: { fontSize: 28, bold: true, color: GREEN, breakLine: true } },
  { text: "pago único · implementación 14–21 días", options: { fontSize: 12, color: GRAY, breakLine: true } },
  { text: "Mantenimiento: $350.000 COP/mes", options: { fontSize: 14, color: GRAY } },
], { x: 0.7, y: 2.3, w: 8.6, h: 3.0, valign: "top" });

// 8. CTA
s = pres.addSlide();
s.background = { color: BG };
s.addText("¿Empezamos con un piloto de 7 días gratis?", { x: 0.8, y: 1.8, w: 8.4, h: 1.2, fontSize: 32, bold: true, color: WHITE, align: "center" });
s.addText("Montamos el agente de WhatsApp con tus 3 tours más vendidos y ves los resultados en vivo, sin pagar nada.", { x: 0.8, y: 3.0, w: 8.4, h: 0.9, fontSize: 15, color: GRAY, align: "center" });
s.addText("axelia.tech · WhatsApp +57 302 402 3534", { x: 0.8, y: 4.2, w: 8.4, h: 0.5, fontSize: 14, color: PURPLE2, align: "center" });

pres.writeFile({ fileName: "C:/Users/alexa/AxelIA_Presentacion_Turismo_v2.pptx" }).then(() => {
  console.log("✅ Presentación corregida: AxelIA_Presentacion_Turismo_v2.pptx");
});
