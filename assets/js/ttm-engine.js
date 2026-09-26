/* ============================================================
   TTM — Moteur de correspondance (Match Compatibility Score)
   7 critères pondérés · 100 points · explication par critère
   ============================================================ */
(function (global) {
  "use strict";

  const D = global.TTM_DATA;
  const TTM = global.TTM;

  const W = { cat: 25, dist: 20, date: 15, time: 12, level: 12, format: 10, hist: 6 };

  const MIN = {
    cat: ["U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16", "U17", "U18", "U19"],
    lvl: { 1: "Débutant", 2: "Intermédiaire", 3: "Avancé" }
  };

  const dayKey = (iso) => ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"][new Date(iso.split("-")[0], +iso.split("-")[1] - 1, +iso.split("-")[2]).getDay()];
  const toMin = (hhmm) => { const p = hhmm.split(":"); return +p[0] * 60 + +p[1]; };
  const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

  /* Historique de rencontres (synthétique, cohérent avec le dataset) */
  const HISTORY = {
    montreuil:  { met: 6, won: 3, lost: 2, draw: 1, last: "2026-09-20" },
    saintdenis: { met: 4, won: 2, lost: 1, draw: 1, last: "2026-09-13" },
    argenteuil: { met: 2, won: 1, lost: 0, draw: 1, last: "2026-06-07" },
    epinay:     { met: 3, won: 2, lost: 1, draw: 0, last: "2026-05-16" },
    versailles: { met: 1, won: 0, lost: 1, draw: 0, last: "2026-04-25" },
    cergy:      { met: 2, won: 1, lost: 1, draw: 0, last: "2026-03-14" },
    meaux:      { met: 0, won: 0, lost: 0, draw: 0, last: null },
    rouen:      { met: 0, won: 0, lost: 0, draw: 0, last: null },
    orleans:    { met: 0, won: 0, lost: 0, draw: 0, last: null }
  };

  const state = (r) => (r >= 0.8 ? "ok" : r >= 0.5 ? "warn" : "no");

  /* ------------------------------------------------------------
     SCORE DE CORRESPONDANCE
     ------------------------------------------------------------ */
  TTM.scoreMatch = function (m, teamId) {
    const team = D.team(teamId) || D.TEAMS[0];
    const pref = D.PREFS[team.id] || D.PREFS.u13;
    const cr = [];

    /* 1. CATÉGORIE — 25 */
    let catIdxM = MIN.cat.indexOf(m.cat), catIdxT = MIN.cat.indexOf(team.cat);
    const gap = catIdxM - catIdxT;
    const rCat = gap === 0 ? 1 : Math.abs(gap) === 1 ? 0.55 : 0.15;
    cr.push({
      key: "cat", label: "Catégorie", weight: W.cat, raw: W.cat * rCat, state: state(rCat),
      detail: m.cat === team.cat ? m.cat + " — identique" : "Écart de " + Math.abs(gap) + " catégorie" + (Math.abs(gap) > 1 ? "s" : ""),
      value: m.cat === team.cat ? m.cat : Math.abs(gap) + " cat. d'écart"
    });

    /* 2. DISTANCE — 20 */
    const limit = pref.maxDist;
    const rDist = m.dist <= limit ? 1 : m.dist <= limit * 1.4 ? 0.75 : m.dist <= limit * 2 ? 0.45 : 0.2;
    cr.push({
      key: "dist", label: "Distance", weight: W.dist, raw: W.dist * rDist, state: state(rDist),
      detail: m.dist + " km du stade " + (m.dist <= limit ? "(dans votre rayon)" : "(au-delà de " + limit + " km)"),
      value: m.dist + " km"
    });

    /* 3. DATE — 15 */
    const today = "2026-09-26";
    const dd = daysBetween(today, m.date);
    let rDate, dDate;
    if (dd < 0) { rDate = 0; dDate = "Match déjà passé"; }
    else if (dd <= 2) { rDate = 1; dDate = dd === 0 ? "Aujourd'hui" : dd === 1 ? "Demain" : "Dans 2 jours"; }
    else if (dd <= 5) { rDate = 0.8; dDate = "Dans " + dd + " jours"; }
    else if (dd <= 10) { rDate = 0.6; dDate = "Dans " + dd + " jours"; }
    else { rDate = 0.35; dDate = "Dans " + dd + " jours"; }
    if (dd >= 0 && pref.days.indexOf(dayKey(m.date)) === -1) { rDate *= 0.6; dDate += " · hors créneau "+team.name; }
    cr.push({ key: "date", label: "Date", weight: W.date, raw: W.date * rDate, state: state(rDate), detail: dDate, value: dDate });

    /* 4. HORAIRE — 12 */
    const t = toMin(m.time);
    const inWin = t >= toMin(pref.timeFrom) && t <= toMin(pref.timeTo);
    const near = t >= toMin(pref.timeFrom) - 90 && t <= toMin(pref.timeTo) + 90;
    const rTime = inWin ? 1 : near ? 0.6 : 0.25;
    cr.push({
      key: "time", label: "Horaire", weight: W.time, raw: W.time * rTime, state: state(rTime),
      detail: m.time + (inWin ? " · dans vos créneaux" : near ? " · proche de vos créneaux" : " · hors créneaux"),
      value: m.time
    });

    /* 5. NIVEAU — 12 */
    const allowed = pref.levels.indexOf(m.level) > -1;
    const rLvl = allowed ? 1 : m.level === 2 ? 0.6 : 0.35;
    cr.push({
      key: "level", label: "Niveau", weight: W.level, raw: W.level * rLvl, state: state(rLvl),
      detail: TTM.levelLabel[m.level] + (allowed ? " · conforme" : " · différent du vôtre"),
      value: TTM.levelLabel[m.level]
    });

    /* 6. FORMAT / TERRAIN — 10 */
    const okFmt = pref.formats.indexOf(m.format) > -1;
    const okPitch = m.format === "11v11" ? true : m.pitch === "Gazon synthétique";
    const rFmt = okFmt ? (okPitch ? 1 : 0.8) : 0.4;
    cr.push({
      key: "format", label: "Format", weight: W.format, raw: W.format * rFmt, state: state(rFmt),
      detail: m.format + " · " + m.pitch.toLowerCase() + (okFmt ? "" : " · hors format habituel"),
      value: m.format
    });

    /* 7. HISTORIQUE — 6 */
    const h = HISTORY[m.clubId] || { met: 0 };
    const rHist = h.met === 0 ? 0.6 : Math.min(1, 0.65 + h.met * 0.05);
    cr.push({
      key: "hist", label: "Historique", weight: W.hist, raw: W.hist * rHist, state: state(rHist),
      detail: h.met === 0 ? "Aucune rencontre récente" : h.met + " rencontre" + (h.met > 1 ? "s" : "") + " déjà disputée" + (h.met > 1 ? "s" : ""),
      value: h.met === 0 ? "Nouveau" : h.met + " match" + (h.met > 1 ? "s" : "")
    });

    const total = cr.reduce((s, c) => s + c.raw, 0);
    const pct = Math.round(total);
    return { pct, criteria: cr, teamId: team.id, matchId: m.id };
  };

  /* ------------------------------------------------------------
     FILTRES
     ------------------------------------------------------------ */
  TTM.filterMatches = function (f, teamId) {
    const S = TTM.store.get();
    const fl = f || S.filters;
    const list = D.AVAILABLE.filter((m) => {
      if (fl.cats.length && fl.cats.indexOf(m.cat) === -1) return false;
      if (fl.dist && m.dist > fl.dist) return false;
      if (fl.levels.length && fl.levels.indexOf(m.level) === -1) return false;
      if (fl.types.length && fl.types.indexOf(m.type) === -1) return false;
      if (fl.cities.length && fl.cities.indexOf(m.city) === -1) return false;
      if (fl.dates.length && fl.dates.indexOf(m.date) === -1) return false;
      if (fl.times.length) {
        const h = +m.time.split(":")[0];
        const ok = fl.times.some((t) => t === "matin" ? h < 12 : t === "aprem" ? h >= 12 && h < 17 : h >= 17);
        if (!ok) return false;
      }
      if (fl.q) {
        const c = D.club(m.clubId) || {};
        const hay = (c.name + " " + m.city + " " + m.venue + " " + m.cat).toLowerCase();
        if (hay.indexOf(fl.q.toLowerCase()) === -1) return false;
      }
      if (fl.onlyCompat && teamId && teamId !== "all") {
        if (TTM.scoreMatch(m, teamId).pct < 70) return false;
      }
      return true;
    });
    if (teamId && teamId !== "all") {
      list.forEach((m) => { m._score = TTM.scoreMatch(m, teamId); });
      list.sort((a, b) => b._score.pct - a._score.pct || a.dist - b.dist);
    } else {
      list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    }
    return list;
  };

  /* ------------------------------------------------------------
     RECOMMANDATIONS
     ------------------------------------------------------------ */
  TTM.recommend = function (teamId, n) {
    const list = D.AVAILABLE.map((m) => Object.assign({}, m, { _score: TTM.scoreMatch(m, teamId) }));
    list.sort((a, b) => b._score.pct - a._score.pct);
    return list.slice(0, n || 3);
  };

  /* ------------------------------------------------------------
     CALENDRIER
     ------------------------------------------------------------ */
  TTM.calendar = function (year, month) {
    const first = new Date(year, month, 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      const evts = [];
      D.MY_MATCHES.forEach((m) => { if (m.date === iso) evts.push(Object.assign({ kind: "match" }, m)); });
      D.AVAILABLE.forEach((m) => { if (m.date === iso && (m._score || TTM.scoreMatch(m, "u15a")).pct >= 80) evts.push(Object.assign({ kind: "avail" }, m)); });
      D.TOURNAMENTS.forEach((t) => { if (t.date === iso) evts.push(Object.assign({ kind: "tournament" }, t)); });
      if (i >= 35 && d.getMonth() !== month) break;
      days.push({ iso, day: d.getDate(), inMonth: d.getMonth() === month, dow: d.getDay(), events: evts });
    }
    return days;
  };

  /* ------------------------------------------------------------
     NOTIFICATIONS INTELLIGENTES (génération)
     ------------------------------------------------------------ */
  TTM.smartNotify = function (kind, payload) {
    const p = payload || {};
    const map = {
      match_recommended: { level: "urgent", title: "Un match " + p.cat + " à " + p.dist + " km correspond à vos préférences", body: p.club + " cherche un adversaire " + p.day + " " + p.date + " à " + p.time + ". " + p.pct + "% compatible." },
      request_accepted: { level: "success", title: p.club + " a accepté votre demande", body: "Match " + p.cat + " du " + p.date + " à " + p.time + " confirmé. Ajouté à vos calendriers." },
      request_declined: { level: "info", title: "Demande refusée", body: p.club + " n'est pas disponible le " + p.date + "." },
      tournament: { level: "important", title: "Un tournoi " + p.cat + " vient d'être publié", body: p.name + " — " + p.date + ", " + p.slots + " places restantes." },
      time_change: { level: "important", title: "Modification d'horaire", body: "Match " + p.cat + " vs " + p.opp + " décalé au " + p.date + " à " + p.time + "." },
      location_change: { level: "important", title: "Modification de lieu", body: "Match " + p.cat + " vs " + p.opp + " : " + p.venue + "." },
      new_message: { level: "info", title: "Nouveau message de " + p.club, body: "« " + p.msg + " »" },
      convocation: { level: "info", title: "Convocation — " + p.n + " joueurs", body: "Convocations envoyées pour " + p.cat + " vs " + p.opp + " (" + p.day + " " + p.time + ")." }
    };
    const cfg = map[kind] || { level: "info", title: "Notification", body: "" };
    return { id: "gen" + Date.now(), type: kind, level: cfg.level, title: cfg.title, body: cfg.body, t: "à l'instant", read: false, link: p.link || "" };
  };

  TTM.pushNotification = function (n) {
    const S = TTM.store.get();
    S.notifications.unshift(n);
    TTM.store.emit();
    const t = TTM.toast(n.title, n.body, n.level === "success" ? "success" : n.level === "urgent" ? "warning" : "info", { action: "Voir" });
    return t;
  };

  /* ------------------------------------------------------------
     WORKFLOW DE DEMANDE (simulation)
     ------------------------------------------------------------ */
  TTM.sendRequest = function (m, teamId, msg, onStep) {
    const c = D.club(m.clubId);
    const S = TTM.store.get();
    const req = {
      id: "r" + Date.now(), matchId: m.id, from: S.clubId, to: m.clubId, teamId: teamId,
      cat: m.cat, date: m.date, status: "pending", sent: new Date().toISOString(), msg: msg || ""
    };
    S.requests.unshift(req);
    TTM.store.emit();
    const steps = [0, 1];
    steps.forEach((i, k) => setTimeout(() => onStep && onStep(i), 380 + k * 1100));
    return req;
  };

  TTM.acceptRequest = function (id) {
    const S = TTM.store.get();
    const r = S.requests.find((x) => x.id === id);
    if (!r) return;
    r.status = "accepted";
    const m = D.match(r.matchId);
    if (m && !D.MY_MATCHES.find((x) => x.matchId === r.matchId)) {
      D.MY_MATCHES.push({
        id: "my" + Date.now(), opp: (D.club(m.clubId) || {}).name, oppId: m.clubId, teamId: r.teamId,
        cat: r.cat, date: m.date, time: m.time, venue: m.venue, city: m.city, type: m.type,
        status: "confirmed", home: false, result: null, matchId: m.id
      });
    }
    TTM.pushNotification(TTM.smartNotify("request_accepted", { club: (D.club(r.to) || {}).name, cat: r.cat, date: TTM.date.fmt(r.date), time: m ? m.time : "" }));
    TTM.store.emit();
  };

  TTM.declineRequest = function (id) {
    const S = TTM.store.get();
    const r = S.requests.find((x) => x.id === id);
    if (!r) return;
    r.status = "declined";
    TTM.pushNotification(TTM.smartNotify("request_declined", { club: (D.club(r.from) || {}).name, date: TTM.date.fmt(r.date) }));
    TTM.store.emit();
  };

  /* ------------------------------------------------------------
     WORKFLOW VISUEL (4 étapes)
     ------------------------------------------------------------ */
  TTM.workflowHTML = function (current, labels) {
    const L = labels || D.WORKFLOW;
    return '<div class="timeline">' + L.map((l, i) => {
      const st = i < current ? "done" : i === current ? "current" : "";
      const ico = i < current ? "check" : i === current ? "clock" : "";
      return '<div class="tl-item ' + st + '"><div class="tl-rail"><div class="tl-node">' + TTM.icon(ico, 16) + "</div></div>" +
        '<div class="tl-body"><div class="tl-title">' + TTM.esc(l) + "</div>" +
        (i < current ? '<div class="tl-meta">' + (i === 0 ? "Il y a 2 minutes" : i === 1 ? "FC notifié par e-mail et push" : "Réponse enregistrée") + "</div>" :
          i === current ? '<div class="tl-meta">En cours…</div>' : '<div class="tl-meta">À venir</div>') +
        "</div></div>";
    }).join("") + "</div>";
  };

  /* ------------------------------------------------------------
     STATS DYNAMIQUES
     ------------------------------------------------------------ */
  TTM.liveStats = function () {
    const S = TTM.store.get();
    return {
      available: D.AVAILABLE.length,
      requests: S.requests.length,
      pending: S.requests.filter((r) => r.status === "pending").length,
      notifications: S.notifications.filter((n) => !n.read).length,
      unreadMsgs: S.threads.reduce((s, t) => s + t.unread, 0)
    };
  };
})(window);
