/* ============================================================
   TTM — Visualisations terrain
   1. pitchHero()  : terrain animé + réseaux de clubs (hero)
   2. pitchMap()   : carte interactive des clubs / matchs
   ============================================================ */
(function (global) {
  "use strict";
  const TTM = global.TTM;
  const D = global.TTM_DATA;
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };

  /* ==========================================================
     1. TERRAIN ANIMÉ (hero)
     ========================================================== */
  TTM.pitchHero = function (host, opts) {
    const o = Object.assign({ w: 1000, h: 620, nodes: 9, duration: 7200, auto: true }, opts || {});
    if (!host) return;
    host.innerHTML = "";
    host.style.position = "relative";

    const svg = svgEl("svg", {
      viewBox: "0 0 " + o.w + " " + o.h, width: "100%", height: "100%",
      preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true"
    });
    svg.style.display = "block";

    const defs = svgEl("defs", {});
    defs.innerHTML =
      "<linearGradient id='phG' x1='0' y1='0' x2='1' y2='1'>" +
      '<stop offset="0" stop-color="#2563EB" stop-opacity=".55"/>' +
      '<stop offset="1" stop-color="#22D3EE" stop-opacity=".22"/></linearGradient>' +
      "<radialGradient id='phGlow' cx='50%' cy='50%' r='50%'>" +
      '<stop offset="0" stop-color="#22D3EE" stop-opacity=".40"/>' +
      '<stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient>' +
      '<pattern id="phGrid" width="52" height="52" patternUnits="userSpaceOnUse">' +
      '<path d="M52 0H0v52" fill="none" stroke="#38BDF8" stroke-opacity=".07" stroke-width="1"/></pattern>';
    svg.appendChild(defs);

    const glow = svgEl("ellipse", { cx: o.w / 2, cy: o.h * 0.55, rx: o.w * 0.42, ry: o.h * 0.38, fill: "url(#phGlow)" });
    svg.appendChild(glow);
    svg.appendChild(svgEl("rect", { x: 0, y: 0, width: o.w, height: o.h, fill: "url(#phGrid)" }));

    /* --- Lignes du terrain (dessin progressif) --- */
    const gPitch = svgEl("g", { fill: "none", stroke: "#7DD3FC", "stroke-width": 1.6, "stroke-opacity": ".34", "stroke-linecap": "round" });
    const L = 90, T = 60, W = o.w - 180, H = o.h - 120;
    const parts = [
      ["M" + L + " " + T + "h" + W + "v" + H + "h" + (-W) + "Z"],
      ["M" + (L + W / 2) + " " + T + "v" + H],
      ["M" + (L + W / 2 - 82) + " " + T + "h164v" + (H * 0.34) + "h-164Z"],
      ["M" + (L + W / 2 - 82) + " " + (T + H) + "h164V" + (T + H - H * 0.34) + "h-164Z"],
      ["M" + (L + W / 2 - 60) + " " + T + "v" + (H * 0.155) + "M" + (L + W / 2 + 60) + " " + T + "v" + (H * 0.155)],
      ["M" + (L + W / 2 - 60) + " " + (T + H) + "v" + (-H * 0.155) + "M" + (L + W / 2 + 60) + " " + (T + H) + "v" + (-H * 0.155)]
    ];
    parts.forEach((p, i) => {
      const path = svgEl("path", { d: p[0], class: "draw-path" });
      path.style.setProperty("--len", "2200");
      path.style.animationDelay = 0.15 + i * 0.16 + "s";
      path.style.animationDuration = "1.3s";
      gPitch.appendChild(path);
    });
    const circle = svgEl("circle", { cx: L + W / 2, cy: T + H / 2, r: 78, class: "draw-path" });
    circle.style.setProperty("--len", "500");
    circle.style.animationDelay = "0.9s";
    gPitch.appendChild(circle);
    svg.appendChild(gPitch);

    /* --- Nœuds : clubs --- */
    const positions = [
      [0.50, 0.52], [0.22, 0.28], [0.78, 0.24], [0.16, 0.72], [0.84, 0.74],
      [0.36, 0.14], [0.64, 0.86], [0.92, 0.46], [0.08, 0.46]
    ].slice(0, o.nodes);

    const gLines = svgEl("g", { fill: "none" });
    const gNodes = svgEl("g", {});
    svg.appendChild(gLines); svg.appendChild(gNodes);

    const nodes = [];
    positions.forEach((p, i) => {
      const x = p[0] * o.w, y = p[1] * o.h, r = i === 0 ? 9 : 5.5;
      const g = svgEl("g", { opacity: "0", style: "transform-origin:" + x + "px " + y + "px" });
      const halo = svgEl("circle", { cx: x, cy: y, r: r * 3.4, fill: "none", stroke: i === 0 ? "#22D3EE" : "#3B82F6", "stroke-opacity": ".45", "stroke-width": 1.2 });
      const core = svgEl("circle", { cx: x, cy: y, r: r, fill: i === 0 ? "#22D3EE" : "url(#phG)" });
      core.setAttribute("stroke", i === 0 ? "#ffffff" : "#7DD3FC");
      core.setAttribute("stroke-width", "1.6");
      g.appendChild(halo); g.appendChild(core);
      gNodes.appendChild(g);
      nodes.push({ x, y, g, halo, i });

      setTimeout(() => {
        g.setAttribute("opacity", "1");
        g.style.transition = "opacity .5s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.34,1.56,.64,1)";
        g.style.transform = "scale(.4)";
        requestAnimationFrame(() => { g.style.transform = "scale(1)"; });
      }, 1500 + i * 190);

      if (i > 0) {
        const l = svgEl("line", { x1: nodes[0].x, y1: nodes[0].y, x2: x, y2: y, stroke: "#38BDF8", "stroke-width": 1, "stroke-opacity": ".5", class: "link-line" });
        gLines.appendChild(l);
        setTimeout(() => { l.style.opacity = "0"; l.style.transition = "opacity .8s ease"; l.style.opacity = "1"; }, 1700 + i * 150);
      }
      const ping = svgEl("circle", { cx: x, cy: y, r: r, fill: "none", stroke: i === 0 ? "#22D3EE" : "#3B82F6", "stroke-width": 1.4, opacity: 0 });
      gNodes.appendChild(ping);
      setInterval(() => {
        ping.animate([{ r: r, opacity: 0.7 }, { r: r * 4, opacity: 0 }], { duration: 2400, easing: "cubic-bezier(.22,1,.36,1)" });
      }, 2200 + i * 320);
    });

    /* --- Ballon qui traverse le terrain --- */
    const ball = svgEl("g", { opacity: 0 });
    ball.innerHTML =
      '<circle r="6" fill="#fff"/><circle r="6" fill="none" stroke="#22D3EE" stroke-width="1.4" opacity=".8"/>' +
      '<path d="M0 -3.4 L3.2 -1.4 L2 2.4 L-2 2.4 L-3.2 -1.4 Z" fill="#2563EB"/>';
    svg.appendChild(ball);
    setTimeout(() => {
      ball.setAttribute("opacity", "1");
      const path = svgEl("path", { id: "ttmBallPath", d: "M" + o.w * 0.16 + " " + o.h * 0.46 + " Q" + o.w * 0.5 + " " + o.h * 0.14 + " " + o.w * 0.84 + " " + o.h * 0.48, fill: "none", stroke: "none" });
      svg.appendChild(path);
      let t = 0;
      const dur = 5200;
      const start = performance.now();
      function move(now) {
        t = Math.min(1, (now - start) / dur);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const p = path.getPointAtLength(path.getTotalLength() * e);
        ball.setAttribute("transform", "translate(" + p.x + "," + p.y + ")");
        if (t < 1) requestAnimationFrame(move);
        else setTimeout(() => { ball.style.transition = "opacity .6s"; ball.setAttribute("opacity", "0"); }, 900);
      }
      requestAnimationFrame(move);
    }, 3600);

    host.appendChild(svg);

    /* --- Carte de match qui apparaît --- */
    const card = document.createElement("div");
    card.style.cssText =
      "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.86);opacity:0;" +
      "pointer-events:none;transition:transform .7s cubic-bezier(.34,1.56,.64,1),opacity .5s ease;z-index:4";
    const rec = TTM.recommend("u15a", 1)[0];
    if (rec) {
      const c = D.club(rec.clubId);
      card.innerHTML =
        '<div class="card card-glass" style="min-width:264px;padding:16px;box-shadow:0 24px 60px rgba(0,0,0,.34)">' +
        '<div class="row-between" style="margin-bottom:12px"><div class="row-2">' + TTM.clubLogo(c, "club-logo-sm") +
        '<div><div class="t-body-sm" style="font-weight:700">' + TTM.esc(c.name) + "</div>" +
        '<div class="t-micro t-muted">MATCH RECOMMANDÉ</div></div></div>' + TTM.compatHTML(rec._score.pct, "compat-ring-sm") + "</div>" +
        '<div class="row" style="gap:14px;font-size:12px;color:var(--ttm-text-secondary)">' +
        "<span>" + TTM.catBadge(rec.cat) + "</span>" +
        "<span>" + TTM.esc(TTM.date.dayMin(rec.date)) + " " + TTM.date.num(rec.date) + " oct.</span>" +
        "<span>" + rec.time + "</span>" +
        "<span>" + rec.dist + " km</span></div></div>";
    }
    host.appendChild(card);
    setTimeout(() => {
      card.style.transform = "translate(-50%,-50%) scale(1)";
      card.style.opacity = "1";
    }, 5200);
    setTimeout(() => {
      card.style.transform = "translate(-50%,-58%) scale(.96)";
      card.style.opacity = "0";
    }, 10000);

    /* --- Balayage lumineux --- */
    const scan = document.createElement("div");
    scan.className = "scanline";
    host.appendChild(scan);
  };

  /* ==========================================================
     2. CARTE INTERACTIVE DES CLUBS
     ========================================================== */
  TTM.pitchMap = function (host, opts) {
    const o = Object.assign({ height: 460, showMatches: true, showStadiums: true, showClubs: true, radius: 46, onSelect: null }, opts || {});
    if (!host) return null;
    const S = TTM.store.get();
    const home = D.club(S.clubId);
    host.innerHTML = "";
    host.classList.add("map", "map-radial");
    host.style.height = o.height + "px";
    host.style.position = "relative";

    /* Projection simplifiée : latitude/longitude → x/y bornés */
    const lats = D.CLUBS.map((c) => c.lat), lngs = D.CLUBS.map((c) => c.lng);
    const minLat = Math.min.apply(null, lats), maxLat = Math.max.apply(null, lats);
    const minLng = Math.min.apply(null, lngs), maxLng = Math.max.apply(null, lngs);
    const latPad = (maxLat - minLat) * 0.08, lngPad = (maxLng - minLng) * 0.08;
    const px = (c) => (10 + 80 * (1 - (c.lng - (minLng - lngPad)) / (maxLng - minLng + 2 * lngPad))) + "%";
    const py = (c) => (10 + 80 * (1 - (c.lat - (minLat - latPad)) / (maxLat - minLat + 2 * latPad))) + "%";

    /* Lignes de terrain en fond */
    const bg = document.createElement("div");
    bg.style.cssText = "position:absolute;inset:6% 8%;border:1.5px solid var(--ttm-border-brand);border-radius:6px;opacity:.5;pointer-events:none";
    bg.innerHTML =
      '<div style="position:absolute;left:50%;top:0;bottom:0;width:1.5px;background:var(--ttm-border-brand)"></div>' +
      '<div style="position:absolute;left:50%;top:50%;width:120px;height:120px;transform:translate(-50%,-50%);border:1.5px solid var(--ttm-border-brand);border-radius:50%"></div>' +
      '<div style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:19%;height:44%;border:1.5px solid var(--ttm-border-brand);border-left:none"></div>' +
      '<div style="position:absolute;right:0;top:50%;transform:translateY(-50%);width:19%;height:44%;border:1.5px solid var(--ttm-border-brand);border-right:none"></div>';
    host.appendChild(bg);

    /* Stades */
    if (o.showStadiums) {
      D.STADIUMS.forEach((s) => {
        const c = { lat: s.lat, lng: s.lng };
        const m = document.createElement("div");
        m.className = "marker is-stadium";
        m.style.left = px(c); m.style.top = py(c);
        m.title = s.name;
        m.innerHTML = '<div class="marker-dot" style="width:12px;height:12px;background:linear-gradient(135deg,#64748B,#94A3B8)"></div>';
        host.appendChild(m);
      });
    }

    /* Marqueurs clubs + matchs */
    const items = [];
    D.CLUBS.forEach((c) => {
      if (!o.showClubs) return;
      const dist = TTM.distance(home, c);
      const matches = D.AVAILABLE.filter((m) => m.clubId === c.id);
      const best = matches.length ? TTM.scoreMatch(matches[0], "u15a").pct : null;
      const el = document.createElement("div");
      el.className = "marker" + (c.id === S.clubId ? " is-active" : "");
      el.style.left = px(c); el.style.top = py(c);
      el.style.animation = "ttm-pop .5s cubic-bezier(.34,1.56,.64,1) both";
      el.style.animationDelay = (0.04 * items.length) + "s";
      el.innerHTML =
        (c.id === S.clubId ? '<span class="marker-pulse"></span>' : "") +
        '<div class="marker-dot" style="background:linear-gradient(135deg,' + c.colors[0] + "," + c.colors[1] + ')"></div>';
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", c.name);
      host.appendChild(el);
      items.push({ el, club: c, dist, matches, best });
    });

    /* Tournois */
    if (o.showMatches) {
      D.TOURNAMENTS.forEach((t) => {
        const c = D.club(t.orgId);
        if (!c) return;
        const el = document.createElement("div");
        el.className = "marker is-tournament";
        el.style.left = px(c); el.style.top = py(c);
        el.innerHTML = '<div class="marker-pin" style="width:26px;height:26px">' + TTM.icon("trophy", 12) + "</div>";
        el.title = t.name;
        el.addEventListener("click", () => miniCard(t.orgId, t.name, t.cat, t.dist, t.date, "Tournoi", 100));
        host.appendChild(el);
      });
    }

    let mini = null;
    function miniCard(clubId, name, cat, dist, date, kind, pct) {
      hideMini();
      const c = D.club(clubId);
      const it = items.find((i) => i.club === c);
      mini = document.createElement("div");
      mini.className = "map-minicard";
      mini.style.left = it ? it.el.style.left : "50%";
      mini.style.top = it ? it.el.style.top : "50%";
      mini.innerHTML =
        '<div style="padding:12px 14px;border-bottom:1px solid var(--ttm-border)">' +
        '<div class="row-2">' + TTM.clubLogo(c, "club-logo-sm") +
        '<div class="flex-1"><div class="t-body-sm" style="font-weight:700">' + TTM.esc(c.name) + "</div>" +
        '<div class="t-micro t-muted">' + TTM.esc(c.city) + " · " + dist + " km</div></div>" + TTM.compatHTML(pct, "compat-ring-sm") + "</div></div>" +
        '<div style="padding:10px 14px"><div class="row-2" style="flex-wrap:wrap">' + TTM.catBadge(cat) +
        '<span class="t-micro t-secondary">' + TTM.esc(TTM.date.dayMin(date)) + " " + TTM.date.num(date) + " oct.</span>" +
        '<span class="badge badge-brand">' + kind + "</span></div>" +
        '<button class="btn btn-primary btn-sm btn-block" style="margin-top:10px" data-go>Voir le match</button></div>';
      host.appendChild(mini);
      mini.querySelector("[data-go]").onclick = () => { o.onSelect && o.onSelect(clubId); hideMini(); };
      setTimeout(() => document.addEventListener("click", outside), 0);
    }
    function outside(e) { if (mini && !mini.contains(e.target)) hideMini(); }
    function hideMini() {
      if (mini) { mini.remove(); mini = null; }
      document.removeEventListener("click", outside);
    }

    items.forEach((it) => {
      it.el.addEventListener("click", () => {
        const m = it.matches[0];
        miniCard(it.club.id, it.club.name, m ? m.cat : "—", it.dist, m ? m.date : "2026-10-03", m ? TTM.typeLabel[m.type] : "Club", it.best || 0);
      });
      it.el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); it.el.click(); } });
    });

    /* Contrôles */
    const ctl = document.createElement("div");
    ctl.className = "map-controls";
    ctl.innerHTML =
      '<button class="map-ctrl" data-z="in" aria-label="Zoom avant">' + TTM.icon("plus", 16) + "</button>" +
      '<button class="map-ctrl" data-z="out" aria-label="Zoom arrière">' + TTM.icon("minus", 16) + "</button>" +
      '<button class="map-ctrl" data-z="fit" aria-label="Recentrer">' + TTM.icon("target", 16) + "</button>";
    host.appendChild(ctl);

    let scale = 1, tx = 0, ty = 0;
    function apply() {
      items.forEach((it) => { it.el.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")"; });
      bg.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    }
    ctl.querySelector('[data-z="in"]').onclick = () => { scale = Math.min(2.4, scale * 1.25); apply(); TTM.haptic(8); };
    ctl.querySelector('[data-z="out"]').onclick = () => { scale = Math.max(0.7, scale / 1.25); apply(); TTM.haptic(8); };
    ctl.querySelector('[data-z="fit"]').onclick = () => { scale = 1; tx = 0; ty = 0; apply(); TTM.haptic(10); };

    /* Légende */
    const leg = document.createElement("div");
    leg.style.cssText = "position:absolute;left:12px;top:12px;z-index:3;display:flex;gap:10px;flex-wrap:wrap";
    leg.innerHTML =
      '<span class="badge badge-brand">● Clubs</span>' +
      '<span class="badge badge-warning">● Tournois</span>' +
      '<span class="badge">● Stades</span>';
    host.appendChild(leg);

    /* Échelle */
    const sc = document.createElement("div");
    sc.className = "map-scale";
    sc.innerHTML = '<span>≈ 20 km</span><div class="map-scale-bar"></div>';
    host.appendChild(sc);

    return { miniCard, hideMini };
  };
})(window);
