// AxelIA Chat — widget de cualificación de leads (demo viva del producto)
(function () {
  if (document.getElementById('ax-chat-style')) return;
  var WA = "573042860980";
  var rubro = null, dolor = null;

  var css = [
    "#ax-chat-btn{position:fixed;bottom:20px;right:20px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#6c5ce7,#a78bfa);color:#fff;font-size:26px;border:none;cursor:pointer;z-index:9999;box-shadow:0 4px 18px rgba(108,92,231,.45);display:flex;align-items:center;justify-content:center;transition:.2s}",
    "#ax-chat-btn:hover{transform:scale(1.06)}",
    "#ax-chat-panel{position:fixed;bottom:90px;right:20px;width:340px;max-width:calc(100vw - 32px);background:#16161f;border:1px solid #222230;border-radius:16px;z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.5);font-family:'Inter',-apple-system,sans-serif}",
    "#ax-chat-header{background:#6c5ce7;color:#fff;padding:12px 16px;font-weight:700;display:flex;justify-content:space-between;align-items:center}",
    "#ax-chat-close{cursor:pointer;font-size:22px;line-height:1;opacity:.85}",
    "#ax-chat-body{padding:16px;height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;color:#e0e0e8}",
    ".ax-msg{max-width:85%;padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.5}",
    ".ax-bot{background:#222230;color:#e0e0e8;align-self:flex-start}",
    ".ax-user{background:#6c5ce7;color:#fff;align-self:flex-end}",
    ".ax-opts{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}",
    ".ax-opt{background:transparent;border:1px solid #6c5ce7;color:#a78bfa;padding:8px 12px;border-radius:20px;cursor:pointer;font-size:13px;transition:.15s}",
    ".ax-opt:hover{background:rgba(108,92,231,.18)}",
    "#ax-chat-input{display:none;padding:12px 16px;border-top:1px solid #222230;flex-direction:column;gap:8px}",
    "#ax-chat-input input{background:#0a0a0f;border:1px solid #222230;border-radius:8px;padding:10px;color:#e0e0e8;font-size:14px;outline:none;width:100%;box-sizing:border-box}",
    "#ax-chat-input input:focus{border-color:#6c5ce7}",
    "#ax-chat-send{background:#00d2a0;color:#0a0a0f;border:none;padding:11px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px}"
  ].join("\n");
  var st = document.createElement('style');
  st.id = 'ax-chat-style';
  st.textContent = css;
  document.head.appendChild(st);

  var btn = document.createElement('div');
  btn.id = 'ax-chat-btn';
  btn.textContent = '💬';
  btn.setAttribute('aria-label', 'Abrir chat de AxelIA');

  var panel = document.createElement('div');
  panel.id = 'ax-chat-panel';
  panel.innerHTML = '<div id="ax-chat-header">AxelIA · Asistente <span id="ax-chat-close">×</span></div>' +
    '<div id="ax-chat-body"></div>' +
    '<div id="ax-chat-input"><input id="ax-in-nombre" placeholder="Tu nombre"><input id="ax-in-wa" placeholder="Tu WhatsApp (opcional)"><button id="ax-chat-send">Enviar y abrir WhatsApp →</button></div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var body = document.getElementById('ax-chat-body');
  var input = document.getElementById('ax-chat-input');

  function botMsg(t) { var d = document.createElement('div'); d.className = 'ax-msg ax-bot'; d.textContent = t; body.appendChild(d); body.scrollTop = body.scrollHeight; }
  function userMsg(t) { var d = document.createElement('div'); d.className = 'ax-msg ax-user'; d.textContent = t; body.appendChild(d); body.scrollTop = body.scrollHeight; }
  function opts(list, cb) {
    var w = document.createElement('div'); w.className = 'ax-opts';
    list.forEach(function (o) {
      var b = document.createElement('button'); b.className = 'ax-opt'; b.textContent = o;
      b.onclick = function () { userMsg(o); w.remove(); cb(o); };
      w.appendChild(b);
    });
    body.appendChild(w); body.scrollTop = body.scrollHeight;
  }

  function inicio() {
    botMsg('Hola 👋 Soy el asistente de AxelIA. ¿En qué rubro está tu negocio?');
    opts(['Restaurante', 'Inmobiliaria', 'Clínica', 'Tienda / Comercio', 'Turismo', 'Otro'], function (r) {
      rubro = r;
      botMsg('Entendido. ¿Qué es lo que más te duele hoy?');
      opts(['Pierdo ventas por no responder a tiempo', 'El papeleo me consume', 'No tengo control ni reportes', 'Mi equipo no sabe usar la IA'], function (d) {
        dolor = d;
        botMsg('¡Perfecto! Déjame tu nombre y WhatsApp, y un humano te contacta con 3 ideas accionables para tu caso.');
        input.style.display = 'flex';
      });
    });
  }

  function enviar() {
    var n = document.getElementById('ax-in-nombre').value.trim();
    var w = document.getElementById('ax-in-wa').value.trim();
    if (!n) { document.getElementById('ax-in-nombre').focus(); return; }
    var msg = 'Hola AxelIA 👋 Soy ' + n + '. Mi rubro: ' + rubro + '. Lo que más me duele: ' + dolor + '. Mi WhatsApp: ' + (w || 'no lo dejé');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank');
  }

  btn.onclick = function () { panel.style.display = 'flex'; btn.style.display = 'none'; if (!body.children.length) inicio(); };
  document.getElementById('ax-chat-close').onclick = function () { panel.style.display = 'none'; btn.style.display = 'flex'; };
  document.getElementById('ax-chat-send').onclick = enviar;
})();
