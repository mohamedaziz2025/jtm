/* ============================================================
   TTM — Application web (prototype interactif)
   Routeur hash · vues · partials · interactions métier
   ============================================================ */
(function () {
  "use strict";

  const TTM = window.TTM;
  const D = window.TTM_DATA;
  const E = TTM.esc;
  const $ = TTM.$;
  const $$ = TTM.$$;
  const st = () => TTM.store.get();

  const TODAY = "2026-09-26";

  /* ---------- état d'interface (non persistant) ---------- */
  const UI = {
    calY: 2026,
    calM: 9,
    calDay: "2026-10-03",
    mkSort: "compat",
    mkCols: true,
    msgId: "s1",
    reqTab: "in",
    myTab: "up",
    clubQ: "",
    clubScope: "idf",
    setTab: "profil"
  };

  const PREF_UI = {
    "notif-push": true,
    "notif-match": true,
    "notif-urgent": true,
    "notif-digest": false,
    "notif-message": true,
    "pref-compact": false,
    "pref-anim": true
  };

  /* ==========================================================
     HELPERS
     ========================================================== */
  const club = (id) => D.club(id) || { id: id, name: "—", short: "?", city: "—", dept: "", colors: ["#64748B", "#94A3B8"] };
  const refTeam = () => (st().activeTeam === "all" ? "u15a" : st().activeTeam);
  const refTeamName = () => (st().activeTeam === "all" ? "Toutes les équipes" : (D.team(refTeam()) || {}).name || "—");
  const home = () => club(st().clubId);
  const scoreOf = (m, tid) => TTM.scoreMatch(m, tid || refTeam());
  const fmtD = (iso) => TTM.date.fmt(iso);
  const fmtDL = (iso) => TTM.date.fmt(iso, { m: "long", y: true });
  const deptOf = (c) => String(c.dept || "").split(" (")[0];
  const distHome = (c) => TTM.distance(home(), c);
  const isIdf = (c) => /Seine-Saint-Denis|Val-d'Oise|Hauts-de-Seine|Yvelines|Seine-et-Marne/.test(c.dept || "");
  const typeOf = (m) => TTM.typeLabel[m.type] || m.type;
  const cap = (s) => String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1);

  const NOTIF_ICO = {
    match_offer: "target",
    request_accepted: "checkCircle",
    request_received: "handshake",
    request_declined: "x",
    tournament: "trophy",
    time_change: "clock",
    location_change: "mapPin",
    new_message: "message",
    convocation: "clipboardCheck"
  };

  const STATUS_BADGE = {
    pending: ["warning", "clock", "En attente"],
    accepted: ["success", "checkCircle", "Confirmé"],
    confirmed: ["success", "checkCircle", "Confirmé"],
    declined: ["danger", "x", "Refusé"],
    played: ["", "flag", "Terminé"]
  };

  /* ==========================================================
     PARTIALS
     ========================================================== */

  function kpi(o) {
    return (
      '<div class="kpi kpi-accent-' + (o.accent || "blue") + ' reveal" data-reveal-delay="' + (o.d || 0) + '">' +
      '<div class="kpi-top"><div class="kpi-ico">' + TTM.icon(o.ico, 20) + "</div>" +
      (o.delta
        ? '<span class="kpi-delta ' + (o.up === false ? "down" : "up") + '">' +
          TTM.icon(o.up === false ? "trendingDown" : "trendingUp", 13) + E(o.delta) + "</span>"
        : "") +
      "</div>" +
      '<div><div class="kpi-val t-num" data-count="' + o.val + '"' + (o.suffix ? ' data-suffix="' + E(o.suffix) + '"' : "") + ">0</div>" +
      '<div class="kpi-label">' + E(o.label) + "</div></div></div>"
    );
  }

  function badge(cls, ico, label) {
    return '<span class="badge ' + cls + '">' + (ico ? TTM.icon(ico, 12) : "") + E(label) + "</span>";
  }

  function statusBadge(stt) {
    const b = STATUS_BADGE[stt] || ["", "", stt];
    return badge(b[0], b[1], b[2]);
  }

  function critList(s) {
    return (
      '<div class="crit-list">' +
      s.criteria
        .map(
          (c) =>
            '<div class="crit"><div class="crit-left">' +
            '<span class="crit-ico crit-' + c.state + '">' + TTM.icon(c.state === "ok" ? "check" : c.state === "warn" ? "alert" : "x", 12) + "</span>" +
            "<span><b style=\"color:var(--ttm-text)\">" + E(c.label) + '</b> <span class="t-muted">· ' + E(c.detail) + "</span></span></div>" +
            '<div class="crit-val">' + Math.round(c.raw) + '<span class="t-muted">/' + c.weight + "</span></div></div>"
        )
        .join("") +
      "</div>"
    );
  }

  function matchCard(m) {
    const c = club(m.clubId);
    const s = scoreOf(m);
    const already = st().requests.find((r) => r.matchId === m.id && r.status === "pending");
    const mine = st().requests.find((r) => r.matchId === m.id && r.status === "accepted");
    return (
      '<article class="match-card mk-card reveal" data-reveal-delay="0.05">' +
      '<div class="match-card-top"><div class="mk-card-club flex-1">' +
      TTM.clubLogo(c, "club-logo-sm") +
      '<div class="flex-1" style="min-width:0"><div class="t-body-sm" style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + E(c.name) + "</div>" +
      '<div class="t-micro t-muted">' + E(c.city) + " · " + m.dist + " km</div></div></div>" +
      TTM.compatHTML(s.pct, "compat-ring-sm") + "</div>" +
      '<div class="match-card-body">' +
      '<div class="row-2 wrap" style="gap:7px">' + TTM.catBadge(m.cat) + badge("", "", typeOf(m)) + badge("badge-brand", "", m.format) + badge("", "", TTM.levelLabel[m.level]) + "</div>" +
      '<div class="mk-facts">' +
      fact("calendar", "<b>" + E(TTM.date.dayMin(m.date)) + "</b> " + E(fmtD(m.date)) + " · " + E(m.time)) +
      fact("mapPin", "<b>" + m.dist + " km</b> de " + E(home().city)) +
      fact("whistle", E(m.pitch) + " · " + E(m.venue)) +
      fact("users", E(m.venue) + " (" + E(m.city) + ")") +
      "</div>" +
      (m.note ? '<p class="t-caption t-secondary" style="line-height:1.5">' + E(m.note) + "</p>" : "") +
      "</div>" +
      '<div class="match-card-foot"><span class="match-meta">' + TTM.icon("clock", 14) + "Publié il y a 2 j</span>" +
      '<div class="row-2">' +
      '<button class="btn btn-outline btn-xs" data-act="open" data-id="' + m.id + '">Détails</button>' +
      (mine
        ? '<button class="btn btn-success btn-xs" disabled>' + TTM.icon("check", 14) + "Confirmé</button>"
        : '<button class="btn btn-primary btn-xs" data-act="req" data-id="' + m.id + '"' + (already ? " disabled" : "") + ">" +
          (already ? "Demandé" : TTM.icon("send", 14) + "Demander") + "</button>") +
      "</div></div></article>"
    );
  }

  function fact(ico, html) {
    return '<div class="mk-fact">' + TTM.icon(ico, 14) + html + "</div>";
  }

  function notifRow(n, compact) {
    return (
      '<div class="notif ' + (n.read ? "" : "unread") + '" data-act="notif" data-id="' + n.id + '">' +
      '<div class="notif-ico level-' + (n.level || "info") + '">' + TTM.icon(NOTIF_ICO[n.type] || "info", 18) + "</div>" +
      '<div class="flex-1" style="min-width:0"><div class="notif-title">' + E(n.title) + "</div>" +
      '<div class="notif-msg">' + E(n.body) + "</div>" +
      '<div class="notif-time">' + E(n.t) + "</div></div></div>"
    );
  }

  function empty(ico, title, text, cta) {
    return (
      '<div class="empty"><div class="empty-ico">' + TTM.icon(ico, 30) + "</div>" +
      '<div class="empty-title">' + E(title) + '</div><div class="empty-text">' + E(text) + "</div>" +
      (cta ? '<button class="btn btn-primary btn-sm" data-act="' + cta.act + '">' + TTM.icon(cta.ico || "arrowRight", 16) + E(cta.label) + "</button>" : "") +
      "</div>"
    );
  }

  function teamSwitch() {
    const a = st().activeTeam;
    return (
      '<div class="team-switch">' +
      '<button class="chip chip-sm ' + (a === "all" ? "is-active" : "") + '" data-team="all">Toutes</button>' +
      D.TEAMS.map((t) => '<button class="chip chip-sm ' + (a === t.id ? "is-active" : "") + '" data-team="' + t.id + '">' + E(t.name) + "</button>").join("") +
      "</div>"
    );
  }

  function chipsBar() {
    const f = st().filters;
    const active = [];
    f.cats.forEach((v) => active.push({ k: "cats", v, l: v }));
    f.levels.forEach((v) => active.push({ k: "levels", v, l: TTM.levelLabel[v] }));
    f.types.forEach((v) => active.push({ k: "types", v, l: typeOf({ type: v }) }));
    f.times.forEach((v) => active.push({ k: "times", v, l: { matin: "Matin", aprem: "Après-midi", soir: "Soir" }[v] }));
    f.cities.forEach((v) => active.push({ k: "cities", v, l: v }));
    f.dates.forEach((v) => active.push({ k: "dates", v, l: fmtD(v) }));
    if (!f.onlyCompat) active.push({ k: "onlyCompat", v: "off", l: "Sans filtre de compatibilité" });
    if (f.dist < 60) active.push({ k: "dist", v: f.dist, l: "≤ " + f.dist + " km" });
    if (f.q) active.push({ k: "q", v: f.q, l: "« " + f.q + " »" });
    if (!active.length) return "";
    return (
      '<div class="row-2 wrap" style="gap:7px">' +
      active.map((a) => '<span class="chip chip-sm is-active">' + E(a.l) + '<span class="chip-close" data-act="unfilter" data-k="' + a.k + '" data-v="' + E(a.v) + '">' + TTM.icon("x", 12) + "</span></span>").join("") +
      '<button class="btn btn-ghost btn-xs" data-act="reset-filters">Tout effacer</button></div>'
    );
  }

  /* ==========================================================
     ROUTEUR
     ========================================================== */
  const ROUTES = {};

  function parseHash() {
    const raw = String(location.hash || "").replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    const name = parts[0] && ROUTES[parts[0]] ? parts[0] : "dashboard";
    return { name: name, id: parts[1] || "" };
  }

  function go(path) {
    const next = "#/" + String(path).replace(/^#?\/?/, "");
    if (location.hash === next) render();
    else location.hash = next;
  }

  function titleOf(def, r) {
    return typeof def.title === "function" ? def.title(r) : def.title;
  }

  function render() {
    const r = parseHash();
    const def = ROUTES[r.name];
    const view = $("#view");
    view.innerHTML = def.view(r);
    $("#pageTitle").textContent = titleOf(def, r);
    $("#crumbs").innerHTML =
      '<span>TTM</span><span class="sep">/</span><span>' + E(titleOf(def, r)) + "</span>";
    $$("#nav .nav-item").forEach((a) => a.classList.toggle("is-active", a.dataset.go === r.name));
    TTM.closeAll();
    document.body.classList.remove("sidebar-open");
    TTM.initReveal(view);
    TTM.initCompat(view);
    TTM.countAll(view);
    TTM.animBars(view);
    if (def.mount) def.mount(r, view);
  }

  function notFound() {
    return empty("search", "Vue introuvable", "Cette page n'existe pas dans le prototype.", { act: "home", label: "Retour au dashboard", ico: "home" });
  }

  /* ==========================================================
     CHROME (sidebar, topbar, badges)
     ========================================================== */
  function paintChrome() {
    const s = st();
    const h = home();
    const stats = TTM.liveStats();

    $("#brandMark").innerHTML = TTM.logo(32);
    $("#collapseIco").innerHTML = TTM.icon("chevronLeft", 16);
    $("#clubLogo").innerHTML = TTM.clubLogo(h, "club-logo-sm");
    $("#clubLogo2").innerHTML = TTM.clubLogo(h, "club-logo-sm");
    $("#clubChev").innerHTML = TTM.icon("chevronDown", 16);
    $("#userAvatar").innerHTML = TTM.avatar(s.user.name, "avatar-sm", 0);

    setTxt("#navBadgeMatches", s.filters.onlyCompat ? D.AVAILABLE.length : D.AVAILABLE.length);
    setTxt("#navBadgeMsgs", stats.unreadMsgs);
    setTxt("#navBadgeReq", stats.pending);
    setTxt("#navBadgeNotif", stats.notifications);
    setTxt("#topBadge", stats.notifications);
    const tb = $("#topBadge");
    if (tb) tb.style.display = stats.notifications ? "" : "none";

    const dd = $("#ddNotifs");
    if (dd) dd.innerHTML = s.notifications.slice(0, 5).map((n) => notifRow(n, true)).join("") ||
      '<div class="empty" style="padding:24px"><div class="empty-title t-body-sm">Aucune notification</div></div>';
  }

  function setTxt(sel, v) {
    const el = $(sel);
    if (el) el.textContent = v;
  }

  /* ==========================================================
     AMORÇAGE
     ========================================================== */
  function init() {
    $$("[data-ico]").forEach((el) => {
      el.innerHTML = TTM.icon(el.dataset.ico, +(el.dataset.size || 18));
    });
    paintChrome();
    if (!location.hash) location.hash = "#/dashboard";
    window.addEventListener("hashchange", render);
    render();
    bindGlobal();
    TTM.store.sub(() => {
      paintChrome();
      if (document.querySelector(".modal.is-open, .sheet.is-open, .drawer.is-open")) return;
      const r = parseHash();
      if (["messages", "requests", "notifications", "mymatches", "calendar", "marketplace", "teams", "tournaments", "clubs", "stats", "map", "settings", "dashboard"].indexOf(r.name) > -1) render();
    });
    TTM.toast("Bienvenue sur TTM", "Prototype interactif · " + D.AVAILABLE.length + " matchs disponibles dans votre réseau.", "info", { duration: 5200 });
  }

  document.addEventListener("DOMContentLoaded", init);

  /* ==========================================================
     ÉVÉNEMENTS GLOBAUX
     ========================================================== */
  function bindGlobal() {
    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    document.addEventListener("input", onInput);
    document.addEventListener("keydown", onKey);
    document.addEventListener("submit", onSubmit);

    $("#collapseBtn").onclick = () => {
      document.body.classList.toggle("sidebar-min");
      TTM.haptic(8);
    };
    $("#menuBtn").onclick = () => {
      document.body.classList.toggle("sidebar-open");
      TTM.haptic(8);
    };
    $("#themeBtn").onclick = () => TTM.theme.toggle();

    const gs = $("#globalSearch");
    const gi = gs.querySelector("input");
    let t = null;
    gi.addEventListener("input", () => {
      gs.classList.toggle("has-value", !!gi.value);
      clearTimeout(t);
      t = setTimeout(() => {
        st().filters.q = gi.value.trim();
        if (parseHash().name !== "marketplace") go("marketplace");
        else render();
      }, 420);
    });
    gs.querySelector(".s-clear").onclick = () => {
      gi.value = "";
      gs.classList.remove("has-value");
      st().filters.q = "";
      render();
    };
  }

  function onClick(e) {
    const nav = e.target.closest("[data-go]");
    if (nav) {
      e.preventDefault();
      go(nav.dataset.go + (nav.dataset.arg ? "/" + nav.dataset.arg : ""));
      return;
    }
    const team = e.target.closest("[data-team]");
    if (team) {
      st().activeTeam = team.dataset.team;
      const r = parseHash();
      if (r.name === "marketplace" || r.name === "dashboard") render();
      TTM.haptic(8);
      return;
    }
    const act = e.target.closest("[data-act]");
    if (act) {
      if (act.tagName === "A") e.preventDefault();
      onAct(act.dataset.act, act, e);
      return;
    }
    const f = e.target.closest("[data-f]");
    if (f) {
      toggleFilter(f.dataset.f, f.dataset.v);
      return;
    }
    if (e.target.closest(".s-clear")) {
      const sb = e.target.closest(".search-bar");
      const inp = sb.querySelector("input");
      inp.value = "";
      sb.classList.remove("has-value");
      st().filters.q = "";
      render();
    }
  }

  function onKey(e) {
    if (e.key !== "Enter") return;
    const t = e.target;
    if (t.id === "mkSearch") {
      st().filters.q = t.value.trim();
      render();
    } else if (t.id === "chatInput") {
      e.preventDefault();
      const f = t.closest("form");
      if (f) f.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  }

  function onChange(e) {
    const el = e.target;
    if (el.id === "mkSort") {
      UI.mkSort = el.value;
      render();
      return;
    }
    if (el.id === "reqTeam") {
      const t = D.team(el.value);
      const hint = $("#reqTeamHint");
      if (t && hint) {
        const p = D.PREFS[t.id];
        hint.textContent = p
          ? "Rayon " + p.maxDist + " km · " + cap(p.days.join(" et ")) + " · " + p.timeFrom + "-" + p.timeTo + " · " + p.formats.join("/")
          : "";
      }
      return;
    }
    const sw = el.closest("[data-sw]");
    if (!sw) return;
    const k = sw.dataset.sw;
    if (k === "dist") {
      st().filters.dist = +el.value;
      const l = $("#distVal");
      if (l) l.textContent = el.value + " km";
      render();
    } else if (k === "onlyCompat") {
      st().filters.onlyCompat = el.checked;
      render();
    } else {
      PREF_UI[k] = el.checked;
      const names = {
        "notif-push": "Notifications push",
        "notif-match": "Nouveaux matchs",
        "notif-urgent": "Alertes urgentes",
        "notif-digest": "Résumé hebdomadaire",
        "notif-message": "Nouveaux messages",
        "pref-compact": "Affichage compact",
        "pref-anim": "Animations"
      };
      TTM.toast((names[k] || k) + (el.checked ? " activé" : " désactivé"), "Préférence enregistrée pour le compte club.", el.checked ? "success" : "info");
      document.body.classList.toggle("pref-compact", !!PREF_UI["pref-compact"]);
    }
  }

  function onInput(e) {
    const el = e.target;
    if (el.id === "clubSearch") {
      UI.clubQ = el.value.trim();
      const host = $("#clubList");
      if (host) {
        host.innerHTML = clubCards();
        TTM.initReveal(host);
        TTM.initCompat(host);
      }
    } else if (el.id === "mkSearch") {
      st().filters.q = el.value.trim();
      clearTimeout(onInput.t);
      onInput.t = setTimeout(refreshMarket, 260);
    } else if (el.dataset.range === "dist") {
      st().filters.dist = +el.value;
      const l = $("#distVal");
      if (l) l.textContent = el.value + " km";
    } else if (el.dataset.range === "slots") {
      const l = el.parentElement.parentElement.querySelector(".slider-val");
      if (l) l.textContent = el.value;
    }
  }

  function onSubmit(e) {
    const f = e.target;
    if (f.id === "chatForm") {
      e.preventDefault();
      sendMessage(f.querySelector("textarea").value);
    } else if (f.dataset.form === "request") {
      e.preventDefault();
      submitRequest(f);
    } else if (f.dataset.form === "publish") {
      e.preventDefault();
      submitPublish(f);
    } else if (f.dataset.form === "join") {
      e.preventDefault();
      submitJoin(f);
    } else if (f.dataset.form === "prefs") {
      e.preventDefault();
      saveTeamPrefs(f);
    } else if (f.dataset.form === "newclub") {
      e.preventDefault();
      submitNewClub(f);
    } else if (f.dataset.form === "profile") {
      e.preventDefault();
      TTM.toast("Profil enregistré", "Les informations du club ont été mises à jour.", "success");
      TTM.closeAll();
    }
  }

  /* ---------- filtres ---------- */
  function toggleFilter(k, v) {
    const f = st().filters;
    TTM.haptic(8);
    if (k === "onlyCompat") {
      f.onlyCompat = v !== "on";
    } else if (Array.isArray(f[k])) {
      const i = f[k].indexOf(v);
      if (i > -1) f[k].splice(i, 1);
      else f[k].push(v);
    } else {
      f[k] = v;
    }
    render();
  }

  function unfilter(k, v) {
    const f = st().filters;
    if (Array.isArray(f[k])) {
      const i = f[k].indexOf(v);
      if (i > -1) f[k].splice(i, 1);
    } else if (k === "onlyCompat") {
      f.onlyCompat = true;
    } else if (k === "dist") {
      f.dist = 60;
    } else if (k === "q") {
      f.q = "";
    }
    render();
  }

  /* ---------- actions ---------- */
  function onAct(name, el, ev) {
    const id = el.dataset.id;
    TTM.haptic(8);
    switch (name) {
      case "home":
        go("dashboard");
        break;
      case "open":
        openMatchModal(id);
        break;
      case "req":
        openRequestModal(id);
        break;
      case "pub":
        openPublishModal();
        break;
      case "readall": {
        st().notifications.forEach((n) => (n.read = true));
        TTM.toast("Notifications lues", "Toutes les notifications sont marquées comme lues.", "success");
        render();
        break;
      }
      case "notif": {
        const n = st().notifications.find((x) => x.id === id);
        if (n) {
          n.read = true;
          if (n.link) go(n.link);
          else render();
        }
        break;
      }
      case "unfilter":
        unfilter(el.dataset.k, el.dataset.v);
        break;
      case "reset-filters":
        st().filters = { cats: [], dist: 60, dates: [], times: [], levels: [], types: [], cities: [], onlyCompat: true, q: "" };
        render();
        break;
      case "reset":
        TTM.store.reset();
        render();
        break;
      case "upgrade":
        openPlansModal();
        break;
      case "parent":
        openParentsModal();
        break;
      case "switchcoach": {
        const s = st();
        s.user = D.USERS[1];
        paintChrome();
        TTM.toast("Vue Coach active", "Connecté en tant que " + s.user.name + " · " + s.user.role + ". Les vues club restent accessibles en lecture.", "info");
        render();
        break;
      }
      case "logout":
        TTM.toast("Déconnexion simulée", "Dans une version réelle, la session serait fermée via le fournisseur d'identité.", "info");
        break;
      case "newclub":
        openNewClubModal();
        break;
      case "club-profile":
        openClubModal(id);
        break;
      case "club-matches":
        st().filters.cities = [club(id).city];
        st().filters.q = "";
        go("marketplace");
        break;
      case "team-matches":
        st().activeTeam = id;
        go("marketplace");
        break;
      case "team-prefs":
        openTeamPrefsModal(id);
        break;
      case "convoq":
        openConvoqueModal(id);
        break;
      case "coach-msg":
        openCoachModal(id);
        break;
      case "coach-call":
        TTM.toast("Appel simulé", "Le téléphone du coach s'ouvrirait ici (données de démonstration).", "info");
        break;
      case "join":
        openTournamentModal(id);
        break;
      case "thread": {
        UI.msgId = id;
        const t = st().threads.find((x) => x.id === id);
        if (t) t.unread = 0;
        render();
        break;
      }
      case "req-accept":
        doAccept(id);
        break;
      case "req-decline":
        doDecline(id);
        break;
      case "req-detail":
        openRequestDetail(id);
        break;
      case "result":
        openResultModal(id);
        break;
      case "req-remind":
        TTM.toast("Relance envoyée", "Un rappel a été envoyé au club et une notification push générée.", "success");
        TTM.pushNotification(TTM.smartNotify("match_recommended", { cat: "U15", dist: 15, club: "FC Montreuil", day: "samedi", date: "3 octobre", time: "15h00", pct: 92, link: "requests" }));
        break;
      case "mk-cols":
        UI.mkCols = !UI.mkCols;
        render();
        break;
      case "mk-filters":
        TTM.sheet({ title: "Filtres", body: filterPanel(), footer: '<button class="btn btn-primary btn-block" data-x>Voir les résultats</button>' });
        break;
      case "cal-prev":
        shiftMonth(-1);
        break;
      case "cal-next":
        shiftMonth(1);
        break;
      case "cal-today":
        UI.calY = 2026;
        UI.calM = 9;
        UI.calDay = "2026-10-03";
        render();
        break;
      case "cal-day":
        UI.calDay = el.dataset.iso;
        render();
        break;
      case "set-tab":
        UI.setTab = el.dataset.v;
        render();
        break;
      case "my-tab":
        UI.myTab = el.dataset.v;
        render();
        break;
      case "req-tab":
        UI.reqTab = el.dataset.v;
        render();
        break;
      case "club-scope":
        UI.clubScope = el.dataset.v;
        render();
        break;
      case "share":
        TTM.toast("Lien copié", "Lien de partage du match copié dans le presse-papiers (simulation).", "success");
        break;
      case "print":
        TTM.toast("Export PDF", "Dans la version finale, la fiche match serait exportée en PDF.", "info");
        break;
      case "download":
        TTM.toast("Export CSV", "Le calendrier du club serait exporté au format CSV (simulation).", "info");
        break;
      case "theme":
        TTM.theme.set(el.dataset.v);
        render();
        break;
      case "edit-club":
        openEditClubModal();
        break;
      case "resend-code":
        TTM.toast("Code renvoyé", "Un nouveau code de connexion a été envoyé par e-mail.", "success");
        break;
      case "close":
        TTM.closeAll();
        break;
      default:
        break;
    }
  }

  function shiftMonth(k) {
    let m = UI.calM + k;
    let y = UI.calY;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    UI.calM = m;
    UI.calY = y;
    const days = TTM.calendar(y, m);
    const first = days.find((d) => d.inMonth && d.events.length) || days.find((d) => d.inMonth);
    UI.calDay = first ? first.iso : UI.calDay;
    render();
  }

  const byDate = (a, b) => (a.date || "").localeCompare(b.date || "") || (a.time || "").localeCompare(b.time || "");

  /* ==========================================================
     VUE · DASHBOARD
     ========================================================== */
  ROUTES.dashboard = {
    title: "Dashboard",
    view: function () {
      const s = st();
      const h = home();
      const K = D.STATS.kpi;
      const upcoming = D.MY_MATCHES.filter((m) => m.status !== "played").sort(byDate);
      const nextM = upcoming[0];
      const recs = TTM.recommend(refTeam(), 3);
      const pending = s.requests.filter((r) => r.status === "pending");
      const unread = s.threads.filter((t) => t.unread > 0);
      const tours = D.TOURNAMENTS.slice().sort(byDate).slice(0, 3);

      return `<div class="stack stack-7">
  <div class="grid-dash">
    <div class="stack stack-5">

      <section class="hero-band reveal">
        <div class="pitch-host" id="pitchHero"></div>
        <div class="hero-band-inner stack stack-4">
          <div class="row-2 wrap" style="gap:8px">
            <span class="badge" style="background:rgba(255,255,255,.14);color:#fff">${TTM.icon("sparkles", 12)}Moteur de correspondance actif</span>
            <span class="badge" style="background:rgba(34,197,94,.2);color:#86EFAC"><span class="badge-dot"></span>${D.AVAILABLE.length} matchs en réseau</span>
          </div>
          <h3>Trouve ton match.<br><span style="color:#67E8F9">${recs.length ? recs[0]._score.pct + " % de compatibilité" : "100 %"}</span> pour ${E(refTeamName())}.</h3>
          <p>TTM compare niveau, distance, créneaux, format et historique pour proposer à chaque équipe l'adversaire le plus cohérent, puis gère la demande jusqu'à la confirmation.</p>
          <div class="row-2 wrap">
            <button class="btn btn-primary btn-lg" data-go="marketplace">${TTM.icon("target", 18)}Trouver un match</button>
            <button class="btn btn-outline btn-lg" data-act="pub" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.22);color:#fff">${TTM.icon("plus", 18)}Publier un match</button>
          </div>
        </div>
      </section>

      <div class="grid-4">
        ${kpi({ label: "Matchs disponibles", val: K.available, ico: "target", accent: "blue", delta: "+12 %", d: 0 })}
        ${kpi({ label: "Demandes en cours", val: pending.length, ico: "handshake", accent: "orange", delta: "+3", d: 0.06 })}
        ${kpi({ label: "Taux de confirmation", val: K.confirmRate, suffix: " %", ico: "checkCircle", accent: "green", delta: "+5 pts", d: 0.12 })}
        ${kpi({ label: "Temps gagné / mois", val: K.timeSaved, suffix: " h", ico: "zap", accent: "purple", delta: "+1,5 h", d: 0.18 })}
      </div>

      ${nextM ? nextMatchCard(nextM) : ""}

      <section class="stack stack-4">
        <div class="row-between">
          <div>
            <h3 class="t-h3">Recommandations pour ${E(refTeamName())}</h3>
            <p class="t-caption t-secondary">Classées par score de compatibilité (7 critères pondérés sur 100 points).</p>
          </div>
          <button class="btn btn-outline btn-sm" data-go="marketplace">Tout voir ${TTM.icon("arrowRight", 16)}</button>
        </div>
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:var(--s-5)">
          ${recs.map((m) => matchCard(m)).join("")}
        </div>
      </section>

      <div class="grid-2">
        <section class="card">
          <div class="card-header"><b class="card-title">Activité récente</b><span class="badge">Live</span></div>
          <div class="card-body">
            <div class="feed">
              ${D.ACTIVITY.map((a) => `<div class="feed-item">
                <div class="feed-ico ${a.cls}">${TTM.icon(a.icon, 16)}</div>
                <div class="flex-1"><div class="feed-text">${E(a.text)}</div><div class="feed-time">${E(a.time)}</div></div>
              </div>`).join("")}
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-header"><b class="card-title">Écosystème TTM</b><button class="btn btn-ghost btn-xs" data-go="stats">Statistiques</button></div>
          <div class="card-body stack stack-5">
            <div class="row-2 wrap" style="gap:10px">
              <div class="stat-strip"><b data-count="${D.CLUBS.length}">0</b><span class="t-caption t-muted">clubs</span></div>
              <div class="stat-strip"><b data-count="${D.TEAMS.length}">0</b><span class="t-caption t-muted">équipes</span></div>
              <div class="stat-strip"><b data-count="${D.TOURNAMENTS.length}">0</b><span class="t-caption t-muted">tournois</span></div>
              <div class="stat-strip"><b data-count="${D.AVAILABLE.length}">0</b><span class="t-caption t-muted">matchs ouverts</span></div>
            </div>
            ${TTM.charts.hbars({ unit: "", data: D.STATS.byCat.map((c) => ({ label: c.label, value: c.value, color: c.color })) })}
            <div class="glow-line"></div>
            <div class="row-2 wrap">
              ${D.CLUBS.slice(0, 8).map((c) => `<button class="btn btn-ghost btn-icon btn-sm" data-act="club-profile" data-id="${c.id}" title="${E(c.name)}">${TTM.clubLogo(c, "club-logo-sm")}</button>`).join("")}
              <button class="btn btn-ghost btn-xs" data-go="clubs">+ ${D.CLUBS.length - 8} autres</button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <aside class="stack stack-5">
      <section class="card card-hover">
        <div class="card-header"><b class="card-title">${TTM.icon("calendar", 16)} Prochains matchs</b><span class="badge">${upcoming.length}</span></div>
        <div class="card-body">
          <div class="cal-list">
            ${upcoming.slice(0, 5).map((m) => `<div class="cal-row">
              <div class="cal-date"><b>${TTM.date.num(m.date)}</b><span>${TTM.date.dayMin(m.date)}</span></div>
              <div class="flex-1" style="min-width:0">
                <div class="t-body-sm" style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${E(m.opp)}</div>
                <div class="t-micro t-muted">${TTM.catBadge(m.cat)} ${E(m.time)} · ${m.home ? "DOMICILE" : "EXTÉRIEUR"}</div>
              </div>
              ${statusBadge(m.status)}
            </div>`).join("")}
          </div>
          <button class="btn btn-outline btn-sm btn-block" style="margin-top:12px" data-go="calendar">${TTM.icon("layout", 16)}Ouvrir le calendrier</button>
        </div>
      </section>

      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("handshake", 16)} Demandes</b><span class="badge badge-warning">${pending.length}</span></div>
        <div class="card-body">
          <div class="mini-list">
            ${pending.length
              ? pending.slice(0, 4).map((r) => {
                  const other = club(r.to === s.clubId ? r.from : r.to);
                  return `<div class="mini-row">
                    ${TTM.clubLogo(other, "club-logo-sm")}
                    <div class="grow">
                      <div class="t-caption" style="font-weight:600">${E(other.name)}</div>
                      <div class="t-micro t-muted">${E(r.cat)} · ${E(fmtD(r.date))} · ${r.to === s.clubId ? "reçue" : "envoyée"}</div>
                    </div>
                    <button class="btn btn-outline btn-xs" data-act="req-detail" data-id="${r.id}">Voir</button>
                  </div>`;
                }).join("")
              : '<div class="t-caption t-muted" style="padding:8px 0">Aucune demande en attente.</div>'}
          </div>
          <button class="btn btn-outline btn-sm btn-block" style="margin-top:12px" data-go="requests">Gérer les demandes</button>
        </div>
      </section>

      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("message", 16)} Messages</b><span class="badge badge-brand">${s.threads.reduce((a, t) => a + t.unread, 0)} non lus</span></div>
        <div class="card-body">
          <div class="mini-list">
            ${s.threads.slice(0, 4).map((t) => {
              const c = club(t.clubId);
              const last = t.messages[t.messages.length - 1];
              return `<div class="mini-row" data-act="thread" data-id="${t.id}" style="cursor:pointer">
                ${TTM.avatar(c.name, "avatar-sm", t.unread ? 1 : 6, t.online ? "on" : "")}
                <div class="grow">
                  <div class="t-caption" style="font-weight:600">${E(c.name)}</div>
                  <div class="t-micro t-muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${E(last.text)}</div>
                </div>
                ${t.unread ? '<span class="msg-unread">' + t.unread + "</span>" : '<span class="t-micro t-muted">' + E(last.t) + "</span>"}
              </div>`;
            }).join("")}
          </div>
          <button class="btn btn-outline btn-sm btn-block" style="margin-top:12px" data-go="messages">Ouvrir la messagerie</button>
        </div>
      </section>

      <section class="card card-brand">
        <div class="card-body">
          <div class="row-between" style="margin-bottom:10px"><b class="t-body-sm">${TTM.icon("trophy", 16)} Tournois à venir</b><button class="btn btn-ghost btn-xs" data-go="tournaments">Tout voir</button></div>
          <div class="mini-list">
            ${tours.map((t) => `<div class="mini-row">
              <div class="cat-badge cat-${t.cat.toLowerCase()}">${E(t.cat)}</div>
              <div class="grow">
                <div class="t-caption" style="font-weight:600">${E(t.name)}</div>
                <div class="t-micro t-muted">${E(fmtD(t.date))} · ${E(t.city)} · ${t.slots} place${t.slots > 1 ? "s" : ""}</div>
              </div>
              <button class="btn btn-primary btn-xs" data-act="join" data-id="${t.id}">S'inscrire</button>
            </div>`).join("")}
          </div>
        </div>
      </section>
    </aside>
  </div>
</div>`;
    },
    mount: function (r, view) {
      const host = view.querySelector("#pitchHero");
      if (host) TTM.pitchHero(host, { nodes: 7, w: 900, h: 560 });
    }
  };

  function nextMatchCard(m) {
    const c = club(m.oppId);
    const t = D.team(m.teamId);
    return `<section class="card card-hover reveal">
  <div class="card-body">
    <div class="row-between wrap" style="align-items:flex-start;gap:var(--s-4)">
      <div class="row-2" style="min-width:0">
        <div style="text-align:center;flex:none;min-width:66px">
          <div class="t-overline t-brand">${E(TTM.date.day(m.date))}</div>
          <div class="t-display t-num" style="line-height:1">${TTM.date.num(m.date)}</div>
          <div class="t-caption t-muted">${E(TTM.date.fmt(m.date, { d: false, m: "long" }))}</div>
        </div>
        <div class="divider-v"></div>
        <div style="min-width:0">
          <div class="t-micro t-brand" style="letter-spacing:.14em">PROCHAIN MATCH</div>
          <div class="mk-vs" style="margin:6px 0">
            <span class="t-h3">${E(t ? t.name : m.cat)}</span>
            <span class="badge badge-solid-dark">VS</span>
            <span class="row-2">${TTM.clubLogo(c, "club-logo-sm")}<span class="t-h4">${E(m.opp)}</span></span>
          </div>
          <div class="row-2 wrap" style="gap:10px">
            ${TTM.catBadge(m.cat)}
            ${statusBadge(m.status)}
            <span class="match-meta">${TTM.icon("clock", 14)}${E(m.time)}</span>
            <span class="match-meta">${TTM.icon("mapPin", 14)}${E(m.venue)}, ${E(m.city)}</span>
            <span class="match-meta">${TTM.icon("shield", 14)}${E(typeOf(m))}</span>
          </div>
        </div>
      </div>
      <div class="row-2 wrap">
        <button class="btn btn-outline btn-sm" data-go="calendar">${TTM.icon("layout", 16)}Calendrier</button>
        <button class="btn btn-primary btn-sm" data-go="mymatches">${TTM.icon("clipboardCheck", 16)}Fiche match</button>
      </div>
    </div>
  </div>
</section>`;
  }

  /* ==========================================================
     VUE · MARKETPLACE
     ========================================================== */
  function marketResults() {
    const s = st();
    const tid = s.activeTeam === "all" ? null : s.activeTeam;
    const list = TTM.filterMatches(s.filters, tid);
    if (!tid) list.forEach((m) => (m._score = scoreOf(m)));
    const sorters = {
      compat: (a, b) => b._score.pct - a._score.pct || a.dist - b.dist,
      date: (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      dist: (a, b) => a.dist - b.dist,
      level: (a, b) => b.level - a.level
    };
    return list.sort(sorters[UI.mkSort] || sorters.compat);
  }

  function refreshMarket() {
    const host = $("#mkList");
    if (!host) return render();
    const list = marketResults();
    host.innerHTML = list.length
      ? list.map((m) => matchCard(m)).join("")
      : empty("search", "Aucun match ne correspond", "Élargissez vos filtres ou augmentez la distance maximale pour voir plus d'adversaires.", { act: "reset-filters", label: "Réinitialiser les filtres", ico: "refresh" });
    const c = $("#mkCount");
    if (c) c.innerHTML = "<b>" + list.length + "</b> matchs";
    TTM.initReveal(host);
    TTM.initCompat(host);
  }

  function chipF(k, v, label, active, extra) {
    return `<button class="chip chip-sm ${active ? "is-active" : ""}" data-f="${k}" data-v="${E(v)}" ${extra || ""}>${E(label)}</button>`;
  }

  function filterPanel() {
    const f = st().filters;
    const cats = ["U11", "U13", "U15", "U17", "U19"];
    const levels = [[1, "Débutant"], [2, "Intermédiaire"], [3, "Avancé"]];
    const types = [["friendly", "Amical"], ["league", "Championnat"], ["cup", "Coupe"]];
    const times = [["matin", "Matin"], ["aprem", "Après-midi"], ["soir", "Soir"]];
    const cities = Array.from(new Set(D.AVAILABLE.map((m) => m.city)));
    return `<div class="stack stack-5">
  <div class="row-between">
    <b class="t-body-sm">${TTM.icon("sliders", 16)} Filtres</b>
    <button class="btn btn-ghost btn-xs" data-act="reset-filters">Réinitialiser</button>
  </div>

  <div class="stack stack-2">
    <div class="field-label">Catégorie</div>
    <div class="row-2 wrap" style="gap:6px">${cats.map((c) => chipF("cats", c, c, f.cats.indexOf(c) > -1)).join("")}</div>
  </div>

  <div class="stack stack-2">
    <div class="field-label">Niveau</div>
    <div class="row-2 wrap" style="gap:6px">${levels.map((l) => chipF("levels", l[0], l[1], f.levels.indexOf(l[0]) > -1)).join("")}</div>
  </div>

  <div class="stack stack-2">
    <div class="field-label">Type de rencontre</div>
    <div class="row-2 wrap" style="gap:6px">${types.map((t) => chipF("types", t[0], t[1], f.types.indexOf(t[0]) > -1)).join("")}</div>
  </div>

  <div class="stack stack-2">
    <div class="field-label">Créneau</div>
    <div class="row-2 wrap" style="gap:6px">${times.map((t) => chipF("times", t[0], t[1], f.times.indexOf(t[0]) > -1)).join("")}</div>
  </div>

  <div class="stack stack-2">
    <div class="field-label">Ville de l'adversaire</div>
    <div class="row-2 wrap" style="gap:6px">${cities.map((c) => chipF("cities", c, c, f.cities.indexOf(c) > -1)).join("")}</div>
  </div>

  <div class="field">
    <div class="row-between"><span class="field-label">Distance maximale</span><span class="slider-val" id="distVal">${f.dist} km</span></div>
    <input class="slider" type="range" min="5" max="120" step="5" value="${f.dist}" data-sw="dist" data-range="dist" aria-label="Distance maximale">
    <div class="row-between"><span class="t-micro t-muted">5 km</span><span class="t-micro t-muted">120 km</span></div>
  </div>

  <div class="divider"></div>

  <label class="switch">
    <input type="checkbox" ${f.onlyCompat ? "checked" : ""} data-sw="onlyCompat">
    <span class="switch-track"><span class="switch-thumb"></span></span>
    <span class="t-caption">Compatibilité ≥ 70 % uniquement</span>
  </label>

  <div class="alert alert-info" style="padding:12px">
    <span class="alert-ico">${TTM.icon("info", 16)}</span>
    <div class="t-caption">Le score compare 7 critères : catégorie, distance, date, horaire, niveau, format/terrain et historique.</div>
  </div>
</div>`;
  }

  ROUTES.marketplace = {
    title: "Trouver un match",
    view: function () {
      const list = marketResults();
      const hi = list.filter((m) => m._score.pct >= 85).length;
      const s = st();
      return `<div class="stack">
  <div class="mk-toolbar">
    <div class="row-between wrap" style="gap:var(--s-3)">
      <div class="flex-1" style="min-width:240px;max-width:420px">
        <div class="search-bar ${s.filters.q ? "has-value" : ""}">
          <span class="s-icon">${TTM.icon("search", 18)}</span>
          <input type="search" id="mkSearch" placeholder="Rechercher un club, une ville, un stade…" value="${E(s.filters.q)}" aria-label="Rechercher un match">
          <button class="s-clear" aria-label="Effacer">${TTM.icon("x", 14)}</button>
        </div>
      </div>
      <div class="row-2 wrap">
        <button class="btn btn-outline btn-sm only-md" data-act="mk-filters">${TTM.icon("filter", 16)}Filtres</button>
        <select class="select input-sm" id="mkSort" style="width:auto;min-width:190px" aria-label="Trier">
          <option value="compat" ${UI.mkSort === "compat" ? "selected" : ""}>Tri : compatibilité</option>
          <option value="date" ${UI.mkSort === "date" ? "selected" : ""}>Tri : date</option>
          <option value="dist" ${UI.mkSort === "dist" ? "selected" : ""}>Tri : distance</option>
          <option value="level" ${UI.mkSort === "level" ? "selected" : ""}>Tri : niveau</option>
        </select>
        <div class="pill-tabs">
          <button class="pill-tab ${UI.mkCols ? "is-active" : ""}" data-act="mk-cols" title="Grille">${TTM.icon("grid", 16)}</button>
          <button class="pill-tab ${!UI.mkCols ? "is-active" : ""}" data-act="mk-cols" title="Liste">${TTM.icon("list", 16)}</button>
        </div>
      </div>
    </div>
    <div class="mk-result-bar">
      <div class="row-2 wrap" style="gap:10px">
        <span class="t-body-sm" id="mkCount"><b>${list.length}</b> matchs</span>
        <span class="badge badge-success">${hi} très compatibles</span>
        ${teamSwitch()}
      </div>
    </div>
  </div>

  <div class="mk-layout">
    <aside class="mk-filters">
      <div class="card card-pad-sm">${filterPanel()}</div>
    </aside>

    <div class="stack stack-4">
      ${chipsBar()}
      <div id="mkList" class="${UI.mkCols ? "grid" : "stack stack-3"}" style="${UI.mkCols ? "grid-template-columns:repeat(auto-fill,minmax(300px,1fr))" : ""}">
        ${list.length
          ? list.map((m) => matchCard(m)).join("")
          : empty("search", "Aucun match ne correspond", "Élargissez vos filtres ou augmentez la distance maximale pour voir plus d'adversaires.", { act: "reset-filters", label: "Réinitialiser les filtres", ico: "refresh" })}
      </div>
    </div>
  </div>
</div>`;
    }
  };

  /* ==========================================================
     VUE · DÉTAIL D'UN MATCH
     ========================================================== */
  ROUTES.match = {
    title: function (r) {
      const m = D.match(r.id);
      return m ? "Match " + m.cat + " · " + club(m.clubId).short : "Match";
    },
    view: function (r) {
      const m = D.match(r.id);
      if (!m) return notFound();
      const c = club(m.clubId);
      const h = home();
      const s = scoreOf(m);
      const stad = D.STADIUMS.find((x) => x.clubId === m.clubId);
      const extra = D.CLUB_EXTRA[m.clubId] || {};
      const hist = D.MY_MATCHES.filter((x) => x.oppId === m.clubId);
      const req = st().requests.find((x) => x.matchId === m.id);
      const sameClub = D.AVAILABLE.filter((x) => x.clubId === m.clubId && x.id !== m.id);

      return `<div class="stack stack-6">
  <button class="btn btn-ghost btn-sm" data-go="marketplace" style="align-self:flex-start">${TTM.icon("arrowLeft", 16)}Retour au marché</button>

  <section class="card card-pad-lg reveal">
    <div class="row-between wrap" style="align-items:flex-start;gap:var(--s-5)">
      <div class="row-2 wrap" style="gap:var(--s-4);min-width:0">
        <div class="stack" style="align-items:center;gap:6px;flex:none">
          ${TTM.clubLogo(h, "club-logo-lg")}
          <span class="t-micro t-muted">${E(h.short)}</span>
        </div>
        <div class="stack" style="align-items:center;gap:6px">
          <div class="row-2" style="gap:5px">
            ${TTM.catBadge(m.cat)}
            <span class="badge badge-brand">${E(typeOf(m))}</span>
            <span class="badge">${E(m.format)}</span>
          </div>
          <span class="t-overline t-muted">VS</span>
        </div>
        <div class="stack" style="align-items:center;gap:6px;flex:none">
          ${TTM.clubLogo(c, "club-logo-lg")}
          <span class="t-micro t-muted">${E(c.short)}</span>
        </div>
      </div>
      <div class="row-2 wrap" style="gap:var(--s-3)">
        ${TTM.compatHTML(s.pct, "compat-ring-lg")}
        <div class="stack" style="gap:6px">
          <b class="t-h4">${s.pct >= 85 ? "Excellente affinité" : s.pct >= 70 ? "Bonne affinité" : "Affinité moyenne"}</b>
          <span class="t-caption t-secondary">pour ${E(refTeamName())}</span>
          <div class="row-2 wrap" style="gap:6px">
            <button class="btn btn-outline btn-sm" data-act="share">${TTM.icon("share", 16)}Partager</button>
            <button class="btn btn-outline btn-sm" data-act="print">${TTM.icon("download", 16)}Fiche</button>
          </div>
        </div>
      </div>
    </div>

    <div class="divider" style="margin:var(--s-5) 0"></div>

    <div class="grid-4" style="gap:var(--s-4)">
      ${fact("calendar", "<b>" + E(TTM.date.day(m.date)) + "</b> " + E(fmtDL(m.date)))}
      ${fact("clock", "<b>" + E(m.time) + "</b> coup d'envoi")}
      ${fact("mapPin", "<b>" + m.dist + " km</b> · " + E(m.city))}
      ${fact("whistle", "<b>" + E(m.pitch) + "</b> · " + E(TTM.levelLabel[m.level]))}
    </div>
  </section>

  <div class="grid-main-side">
    <div class="stack stack-5">
      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("gauge", 16)} Détail du score de compatibilité</b><span class="badge badge-brand">${s.pct} / 100</span></div>
        <div class="card-body">${critList(s)}</div>
      </section>

      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("mapPin", 16)} Lieu & conditions</b></div>
        <div class="card-body stack stack-4">
          <div class="row-2" style="align-items:flex-start;gap:12px">
            ${TTM.clubLogo(c, "club-logo-lg")}
            <div class="flex-1" style="min-width:0">
              <b class="t-body-sm">${E(stad ? stad.name : m.venue)}</b>
              <div class="t-caption t-secondary">${E(m.venue)}, ${E(m.city)} · ${E(c.dept)}</div>
              <div class="t-micro t-muted">Surface : ${E(stad ? stad.surface : m.pitch)} · Dimensions : ${E(stad ? stad.size : "105×68")}</div>
            </div>
          </div>
          <div class="alert alert-neutral">
            <span class="alert-ico">${TTM.icon("info", 16)}</span>
            <div><div class="alert-title">Note du club organisateur</div><div>${E(m.note || "Aucune précision complémentaire.")}</div></div>
          </div>
          <div class="row-2 wrap" style="gap:8px">
            ${badge("badge-brand", "users", extra.teams + " équipes") || ""}
            ${badge("badge-success", "target", extra.matches + " matchs publiés")}
            ${badge("badge-warning", "trophy", extra.tournaments + " tournois")}
            ${extra.verified ? badge("badge-info", "shieldCheck", "Club vérifié") : badge("", "alertCircle", "Vérification en cours")}
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("activity", 16)} Historique des confrontations</b></div>
        <div class="card-body">
          ${hist.length
            ? `<div class="table-wrap"><table class="table">
              <thead><tr><th>Date</th><th>Équipe</th><th>Lieu</th><th>Résultat</th></tr></thead>
              <tbody>${hist.map((x) => `<tr>
                <td>${E(fmtD(x.date))}</td>
                <td>${TTM.catBadge(x.cat)}</td>
                <td>${x.home ? "DOMICILE" : "EXTÉRIEUR"}</td>
                <td><b>${E(x.result || "—")}</b></td>
              </tr>`).join("")}</tbody>
            </table></div>`
            : '<div class="t-caption t-secondary">Aucune rencontre enregistrée entre les deux clubs. Ce sera un premier match.</div>'}
        </div>
      </section>

      ${sameClub.length
        ? `<section class="stack stack-4">
          <h3 class="t-h4">Autres rencontres de ${E(c.name)}</h3>
          <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--s-4)">
            ${sameClub.map((x) => matchCard(x)).join("")}
          </div>
        </section>`
        : ""}
    </div>

    <aside class="stack stack-5 sticky-side">
      <section class="card card-brand">
        <div class="card-body stack stack-4">
          <div class="row-2">${TTM.icon("send", 18)}<b class="t-body-sm">Demander ce match</b></div>
          ${req
            ? `<div class="alert ${req.status === "accepted" ? "alert-success" : req.status === "declined" ? "alert-danger" : "alert-warning"}">
                 <span class="alert-ico">${TTM.icon(req.status === "accepted" ? "checkCircle" : req.status === "declined" ? "x" : "clock", 16)}</span>
                 <div><div class="alert-title">Demande ${req.status === "accepted" ? "acceptée" : req.status === "declined" ? "refusée" : "en attente de réponse"}</div>
                 <div>${E(c.name)} · ${E(req.cat)} · ${E(fmtD(req.date))}</div></div>
               </div>
               <button class="btn btn-outline btn-sm btn-block" data-go="requests">${TTM.icon("handshake", 16)}Suivre la demande</button>`
            : `<div class="stack stack-3">
                <div class="field">
                  <label class="field-label" for="reqTeam">Équipe concernée</label>
                  <select class="select" id="reqTeam">
                    ${D.TEAMS.map((t) => `<option value="${t.id}" ${t.id === refTeam() ? "selected" : ""}>${E(t.name)} · ${E(t.level)}</option>`).join("")}
                  </select>
                  <div class="field-hint" id="reqTeamHint"></div>
                </div>
                <button class="btn btn-primary btn-lg btn-block" data-act="req" data-id="${m.id}">${TTM.icon("send", 18)}Envoyer la demande</button>
                <div class="t-micro t-muted">Réponse moyenne du club : 4 h 12 · Confirmation automatique du calendrier en cas d'accord.</div>
              </div>`}
        </div>
      </section>

      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("building", 16)} ${E(c.name)}</b><button class="btn btn-ghost btn-xs" data-act="club-profile" data-id="${c.id}">Profil</button></div>
        <div class="card-body stack stack-3">
          <p class="t-caption t-secondary" style="line-height:1.55">${E(c.desc)}</p>
          <div class="row-between"><span class="t-caption t-muted">Président</span><b class="t-caption">${E(c.president)}</b></div>
          <div class="row-between"><span class="t-caption t-muted">Fondé en</span><b class="t-caption">${c.since}</b></div>
          <div class="row-between"><span class="t-caption t-muted">Stade</span><b class="t-caption">${E(c.stadium)}</b></div>
          <div class="row-between"><span class="t-caption t-muted">Licenciés</span><b class="t-caption">${(extra.members || 0).toLocaleString("fr-FR")}</b></div>
          <div class="row-between"><span class="t-caption t-muted">Note</span><span class="rating">${TTM.icon("star", 13)}${extra.rating || "—"}</span></div>
        </div>
      </section>
    </aside>
  </div>
</div>`;
    }
  };

  /* ==========================================================
     VUE · MES MATCHS
     ========================================================== */
  ROUTES.mymatches = {
    title: "Mes matchs",
    view: function () {
      const all = D.MY_MATCHES.slice().sort(byDate);
      const up = all.filter((m) => m.status !== "played");
      const pending = all.filter((m) => m.status === "pending");
      const done = all.filter((m) => m.status === "played");
      const list = UI.myTab === "up" ? up : UI.myTab === "pending" ? pending : done;
      const played = done.length;
      const wins = done.filter((m) => {
        if (!m.result) return false;
        const p = m.result.split("-").map(Number);
        return m.home ? p[0] > p[1] : p[1] > p[0];
      }).length;

      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Mes matchs</h2>
      <p>Toutes les rencontres de l'AS Courbevoie : colonnes, résultats, convocations et demandes liées.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-act="download">${TTM.icon("download", 16)}Exporter</button>
      <button class="btn btn-primary btn-sm" data-act="pub">${TTM.icon("plus", 16)}Publier un match</button>
    </div>
  </div>

  <div class="grid-4">
    ${kpi({ label: "Rencontres jouées", val: played, ico: "checkCircle", accent: "green", delta: "+4", d: 0 })}
    ${kpi({ label: "Victoires", val: wins, ico: "trophy", accent: "blue", delta: "+12 %", d: 0.05 })}
    ${kpi({ label: "Taux de victoire", val: played ? Math.round((wins / played) * 100) : 0, suffix: " %", ico: "trendingUp", accent: "cyan", delta: "+3 pts", d: 0.1 })}
    ${kpi({ label: "Prochaines rencontres", val: up.length, ico: "calendar", accent: "orange", delta: "3 cette semaine", d: 0.15 })}
  </div>

  <div class="tabs">
    <button class="tab ${UI.myTab === "up" ? "is-active" : ""}" data-act="my-tab" data-v="up">À venir<span class="tab-count">${up.length}</span></button>
    <button class="tab ${UI.myTab === "pending" ? "is-active" : ""}" data-act="my-tab" data-v="pending">En attente<span class="tab-count">${pending.length}</span></button>
    <button class="tab ${UI.myTab === "done" ? "is-active" : ""}" data-act="my-tab" data-v="done">Terminés<span class="tab-count">${done.length}</span></button>
  </div>

  <section class="card">
    <div class="table-wrap">
      <table class="table table-clickable">
        <thead><tr>
          <th>Date</th><th>Équipe</th><th>Adversaire</th><th>Lieu</th><th>Type</th><th>Statut</th><th style="text-align:right">Actions</th>
        </tr></thead>
        <tbody>
          ${list.length
            ? list
                .map((m) => {
                  const c = club(m.oppId);
                  const t = D.team(m.teamId);
                  return `<tr>
              <td><b>${TTM.date.num(m.date)}</b> ${E(TTM.date.fmt(m.date, { d: false }))}<div class="t-micro t-muted">${E(TTM.date.dayMin(m.date))} · ${E(m.time)}</div></td>
              <td>${TTM.catBadge(m.cat)}<div class="t-micro t-muted" style="margin-top:3px">${E(t ? t.name : "—")}</div></td>
              <td><div class="row-2">${TTM.clubLogo(c, "club-logo-sm")}<div style="min-width:0"><div class="t-caption" style="font-weight:600">${E(m.opp)}</div><div class="t-micro t-muted">${E(c.city)}</div></div></div></td>
              <td><div class="t-caption">${E(m.venue)}</div><div class="t-micro t-muted">${E(m.city)} · ${m.home ? "DOMICILE" : "EXTÉRIEUR"}</div></td>
              <td>${badge("", "", typeOf(m))}</td>
              <td>${statusBadge(m.status)}${m.result ? '<div class="t-micro t-muted" style="margin-top:3px">' + E(m.result) + "</div>" : ""}</td>
              <td style="text-align:right">
                <div class="row-2" style="justify-content:flex-end">
                  ${m.status === "pending"
                    ? '<button class="btn btn-outline btn-xs" data-go="requests">Demande</button>'
                    : '<button class="btn btn-outline btn-xs" data-act="convoq" data-id="' + m.teamId + '">Convoquer</button>'}
                  ${m.status === "played"
                    ? '<button class="btn btn-ghost btn-xs" data-act="result" data-id="' + m.id + '">Résultat</button>'
                    : '<button class="btn btn-ghost btn-xs" data-go="calendar">Planning</button>'}
                </div>
              </td>
            </tr>`;
                })
                .join("")
            : '<tr><td colspan="7">' + empty("calendar", "Aucun match dans cette liste", "Changez d'onglet ou publiez une nouvelle rencontre.", { act: "pub", label: "Publier un match", ico: "plus" }) + "</td></tr>"}
        </tbody>
      </table>
    </div>
  </section>
</div>`;
    }
  };

  /* ==========================================================
     VUE · CALENDRIER
     ========================================================== */
  ROUTES.calendar = {
    title: "Calendrier",
    view: function () {
      const days = TTM.calendar(UI.calY, UI.calM);
      const label = TTM.date.fmt(UI.calY + "-10-01", { d: false, m: "long", y: true });
      const dow = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      const sel = days.find((d) => d.iso === UI.calDay);
      const selEvents = sel ? sel.events : [];
      const monthMatches = D.MY_MATCHES.filter((m) => m.date.indexOf(UI.calY + "-" + String(UI.calM + 1).padStart(2, "0")) === 0);
      const head = [];
      const firstDow = (new Date(UI.calY, UI.calM, 1).getDay() + 6) % 7;
      for (let i = 0; i < firstDow; i++) head.push(i);

      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Calendrier du club</h2>
      <p>Vue mensuelle : matchs confirmés, matchs disponibles compatibles et tournois. Cliquez sur un jour pour le détail.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-act="download">${TTM.icon("download", 16)}Exporter (.ics)</button>
      <button class="btn btn-outline btn-sm" data-act="cal-today">${TTM.icon("rotate", 16)}Aujourd'hui</button>
    </div>
  </div>

  <div class="grid-main-side">
    <section class="card card-pad">
      <div class="row-between" style="margin-bottom:var(--s-4)">
        <div class="row-2">
          <button class="btn btn-ghost btn-icon btn-sm" data-act="cal-prev" aria-label="Mois précédent">${TTM.icon("chevronLeft", 18)}</button>
          <b class="t-h3" style="min-width:170px;text-align:center">${E(cap(label))}</b>
          <button class="btn btn-ghost btn-icon btn-sm" data-act="cal-next" aria-label="Mois suivant">${TTM.icon("chevronRight", 18)}</button>
        </div>
        <div class="row-2 wrap" style="gap:10px">
          <span class="chart-legend">
            <span class="lg"><span class="sw" style="background:var(--ttm-accent)"></span>Mes matchs</span>
            <span class="lg"><span class="sw" style="background:#22C55E"></span>Disponibles</span>
            <span class="lg"><span class="sw" style="background:var(--ttm-warning)"></span>Tournois</span>
          </span>
        </div>
      </div>

      <div class="cal-grid">
        ${dow.map((d) => `<div class="cal-dow">${d}</div>`).join("")}
        ${days
          .map((d) => {
            const cls = ["cal-cell"];
            if (!d.inMonth) cls.push("out");
            if (d.iso === TODAY) cls.push("today");
            const evs = d.events.slice(0, 3);
            const rest = d.events.length - evs.length;
            return `<div class="${cls.join(" ")}" data-act="cal-day" data-iso="${d.iso}" style="cursor:pointer;${d.iso === UI.calDay ? "box-shadow:inset 0 0 0 2px var(--ttm-accent)" : ""}">
              <div class="cal-num">${d.day}</div>
              ${evs
                .map((e) => {
                  if (e.kind === "avail") {
                    return `<button class="cal-ev avail" data-act="open" data-id="${e.id}" title="${E(club(e.clubId).name)} · ${E(e._score ? e._score.pct : "")} %">${E(e.cat)} ${E(e.time)}</button>`;
                  }
                  if (e.kind === "tournament") {
                    return `<button class="cal-ev tournament" data-act="join" data-id="${e.id}" title="${E(e.name)}">${E(e.name).slice(0, 16)}</button>`;
                  }
                  return `<button class="cal-ev match" data-act="convoq" data-id="${e.teamId}" title="${E(e.opp)} · ${E(e.time)}">${E(e.cat)} ${E(e.time)}</button>`;
                })
                .join("")}
              ${rest > 0 ? `<div class="t-micro t-muted" style="padding-left:4px">+${rest} autre${rest > 1 ? "s" : ""}</div>` : ""}
            </div>`;
          })
          .join("")}
      </div>
    </section>

    <aside class="stack stack-5">
      <section class="card card-brand">
        <div class="card-body">
          <div class="t-micro t-brand" style="letter-spacing:.14em">JOUR SÉLECTIONNÉ</div>
          <div class="t-h3" style="margin:4px 0 2px">${sel ? E(TTM.date.day(sel.iso)) + " " + E(fmtDL(sel.iso)) : "—"}</div>
          <div class="t-caption t-secondary">${selEvents.length} événement${selEvents.length > 1 ? "s" : ""}</div>
        </div>
      </section>

      <section class="card">
        <div class="card-body">
          ${selEvents.length
            ? `<div class="cal-list">${selEvents
                .map((e) => {
                  const c = club(e.clubId || e.oppId);
                  const kind = e.kind === "match" ? "badge-brand" : e.kind === "avail" ? "badge-success" : "badge-warning";
                  const label = e.kind === "match" ? "Match " + e.cat : e.kind === "avail" ? "Disponible" : "Tournoi";
                  return `<div class="cal-row">
                    <div class="cal-date"><b>${TTM.date.num(e.date)}</b><span>${E(TTM.date.dayMin(e.date))}</span></div>
                    <div class="flex-1" style="min-width:0">
                      <div class="row-2" style="gap:6px">${badge(kind, "", label)}${e.cat ? TTM.catBadge(e.cat) : ""}</div>
                      <div class="t-caption" style="margin-top:4px;font-weight:600">${E(e.kind === "tournament" ? e.name : c.name)}</div>
                      <div class="t-micro t-muted">${E(e.time || "")} ${E(e.venue || e.city || "")}</div>
                    </div>
                  </div>`;
                })
                .join("")}</div>`
            : '<div class="empty" style="padding:28px 0"><div class="empty-ico">' + TTM.icon("calendar", 26) + '</div><div class="empty-title t-body-sm">Journée libre</div><div class="empty-text t-caption">Aucun match, disponibilité ou tournoi ce jour-là.</div></div>'}
        </div>
      </section>

      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("barChart", 16)} ${E(cap(label))} en bref</b></div>
        <div class="card-body stack stack-3">
          <div class="row-between"><span class="t-caption t-secondary">Mes matchs</span><b>${monthMatches.length}</b></div>
          <div class="row-between"><span class="t-caption t-secondary">Disponibilités compatibles</span><b>${D.AVAILABLE.filter((m) => m.date.indexOf(UI.calY + "-" + String(UI.calM + 1).padStart(2, "0")) === 0).length}</b></div>
          <div class="row-between"><span class="t-caption t-secondary">Tournois</span><b>${D.TOURNAMENTS.filter((t) => t.date.indexOf(UI.calY + "-" + String(UI.calM + 1).padStart(2, "0")) === 0).length}</b></div>
          <div class="glow-line"></div>
          <div class="t-micro t-muted">Données de démonstration synthétiques — le calendrier réel synchroniserait Google Calendar, Outlook et les notifications des coachs.</div>
        </div>
      </section>
    </aside>
  </div>
</div>`;
    }
  };

  /* ==========================================================
     VUE · ÉQUIPES
     ========================================================== */
  function teamStats(t) {
    const ms = D.MY_MATCHES.filter((m) => m.teamId === t.id);
    const played = ms.filter((m) => m.status === "played");
    return { total: ms.length, played: played.length, last: played.length ? played[played.length - 1].result : null };
  }

  ROUTES.teams = {
    title: "Équipes",
    view: function () {
      const s = st();
      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Nos ${D.TEAMS.length} équipes</h2>
      <p>Chaque équipe porte ses propres préférences : le moteur de correspondance recalcule les recommandations dès qu'elles changent.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-act="mk-filters">${TTM.icon("filter", 16)}Filtres</button>
      <button class="btn btn-primary btn-sm" data-go="marketplace">${TTM.icon("target", 16)}Trouver un match</button>
    </div>
  </div>

  <div class="card card-pad-sm">
    <div class="row-between wrap" style="gap:var(--s-3)">
      <div class="flex-1"><div class="field-label">Équipe de référence pour les recommandations</div>${teamSwitch()}</div>
      <div class="t-caption t-muted">${s.activeTeam === "all" ? "Vue globale (référence U15 A)" : "Recommandations calculées pour " + E(s.activeTeam)}</div>
    </div>
  </div>

  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--s-5)">
    ${D.TEAMS.map((t, i) => {
      const coach = D.COACHES.find((c) => c.teamId === t.id) || D.COACHES.find((c) => c.cat === t.cat);
      const p = D.PREFS[t.id];
      const k = teamStats(t);
      return `<article class="card card-hover team-card reveal" data-reveal-delay="${(i % 4) * 0.06}">
      <div class="card-body stack stack-4">
        <div class="row-2" style="align-items:flex-start">
          <div class="team-jersey" style="background:${t.jersey}">${E(t.cat)}</div>
          <div class="flex-1" style="min-width:0">
            <div class="t-h4">${E(t.name)}${s.activeTeam === t.id ? ' <span class="badge badge-brand">active</span>' : ""}</div>
            <div class="t-caption t-secondary">${E(t.level)}${t.home ? " · équipe première" : " · équipe de réserve"}</div>
          </div>
          ${TTM.compatHTML(TTM.recommend(t.id, 1)[0]._score.pct, "compat-ring-sm")}
        </div>

        <div class="row-2" style="gap:10px">
          ${coach ? TTM.avatar(coach.name, "avatar-sm", i) : ""}
          <div class="flex-1" style="min-width:0">
            <div class="t-caption" style="font-weight:600">${E(coach ? coach.name : "—")}</div>
            <div class="t-micro t-muted">${E(coach ? coach.role : "")} · depuis ${coach ? coach.since : "—"}</div>
          </div>
        </div>

        <div class="grid-2" style="gap:8px">
          <div class="team-stat"><b>${p.maxDist} km</b><span>rayon de recherche</span></div>
          <div class="team-stat"><b>${k.played}</b><span>matchs joués</span></div>
        </div>

        <div class="stack stack-1">
          <div class="row-between"><span class="t-micro t-muted">Jours</span><span class="t-micro">${E(p.days.map(cap).join(" · "))}</span></div>
          <div class="row-between"><span class="t-micro t-muted">Créneaux</span><span class="t-micro">${E(p.timeFrom)} – ${E(p.timeTo)}</span></div>
          <div class="row-between"><span class="t-micro t-muted">Formats</span><span class="t-micro">${E(p.formats.join(" / "))}</span></div>
          <div class="row-between"><span class="t-micro t-muted">Notifications</span><span class="t-micro">${p.notify ? "Actives" : "Désactivées"}</span></div>
        </div>
      </div>
      <div class="card-footer row-2" style="justify-content:space-between">
        <button class="btn btn-ghost btn-xs" data-act="team-prefs" data-id="${t.id}">${TTM.icon("sliders", 14)}Préférences</button>
        <div class="row-2">
          <button class="btn btn-outline btn-xs" data-act="convoq" data-id="${t.id}">Convoquer</button>
          <button class="btn btn-primary btn-xs" data-act="team-matches" data-id="${t.id}">Matchs</button>
        </div>
      </div>
    </article>`;
    }).join("")}
  </div>
</div>`;
    }
  };

  /* ==========================================================
     VUE · COACHS
     ========================================================== */
  const PERMS = [
    { key: "calendar", label: "Voir et modifier le calendrier" },
    { key: "requests", label: "Envoyer et répondre aux demandes" },
    { key: "messages", label: "Messagerie club" },
    { key: "roster", label: "Liste des joueurs et convocations" },
    { key: "stats", label: "Statistiques avancées" }
  ];

  ROUTES.coaches = {
    title: "Coachs",
    view: function () {
      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Staff technique</h2>
      <p>${D.COACHES.length} membres de l'encadrement répartis sur les ${D.TEAMS.length} équipes du club, avec des droits d'accès par rôle.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-act="share">${TTM.icon("share", 16)}Partager le planning</button>
      <button class="btn btn-primary btn-sm" data-act="coach-msg" data-id="${D.COACHES[0].id}">${TTM.icon("message", 16)}Contacter le staff</button>
    </div>
  </div>

  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:var(--s-5)">
    ${D.COACHES.map((c, i) => {
      const t = D.team(c.teamId);
      return `<article class="card card-hover reveal" data-reveal-delay="${(i % 3) * 0.06}">
      <div class="card-body stack stack-4">
        <div class="row-2" style="align-items:flex-start">
          ${TTM.avatar(c.name, "avatar-lg", i)}
          <div class="flex-1" style="min-width:0">
            <div class="t-h4">${E(c.name)}</div>
            <div class="t-caption t-secondary">${E(c.role)}${t ? " · " + E(t.name) : ""}</div>
            <div class="row-2 wrap" style="gap:6px;margin-top:6px">
              ${c.cat ? TTM.catBadge(c.cat) : ""}
              ${badge("badge-brand", "calendar", "Depuis " + c.since)}
            </div>
          </div>
        </div>
        <div class="stack stack-2">
          <div class="row-2 t-caption t-secondary">${TTM.icon("phone", 14)}${E(c.phone)}</div>
          <div class="row-2 t-caption t-secondary">${TTM.icon("mail", 14)}${E(c.mail)}</div>
        </div>
        <div class="row-2 wrap" style="gap:6px">
          ${c.perms.map((p) => badge("badge-info", "", (PERMS.find((x) => x.key === p) || { label: p }).label.split(" ")[0])).join("")}
        </div>
      </div>
      <div class="card-footer row-2" style="justify-content:space-between">
        <button class="btn btn-ghost btn-xs" data-act="coach-call" data-id="${c.id}">${TTM.icon("phone", 14)}Appeler</button>
        <div class="row-2">
          ${c.teamId ? '<button class="btn btn-outline btn-xs" data-act="convoq" data-id="' + c.teamId + '">Convocations</button>' : ""}
          <button class="btn btn-primary btn-xs" data-act="coach-msg" data-id="${c.id}">${TTM.icon("message", 14)}Message</button>
        </div>
      </div>
    </article>`;
    }).join("")}
  </div>

  <section class="card">
    <div class="card-header"><b class="card-title">${TTM.icon("shieldCheck", 16)} Matrice des droits d'accès</b><span class="badge">RBAC par rôle</span></div>
    <div class="table-wrap">
      <table class="table perm">
        <thead><tr><th>Permission</th><th>Président</th><th>Coach</th><th>Adjoint</th><th>Parent</th></tr></thead>
        <tbody>
          ${PERMS.map((p) => {
            const row = (ok) => '<td>' + (ok ? '<span class="perm-yes">' + TTM.icon("check", 16) + "</span>" : '<span class="perm-no">' + TTM.icon("minus", 16) + "</span>") + "</td>";
            return "<tr><td>" + E(p.label) + "</td>" + row(true) + row(true) + row(p.key !== "stats") + row(p.key === "calendar");
          }).join("")}
          <tr><td>Consulter les statistiques du club</td><td class="perm-yes">${TTM.icon("check", 16)}</td><td class="perm-yes">${TTM.icon("check", 16)}</td><td class="perm-no">${TTM.icon("minus", 16)}</td><td class="perm-no">${TTM.icon("minus", 16)}</td></tr>
          <tr><td>Gérer les utilisateurs et les clubs</td><td class="perm-yes">${TTM.icon("check", 16)}</td><td class="perm-no">${TTM.icon("minus", 16)}</td><td class="perm-no">${TTM.icon("minus", 16)}</td><td class="perm-no">${TTM.icon("minus", 16)}</td></tr>
          <tr><td>Publier un tournoi ou un tournoi multi-clubs</td><td class="perm-yes">${TTM.icon("check", 16)}</td><td class="perm-yes">${TTM.icon("check", 16)}</td><td class="perm-no">${TTM.icon("minus", 16)}</td><td class="perm-no">${TTM.icon("minus", 16)}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer t-micro t-muted">Le module Parents (lecture seule) est en phase de développement : calendrier, convocations et résultats de l'enfant.</div>
  </section>
</div>`;
    }
  };

  /* ==========================================================
     VUE · CLUBS (annuaire réseau)
     ========================================================== */
  function clubCards() {
    const q = UI.clubQ.toLowerCase();
    let list = D.CLUBS.filter((c) => (c.name + " " + c.city + " " + c.dept + " " + c.president).toLowerCase().indexOf(q) > -1);
    if (UI.clubScope === "idf") list = list.filter(isIdf);
    if (UI.clubScope === "outside") list = list.filter((c) => !isIdf(c));
    if (!list.length) return empty("globe", "Aucun club trouvé", "Essayez un autre nom de club, de ville ou de département.");
    return list.map((c, i) => {
      const x = D.CLUB_EXTRA[c.id] || {};
      const n = D.AVAILABLE.filter((m) => m.clubId === c.id).length;
      const mine = c.id === st().clubId;
      return `<article class="card card-hover reveal" data-reveal-delay="${(i % 3) * 0.05}">
      <div class="card-body stack stack-4">
        <div class="row-2" style="align-items:flex-start">
          ${TTM.clubLogo(c, "club-logo-lg")}
          <div class="flex-1" style="min-width:0">
            <div class="row-2 wrap" style="gap:6px">
              <b class="t-body-sm">${E(c.name)}</b>
              ${x.verified ? '<span class="badge badge-info" title="Club vérifié">' + TTM.icon("shieldCheck", 12) + "Vérifié</span>" : ""}
              ${mine ? '<span class="badge badge-brand">Votre club</span>' : ""}
            </div>
            <div class="t-caption t-secondary">${E(c.city)} · ${E(deptOf(c))}</div>
            <div class="row-2 wrap" style="gap:8px;margin-top:6px">
              <span class="rating">${TTM.icon("star", 13)}${E(String(x.rating || "—"))}</span>
              <span class="t-micro" style="color:var(--ttm-success);font-weight:700">${TTM.icon("trendingUp", 12)} ${E(x.trend || "")}</span>
              <span class="t-micro t-muted">${mine ? "votre stade" : distHome(c) + " km"}</span>
            </div>
          </div>
        </div>
        <div class="grid-3" style="gap:8px">
          <div class="team-stat"><b>${x.matches || 0}</b><span>matchs</span></div>
          <div class="team-stat"><b>${x.teams || 0}</b><span>équipes</span></div>
          <div class="team-stat"><b>${n}</b><span>disponibles</span></div>
        </div>
        <p class="t-caption t-secondary" style="line-height:1.5">${E(c.desc)}</p>
      </div>
      <div class="card-footer row-2" style="justify-content:space-between">
        <span class="t-micro t-muted">Président : ${E(c.president)}</span>
        <div class="row-2">
          <button class="btn btn-ghost btn-xs" data-act="club-profile" data-id="${c.id}">Profil</button>
          <button class="btn btn-outline btn-xs" data-act="club-matches" data-id="${c.id}">Matchs</button>
        </div>
      </div>
    </article>`;
    }).join("");
  }

  ROUTES.clubs = {
    title: "Clubs",
    view: function () {
      const idf = D.CLUBS.filter(isIdf).length;
      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Réseau de clubs</h2>
      <p>${D.CLUBS.length} clubs partenaires · ${idf} en Île-de-France. Chaque club publie ses disponibilités, tournois et coordonnées.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-go="map">${TTM.icon("mapPin", 16)}Voir la carte</button>
      <button class="btn btn-primary btn-sm" data-act="newclub">${TTM.icon("plus", 16)}Créer un club</button>
    </div>
  </div>

  <div class="card card-pad-sm">
    <div class="row-between wrap" style="gap:var(--s-3)">
      <div class="flex-1" style="min-width:220px;max-width:420px">
        <div class="search-bar ${UI.clubQ ? "has-value" : ""}">
          <span class="s-icon">${TTM.icon("search", 18)}</span>
          <input type="search" id="clubSearch" placeholder="Rechercher un club, une ville…" value="${E(UI.clubQ)}" aria-label="Rechercher un club">
          <button class="s-clear" aria-label="Effacer">${TTM.icon("x", 14)}</button>
        </div>
      </div>
      <div class="pill-tabs">
        <button class="pill-tab ${UI.clubScope === "all" ? "is-active" : ""}" data-act="club-scope" data-v="all">Tous (${D.CLUBS.length})</button>
        <button class="pill-tab ${UI.clubScope === "idf" ? "is-active" : ""}" data-act="club-scope" data-v="idf">Île-de-France (${idf})</button>
        <button class="pill-tab ${UI.clubScope === "outside" ? "is-active" : ""}" data-act="club-scope" data-v="outside">Hors IDF (${D.CLUBS.length - idf})</button>
      </div>
    </div>
  </div>

  <div id="clubList" class="grid" style="grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:var(--s-5)">
    ${clubCards()}
  </div>
</div>`;
    }
  };

  /* ==========================================================
     VUE · TOURNOIS
     ========================================================== */
  ROUTES.tournaments = {
    title: "Tournois",
    view: function () {
      const list = D.TOURNAMENTS.slice().sort(byDate);
      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Tournois & plateaux</h2>
      <p>${D.TOURNAMENTS.length} compétitions publiées par le réseau, avec gestion des places, liste des participants et confirmation automatique.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-go="calendar">${TTM.icon("calendar", 16)}Voir au calendrier</button>
      <button class="btn btn-primary btn-sm" data-act="pub">${TTM.icon("plus", 16)}Proposer un tournoi</button>
    </div>
  </div>

  <div class="grid-4">
    ${kpi({ label: "Tournois ouverts", val: list.length, ico: "trophy", accent: "orange", delta: "+2", d: 0 })}
    ${kpi({ label: "Places disponibles", val: list.reduce((a, t) => a + t.slots, 0), ico: "users", accent: "blue", delta: "+5", d: 0.05 })}
    ${kpi({ label: "Équipes inscrites", val: list.reduce((a, t) => a + t.teams, 0), ico: "shield", accent: "green", delta: "+18 %", d: 0.1 })}
    ${kpi({ label: "Rayon moyen", val: Math.round(list.reduce((a, t) => a + t.dist, 0) / list.length), suffix: " km", ico: "mapPin", accent: "purple", delta: "-2 km", d: 0.15 })}
  </div>

  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--s-5)">
    ${list.map((t, i) => {
      const c = club(t.orgId);
      const pctSlots = Math.round((t.teams / t.maxTeams) * 100);
      const multi = t.date !== t.endDate;
      return `<article class="card card-hover reveal" data-reveal-delay="${(i % 3) * 0.05}">
      <div class="card-body stack stack-4">
        <div class="row-2 wrap" style="gap:8px">
          ${TTM.catBadge(t.cat)}
          ${badge(t.level === 1 ? "badge-success" : t.level === 2 ? "badge-brand" : "badge-warning", "", TTM.levelLabel[t.level])}
          ${t.fee ? badge("badge-danger", "wallet", "Frais d'inscription") : badge("badge-success", "check", "Inscription gratuite")}
        </div>
        <div>
          <b class="t-body-sm">${E(t.name)}</b>
          <div class="t-micro t-muted" style="margin-top:3px">${E(fmtDL(t.date))}${multi ? " → " + E(fmtD(t.endDate)) : ""}</div>
        </div>
        <div class="row-2" style="align-items:flex-start">
          ${TTM.clubLogo(c, "club-logo-sm")}
          <div class="flex-1" style="min-width:0">
            <div class="t-caption" style="font-weight:600">${E(c.name)}</div>
            <div class="t-micro t-muted">${E(t.venue)} · ${E(t.city)} · ${t.dist} km</div>
          </div>
          ${TTM.compatHTML(100 - Math.round(t.dist / 1.5), "compat-ring-sm")}
        </div>
        <div class="stack stack-2">
          <div class="row-between"><span class="t-caption t-secondary">Équipes</span><span class="t-caption t-num" style="font-weight:700">${t.teams} / ${t.maxTeams}</span></div>
          <div class="bar ${pctSlots >= 100 ? "bar-warning" : "bar-success"}"><div class="bar-fill" data-w="${pctSlots}"></div></div>
          <div class="t-micro ${t.slots <= 2 ? "" : "t-muted"}" style="${t.slots <= 2 ? "color:var(--ttm-warning);font-weight:700" : ""}">${t.slots <= 2 ? "Plus que " + t.slots + " place" + (t.slots > 1 ? "s" : "") : t.slots + " places restantes"}</div>
        </div>
        <div class="row-2 wrap" style="gap:12px">
          <span class="match-meta">${TTM.icon("users", 14)}${E(t.age)}</span>
          <span class="match-meta">${TTM.icon("whistle", 14)}${E(t.format)}</span>
          <span class="match-meta">${TTM.icon("award", 14)}${E(t.prize)}</span>
        </div>
      </div>
      <div class="card-footer row-2" style="justify-content:space-between">
        <button class="btn btn-ghost btn-xs" data-act="club-profile" data-id="${c.id}">${TTM.icon("building", 14)}${E(c.short)}</button>
        <button class="btn btn-primary btn-xs" data-act="join" data-id="${t.id}" ${t.slots <= 0 ? "disabled" : ""}>${t.slots <= 0 ? "Complet" : "Inscrire une équipe"}</button>
      </div>
    </article>`;
    }).join("")}
  </div>
</div>`;
    }
  };

  /* ==========================================================
     VUE · MESSAGERIE
     ========================================================== */
  const REPLIES = [
    "Parfait, c'est noté de notre côté.",
    "Nous confirmons le créneau et le terrain.",
    "Merci ! Nous préparons la liste des joueurs.",
    "Pouvez-vous nous envoyer les licences manquantes ?",
    "Rendez-vous sur le parking visiteurs 15 min avant le coup d'envoi."
  ];

  function nowHHMM() {
    const d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function sendMessage(text) {
    const t = st().threads.find((x) => x.id === UI.msgId);
    const v = String(text || "").trim();
    if (!t || !v) return;
    t.messages.push({ me: true, text: v, t: nowHHMM() });
    t.updated = new Date().toISOString();
    t.unread = 0;
    render();
    const body = $(".chat-body");
    if (body) body.scrollTop = body.scrollHeight;

    const c = club(t.clubId);
    setTimeout(() => {
      const b = $(".chat-body");
      if (!b) return;
      const typ = document.createElement("div");
      typ.className = "bubble bubble-in";
      typ.id = "typingBubble";
      typ.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
      b.appendChild(typ);
      b.scrollTop = b.scrollHeight;
    }, 900);
    setTimeout(() => {
      const th = st().threads.find((x) => x.id === UI.msgId);
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      th.messages.push({ me: false, text: reply, t: nowHHMM() });
      TTM.toast("Nouveau message de " + c.name, reply, "info");
      render();
    }, 2700);
  }

  ROUTES.messages = {
    title: "Messages",
    view: function () {
      const s = st();
      const t = s.threads.find((x) => x.id === UI.msgId) || s.threads[0];
      UI.msgId = t.id;
      const c = club(t.clubId);
      return `<div class="stack stack-5">
  <div class="view-head" style="margin-bottom:0">
    <div>
      <h2>Messagerie club</h2>
      <p>Échanges liés aux matchs, convocations et documents. ${s.threads.reduce((a, x) => a + x.unread, 0)} message(s) non lu(s).</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-act="readall">${TTM.icon("check", 16)}Tout marquer comme lu</button>
      <button class="btn btn-primary btn-sm" data-act="newclub">${TTM.icon("edit", 16)}Nouveau message</button>
    </div>
  </div>

  <div class="msg-layout">
    <div class="msg-list-pane">
      ${s.threads.map((x) => {
        const cc = club(x.clubId);
        const last = x.messages[x.messages.length - 1];
        return `<div class="msg-item ${x.id === t.id ? "is-active" : ""}" data-act="thread" data-id="${x.id}">
          ${TTM.avatar(cc.name, "avatar-sm", x.unread ? 1 : 6, x.online ? "on" : "")}
          <div class="flex-1" style="min-width:0">
            <div class="row-between"><b class="t-caption">${E(cc.name)}</b><span class="t-micro t-muted">${E(last.t)}</span></div>
            <div class="msg-last">${last.me ? "Vous : " : ""}${E(last.text)}</div>
          </div>
          ${x.unread ? '<span class="msg-unread">' + x.unread + "</span>" : ""}
        </div>`;
      }).join("")}
    </div>

    <div class="chat">
      <div class="chat-head">
        ${TTM.clubLogo(c, "club-logo-sm")}
        <div class="flex-1" style="min-width:0">
          <b class="t-body-sm">${E(c.name)}</b>
          <div class="t-micro ${t.online ? "" : "t-muted"}" style="${t.online ? "color:var(--ttm-success);font-weight:700" : ""}">${t.online ? "● En ligne" : "Vu " + E(t.messages[t.messages.length - 1].t)}</div>
        </div>
        <div class="row-2">
          <button class="btn btn-ghost btn-icon btn-sm hide-sm" data-act="club-profile" data-id="${c.id}" aria-label="Profil du club">${TTM.icon("building", 18)}</button>
          <button class="btn btn-ghost btn-icon btn-sm" data-act="coach-call" aria-label="Appeler">${TTM.icon("phone", 18)}</button>
        </div>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-day">Aujourd'hui</div>
        ${t.messages.map((msg) => `<div class="bubble ${msg.me ? "bubble-out" : "bubble-in"}">${E(msg.text)}<div class="bubble-time">${E(msg.t)}${msg.me ? " · lu" : ""}</div></div>`).join("")}
      </div>
      <form class="chat-compose" id="chatForm">
        <button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Joindre un document">${TTM.icon("paperclip", 18)}</button>
        <textarea class="chat-input" id="chatInput" rows="1" placeholder="Écrire à ${E(c.name)}…" aria-label="Message"></textarea>
        <button type="submit" class="btn btn-primary btn-icon" aria-label="Envoyer">${TTM.icon("send", 18)}</button>
      </form>
    </div>
  </div>
</div>`;
    },
    mount: function () {
      const b = $("#chatBody");
      if (b) b.scrollTop = b.scrollHeight;
    }
  };

  /* ==========================================================
     VUE · DEMANDES
     ========================================================== */
  function doAccept(id) {
    const r = st().requests.find((x) => x.id === id);
    if (!r) return;
    TTM.confirm({
      title: "Accepter cette demande ?",
      body: "Le match sera ajouté au calendrier de l'équipe " + ((D.team(r.teamId) || {}).name || "") + " et une notification partira vers " + (club(r.from).name) + ".",
      ok: "Accepter le match"
    }).then((ok) => {
      if (!ok) return;
      TTM.acceptRequest(id);
      render();
    });
  }

  function doDecline(id) {
    const r = st().requests.find((x) => x.id === id);
    if (!r) return;
    TTM.confirm({ title: "Refuser la demande ?", body: "Le club demandeur sera prévenu et pourra proposer une autre date.", ok: "Refuser", danger: true }).then((ok) => {
      if (!ok) return;
      TTM.declineRequest(id);
      render();
    });
  }

  ROUTES.requests = {
    title: "Demandes",
    view: function () {
      const s = st();
      const all = s.requests.slice();
      const rec = all.filter((r) => r.to === s.clubId);
      const sent = all.filter((r) => r.from === s.clubId);
      const list = UI.reqTab === "in" ? rec : UI.reqTab === "out" ? sent : all;
      const pending = all.filter((r) => r.status === "pending").length;
      const accepted = all.filter((r) => r.status === "accepted").length;

      const row = (r) => {
        const incoming = r.to === s.clubId;
        const other = club(incoming ? r.from : r.to);
        const m = D.match(r.matchId);
        return `<tr>
        <td>
          <div class="row-2">${TTM.clubLogo(other, "club-logo-sm")}
            <div style="min-width:0">
              <div class="t-caption" style="font-weight:600">${E(other.name)}</div>
              <div class="t-micro t-muted">${incoming ? "Reçue" : "Envoyée"} · ${E((D.team(r.teamId) || {}).name || r.cat)}</div>
            </div>
          </div>
        </td>
        <td>${TTM.catBadge(r.cat)}</td>
        <td><b>${E(fmtD(r.date))}</b><div class="t-micro t-muted">${E(m ? m.time : "")} · ${E(m ? m.city : "")}</div></td>
        <td>${badge("", "", typeOf(m || { type: "friendly" }))}</td>
        <td>${statusBadge(r.status)}</td>
        <td style="text-align:right">
          <div class="row-2" style="justify-content:flex-end">
            <button class="btn btn-ghost btn-xs" data-act="req-detail" data-id="${r.id}">Détails</button>
            ${incoming && r.status === "pending"
              ? '<button class="btn btn-outline btn-xs" data-act="req-decline" data-id="' + r.id + '">Refuser</button><button class="btn btn-primary btn-xs" data-act="req-accept" data-id="' + r.id + '">Accepter</button>'
              : r.status === "pending"
                ? '<button class="btn btn-outline btn-xs" data-act="req-remind" data-id="' + r.id + '">Relancer</button>'
                : ""}
          </div>
        </td>
      </tr>`;
      };

      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Demandes de match</h2>
      <p>Suivi complet du workflow : envoi, notification du club, réponse et confirmation au calendrier.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-go="marketplace">${TTM.icon("target", 16)}Trouver un match</button>
      <button class="btn btn-primary btn-sm" data-act="pub">${TTM.icon("plus", 16)}Publier un match</button>
    </div>
  </div>

  <div class="grid-4">
    ${kpi({ label: "Demandes totales", val: all.length, ico: "handshake", accent: "blue", delta: "+6", d: 0 })}
    ${kpi({ label: "En attente de réponse", val: pending, ico: "clock", accent: "orange", delta: "-2", d: 0.05 })}
    ${kpi({ label: "Confirmées", val: accepted, ico: "checkCircle", accent: "green", delta: "+4", d: 0.1 })}
    ${kpi({ label: "Taux de confirmation", val: all.length ? Math.round((accepted / all.length) * 100) : 0, suffix: " %", ico: "target", accent: "purple", delta: "+5 pts", d: 0.15 })}
  </div>

  <div class="tabs">
    <button class="tab ${UI.reqTab === "in" ? "is-active" : ""}" data-act="req-tab" data-v="in">Reçues<span class="tab-count">${rec.length}</span></button>
    <button class="tab ${UI.reqTab === "out" ? "is-active" : ""}" data-act="req-tab" data-v="out">Envoyées<span class="tab-count">${sent.length}</span></button>
    <button class="tab ${UI.reqTab === "all" ? "is-active" : ""}" data-act="req-tab" data-v="all">Toutes<span class="tab-count">${all.length}</span></button>
  </div>

  <section class="card">
    ${list.length
      ? `<div class="table-wrap"><table class="table">
          <thead><tr><th>Club</th><th>Catégorie</th><th>Date</th><th>Type</th><th>Statut</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>${list.map(row).join("")}</tbody>
        </table></div>`
      : empty("inbox", "Aucune demande", "Aucune demande dans cette liste pour le moment.")}
  </section>

  <section class="card card-pad">
    <div class="row-between" style="margin-bottom:var(--s-4)"><b class="card-title">${TTM.icon("gitBranch", 16)} Comment fonctionne une demande</b><span class="badge badge-brand">Automatique</span></div>
    <div class="steps">
      ${D.WORKFLOW.map((w, i) => `<div class="step ${i === 0 ? "current" : ""}">
        <div class="step-dot">${i + 1}</div><div class="step-label">${E(w)}</div>
      </div>${i < D.WORKFLOW.length - 1 ? '<div class="step-line"></div>' : ""}`).join("")}
    </div>
  </section>
</div>`;
    }
  };

  /* ==========================================================
     VUE · NOTIFICATIONS
     ========================================================== */
  ROUTES.notifications = {
    title: "Notifications",
    view: function () {
      const s = st();
      const unread = s.notifications.filter((n) => !n.read);
      const read = s.notifications.filter((n) => n.read);
      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Notifications</h2>
      <p>Centre d'alertes du club : matchs recommandés, réponses aux demandes, messages, changements d'horaire et convocations.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-go="settings">${TTM.icon("settings", 16)}Préférences</button>
      <button class="btn btn-primary btn-sm" data-act="readall" ${!unread.length ? "disabled" : ""}>${TTM.icon("check", 16)}Tout marquer comme lu</button>
    </div>
  </div>

  <div class="grid-4">
    ${kpi({ label: "Non lues", val: unread.length, ico: "bell", accent: "orange", d: 0 })}
    ${kpi({ label: "Urgentes", val: s.notifications.filter((n) => n.level === "urgent").length, ico: "alertCircle", accent: "blue", d: 0.05 })}
    ${kpi({ label: "Messages clubs", val: s.notifications.filter((n) => n.type === "new_message").length, ico: "message", accent: "purple", d: 0.1 })}
    ${kpi({ label: "Total sur 30 jours", val: s.notifications.length + 41, ico: "activity", accent: "green", delta: "+18 %", d: 0.15 })}
  </div>

  <div class="grid-main-side">
    <div class="stack stack-5">
      <section class="card">
        <div class="card-header"><b class="card-title">Nouvelles</b><span class="badge badge-brand">${unread.length}</span></div>
        <div class="card-body notif-group" style="padding:var(--s-3)">
          ${unread.length ? unread.map((n) => notifRow(n)).join("") : '<div class="t-caption t-secondary" style="padding:16px 4px">Aucune nouvelle notification.</div>'}
        </div>
      </section>

      <section class="card">
        <div class="card-header"><b class="card-title">Anciennes</b><span class="badge">${read.length}</span></div>
        <div class="card-body notif-group" style="padding:var(--s-3)">
          ${read.length ? read.map((n) => notifRow(n)).join("") : '<div class="t-caption t-secondary" style="padding:16px 4px">Rien à afficher.</div>'}
        </div>
      </section>
    </div>

    <aside class="stack stack-5">
      <section class="card card-brand">
        <div class="card-body stack stack-4">
          <b class="t-body-sm">${TTM.icon("settings", 16)} Canaux d'alerte</b>
          ${[["notif-push", "Push mobile", "Alertes sur le téléphone du président et des coachs."],
             ["notif-match", "Nouveaux matchs", "Un push dès qu'un match correspond à 80 % ou plus."],
             ["notif-urgent", "Alertes urgentes", "Demandes recevues et changements de dernière minute."],
             ["notif-digest", "Résumé hebdomadaire", "Un e-mail chaque lundi matin avec l'activité du club."]]
            .map((c) => `<label class="switch" style="width:100%;align-items:flex-start">
              <input type="checkbox" ${PREF_UI[c[0]] ? "checked" : ""} data-sw="${c[0]}">
              <span class="switch-track" style="margin-top:2px"><span class="switch-thumb"></span></span>
              <span><span class="t-caption" style="font-weight:600">${E(c[1])}</span><br><span class="t-micro t-muted">${E(c[2])}</span></span>
            </label>`).join("")}
        </div>
      </section>

      <section class="card">
        <div class="card-body stack stack-3">
          <b class="t-body-sm">${TTM.icon("info", 16)} Comment sont générées les alertes</b>
          <p class="t-caption t-secondary" style="line-height:1.55">Chaque événement métier (publication d'un match, réponse d'un club, modification d'horaire, convocation) produit une notification contextualisée et routée vers les bons destinataires.</p>
          <div class="glow-line"></div>
          <div class="row-between"><span class="t-caption t-muted">Délai moyen de notification</span><b class="t-caption">1,4 s</b></div>
          <div class="row-between"><span class="t-caption t-muted">Taux de lecture</span><b class="t-caption">92 %</b></div>
        </div>
      </section>
    </aside>
  </div>
</div>`;
    }
  };

  /* ==========================================================
     VUE · STATISTIQUES
     ========================================================== */
  ROUTES.stats = {
    title: "Statistiques",
    view: function () {
      const K = D.STATS.kpi;
      const cats = D.TEAMS.map((t) => t.cat);
      const teamsDonut = D.TEAMS.map((t, i) => ({
        label: t.name,
        value: D.MY_MATCHES.filter((m) => m.teamId === t.id).length + 3 + i,
        color: ["#2563EB", "#22D3EE", "#8B5CF6", "#22C55E", "#F59E0B", "#EC4899", "#0EA5E9"][i % 7]
      }));
      const funnel = D.STATS.requestsFunnel;
      const maxF = funnel[0].value;

      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Statistiques du club</h2>
      <p>Indicateurs de performance du réseau TTM : volume de matchs, taux de confirmation, distances parcourues et efficacité du moteur.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-act="download">${TTM.icon("download", 16)}Exporter</button>
      <button class="btn btn-primary btn-sm" data-act="print">${TTM.icon("clipboardCheck", 16)}Rapport</button>
    </div>
  </div>

  <div class="grid-4">
    ${kpi({ label: "Matchs joués", val: K.matchesPlayed, ico: "checkCircle", accent: "blue", delta: "+18 %", d: 0 })}
    ${kpi({ label: "Taux de victoire", val: K.winRate, suffix: " %", ico: "trophy", accent: "green", delta: "+4 pts", d: 0.05 })}
    ${kpi({ label: "Distance moyenne", val: K.avgDist, suffix: " km", ico: "mapPin", accent: "cyan", delta: "-1,8 km", d: 0.1 })}
    ${kpi({ label: "Temps administratif gagné", val: K.timeSaved, suffix: " h", ico: "zap", accent: "purple", delta: "+22 %", d: 0.15 })}
  </div>

  <div class="grid-main-side">
    <div class="stack stack-5">
      <section class="card">
        <div class="card-header"><b class="card-title">Activité sur 12 semaines</b><span class="badge badge-brand">+19 %</span></div>
        <div class="card-body">
          ${TTM.charts.line({ data: D.STATS.activity12w, height: 230, color: "#2563EB", color2: "#22D3EE", label: "Nombre de matchs par semaine", xLabels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12"] })}
        </div>
      </section>

      <div class="grid-2">
        <section class="card">
          <div class="card-header"><b class="card-title">Matchs par catégorie</b></div>
          <div class="card-body">
            ${TTM.charts.bars({ data: D.STATS.byCat, height: 210, unit: "", label: "Matchs par catégorie" })}
          </div>
        </section>
        <section class="card">
          <div class="card-header"><b class="card-title">Répartition par équipe</b></div>
          <div class="card-body stack stack-4" style="align-items:center">
            ${TTM.charts.donut({ data: teamsDonut, size: 210, center: D.TEAMS.length, centerLabel: "équipes", label: "Matchs par équipe" })}
            <div class="chart-legend" style="justify-content:center">
              ${teamsDonut.map((t) => `<span class="lg"><span class="sw" style="background:${t.color}"></span>${E(t.label)}</span>`).join("")}
            </div>
          </div>
        </section>
      </div>

      <section class="card">
        <div class="card-header"><b class="card-title">Entonnoir de conversion</b><span class="badge">${D.STATS.requestsFunnel[3].value} matchs confirmés</span></div>
        <div class="card-body stack stack-4">
          ${funnel.map((f) => `<div class="stack stack-1">
            <div class="row-between"><span class="t-caption t-secondary">${E(f.label)}</span><span class="t-caption t-num" style="font-weight:700">${f.value}${f === funnel[0] ? "" : " · " + Math.round((f.value / funnel[funnel.indexOf(f) - 1].value) * 100) + " %"}</span></div>
            <div class="bar"><div class="bar-fill" data-w="${Math.round((f.value / maxF) * 100)}"></div></div>
          </div>`).join("")}
        </div>
      </section>
    </div>

    <aside class="stack stack-5">
      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("mapPin", 16)} Distance des adversaires</b></div>
        <div class="card-body">
          ${TTM.charts.hbars({ data: D.STATS.distBuckets, unit: " matchs" })}
        </div>
      </section>

      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("building", 16)} Clubs les plus actifs</b><button class="btn btn-ghost btn-xs" data-go="clubs">Annuaire</button></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Club</th><th class="num">Matchs</th><th class="num">Note</th></tr></thead>
            <tbody>
              ${D.CLUBS.slice()
                .sort((a, b) => (D.CLUB_EXTRA[b.id] || {}).matches - (D.CLUB_EXTRA[a.id] || {}).matches)
                .slice(0, 8)
                .map((c) => {
                  const x = D.CLUB_EXTRA[c.id] || {};
                  return `<tr style="cursor:pointer" data-act="club-profile" data-id="${c.id}">
                    <td><div class="row-2">${TTM.clubLogo(c, "club-logo-sm")}<span class="t-caption" style="font-weight:600">${E(c.name)}</span></div></td>
                    <td class="num"><b>${x.matches || 0}</b></td>
                    <td class="num"><span class="rating">${TTM.icon("star", 12)}${E(String(x.rating || "—"))}</span></td>
                  </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card card-brand">
        <div class="card-body stack stack-3">
          <b class="t-body-sm">${TTM.icon("sparkles", 16)} Impact du moteur</b>
          <div class="row-between"><span class="t-caption t-secondary">Matchs trouvés sans échange</span><b>${K.matchesPlayed} / ${K.matchesPlayed + 9}</b></div>
          <div class="row-between"><span class="t-caption t-secondary">Réductions d'échanges</span><b>−71 %</b></div>
          <div class="row-between"><span class="t-caption t-secondary">Score moyen proposé</span><b>82 %</b></div>
          <div class="glow-line"></div>
          <p class="t-micro t-muted">Indicateurs synthétiques pour la démonstration : ils seraient calculés en temps réel à partir des données du club.</p>
        </div>
      </section>
    </aside>
  </div>
</div>`;
    }
  };

  /* ==========================================================
     VUE · CARTE
     ========================================================== */
  ROUTES.map = {
    title: "Carte",
    view: function () {
      const s = st();
      const near = D.AVAILABLE.slice()
        .map((m) => ({ m, c: club(m.clubId), d: m.dist, pct: scoreOf(m).pct }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 8);
      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Carte du réseau</h2>
      <p>${D.CLUBS.length} clubs, ${D.STADIUMS.length} stades référencés. Cliquez sur un club pour voir sa première disponibilité.</p>
    </div>
    <div class="row-2 wrap">
      <button class="btn btn-outline btn-sm" data-go="clubs">${TTM.icon("globe", 16)}Annuaire</button>
      <button class="btn btn-primary btn-sm" data-go="marketplace">${TTM.icon("target", 16)}Trouver un match</button>
    </div>
  </div>

  <div class="grid-main-side">
    <section class="card card-pad-sm">
      <div id="clubMap" class="map map-radial" style="height:540px;border-radius:var(--r-lg)"></div>
    </section>

    <aside class="stack stack-5">
      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("mapPin", 16)} Clubs les plus proches</b></div>
        <div class="card-body">
          <div class="mini-list">
            ${D.CLUBS.map((c) => ({ c: c, d: distHome(c) }))
              .sort((a, b) => a.d - b.d)
              .slice(0, 6)
              .map((x) => `<div class="mini-row">
                ${TTM.clubLogo(x.c, "club-logo-sm")}
                <div class="grow">
                  <div class="t-caption" style="font-weight:600">${E(x.c.name)}</div>
                  <div class="t-micro t-muted">${E(x.c.city)} · ${E(x.c.dept)}</div>
                </div>
                <b class="t-caption t-num">${x.c.id === s.clubId ? "—" : x.d + " km"}</b>
              </div>`).join("")}
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-header"><b class="card-title">${TTM.icon("target", 16)} Disponibilités proches</b></div>
        <div class="card-body">
          <div class="mini-list">
            ${near.map((x) => `<div class="mini-row">
              ${TTM.compatHTML(x.pct, "compat-ring-sm")}
              <div class="grow">
                <div class="t-caption" style="font-weight:600">${E(x.c.name)}</div>
                <div class="t-micro t-muted">${E(x.m.cat)} · ${E(fmtD(x.m.date))} ${E(x.m.time)} · ${x.d} km</div>
              </div>
              <button class="btn btn-outline btn-xs" data-act="open" data-id="${x.m.id}">Voir</button>
            </div>`).join("")}
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-body stack stack-3">
          <b class="t-body-sm">${TTM.icon("info", 16)} Lecture de la carte</b>
          <div class="t-caption t-secondary">Les marqueurs positionnent les clubs selon leurs coordonnées réelles. Les stades apparaissent en gris, les tournois en orange. Utilisez la molette ou les boutons pour zoomer.</div>
        </div>
      </section>
    </aside>
  </div>
</div>`;
    },
    mount: function () {
      const host = $("#clubMap");
      if (!host) return;
      TTM.pitchMap(host, {
        height: 540,
        onSelect: function (clubId) {
          st().filters.cities = [club(clubId).city];
          go("marketplace");
        }
      });
    }
  };

  /* ==========================================================
     VUE · PARAMÈTRES
     ========================================================== */
  const SET_TABS = [
    { k: "profil", l: "Profil", i: "user" },
    { k: "club", l: "Club", i: "building" },
    { k: "equipes", l: "Équipes", i: "shield" },
    { k: "notif", l: "Notifications", i: "bell" },
    { k: "apparence", l: "Apparence", i: "sparkles" },
    { k: "securite", l: "Sécurité", i: "lock" }
  ];

  ROUTES.settings = {
    title: "Paramètres",
    view: function () {
      const s = st();
      const h = home();
      const u = s.user;
      return `<div class="stack stack-6">
  <div class="view-head">
    <div>
      <h2>Paramètres</h2>
      <p>Configuration du compte, du club, des équipes et des notifications. Les données de démonstration ne sont pas enregistrées.</p>
    </div>
    <button class="btn btn-outline btn-sm" data-act="reset">${TTM.icon("refresh", 16)}Réinitialiser la démo</button>
  </div>

  <div class="grid-side-main">
    <aside class="stack stack-3">
      <div class="card card-pad-sm">
        <div class="stack" style="gap:2px">
          ${SET_TABS.map((t) => `<button class="nav-item ${UI.setTab === t.k ? "is-active" : ""}" data-act="set-tab" data-v="${t.k}">${TTM.icon(t.i, 18)}<span>${E(t.l)}</span></button>`).join("")}
        </div>
      </div>
      <section class="card card-brand">
        <div class="card-body stack stack-3">
          <div class="row-2">
            <span class="badge badge-solid-brand">PRO</span>
            <b class="t-body-sm">Offre Pro Club</b>
          </div>
          <p class="t-micro t-secondary" style="line-height:1.5">7 équipes, utilisateurs illimités, moteur prioritaire et tableau de bord club.</p>
          <button class="btn btn-primary btn-xs btn-block" data-act="upgrade">${TTM.icon("sparkles", 14)}Découvrir</button>
        </div>
      </section>
    </aside>

    <div class="stack stack-5">
      ${UI.setTab === "profil"
        ? `<section class="card"><div class="card-header"><b class="card-title">${TTM.icon("user", 16)} Profil utilisateur</b></div>
            <div class="card-body"><form class="stack stack-4" data-form="profile">
              <div class="row-2" style="gap:14px">${TTM.avatar(u.name, "avatar-xl", 0)}<div><b class="t-h4">${E(u.name)}</b><div class="t-caption t-secondary">${E(u.role)} · ${E(h.name)}</div></div></div>
              <div class="grid-2">
                ${field("text", "Nom complet", u.name, "name", true)}
                ${field("text", "Fonction", u.role, "role", true)}
                ${field("email", "E-mail", "president@as-courbevoie.fr", "mail", true)}
                ${field("text", "Téléphone", "+33 6 12 34 56 78", "phone")}
              </div>
              <div class="row-2"><button type="submit" class="btn btn-primary">${TTM.icon("check", 16)}Enregistrer</button><button type="button" class="btn btn-ghost" data-act="reset">Annuler</button></div>
            </form></div></section>`
        : ""}

      ${UI.setTab === "club"
        ? `<section class="card"><div class="card-header"><b class="card-title">${TTM.icon("building", 16)} Informations du club</b><span class="badge badge-info">Vérifié</span></div>
            <div class="card-body"><form class="stack stack-4" data-form="profile">
              <div class="row-2" style="gap:14px">${TTM.clubLogo(h, "club-logo-xl")}<div><b class="t-h4">${E(h.name)}</b><div class="t-caption t-secondary">${E(h.dept)} · fondé en ${h.since}</div></div></div>
              <div class="grid-2">
                ${field("text", "Nom du club", h.name, "clubname", true)}
                ${field("text", "Ville", h.city, "city", true)}
                ${field("text", "Département", deptOf(h), "dept")}
                ${field("text", "Président", h.president, "president")}
                ${field("text", "Stade", h.stadium, "stadium")}
                ${field("text", "Capacité", h.seats, "seats")}
              </div>
              <div class="field"><label class="field-label" for="desc">Présentation</label><textarea class="textarea" id="desc" rows="3">${E(h.desc)}</textarea></div>
              <div class="row-2"><button type="submit" class="btn btn-primary">${TTM.icon("check", 16)}Enregistrer les modifications</button><button type="button" class="btn btn-ghost" data-act="edit-club">${TTM.icon("image", 16)}Changer le logo</button></div>
            </form></div></section>`
        : ""}

      ${UI.setTab === "equipes"
        ? `<section class="card"><div class="card-header"><b class="card-title">${TTM.icon("shield", 16)} Préférences par équipe</b><button class="btn btn-ghost btn-xs" data-go="teams">Vue équipes</button></div>
            <div class="card-body stack stack-4">
              ${D.TEAMS.map((t) => {
                const p = D.PREFS[t.id];
                return `<div class="card card-flat card-pad-sm stack stack-3">
                  <div class="row-between">
                    <div class="row-2">${TTM.catBadge(t.cat)}<b class="t-body-sm">${E(t.name)}</b><span class="t-micro t-muted">${E(t.level)}</span></div>
                    <button class="btn btn-outline btn-xs" data-act="team-prefs" data-id="${t.id}">${TTM.icon("sliders", 14)}Modifier</button>
                  </div>
                  <div class="row-2 wrap" style="gap:8px">
                    ${badge("", "mapPin", p.maxDist + " km")}
                    ${badge("", "calendar", p.days.map(cap).join(" · "))}
                    ${badge("", "clock", p.timeFrom + " – " + p.timeTo)}
                    ${badge("", "whistle", p.formats.join(" / "))}
                    ${badge(p.notify ? "badge-success" : "", p.notify ? "check" : "bellOff", p.notify ? "Alertes actives" : "Alertes coupées")}
                  </div>
                </div>`;
              }).join("")}
            </div></section>`
        : ""}

      ${UI.setTab === "notif"
        ? `<section class="card"><div class="card-header"><b class="card-title">${TTM.icon("bell", 16)} Notifications & rappels</b></div>
            <div class="card-body stack stack-4">
              ${[["notif-push", "Notifications push", "Alertes sur tous les appareils connectés."],
                 ["notif-match", "Nouveaux matchs recommandés", "Dès qu'un match atteint 80 % de compatibilité."],
                 ["notif-urgent", "Demandes reçues", "Notification immédiate pour toute demande entrante."],
                 ["notif-message", "Messages des clubs", "Alerte à chaque nouveau message reçu."],
                 ["notif-digest", "Résumé hebdomadaire", "Activité du club envoyée chaque lundi à 8 h."]]
                .map((c) => `<div class="card card-flat card-pad-sm row-between" style="align-items:flex-start">
                  <div style="min-width:0;padding-right:12px"><b class="t-body-sm">${E(c[1])}</b><div class="t-caption t-secondary">${E(c[2])}</div></div>
                  <label class="switch"><input type="checkbox" ${PREF_UI[c[0]] ? "checked" : ""} data-sw="${c[0]}"><span class="switch-track"><span class="switch-thumb"></span></span></label>
                </div>`).join("")}
            </div></section>`
        : ""}

      ${UI.setTab === "apparence"
        ? `<section class="card"><div class="card-header"><b class="card-title">${TTM.icon("sparkles", 16)} Apparence</b></div>
            <div class="card-body stack stack-5">
              <div class="field">
                <span class="field-label">Thème</span>
                <div class="pill-tabs" style="align-self:flex-start">
                  <button class="pill-tab ${TTM.theme.get() === "light" ? "is-active" : ""}" data-act="theme" data-v="light">${TTM.icon("sun", 14)} Clair</button>
                  <button class="pill-tab ${TTM.theme.get() === "dark" ? "is-active" : ""}" data-act="theme" data-v="dark">${TTM.icon("moon", 14)} Sombre</button>
                </div>
              </div>
              <div class="divider"></div>
              <div class="card card-flat card-pad-sm row-between">
                <div><b class="t-body-sm">Animations et micro-interactions</b><div class="t-caption t-secondary">Désactiver pour une interface plus sobre.</div></div>
                <label class="switch"><input type="checkbox" ${PREF_UI["pref-anim"] ? "checked" : ""} data-sw="pref-anim"><span class="switch-track"><span class="switch-thumb"></span></span></label>
              </div>
              <div class="card card-flat card-pad-sm row-between">
                <div><b class="t-body-sm">Affichage compact</b><div class="t-caption t-secondary">Réduit les espacements des listes et tableaux.</div></div>
                <label class="switch"><input type="checkbox" ${PREF_UI["pref-compact"] ? "checked" : ""} data-sw="pref-compact"><span class="switch-track"><span class="switch-thumb"></span></span></label>
              </div>
              <div class="alert alert-info">
                <span class="alert-ico">${TTM.icon("info", 16)}</span>
                <div>Le thème est enregistré localement dans votre navigateur et s'applique aussi à l'application mobile, à la landing page et au deck de présentation.</div>
              </div>
            </div></section>`
        : ""}

      ${UI.setTab === "securite"
        ? `<section class="card"><div class="card-header"><b class="card-title">${TTM.icon("lock", 16)} Sécurité & accès</b></div>
            <div class="card-body stack stack-4">
              <form class="stack stack-4" data-form="profile">
                <div class="grid-2">
                  ${field("password", "Mot de passe actuel", "••••••••", "p1")}
                  ${field("password", "Nouveau mot de passe", "••••••••", "p2")}
                </div>
                <div class="row-2"><button type="submit" class="btn btn-primary">${TTM.icon("lock", 16)}Mettre à jour</button></div>
              </form>
              <div class="divider"></div>
              <div class="card card-flat card-pad-sm row-between">
                <div><b class="t-body-sm">Double authentification</b><div class="t-caption t-secondary">Code à 6 chiffres envoyé par SMS à chaque connexion sensible.</div></div>
                <label class="switch"><input type="checkbox" checked data-sw="notif-2fa"><span class="switch-track"><span class="switch-thumb"></span></span></label>
              </div>
              <div class="card card-flat card-pad-sm">
                <div class="row-between"><b class="t-body-sm">Sessions actives</b><span class="badge badge-success">1 appareil</span></div>
                <div class="t-caption t-secondary" style="margin-top:6px">Chrome · macOS · Paris · session actuelle</div>
              </div>
              <div class="alert alert-warning">
                <span class="alert-ico">${TTM.icon("alertCircle", 16)}</span>
                <div>Données de démonstration : aucun mot de passe n'est réellement enregistré ni transmis.</div>
              </div>
            </div></section>`
        : ""}
    </div>
  </div>
</div>`;
    }
  };

  function field(type, label, value, id, req) {
    return `<div class="field">
      <label class="field-label" for="${id}">${E(label)}${req ? ' <span class="req">*</span>' : ""}</label>
      <input class="input" type="${type}" id="${id}" name="${id}" value="${E(value)}" ${req ? "required" : ""}>
    </div>`;
  }

  /* ==========================================================
     MODALES
     ========================================================== */

  function openMatchModal(id) {
    const m = D.match(id);
    if (!m) return;
    const c = club(m.clubId);
    const s = scoreOf(m);
    TTM.modal({
      size: "wide",
      title: "Match " + m.cat + " · " + c.name,
      subtitle: fmtDL(m.date) + " à " + m.time + " · " + m.venue + ", " + m.city,
      body: `<div class="stack stack-4">
      <div class="row-2 wrap" style="gap:8px">
        ${TTM.catBadge(m.cat)}${badge("badge-brand", "", typeOf(m))}${badge("", "", m.format)}${badge("", "", TTM.levelLabel[m.level])}
        <span class="match-meta">${TTM.icon("mapPin", 14)}${m.dist} km</span>
        <span class="match-meta">${TTM.icon("whistle", 14)}${E(m.pitch)}</span>
      </div>
      ${m.note ? '<div class="alert alert-neutral"><span class="alert-ico">' + TTM.icon("info", 16) + '</span><div>' + E(m.note) + "</div></div>" : ""}
      <div class="divider"></div>
      <div class="grid-2" style="align-items:center">
        <div class="stack stack-2">
          <b class="t-body-sm">Score de compatibilité</b>
          <div class="t-caption t-secondary">Calculé pour ${E(refTeamName())} sur 7 critères pondérés.</div>
        </div>
        <div class="row" style="justify-content:flex-end">${TTM.compatHTML(s.pct, "compat-ring-lg")}</div>
      </div>
      ${critList(s)}
    </div>`,
      footer: `<button class="btn btn-outline" data-x>Fermer</button>
        <button class="btn btn-outline" data-go="match/${m.id}">Fiche complète</button>
        <button class="btn btn-primary" data-act="req" data-id="${m.id}">${TTM.icon("send", 16)}Demander ce match</button>`,
      onMount: null
    });
  }

  function openRequestModal(id) {
    const m = D.match(id);
    if (!m) return;
    const c = club(m.clubId);
    const s = scoreOf(m);
    const tid = refTeam();
    TTM.modal({
      title: "Demander ce match",
      subtitle: c.name + " · " + m.cat + " · " + fmtDL(m.date) + " à " + m.time,
      body: `<form class="stack stack-4" data-form="request" data-match="${m.id}">
        <div class="row-2" style="gap:12px;padding:12px;border-radius:var(--r-md);background:var(--ttm-accent-soft)">
          ${TTM.clubLogo(c, "club-logo-sm")}
          <div class="flex-1" style="min-width:0">
            <b class="t-body-sm">${E(c.name)}</b>
            <div class="t-micro t-secondary">${E(m.venue)}, ${E(m.city)} · ${m.dist} km</div>
          </div>
          ${TTM.compatHTML(s.pct, "compat-ring-sm")}
        </div>
        <div class="field">
          <label class="field-label" for="reqTeam">Équipe concernée <span class="req">*</span></label>
          <select class="select" id="reqTeam" name="reqTeam" required>
            ${D.TEAMS.map((t) => `<option value="${t.id}" ${t.id === tid ? "selected" : ""}>${E(t.name)} · ${E(t.level)}</option>`).join("")}
          </select>
          <div class="field-hint" id="reqTeamHint"></div>
        </div>
        <div class="field">
          <label class="field-label" for="reqMsg">Message au club</label>
          <textarea class="textarea" id="reqMsg" name="reqMsg" rows="4" placeholder="Précisez le nombre de joueurs, la disponibilité des licences, l'arbitre…">Bonjour, nous serions ravis de disputer ce match ${m.cat}. Notre équipe est disponible et nous fournissons les licences.</textarea>
        </div>
        <label class="check"><input type="checkbox" name="alt" checked><span class="check-box">${TTM.icon("check", 13)}</span><span class="t-caption">Proposer une date alternative à l'adversaire</span></label>
      </form>`,
      footer: `<button class="btn btn-outline" data-x>Annuler</button>
        <button class="btn btn-primary" data-local="req" data-id="${m.id}">${TTM.icon("send", 16)}Envoyer la demande</button>`,
      onMount: function (el) {
        const sel = el.querySelector("#reqTeam");
        const hint = el.querySelector("#reqTeamHint");
        const upd = () => {
          const t = D.team(sel.value);
          const p = D.PREFS[t.id];
          hint.textContent = p ? "Rayon " + p.maxDist + " km · " + cap(p.days.join(" et ")) + " · " + p.timeFrom + "–" + p.timeTo + " · " + p.formats.join("/") : "";
        };
        upd();
        sel.addEventListener("change", upd);
        el.querySelector('[data-local="req"]').onclick = () => submitRequest(el.querySelector("form"));
      }
    });
  }

  function submitRequest(f) {
    const m = D.match(f.dataset.match);
    const teamId = f.querySelector("#reqTeam").value;
    const msg = f.querySelector("#reqMsg").value;
    const c = club(m.clubId);
    TTM.closeAll();
    const modal = TTM.modal({
      closable: false,
      title: "Demande envoyée à " + c.name,
      subtitle: "Suivi du workflow en temps réel",
      body: '<div id="wf">' + TTM.workflowHTML(0) + "</div>",
      footer: '<span class="t-micro t-muted" style="margin-right:auto">Simulation du workflow de mise en relation</span><button class="btn btn-outline" data-x>Fermer</button>'
    });
    const step = (i) => {
      const host = modal.el.querySelector("#wf");
      if (host) host.innerHTML = TTM.workflowHTML(i);
    };
    TTM.sendRequest(m, teamId, msg, (i) => step(i));
    setTimeout(() => step(1), 1500);
    setTimeout(() => step(2), 2700);
    setTimeout(() => {
      step(3);
      TTM.toast("Match confirmé", c.name + " a accepté votre demande : " + m.cat + " du " + fmtD(m.date) + " ajouté au calendrier.", "success", { duration: 6000 });
      TTM.pushNotification(TTM.smartNotify("request_accepted", { club: c.name, cat: m.cat, date: fmtD(m.date), time: m.time, link: "calendar" }));
    }, 4000);
  }

  function openPublishModal() {
    const nextSat = "2026-11-07";
    TTM.modal({
      size: "wide",
      title: "Publier un match",
      subtitle: "Votre disponibilité devient visible par les clubs du réseau, avec un score de compatibilité calculé pour chacun.",
      body: `<form class="stack stack-4" data-form="publish">
        <div class="grid-2">
          <div class="field">
            <label class="field-label" for="pubTeam">Équipe <span class="req">*</span></label>
            <select class="select" id="pubTeam" name="pubTeam" required>
              ${D.TEAMS.map((t) => `<option value="${t.id}" ${t.id === refTeam() ? "selected" : ""}>${E(t.name)} · ${E(t.cat)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label class="field-label" for="pubClub">Receveur <span class="req">*</span></label>
            <select class="select" id="pubClub" name="pubClub" required>
              ${D.CLUBS.map((c) => `<option value="${c.id}">${E(c.name)} · ${E(c.city)}</option>`).join("")}
            </select>
            <div class="field-hint">Le club sera notifié par e-mail et push.</div>
          </div>
          <div class="field">
            <label class="field-label" for="pubDate">Date <span class="req">*</span></label>
            <input class="input" type="date" id="pubDate" name="pubDate" value="${nextSat}" required>
          </div>
          <div class="field">
            <label class="field-label" for="pubTime">Heure <span class="req">*</span></label>
            <input class="input" type="time" id="pubTime" name="pubTime" value="15:00" required>
          </div>
          <div class="field">
            <label class="field-label" for="pubFormat">Format</label>
            <select class="select" id="pubFormat" name="pubFormat">
              <option>7v7</option><option selected>9v9</option><option>11v11</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label" for="pubPitch">Terrain</label>
            <select class="select" id="pubPitch" name="pubPitch">
              <option>Gazon synthétique</option><option selected>Gazon naturel</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label" for="pubLevel">Niveau</label>
            <select class="select" id="pubLevel" name="pubLevel">
              <option value="1">Débutant</option><option value="2" selected>Intermédiaire</option><option value="3">Avancé</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label" for="pubType">Type de rencontre</label>
            <select class="select" id="pubType" name="pubType">
              <option value="friendly" selected>Amical</option>
              <option value="league">Championnat</option>
              <option value="cup">Coupe</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="pubNote">Précisions (optionnel)</label>
          <textarea class="textarea" id="pubNote" name="pubNote" rows="3" placeholder="Nombre de joueurs, arbitre, parking, transport…"></textarea>
        </div>
        <div class="alert alert-info">
          <span class="alert-ico">${TTM.icon("sparkles", 16)}</span>
          <div>Publication immédiate : la demande est poussée vers les clubs dont les préférences correspondent, avec une notification prioritaire.</div>
        </div>
      </form>`,
      footer: `<button class="btn btn-outline" data-x>Annuler</button>
        <button class="btn btn-primary" data-local="pub">${TTM.icon("rocket", 16)}Publier maintenant</button>`,
      onMount: function (el) {
        el.querySelector('[data-local="pub"]').onclick = () => submitPublish(el.querySelector("form"));
      }
    });
  }

  function submitPublish(f) {
    const t = D.team(f.querySelector("#pubTeam").value);
    const c = D.club(f.querySelector("#pubClub").value);
    const m = {
      id: "m" + Date.now(),
      clubId: c.id,
      cat: t.cat,
      date: f.querySelector("#pubDate").value,
      time: f.querySelector("#pubTime").value,
      venue: c.stadium,
      city: c.city,
      level: +f.querySelector("#pubLevel").value,
      type: f.querySelector("#pubType").value,
      pitch: f.querySelector("#pubPitch").value,
      format: f.querySelector("#pubFormat").value,
      note: f.querySelector("#pubNote").value.trim(),
      dist: TTM.distance(home(), c)
    };
    D.AVAILABLE.unshift(m);
    TTM.closeAll();
    TTM.toast("Match publié", t.name + " vs " + c.name + " — " + fmtDL(m.date) + " à " + m.time + ". Le réseau a été notifié.", "success", { duration: 5600 });
    setTimeout(() => {
      TTM.pushNotification({
        id: "gen" + Date.now(),
        type: "match_offer",
        level: "success",
        title: "Publication confirmée",
        body: t.name + " recherche un adversaire " + t.cat + " le " + fmtD(m.date) + " à " + m.time + " (" + m.dist + " km).",
        t: "à l'instant",
        read: false,
        link: "marketplace"
      });
    }, 500);
    go("marketplace");
  }

  function openTournamentModal(id) {
    const t = D.TOURNAMENTS.find((x) => x.id === id);
    if (!t) return;
    const c = club(t.orgId);
    TTM.modal({
      title: "Inscrire une équipe",
      subtitle: t.name + " · " + fmtDL(t.date),
      body: `<form class="stack stack-4" data-form="join" data-id="${t.id}">
        <div class="row-2" style="gap:12px;padding:12px;border-radius:var(--r-md);background:var(--ttm-warning-soft)">
          ${TTM.clubLogo(c, "club-logo-sm")}
          <div class="flex-1" style="min-width:0">
            <b class="t-body-sm">${E(t.name)}</b>
            <div class="t-micro t-secondary">${E(t.venue)}, ${E(t.city)} · ${t.dist} km · ${E(t.age)}</div>
          </div>
          ${TTM.catBadge(t.cat)}
        </div>
        <div class="grid-2">
          <div class="field">
            <label class="field-label" for="joinTeam">Équipe <span class="req">*</span></label>
            <select class="select" id="joinTeam" name="joinTeam" required>
              ${D.TEAMS.filter((x) => x.cat === t.cat).map((x) => `<option value="${x.id}">${E(x.name)} · ${E(x.level)}</option>`).join("") ||
                D.TEAMS.map((x) => `<option value="${x.id}">${E(x.name)} · ${E(x.cat)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label class="field-label" for="joinCoach">Coach référent</label>
            <select class="select" id="joinCoach" name="joinCoach">
              ${D.COACHES.filter((c2) => c2.cat === t.cat).map((c2) => `<option>${E(c2.name)}</option>`).join("") || '<option>—</option>'}
            </select>
          </div>
        </div>
        <div class="grid-3" style="gap:10px">
          ${badge("badge-brand", "users", t.teams + " / " + t.maxTeams + " équipes")}
          ${badge(t.fee ? "badge-danger" : "badge-success", t.fee ? "wallet" : "check", t.fee ? "Frais d'inscription" : "Gratuit")}
          ${badge("badge-warning", "award", t.prize)}
        </div>
        <label class="check"><input type="checkbox" checked><span class="check-box">${TTM.icon("check", 13)}</span><span class="t-caption">Je confirme la présence de l'encadrement et les licenses à jour.</span></label>
      </form>`,
      footer: `<button class="btn btn-outline" data-x>Annuler</button>
        <button class="btn btn-primary" data-local="join" data-id="${t.id}" ${t.slots <= 0 ? "disabled" : ""}>${TTM.icon("check", 16)}Confirmer l'inscription</button>`,
      onMount: function (el) {
        const b = el.querySelector('[data-local="join"]');
        if (b) b.onclick = () => submitJoin(el.querySelector("form"));
      }
    });
  }

  function submitJoin(f) {
    const t = D.TOURNAMENTS.find((x) => x.id === f.dataset.id);
    const team = D.team(f.querySelector("#joinTeam").value);
    t.teams = Math.min(t.maxTeams, t.teams + 1);
    t.slots = Math.max(0, t.slots - 1);
    TTM.closeAll();
    TTM.toast("Inscription confirmée", team.name + " est inscrite à " + t.name + " — liste des participants mise à jour.", "success", { duration: 5200 });
    TTM.pushNotification(TTM.smartNotify("tournament", { cat: t.cat, name: t.name, date: fmtD(t.date), slots: t.slots, link: "tournaments" }));
    render();
  }

  function openTeamPrefsModal(teamId) {
    const t = D.team(teamId);
    const p = D.PREFS[teamId];
    if (!t || !p) return;
    const DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    TTM.modal({
      title: "Préférences · " + t.name,
      subtitle: "Ces critères alimentent le score de compatibilité et les notifications",
      body: `<form class="stack stack-5" data-form="prefs" data-team="${teamId}">
        <div class="field">
          <div class="row-between"><span class="field-label">Rayon de recherche</span><span class="slider-val" id="prefDist">${p.maxDist} km</span></div>
          <input class="slider" type="range" min="5" max="120" step="5" name="maxDist" value="${p.maxDist}" data-range="dist" aria-label="Rayon de recherche">
        </div>
        <div class="field">
          <span class="field-label">Jours recherchés</span>
          <div class="row-2 wrap" style="gap:6px">
            ${DAYS.map((d) => `<label class="chip chip-sm ${p.days.indexOf(d) > -1 ? "is-active" : ""}"><input type="checkbox" name="day" value="${d}" ${p.days.indexOf(d) > -1 ? "checked" : ""} style="position:absolute;opacity:0;width:0;height:0"><span style="color:inherit">${E(cap(d))}</span></label>`).join("")}
          </div>
        </div>
        <div class="grid-2">
          <div class="field"><label class="field-label" for="from">Créneau de début</label><input class="input" type="time" id="from" name="timeFrom" value="${p.timeFrom}"></div>
          <div class="field"><label class="field-label" for="to">Créneau de fin</label><input class="input" type="time" id="to" name="timeTo" value="${p.timeTo}"></div>
        </div>
        <div class="field">
          <span class="field-label">Niveaux acceptés</span>
          <div class="row-2 wrap" style="gap:6px">
            ${[1, 2, 3].map((l) => `<label class="chip chip-sm ${p.levels.indexOf(l) > -1 ? "is-active" : ""}"><input type="checkbox" name="level" value="${l}" ${p.levels.indexOf(l) > -1 ? "checked" : ""} style="position:absolute;opacity:0;width:0;height:0"><span style="color:inherit">${E(TTM.levelLabel[l])}</span></label>`).join("")}
          </div>
        </div>
        <div class="field">
          <span class="field-label">Formats de jeu</span>
          <div class="row-2 wrap" style="gap:6px">
            ${["7v7", "9v9", "11v11"].map((f) => `<label class="chip chip-sm ${p.formats.indexOf(f) > -1 ? "is-active" : ""}"><input type="checkbox" name="format" value="${f}" ${p.formats.indexOf(f) > -1 ? "checked" : ""} style="position:absolute;opacity:0;width:0;height:0"><span style="color:inherit">${E(f)}</span></label>`).join("")}
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" name="notify" ${p.notify ? "checked" : ""}>
          <span class="switch-track"><span class="switch-thumb"></span></span>
          <span class="t-caption">Recevoir les notifications de nouveaux matchs</span>
        </label>
        <div class="alert alert-info"><span class="alert-ico">${TTM.icon("info", 16)}</span><div>Enregistrez pour recalculer immédiatement les recommandations de ${E(t.name)}.</div></div>
      </form>`,
      footer: `<button class="btn btn-outline" data-x>Annuler</button><button class="btn btn-primary" data-local="prefs">${TTM.icon("check", 16)}Enregistrer</button>`,
      onMount: function (el) {
        el.querySelectorAll('.chip input[type="checkbox"]').forEach((i) =>
          i.addEventListener("change", () => i.closest(".chip").classList.toggle("is-active", i.checked))
        );
        el.querySelector('[data-local="prefs"]').onclick = () => saveTeamPrefs(el.querySelector("form"));
      }
    });
  }

  function saveTeamPrefs(f) {
    const teamId = f.dataset.team;
    const p = D.PREFS[teamId];
    const val = (n) => Array.prototype.slice.call(f.querySelectorAll('[name="' + n + '"]:checked')).map((i) => i.value);
    p.maxDist = +f.querySelector('[name="maxDist"]').value;
    p.days = val("day");
    p.timeFrom = f.querySelector('[name="timeFrom"]').value;
    p.timeTo = f.querySelector('[name="timeTo"]').value;
    p.levels = val("level").map(Number);
    p.formats = val("format");
    p.notify = f.querySelector('[name="notify"]').checked;
    TTM.closeAll();
    TTM.toast("Préférences enregistrées", "Les recommandations de " + (D.team(teamId) || {}).name + " ont été recalculées.", "success");
    render();
  }

  const ROSTER = [
    "Lucas Martin", "Hugo Bernard", "Théo Petit", "Nathan Leroy", "Inès Moreau",
    "Chloé Dubois", "Lucas Rousseau", "Enzo Garnier", "Jules Mercier", "Adam Lefèvre",
    "Rayan Belkacem", "Yanis Cherif", "Noé Fontaine", "Mathis Barbier", "Sami Kaddour"
  ];

  function openConvoqueModal(teamId) {
    const t = D.team(teamId) || D.TEAMS[0];
    const m = D.MY_MATCHES.filter((x) => x.teamId === t.id && x.status !== "played").sort(byDate)[0];
    TTM.modal({
      title: "Convocations · " + t.name,
      subtitle: m ? "Prochain match : " + m.cat + " vs " + m.opp + " · " + fmtDL(m.date) + " à " + m.time : "Aucun match à venir",
      body: `<div class="stack stack-4">
        <div class="field">
          <span class="field-label">Joueurs convoqués (${ROSTER.length} disponibles)</span>
          <div class="stack stack-1" style="max-height:280px;overflow-y:auto;padding-right:6px">
            ${ROSTER.map((n, i) => `<label class="check" style="padding:6px 2px">
              <input type="checkbox" ${i < 9 ? "checked" : ""}>
              <span class="check-box">${TTM.icon("check", 13)}</span>
              <span class="flex-1">${TTM.avatar(n, "avatar-xs", i)}</span>
              <span class="t-caption">${E(n)}</span>
              <span class="t-micro t-muted">${i < 9 ? "Confirmé" : "En attente"}</span>
            </label>`).join("")}
          </div>
        </div>
        <div class="alert alert-neutral">
          <span class="alert-ico">${TTM.icon("send", 16)}</span>
          <div>Les convocations sont envoyées par SMS et e-mail aux parents, avec la localisation du stade et l'heure de rendez-vous.</div>
        </div>
      </div>`,
      footer: `<button class="btn btn-outline" data-x>Annuler</button>
        <button class="btn btn-primary" data-local="convoq" data-id="${t.id}">${TTM.icon("clipboardCheck", 16)}Envoyer les convocations</button>`,
      onMount: function (el) {
        el.querySelector('[data-local="convoq"]').onclick = () => {
          const n = el.querySelectorAll('.check input:checked').length;
          TTM.closeAll();
          TTM.toast("Convocations envoyées", n + " joueurs de " + t.name + " ont été convoqués" + (m ? " pour le match du " + fmtD(m.date) + "." : "."), "success", { duration: 5200 });
          TTM.pushNotification(TTM.smartNotify("convocation", { n: n, cat: t.cat, opp: m ? m.opp : "—", day: m ? TTM.date.dayMin(m.date) : "", time: m ? m.time : "", link: "calendar" }));
        };
      }
    });
  }

  function openCoachModal(id) {
    const c = D.coach(id);
    if (!c) return;
    const t = D.team(c.teamId);
    TTM.modal({
      title: c.name,
      subtitle: c.role + (t ? " · " + t.name : "") + " · club AS Courbevoie",
      body: `<div class="stack stack-4">
        <div class="row-2" style="gap:14px">${TTM.avatar(c.name, "avatar-xl", D.COACHES.indexOf(c))}
          <div class="stack" style="gap:6px;min-width:0">
            <div class="row-2 wrap" style="gap:6px">${c.cat ? TTM.catBadge(c.cat) : ""}${badge("badge-brand", "calendar", "Depuis " + c.since)}</div>
            <div class="t-caption t-secondary">${E(c.phone)}</div>
            <div class="t-caption t-secondary">${E(c.mail)}</div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="field">
          <span class="field-label">Droits accordés</span>
          <div class="row-2 wrap" style="gap:6px">
            ${c.perms.map((p) => badge("badge-info", "check", (PERMS.find((x) => x.key === p) || { label: p }).label)).join("")}
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="coachMsg">Message rapide</label>
          <textarea class="textarea" id="coachMsg" rows="3" placeholder="Écrire à ${E(c.name.split(" ")[0])}…"></textarea>
        </div>
      </div>`,
      footer: `<button class="btn btn-outline" data-x>Fermer</button>
        <button class="btn btn-outline" data-act="coach-call" data-id="${c.id}">${TTM.icon("phone", 16)}Appeler</button>
        <button class="btn btn-primary" data-local="coach" data-id="${c.id}">${TTM.icon("send", 16)}Envoyer</button>`,
      onMount: function (el) {
        el.querySelector('[data-local="coach"]').onclick = () => {
          const v = el.querySelector("#coachMsg").value.trim();
          if (!v) {
            TTM.toast("Message vide", "Écrivez un message avant de l'envoyer.", "warning");
            return;
          }
          TTM.closeAll();
          TTM.toast("Message envoyé", c.name + " a reçu votre message dans la messagerie du club.", "success");
        };
      }
    });
  }

  function openClubModal(id) {
    const c = club(id);
    const x = D.CLUB_EXTRA[id] || {};
    const stad = D.STADIUMS.find((s) => s.clubId === id);
    const open = D.AVAILABLE.filter((m) => m.clubId === id);
    const tours = D.TOURNAMENTS.filter((t) => t.orgId === id);
    TTM.modal({
      size: "wide",
      title: c.name,
      subtitle: c.city + " · " + c.dept + " · fondé en " + c.since,
      body: `<div class="grid-2" style="gap:var(--s-5)">
        <div class="stack stack-4">
          <div class="row-2" style="gap:14px">${TTM.clubLogo(c, "club-logo-xl")}
            <div class="stack" style="gap:6px">
              <div class="row-2 wrap" style="gap:6px">${x.verified ? badge("badge-info", "shieldCheck", "Club vérifié") : badge("", "alertCircle", "Vérification en cours")}<span class="rating">${TTM.icon("star", 13)}${E(String(x.rating || "—"))}</span></div>
              <span class="t-micro t-muted">Président : ${E(c.president)}</span>
            </div>
          </div>
          <p class="t-caption t-secondary" style="line-height:1.6">${E(c.desc)}</p>
          <div class="grid-3" style="gap:8px">
            <div class="team-stat"><b>${x.matches || 0}</b><span>matchs publiés</span></div>
            <div class="team-stat"><b>${x.teams || 0}</b><span>équipes</span></div>
            <div class="team-stat"><b>${(x.members || 0).toLocaleString("fr-FR")}</b><span>licenciés</span></div>
          </div>
        </div>
        <div class="stack stack-4">
          <div class="card card-flat card-pad-sm stack stack-2">
            <b class="t-body-sm">${TTM.icon("whistle", 15)} Stade</b>
            <div class="t-caption">${E(stad ? stad.name : c.stadium)}</div>
            <div class="t-micro t-muted">${E(stad ? stad.surface : "—")} · ${E(stad ? stad.size : "—")} · ${c.seats} places</div>
          </div>
          <div class="card card-flat card-pad-sm stack stack-2">
            <b class="t-body-sm">${TTM.icon("target", 15)} Activité récente</b>
            <div class="row-between"><span class="t-caption t-secondary">Matchs disponibles</span><b>${open.length}</b></div>
            <div class="row-between"><span class="t-caption t-secondary">Tournois organisés</span><b>${tours.length}</b></div>
            <div class="row-between"><span class="t-caption t-secondary">Distance depuis ${E(home().city)}</span><b>${id === st().clubId ? "—" : distHome(c) + " km"}</b></div>
            <div class="row-between"><span class="t-caption t-secondary">Progression</span><b style="color:var(--ttm-success)">${E(x.trend || "—")}</b></div>
          </div>
        </div>
      </div>`,
      footer: `<button class="btn btn-outline" data-x>Fermer</button>
        <button class="btn btn-outline" data-go="clubs">${TTM.icon("globe", 16)}Annuaire</button>
        <button class="btn btn-primary" data-act="club-matches" data-id="${id}">${TTM.icon("target", 16)}Voir les ${open.length} matchs</button>`,
      onMount: null
    });
  }

  function openNewClubModal() {
    TTM.modal({
      title: "Créer un nouveau club",
      subtitle: "Enrôlez un second club dans votre compte président",
      body: `<form class="stack stack-4" data-form="newclub">
        <div class="grid-2">
          <div class="field"><label class="field-label" for="ncName">Nom du club <span class="req">*</span></label><input class="input" id="ncName" name="ncName" placeholder="FC Courbevoie" required></div>
          <div class="field"><label class="field-label" for="ncCity">Ville <span class="req">*</span></label><input class="input" id="ncCity" name="ncCity" placeholder="Courbevoie" required></div>
          <div class="field"><label class="field-label" for="ncDept">Département</label><input class="input" id="ncDept" name="ncDept" placeholder="Hauts-de-Seine (92)"></div>
          <div class="field"><label class="field-label" for="ncPres">Président</label><input class="input" id="ncPres" name="ncPres" value="Karim Benali"></div>
        </div>
        <div class="field"><label class="field-label" for="ncMail">E-mail de contact <span class="req">*</span></label><input class="input" type="email" id="ncMail" name="ncMail" placeholder="contact@club.fr" required></div>
        <div class="alert alert-info"><span class="alert-ico">${TTM.icon("info", 16)}</span><div>Vous pourrez basculer entre vos clubs depuis le sélecteur en haut de la barre latérale.</div></div>
      </form>`,
      footer: `<button class="btn btn-outline" data-x>Annuler</button><button class="btn btn-primary" data-local="newclub">${TTM.icon("plus", 16)}Créer le club</button>`,
      onMount: function (el) {
        el.querySelector('[data-local="newclub"]').onclick = () => submitNewClub(el.querySelector("form"));
      }
    });
  }

  function submitNewClub(f) {
    const name = f.querySelector("#ncName").value.trim() || "Nouveau club";
    TTM.closeAll();
    TTM.toast("Club créé", name + " a été ajouté à votre compte. Basculez de club via le sélecteur latéral.", "success", { duration: 5200 });
  }

  function openEditClubModal() {
    const h = home();
    TTM.modal({
      title: "Identité du club",
      subtitle: "Couleurs et sigle utilisés dans le réseau",
      body: `<form class="stack stack-4" data-form="profile">
        <div class="row-2" style="gap:14px">${TTM.clubLogo(h, "club-logo-xl")}<div><b class="t-h4">${E(h.name)}</b><div class="t-caption t-secondary">${E(h.city)}</div></div></div>
        <div class="field"><label class="field-label" for="short">Sigle (3 lettres)</label><input class="input" id="short" name="short" value="${E(h.short)}" maxlength="4"></div>
        <div class="grid-2">
          <div class="field"><label class="field-label" for="c1">Couleur principale</label><input class="input" type="color" id="c1" name="c1" value="${E(h.colors[0])}" style="height:46px;padding:4px"></div>
          <div class="field"><label class="field-label" for="c2">Couleur secondaire</label><input class="input" type="color" id="c2" name="c2" value="${E(h.colors[1])}" style="height:46px;padding:4px"></div>
        </div>
      </form>`,
      footer: `<button class="btn btn-outline" data-x>Annuler</button><button class="btn btn-primary" data-local="brand" data-id="${h.id}">${TTM.icon("check", 16)}Appliquer</button>`,
      onMount: function (el) {
        el.querySelector('[data-local="brand"]').onclick = () => {
          const c = home();
          c.short = el.querySelector("#short").value.toUpperCase() || c.short;
          c.colors = [el.querySelector("#c1").value, el.querySelector("#c2").value];
          TTM.closeAll();
          TTM.toast("Identité mise à jour", "Le nouveau sigle et les couleurs sont appliqués dans tout le prototype.", "success");
          render();
        };
      }
    });
  }

  function openPlansModal() {
    const plans = [
      { n: "Essentiel", t: "Pour un club qui cherche ses matchs", f: ["Jusqu'à 2 équipes", "Demandes illimitées", "Calendrier partagé", "Notifications e-mail"], tag: "", cta: "Choisir" },
      { n: "Pro Club", t: "Pour les clubs structurés", f: ["Équipes illimitées", "Moteur de correspondance prioritaire", "Tableau de bord et statistiques", "Comptes coachs et adjoints", "Module Parents (lecture)", "Support prioritaire"], tag: "RECOMMANDÉ", cta: "Activer", best: true },
      { n: "Réseau", t: "Pour les structures multi-clubs", f: ["Multi-clubs et licences", "Marque blanche et API", "Tableau de bord inter-clubs", "Arbitrage et tournois", "Accompagnement dédié"], tag: "", cta: "Parler à l'équipe" }
    ];
    TTM.modal({
      size: "wide",
      title: "Offres TTM",
      subtitle: "Tarifs sur devis · engagement annuel · accompagnement à l'onboarding",
      body: `<div class="grid-3" style="gap:var(--s-4)">
        ${plans.map((p) => `<div class="card card-pad plan ${p.best ? "card-brand" : ""}">
          ${p.tag ? '<span class="plan-off">' + E(p.tag) + "</span>" : ""}
          <div>
            <b class="t-h4">${E(p.n)}</b>
            <div class="t-caption t-secondary" style="margin-top:4px">${E(p.t)}</div>
          </div>
          <div class="stat-strip"><b>Sur devis</b><span class="t-micro t-muted">selon le nombre d'équipes</span></div>
          <div class="divider"></div>
          <div class="plan-feats">
            ${p.f.map((x) => '<div class="plan-feat">' + TTM.icon("check", 15) + "<span>" + E(x) + "</span></div>").join("")}
          </div>
          <button class="btn ${p.best ? "btn-primary" : "btn-outline"} btn-block" data-local="plan" data-v="${E(p.n)}">${E(p.cta)}</button>
        </div>`).join("")}
      </div>
      <p class="t-micro t-muted" style="margin-top:16px">Aucun prix n'est affiché dans cette démonstration : les offres sont chiffrées sur devis selon le nombre d'équipes, de coachs et de tournois organisés.</p>`,
      footer: `<button class="btn btn-outline" data-x>Fermer</button>`,
      onMount: function (el) {
        el.querySelectorAll('[data-local="plan"]').forEach((b) => (b.onclick = () => {
          TTM.closeAll();
          TTM.toast("Demande enregistrée", "Votre demande pour l'offre " + b.dataset.v + " a été transmise. Un conseiller vous recontacte.", "success");
        }));
      }
    });
  }

  function openParentsModal() {
    const m = D.MY_MATCHES.filter((x) => x.status !== "played").sort(byDate)[0];
    const t = D.team(m ? m.teamId : "u15a");
    TTM.modal({
      size: "wide",
      title: "Aperçu du module Parents",
      subtitle: "Vue simplifiée destinée aux familles (lecture seule)",
      body: `<div class="row" style="justify-content:center;gap:var(--s-5);align-items:flex-start">
        <div class="card card-flat" style="width:300px;max-width:100%">
          <div class="card-body stack stack-4">
            <div class="row-2" style="justify-content:space-between">
              ${TTM.wordmark()}
              <span class="badge badge-brand">${TTM.icon("eye", 12)}Parent</span>
            </div>
            <div class="row-2" style="gap:12px">
              ${TTM.avatar("Yacine Belkacem", "avatar-lg", 1)}
              <div><b class="t-body-sm">Yacine Belkacem</b><div class="t-micro t-muted">${TTM.catBadge(t.cat)} ${E(t.name)} · U15 A</div></div>
            </div>
            ${m ? `<div class="card card-brand card-pad-sm stack stack-2">
              <div class="t-micro t-brand" style="letter-spacing:.12em">PROCHAIN MATCH</div>
              <b class="t-body-sm">${E(t.name)} vs ${E(m.opp)}</b>
              <div class="t-caption">${E(TTM.date.day(m.date))} ${E(fmtD(m.date))} · ${E(m.time)}</div>
              <div class="t-micro t-muted">${E(m.venue)}, ${E(m.city)}</div>
            </div>` : ""}
            <div class="stack stack-2">
              <div class="row-between"><span class="t-caption t-secondary">Convocation</span>${badge("badge-success", "check", "Reçue")}</div>
              <div class="row-between"><span class="t-caption t-secondary">Licences</span>${badge("badge-success", "check", "À jour")}</div>
              <div class="row-between"><span class="t-caption t-secondary">Transport</span>${badge("badge-warning", "clock", "À confirmer")}</div>
            </div>
            <div class="row-2">
              <button class="btn btn-primary btn-sm btn-block">${TTM.icon("check", 16)}Confirmer la présence</button>
            </div>
            <div class="row-2">
              <button class="btn btn-outline btn-sm btn-block">${TTM.icon("mapPin", 16)}Itinéraire</button>
            </div>
          </div>
        </div>
        <div class="stack stack-3" style="flex:1;min-width:240px">
          <b class="t-body-sm">Ce que verra un parent</b>
          <div class="stack stack-2">
            ${[["check", "Calendrier de l'équipe, sans les autres clubs"],
               ["check", "Convocations et confirmations de présence"],
               ["clipboardCheck", "Documents de licence (lecture seule)"],
               ["mapPin", "Localisation du stade et heure de rendez-vous"],
               ["bell", "Notifications de changement d'horaire"]]
              .map((r) => '<div class="row-2 t-caption t-secondary" style="align-items:flex-start">' + TTM.icon(r[0], 15) + "<span>" + E(r[1]) + "</span></div>").join("")}
          </div>
          <div class="alert alert-neutral"><span class="alert-ico">${TTM.icon("lock", 16)}</span><div>Le parent n'accède jamais aux autres conversations, aux coordonnées des coachs ni aux données des autres joueurs.</div></div>
        </div>
      </div>`,
      footer: `<button class="btn btn-outline" data-x>Fermer</button><button class="btn btn-primary" data-go="mobile">${TTM.icon("smartphone", 16)}Voir la version mobile</button>`,
      onMount: null
    });
  }

  function openRequestDetail(id) {
    const s = st();
    const r = s.requests.find((x) => x.id === id);
    if (!r) return;
    const incoming = r.to === s.clubId;
    const other = club(incoming ? r.from : r.to);
    const m = D.match(r.matchId);
    const t = D.team(r.teamId);
    const stepIdx = r.status === "pending" ? 2 : r.status === "accepted" ? 3 : 1;
    TTM.modal({
      title: "Demande " + r.cat,
      subtitle: (incoming ? "Reçue de " : "Envoyée à ") + other.name,
      body: `<div class="stack stack-4">
        <div class="row-2" style="gap:12px;padding:12px;border-radius:var(--r-md);background:var(--ttm-surface-2)">
          ${TTM.clubLogo(other, "club-logo-sm")}
          <div class="flex-1" style="min-width:0">
            <b class="t-body-sm">${E(other.name)}</b>
            <div class="t-micro t-secondary">${E(t ? t.name : r.cat)} · ${E(fmtDL(r.date))}${m ? " à " + E(m.time) : ""}</div>
          </div>
          ${statusBadge(r.status)}
        </div>
        ${m ? '<div class="row-2 wrap" style="gap:8px">' + TTM.catBadge(m.cat) + badge("badge-brand", "", typeOf(m)) + badge("", "mapPin", m.city + " · " + m.dist + " km") + badge("", "whistle", m.format) + "</div>" : ""}
        <div class="card card-flat card-pad-sm">
          <div class="t-micro t-muted" style="letter-spacing:.12em">MESSAGE DU CLUB</div>
          <p class="t-body-sm" style="margin-top:6px;line-height:1.6">${E(r.msg || "Aucun message joint à la demande.")}</p>
        </div>
        <div>
          <div class="t-micro t-muted" style="letter-spacing:.12em;margin-bottom:10px">SUIVI DU WORKFLOW</div>
          ${TTM.workflowHTML(stepIdx)}
        </div>
      </div>`,
      footer: `<button class="btn btn-outline" data-x>Fermer</button>
        ${incoming && r.status === "pending"
          ? '<button class="btn btn-outline" data-act="req-decline" data-id="' + r.id + '">Refuser</button><button class="btn btn-primary" data-act="req-accept" data-id="' + r.id + '">Accepter le match</button>'
          : r.status === "pending"
            ? '<button class="btn btn-primary" data-act="req-remind" data-id="' + r.id + '">Relancer le club</button>'
            : '<button class="btn btn-outline" data-go="calendar">Voir le calendrier</button>'}`,
      onMount: null
    });
  }

  function openResultModal(id) {
    const m = D.MY_MATCHES.find((x) => x.id === id);
    if (!m) return;
    TTM.modal({
      title: "Saisir le résultat",
      subtitle: m.cat + " vs " + m.opp + " · " + fmtDL(m.date),
      body: `<div class="stack stack-4">
        <div class="row-2" style="justify-content:center;gap:var(--s-5)">
          <div class="stack" style="align-items:center;gap:6px">${TTM.clubLogo(home(), "club-logo-lg")}<b class="t-caption">AS Courbevoie</b></div>
          <span class="t-h2 t-muted">–</span>
          <div class="stack" style="align-items:center;gap:6px">${TTM.clubLogo(club(m.oppId), "club-logo-lg")}<b class="t-caption">${E(m.opp)}</b></div>
        </div>
        <div class="row-2" style="justify-content:center">
          <input class="input" type="number" id="rUs" min="0" max="30" value="2" style="width:96px;text-align:center;font-size:1.4rem;font-weight:800" aria-label="Nos buts">
          <span class="t-h2 t-muted">–</span>
          <input class="input" type="number" id="rThem" min="0" max="30" value="1" style="width:96px;text-align:center;font-size:1.4rem;font-weight:800" aria-label="Buts adverse">
        </div>
        <div class="field"><label class="field-label" for="rNote">Commentaire (optionnel)</label><input class="input" id="rNote" placeholder="Match serré, bon état d'esprit…"></div>
      </div>`,
      footer: `<button class="btn btn-outline" data-x>Annuler</button><button class="btn btn-primary" data-local="result" data-id="${m.id}">${TTM.icon("check", 16)}Enregistrer</button>`,
      onMount: function (el) {
        el.querySelector('[data-local="result"]').onclick = () => {
          const us = +el.querySelector("#rUs").value || 0;
          const them = +el.querySelector("#rThem").value || 0;
          m.result = us + "-" + them;
          m.status = "played";
          TTM.closeAll();
          TTM.toast("Résultat enregistré", m.cat + " vs " + m.opp + " : " + m.result + ". Les statistiques du club sont actualisées.", "success");
          render();
        };
      }
    });
  }

  /* @@NEXT@@ */
})();
