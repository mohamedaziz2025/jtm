/* TTM — Prototype mobile (14 écrans) */
(function () {
  "use strict";

  const TTM = window.TTM;
  const D = window.TTM_DATA;
  const E = TTM.esc;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [].slice.call((r || document).querySelectorAll(s));
  const st = () => TTM.store.get();

  const SCREENS = [
    { id: "login", n: "Connexion", tab: null, cap: "Numéro de téléphone puis code à 6 chiffres (SMS simulé)." },
    { id: "otp", n: "Code OTP", tab: null, cap: "Saisie du code, compte à rebours et renvoi." },
    { id: "role", n: "Profil", tab: null, cap: "Choix du rôle : président de club, coach ou parent." },
    { id: "join", n: "Rattachement", tab: null, cap: "Sélection du club puis de l'équipe (7 équipes à Courbevoie)." },
    { id: "prefs", n: "Préférences", tab: null, cap: "Rayon, jours, créneaux, formats et permissions push." },
    { id: "home", n: "Accueil", tab: "home", cap: "Prochain match, recommandations, actions rapides." },
    { id: "market", n: "Marché", tab: "market", cap: "26 matchs disponibles, recherche et filtres par chips." },
    { id: "match", n: "Fiche match", tab: null, cap: "Score de compatibilité détaillé sur 7 critères pondérés." },
    { id: "request", n: "Demande", tab: null, cap: "Formulaire de demande avec message au club." },
    { id: "sent", n: "Suivi", tab: null, cap: "Workflow en 4 étapes : envoi, notification, réponse, confirmation." },
    { id: "alerts", n: "Alertes", tab: "alerts", cap: "Notifications push du club et des parents." },
    { id: "chat", n: "Messagerie", tab: null, cap: "Conversation avec le club organisateur." },
    { id: "calendar", n: "Agenda", tab: "calendar", cap: "Agenda des matchs confirmés et demandes en cours." },
    { id: "profile", n: "Profil", tab: "profile", cap: "Compte, club, équipe, module Parents et réglages." }
  ];

  const TABS = [
    { id: "home", ico: "home", label: "Accueil" },
    { id: "market", ico: "target", label: "Marché" },
    { id: "calendar", ico: "calendar", label: "Agenda" },
    { id: "alerts", ico: "bell", label: "Alertes" },
    { id: "profile", ico: "user", label: "Profil" }
  ];

  const state = { screen: "login", params: {}, stack: [], filters: { q: "", cat: "" }, chat: null };

  const club = (id) => D.club(id);
  const home = () => club(st().clubId);
  const refTeam = () => (st().activeTeam === "all" ? "u15a" : st().activeTeam);
  const fmtD = (iso) => TTM.date.fmt(iso);
  const catOf = (c) => TTM.catBadge(c);

  /* ---------- chrome ---------- */

  function appbar(title, sub, opts) {
    const o = opts || {};
    return (
      '<div class="m-appbar">' +
      (o.back ? '<button class="m-back" data-m="back" aria-label="Retour">' + TTM.icon("chevronLeft", 18) + "</button>" : "") +
      '<div><div class="m-appbar-title">' + E(title) + "</div>" + (sub ? '<div class="m-appbar-sub">' + E(sub) + "</div>" : "") + "</div>" +
      (o.avatar === false ? "" : '<button class="m-avatar-btn" data-m="profile">' + TTM.avatar(st().user.name, "avatar-sm", 0) + "</button>") +
      "</div>"
    );
  }

  function paintTabs() {
    const cur = (SCREENS.find((s) => s.id === state.screen) || {}).tab;
    $("#mTabbar").innerHTML = TABS.map((t) => {
      const unread = t.id === "alerts" ? st().notifications.filter((n) => !n.read).length : 0;
      return '<button class="m-tab ' + (cur === t.id ? "is-active" : "") + '" data-m="tab" data-v="' + t.id + '">' +
        TTM.icon(t.ico, 20) + "<span>" + t.label + "</span>" +
        (unread ? '<span class="m-tab-dot">' + unread + "</span>" : "") + "</button>";
    }).join("");
  }

  function paintList() {
    $("#screenList").innerHTML = SCREENS.map((s, i) =>
      '<li><button class="m-side-item ' + (state.screen === s.id ? "is-active" : "") + '" data-m="go" data-v="' + s.id + '">' +
      '<span class="m-side-num">' + (i + 1) + "</span>" + E(s.n) + "</button></li>").join("");
    const s = SCREENS.find((x) => x.id === state.screen);
    $("#screenCaption").textContent = (s ? s.n + " — " + s.cap : "");
  }

  function go(id, params, keepStack) {
    if (!keepStack) state.stack.push({ id: state.screen, params: state.params });
    state.screen = id;
    state.params = params || {};
    render();
  }

  function back() {
    const p = state.stack.pop();
    state.screen = p ? p.id : "home";
    state.params = p ? p.params : {};
    render();
  }

  function render() {
    const fn = VIEWS[state.screen] || VIEWS.home;
    $("#mViewport").innerHTML = '<div class="m-screen">' + fn() + "</div>";
    $("#mViewport").scrollTop = 0;
    paintTabs();
    paintList();
    const idx = SCREENS.findIndex((s) => s.id === state.screen) + 1;
    document.title = "TTM Mobile — " + (SCREENS[idx - 1] ? SCREENS[idx - 1].n : "") + " (" + idx + "/14)";
  }

  /* ---------- écrans ---------- */

  const VIEWS = {};

  VIEWS.login = function () {
    return (
      '<div class="m-logo-hero">' +
      '<img src="../assets/logo/ttm-logo-dark.svg" alt="TTM" height="34">' +
      '<div class="t-center stack stack-1"><div class="t-h3">Trouve ton match.</div>' +
      '<div class="t-caption t-secondary">Le réseau intelligent des clubs de football.</div></div></div>' +
      '<div class="stack stack-4">' +
      '<div class="field"><label class="field-label" for="ph">Numéro de téléphone</label>' +
      '<input class="input input-lg" id="ph" type="tel" value="06 12 34 56 78" autocomplete="tel"></div>' +
      '<div class="row-2" style="gap:8px">' +
      '<button class="btn btn-outline btn-sm">Google</button>' +
      '<button class="btn btn-outline btn-sm">Apple</button></div>' +
      '<button class="btn btn-primary btn-lg btn-block" data-m="to" data-v="otp">' + TTM.icon("send", 16) + "Recevoir un code</button>" +
      '<p class="t-micro t-muted t-center">En continuant, vous acceptez les conditions d\'utilisation de la démo.</p>' +
      "</div>"
    );
  };

  VIEWS.otp = function () {
    return (
      appbar("Vérification", "Code envoyé au 06 12 34 56 78", { back: true }) +
      '<div class="field"><label class="field-label">Code de vérification à 6 chiffres</label>' +
      '<div class="m-otp">' + [0, 1, 2, 3, 4, 5].map(() => '<input inputmode="numeric" maxlength="1" value="7">').join("") + "</div></div>" +
      '<div class="alert alert-neutral">' + TTM.icon("info", 16) + "<div>Code de démonstration : 7 Accepté, vous Reese Dunn.</div></div>" +
      '<div class="m-cta-bar">' +
      '<button class="btn btn-primary btn-lg btn-block" data-m="to" data-v="role">Vérifier et continuer</button>' +
      '<button class="btn btn-ghost btn-block" data-m="toast" data-v="Un nouveau code a été envoyé par SMS.">Renvoyer le code (00:42)</button>' +
      "</div>"
    );
  };

  VIEWS.role = function () {
    const roles = [
      { id: "pres", ico: "shield", t: "Président de club", s: "Gérer les équipes, les matchs et le réseau du club" },
      { id: "coach", ico: "coach", t: "Coach", s: "Encadrer une équipe, publier et confirmer les présences" },
      { id: "parent", ico: "user", t: "Parent", s: "Suivre le calendrier, les convocations et les licences" }
    ];
    return (
      appbar("Votre profil", "Étape 1 sur 3", { back: true }) +
      '<div class="t-caption t-secondary">Sélectionnez le rôle qui correspond à votre utilisation. Il pourra être modifié plus tard.</div>' +
      '<div class="stack stack-2">' +
      roles.map((r, i) =>
        '<button class="m-choice ' + (i === 0 ? "is-active" : "") + '" data-m="to" data-v="join">' +
        '<span class="m-choice-ico">' + TTM.icon(r.ico, 20) + "</span>" +
        "<span><b class=\"t-body-sm\">" + E(r.t) + '</b><div class="t-micro t-secondary">' + E(r.s) + "</div></span></button>").join("") +
      "</div>" +
      '<div class="m-cta-bar"><button class="btn btn-primary btn-lg btn-block" data-m="to" data-v="join">Continuer</button></div>'
    );
  };

  VIEWS.join = function () {
    const s = st();
    return (
      appbar("Votre club", "Étape 2 sur 3", { back: true }) +
      '<div class="card card-brand card-pad stack stack-2">' +
      "<div class=\"row-2\" style=\"gap:12px\">" + TTM.clubLogo(home(), "club-logo-lg") +
      "<div><b class=\"t-body-sm\">" + E(home().name) + '</b><div class="t-micro t-brand-soft">' + E(home().city) + " · " + E(home().dept) + "</div></div></div>" +
      '<div class="t-caption t-brand-soft">8 membres du bureau, 7 équipes, 3 stades référencés.</div></div>' +
      '<div class="field"><label class="field-label">Équipe suivie</label><div class="stack stack-2">' +
      D.TEAMS.map((t) =>
        '<button class="m-choice ' + (s.activeTeam === t.id ? "is-active" : "") + '" data-m="team" data-v="' + t.id + '">' +
        catOf(t.cat) + '<span class="m-row-main"><b class="t-body-sm">' + E(t.name) + '</b><div class="t-micro t-secondary">' + E(t.level) + " · " + E(t.coach) + "</div></span>" +
        (s.activeTeam === t.id ? TTM.icon("checkCircle", 20) : TTM.icon("chevronRight", 18)) + "</button>").join("") +
      "</div></div>" +
      '<div class="m-cta-bar"><button class="btn btn-primary btn-lg btn-block" data-m="to" data-v="prefs">Continuer</button></div>'
    );
  };

  VIEWS.prefs = function () {
    const p = D.PREFS[refTeam()];
    const t = D.team(refTeam());
    const days = ["L", "M", "M", "J", "V", "S", "D"];
    return (
      appbar("Vos préférences", "Étape 3 sur 3 · " + (t ? t.name : ""), { back: true }) +
      '<div class="card card-flat card-pad stack stack-3">' +
      '<div class="row-between"><b class="t-body-sm">Rayon de recherche</b><span class="slider-val">' + p.maxDist + " km</span></div>" +
      '<input class="slider" type="range" min="5" max="120" step="5" value="' + p.maxDist + '">' +
      '<div class="row-between"><b class="t-body-sm">Créneaux</b><span class="t-micro t-secondary">' + p.timeFrom + " – " + p.timeTo + "</span></div>" +
      '<div class="row-2" style="gap:6px">' + days.map((d, i) =>
        '<button class="chip chip-sm ' + (p.days.indexOf(["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"][i]) > -1 ? "is-active" : "") + '" data-m="noop">' + d + "</button>").join("") + "</div>" +
      '<div class="row-between"><b class="t-body-sm">Formats</b><div class="row-2" style="gap:6px">' +
      p.formats.map((f) => '<span class="chip chip-sm is-active">' + E(f) + "</span>").join("") + "</div></div></div>" +
      '<div class="stack stack-2">' +
      '<label class="m-row"><span class="m-choice-ico">' + TTM.icon("bell", 18) + '</span><span class="m-row-main"><b class="t-body-sm">Notifications de matchs</b><div class="t-micro t-secondary">Push, e-mail et SMS</div></span>' +
      '<span class="switch"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></span></label>' +
      '<label class="m-row"><span class="m-choice-ico">' + TTM.icon("mapPin", 18) + '</span><span class="m-row-main"><b class="t-body-sm">Localisation</b><div class="t-micro t-secondary">Calcul des distances et stades proches</div></span>' +
      '<span class="switch"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></span></label>' +
      '<label class="m-row"><span class="m-choice-ico">' + TTM.icon("clipboardCheck", 18) + '</span><span class="m-row-main"><b class="t-body-sm">Calendrier personnel</b><div class="t-micro t-secondary">Synchronisation des matchs confirmés</div></span>' +
      '<span class="switch"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></span></label></div>' +
      '<div class="m-cta-bar"><button class="btn btn-primary btn-lg btn-block" data-m="to" data-v="home">' + TTM.icon("check", 16) + "Activer les préférences</button></div>"
    );
  };

  function recoCard(m) {
    const c = club(m.clubId);
    const s = TTM.scoreMatch(m, refTeam());
    const req = st().requests.find((r) => r.matchId === m.id);
    return (
      '<div class="m-match">' +
      '<div class="m-match-top">' + TTM.clubLogo(c, "club-logo-sm") +
      '<span class="m-row-main"><b class="t-body-sm">' + E(c.name) + '</b><div class="t-micro t-muted">' + E(c.city) + " · " + m.dist + " km</div></span>" +
      TTM.compatHTML(s.pct, "compat-ring-sm") + "</div>" +
      '<div class="m-match-facts">' +
      '<div class="m-fact">' + TTM.icon("calendar", 14) + E(TTM.date.dayMin(m.date)) + " " + E(fmtD(m.date)) + " · " + E(m.time) + "</div>" +
      '<div class="m-fact">' + TTM.icon("whistle", 14) + E(m.format) + " · " + E(m.pitch) + "</div>" +
      '<div class="m-fact">' + TTM.icon("tag", 14) + E(TTM.typeLabel[m.type] || m.type) + " · " + E(TTM.levelLabel[m.level]) + "</div></div>" +
      '<div class="m-match-foot">' + catOf(m.cat) +
      (req
        ? '<button class="btn btn-success btn-sm" disabled>' + TTM.icon("check", 14) + (req.status === "accepted" ? "Confirmé" : "Demandé") + "</button>"
        : '<button class="btn btn-primary btn-sm" data-m="match" data-v="' + m.id + '">Voir et demander</button>') +
      "</div></div>"
    );
  }

  VIEWS.home = function () {
    const s = st();
    const t = D.team(refTeam());
    const next = D.MY_MATCHES.filter((m) => m.status !== "played").sort((a, b) => a.date.localeCompare(b.date))[0];
    const reco = D.AVAILABLE.filter((m) => m.clubId !== s.clubId).slice(0, 6);
    const unread = s.notifications.filter((n) => !n.read).length;
    return (
      appbar("Bonjour " + s.user.name.split(" ")[0], (t ? t.name + " · " : "") + "Courbevoie") +
      (unread ? '<button class="alert alert-info" data-m="tab" data-v="alerts" style="text-align:left;width:100%"><span class="alert-ico">' + TTM.icon("bell", 16) + "</span><div><b>" + unread + " nouvelle" + (unread > 1 ? "s" : "") + " notification" + (unread > 1 ? "s" : "") + "</b><div class=\"t-micro\">3 matchs recommandés pour votre équipe</div></div></button>" : "") +
      (next
        ? '<div class="card card-brand card-pad stack stack-3"><div class="m-sect"><b class="t-body-sm t-brand-soft">Prochain match</b><span class="badge badge-solid-brand">' + E(TTM.date.dayMin(next.date)) + "</span></div>" +
          '<div class="row-2" style="gap:12px;align-items:center">' + TTM.clubLogo(home(), "club-logo-sm") +
          '<div class="flex-1"><b class="t-body">' + E(t ? t.name : "Équipe") + " vs " + E(next.opp) + '</b><div class="t-micro t-brand-soft">' + E(fmtD(next.date)) + " · " + E(next.time) + " · " + E(next.venue) + "</div></div>" +
          TTM.catBadge(next.cat) + "</div>" +
          '<div class="row-2" style="gap:8px"><button class="btn btn-primary btn-sm btn-block" data-m="calendar">Voir l\'agenda</button>' +
          '<button class="btn btn-soft btn-sm" data-m="toast" data-v="Convocation envoyée aux 9 joueurs convoqués.">' + TTM.icon("clipboardCheck", 14) + "Convoquer</button></div></div>"
        : "") +
      '<div class="m-hero"><div class="m-hero-kpi"><b class="t-num">' + D.AVAILABLE.length + "</b>" +
      '<div class="t-caption t-secondary">matchs disponibles<br>dans le réseau à 25 km</div></div>' +
      '<div class="row-2 wrap" style="gap:6px">' +
      ["U9", "U11", "U13", "U15", "U17", "U19"].map((c) => '<button class="chip chip-sm" data-m="tab" data-v="market">' + c + "</button>").join("") + "</div></div>" +
      '<div class="m-sect"><h3>Recommandé pour vous</h3><button class="btn btn-ghost btn-xs" data-m="tab" data-v="market">Tout voir</button></div>' +
      '<div class="m-carousel">' + reco.map(recoCard).join("") + "</div>" +
      '<div class="m-mini"><div><b>92%</b><span>compatibilité max.</span></div><div><b>4</b><span>demandes en cours</span></div><div><b>12</b><span>matchs joués</span></div></div>' +
      '<button class="btn btn-outline btn-block" data-m="tab" data-v="profile" style="margin-top:4px">' + TTM.icon("rocket", 16) + "Publier un match</button>"
    );
  };

  VIEWS.market = function () {
    const list = D.AVAILABLE.filter((m) => {
      if (state.filters.cat && m.cat !== state.filters.cat) return false;
      if (state.filters.q && (club(m.clubId).name + club(m.clubId).city + m.city).toLowerCase().indexOf(state.filters.q.toLowerCase()) < 0) return false;
      return true;
    });
    return (
      appbar("Marché des matchs", list.length + " résultats sur " + D.AVAILABLE.length) +
      '<div class="search-bar has-value"><span class="search-bar-ico">' + TTM.icon("search", 16) + '</span>' +
      '<input class="search-input" id="mSearch" placeholder="Club, ville, catégorie…" value="' + E(state.filters.q) + '">' +
      '<button class="s-clear">' + TTM.icon("x", 14) + "</button></div>" +
      '<div class="row-2 wrap" style="gap:6px">' +
      ["", "U9", "U11", "U13", "U15", "U17", "U19"].map((c) =>
        '<button class="chip chip-sm ' + (state.filters.cat === c ? "is-active" : "") + '" data-m="cat" data-v="' + c + '">' + (c || "Toutes") + "</button>").join("") +
      '<button class="chip chip-sm" data-m="toast" data-v="Filtres avancés : distance, surface, créneau.">' + TTM.icon("sliders", 13) + "Filtres</button></div>" +
      (list.length
        ? '<div class="m-list">' + list.slice(0, 12).map((m) => {
            const c = club(m.clubId);
            const s = TTM.scoreMatch(m, refTeam());
            return '<button class="m-row" data-m="match" data-v="' + m.id + '">' + TTM.clubLogo(c, "club-logo-sm") +
              '<span class="m-row-main"><b class="t-body-sm">' + E(c.name) + "</b>" +
              '<div class="t-row-s">' + TTM.icon("calendar", 12) + " " + E(TTM.date.dayMin(m.date)) + " " + E(fmtD(m.date)) + " · " + E(m.time) + "</div>" +
              '<div class="t-micro t-muted">' + E(m.cat) + " · " + E(m.format) + " · " + m.dist + " km</div></span>" +
              TTM.compatHTML(s.pct, "compat-ring-sm") + TTM.icon("chevronRight", 16) + "</button>";
          }).join("") + "</div>"
        : '<div class="empty">' + TTM.icon("search", 26) + '<div class="empty-title">Aucun match trouvé</div><div class="empty-text">Élargissez vos filtres ou changez de catégorie.</div></div>') +
      (list.length > 12 ? '<button class="btn btn-outline btn-block" data-m="toast" data-v="Chargement de ' + (list.length - 12) + ' autres matchs…">Charger plus</button>' : "")
    );
  };

  VIEWS.match = function () {
    const m = D.match(state.params.id) || D.AVAILABLE[0];
    const c = club(m.clubId);
    const s = TTM.scoreMatch(m, refTeam());
    const req = st().requests.find((r) => r.matchId === m.id);
    return (
      appbar(c.name, m.cat + " · " + m.dist + " km", { back: true, avatar: false }) +
      '<div class="card card-flat card-pad stack stack-3">' +
      '<div class="row-2" style="gap:12px;align-items:center">' + TTM.clubLogo(c, "club-logo-lg") +
      "<div class=\"flex-1\"><b class=\"t-body\">" + E(c.name) + '</b><div class="t-caption t-secondary">' + E(c.city) + " · " + E(c.dept) + "</div></div>" +
      TTM.compatHTML(s.pct, "compat-ring-lg") + "</div>" +
      '<div class="m-match-facts">' +
      '<div class="m-fact">' + TTM.icon("calendar", 14) + E(TTM.date.dayMin(m.date)) + " " + E(fmtD(m.date)) + " · " + E(m.time) + "</div>" +
      '<div class="m-fact">' + TTM.icon("whistle", 14) + E(m.venue) + " · " + E(m.pitch) + "</div>" +
      '<div class="m-fact">' + TTM.icon("target", 14) + E(TTM.typeLabel[m.type] || m.type) + " · " + E(TTM.levelLabel[m.level]) + " · " + E(m.format) + "</div></div>" +
      (m.note ? '<div class="alert alert-neutral">' + TTM.icon("info", 14) + "<div>" + E(m.note) + "</div></div>" : "") + "</div>" +
      '<div class="card card-flat card-pad stack stack-2"><b class="t-body-sm">Pourquoi ce match vous convient</b>' +
      s.criteria.map((k) =>
        '<div class="crit"><div class="crit-left">' +
        '<span class="crit-ico crit-' + k.state + '">' + TTM.icon(k.state === "ok" ? "check" : k.state === "warn" ? "alert" : "x", 12) + "</span>" +
        "<span><b>" + E(k.label) + '</b> <span class="t-muted">· ' + E(k.detail) + "</span></span></div>" +
        '<div class="crit-val">' + Math.round(k.raw) + '<span class="t-muted">/' + k.weight + "</span></div></div>").join("") + "</div>" +
      '<div class="m-cta-bar">' +
      (req
        ? '<button class="btn btn-success btn-lg btn-block" disabled>' + TTM.icon("check", 16) + (req.status === "accepted" ? "Match confirmé" : "Demande envoyée") + "</button>"
        : '<button class="btn btn-primary btn-lg btn-block" data-m="to" data-v="request" data-id="' + m.id + '">' + TTM.icon("send", 16) + "Demander ce match</button>") +
      '<button class="btn btn-ghost btn-block" data-m="chat" data-v="' + (st().threads[0] || {}).id + '">' + TTM.icon("message", 15) + "Poser une question au club</button>" +
      "</div>"
    );
  };

  VIEWS.request = function () {
    const m = D.match(state.params.id) || D.AVAILABLE[0];
    const c = club(m.clubId);
    return (
      appbar("Demander ce match", c.name, { back: true, avatar: false }) +
      '<div class="card card-flat card-pad-sm stack stack-2">' +
      '<div class="row-2" style="gap:10px">' + TTM.clubLogo(c, "club-logo-sm") +
      '<span class="m-row-main"><b class="t-body-sm">' + E(m.cat) + " · " + E(m.format) + "</b>" +
      '<div class="t-micro t-muted">' + E(fmtD(m.date)) + " · " + E(m.time) + "</div></span>" + TTM.catBadge(m.cat) + "</div></div>" +
      '<div class="field"><label class="field-label">Équipe</label><select class="select" id="rTeam">' +
      D.TEAMS.map((t) => '<option ' + (t.id === refTeam() ? "selected" : "") + ">" + E(t.name) + " · " + E(t.cat) + "</option>").join("") +
      "</select></div>" +
      '<div class="field"><label class="field-label">Message au club</label><textarea class="textarea" rows="4">Bonjour, nous sommes disponibles et providers ' +
      E(fmtD(m.date)) + " à " + E(m.time) + ". Licences à jour, 12 joueurs disponibles.</textarea></div>" +
      '<label class="check"><input type="checkbox" checked><span class="check-box">' + TTM.icon("check", 13) + '</span><span class="t-caption">Proposer une alternative de date</span></label>' +
      '<label class="check"><input type="checkbox" checked><span class="check-box">' + TTM.icon("check", 13) + '</span><span class="t-caption">Jeprovide l\'encadrement et les licences</span></label>' +
      '<div class="m-cta-bar"><button class="btn btn-primary btn-lg btn-block" data-m="send-req" data-id="' + m.id + '">' + TTM.icon("send", 16) + "Envoyer la demande</button>" +
      '<div class="t-micro t-muted t-center">Le club reçoit une notification push, e-mail et SMS.</div></div>'
    );
  };

  VIEWS.sent = function () {
    const c = state.params.club || "FC Montreuil";
    return (
      appbar("Demande envoyée", c, { back: true, avatar: false }) +
      '<div class="card card-brand card-pad stack stack-3">' +
      '<div class="row-2" style="gap:12px;align-items:center">' + TTM.compatHTML(90, "compat-ring-xl") +
      "<div><b class=\"t-body\">Demande transmise</b><div class=\"t-caption t-brand-soft\">" + E(c) + " reçoit votre demande et l\'examine sous 24 h.</div></div></div></div>" +
      TTM.workflowHTML(2) +
      '<div class="alert alert-info">' + TTM.icon("sparkles", 15) + "<div>Une relance automatique est programmée dans 48 h si le club n'a pas répondu.</div></div>" +
      '<div class="m-cta-bar"><button class="btn btn-primary btn-lg btn-block" data-m="tab" data-v="calendar">Suivre dans l\'agenda</button>' +
      '<button class="btn btn-ghost btn-block" data-m="toast" data-v="Relance envoyée au club.">Relancer le club</button></div>'
    );
  };

  VIEWS.alerts = function () {
    const list = st().notifications;
    const ico = { request: "send", request_accepted: "checkCircle", match_recommended: "sparkles", match_offer: "target", tournament: "trophy", convocation: "clipboardCheck", info: "info" };
    return (
      appbar("Notifications", list.filter((n) => !n.read).length + " non lues", { avatar: false }) +
      '<div class="row-2" style="gap:8px"><button class="btn btn-outline btn-sm btn-block" data-m="readall">Tout marquer comme lu</button>' +
      '<button class="btn btn-ghost btn-sm" data-m="toast" data-v="Préférences de notification ouvertes.">' + TTM.icon("sliders", 14) + "</button></div>" +
      '<div class="m-list">' + list.map((n) =>
        '<button class="m-row" data-m="notif" data-v="' + n.id + '" style="' + (n.read ? "opacity:.62" : "") + '">' +
        '<span class="m-choice-ico" style="' + (n.read ? "" : "background:var(--ttm-accent-soft);color:var(--ttm-brand)") + '">' + TTM.icon(ico[n.type] || "bell", 18) + "</span>" +
        '<span class="m-row-main"><b class="t-body-sm">' + E(n.title) + "</b>" +
        '<div class="t-micro t-secondary" style="line-height:1.4">' + E(n.body) + "</div>" +
        '<div class="t-micro t-muted">' + E(n.t) + "</div></span>" +
        (n.read ? "" : '<span class="badge-dot-live"></span>') + "</button>").join("") + "</div>"
    );
  };

  VIEWS.chat = function () {
    const t = st().threads.find((x) => x.id === state.chat) || st().threads[0];
    if (!t) return appbar("Messagerie", "", { back: true });
    return (
      appbar(t.name, t.sub || "Conversation club", { back: true, avatar: false }) +
      '<div class="chat">' +
      '<div class="chat-day t-micro t-muted">Aujourd\'hui</div>' +
      t.messages.map((m) =>
        '<div class="m-bub ' + (m.me ? "m-bub-out" : "m-bub-in") + '">' + E(m.text) +
        '<div class="t-micro" style="opacity:.7;margin-top:4px">' + E(m.t || "9:12") + "</div></div>").join("") +
      "</div>" +
      '<div class="m-compose"><input class="input" id="mChat" placeholder="Votre message…">' +
      '<button class="btn btn-primary btn-icon" data-m="send-msg" data-v="' + t.id + '">' + TTM.icon("send", 16) + "</button></div>" +
      '<div class="row-2 wrap" style="gap:6px"><span class="chip chip-sm">' + TTM.icon("calendar", 12) + " Confirmer le match</span>" +
      '<span class="chip chip-sm">' + TTM.icon("mapPin", 12) + " Envoyer l\'itinéraire</span></div>"
    );
  };

  VIEWS.calendar = function () {
    const s = st();
    const mine = D.MY_MATCHES.slice().sort((a, b) => a.date.localeCompare(b.date));
    const groups = {};
    mine.forEach((m) => { (groups[m.date] = groups[m.date] || []).push(m); });
    const reqs = s.requests.filter((r) => r.status === "pending");
    return (
      appbar("Agenda", mine.length + " matchs · " + reqs.length + " demandes en cours", { avatar: false }) +
      '<div class="tabs tabs-pill"><button class="tab is-active">Tout</button><button class="tab">À venir</button><button class="tab">Joués</button></div>' +
      (reqs.length
        ? '<div class="card card-flat card-pad-sm stack stack-2"><b class="t-body-sm">Demandes en attente</b>' +
          reqs.map((r) => '<button class="m-row" data-m="tab" data-v="alerts"><span class="m-row-main"><b class="t-body-sm">' + E(r.cat) + " vs " + E(club(r.to).short) + '</b><div class="t-micro t-muted">' + E(fmtD(r.date)) + " · " + E(r.time) + " · en attente de réponse</div></span>" + TTM.icon("clock", 16) + "</button>").join("") + "</div>"
        : "") +
      Object.keys(groups).map((d) =>
        '<div class="m-day"><div class="m-day-h"><b>' + E(TTM.date.dayMin(d)) + "</b><span class=\"t-micro t-muted\">" + E(fmtD(d)) + "</span></div>" +
        groups[d].map((m) =>
          '<div class="m-ev"><div><div class="m-ev-time">' + E(m.time) + '</div><div class="m-ev-dim">' + E(m.cat) + "</div></div>" +
          "<div><b class=\"t-body-sm\">" + E(m.opp) + '</b><div class="t-micro t-muted">' + E(m.venue) + " · " + E(m.city) + "</div></div>" +
          (m.status === "played"
            ? '<span class="badge badge">' + E(m.result || "Joué") + "</span>"
            : '<button class="btn btn-outline btn-xs" data-m="toast" data-v="Itinéraire ouvert vers ' + E(m.venue) + '.">Itinéraire</button>') +
          "</div>").join("") + "</div>").join("") +
      '<div class="m-cta-bar"><button class="btn btn-primary btn-block" data-m="toast" data-v="Calendrier synchronisé (Google / Outlook).">' + TTM.icon("download", 16) + "Synchroniser mon calendrier</button></div>"
    );
  };

  VIEWS.profile = function () {
    const s = st();
    const t = D.team(refTeam());
    return (
      appbar("Profil", "Compte président · AS Courbevoie", { avatar: false }) +
      '<div class="card card-flat card-pad stack stack-3">' +
      '<div class="row-2" style="gap:12px">' + TTM.avatar(s.user.name, "avatar-xl", 0) +
      "<div><b class=\"t-body\">" + E(s.user.name) + '</b><div class="t-caption t-secondary">' + E(s.user.role) + "</div>" +
      '<div class="t-micro t-muted">' + E(s.user.club || "AS Courbevoie") + " · " + E(s.user.email || "k.benali@ascourbevoie.fr") + "</div></div></div>" +
      '<div class="row-2" style="gap:8px"><span class="badge badge-success">' + TTM.icon("shieldCheck", 12) + "Identité vérifiée</span>" +
      '<span class="badge badge-brand">2 clubs</span><span class="badge">' + D.TEAMS.length + " équipes</span></div></div>" +
      '<div class="m-sect"><h3>Module Parents</h3><span class="badge badge-success">Actif</span></div>' +
      '<div class="card card-flat card-pad-sm stack stack-2">' +
      '<div class="row-2" style="gap:10px">' + TTM.avatar("Yacine Belkacem", "avatar-sm", 1) +
      '<span class="m-row-main"><b class="t-body-sm">Yacine Belkacem</b><div class="t-micro t-muted">Parent · U15 A · 3 enfants</div></span>' +
      '<span class="switch"><input type="checkbox" checked><span class="switch-track"><span class="switch-thumb"></span></span></span></div>' +
      '<div class="t-micro t-secondary">Accès en lecture seule : agenda, convocations, licences et confirmations de présence.</div></div>' +
      '<div class="m-list">' +
      [["users", "Staff technique", D.COACHES.length + " coachs"], ["clipboardCheck", "Licences", "412 à jour"], ["wallet", "Offre", "Pro Club · sur devis"],
       ["shield", "Confidentialité", "RGPD · données France"], ["message", "Aide et support", "Réponse sous 24 h"], ["settings", "Paramètres", "Thème, langue, notifications"]]
        .map((r) => '<button class="m-row" data-m="toast" data-v="' + E(r[1] + " : " + r[2]) + '"><span class="m-choice-ico">' + TTM.icon(r[0], 18) + "</span>" +
          '<span class="m-row-main"><b class="t-body-sm">' + E(r[1]) + '</b></span><span class="t-micro t-muted">' + E(r[2]) + "</span>" + TTM.icon("chevronRight", 16) + "</button>").join("") +
      "</div>" +
      '<div class="row-2" style="gap:8px"><button class="btn btn-outline btn-sm btn-block" data-m="theme">Thème</button>' +
      '<button class="btn btn-ghost btn-sm btn-block" data-m="toast" data-v="Session fermée (simulation).">Déconnexion</button></div>'
    );
  };

  /* ---------- interactions ---------- */

  document.addEventListener("click", function (e) {
    const b = e.target.closest("[data-m]");
    if (!b) return;
    const a = b.dataset.m;
    if (a === "go") go(b.dataset.v);
    else if (a === "tab") go(b.dataset.v);
    else if (a === "to") go(b.dataset.v, { id: b.dataset.id });
    else if (a === "back") back();
    else if (a === "profile") go("profile");
    else if (a === "match") go("match", { id: b.dataset.v });
    else if (a === "chat") { state.chat = b.dataset.v; go("chat"); }
    else if (a === "team") { st().activeTeam = b.dataset.v; render(); }
    else if (a === "cat") { state.filters.cat = b.dataset.v; render(); }
    else if (a === "theme") { TTM.theme.toggle(); render(); }
    else if (a === "noop") return;
    else if (a === "toast") TTM.toast("Information", b.dataset.v, "info");
    else if (a === "readall") {
      st().notifications.forEach((n) => (n.read = true));
      TTM.toast("Notifications lues", "Toutes les alertes sont marquées comme lues.", "success");
      render();
    } else if (a === "notif") {
      const n = st().notifications.find((x) => x.id === b.dataset.v);
      if (n) { n.read = true; TTM.toast(n.title, n.body, "info", { duration: 3200 }); render(); }
    } else if (a === "send-req") {
      const m = D.match(b.dataset.id);
      const c = club(m.clubId);
      TTM.sendRequest(m, refTeam(), "Message depuis l'application mobile.", null);
      go("sent", { club: c.name });
      TTM.toast("Demande envoyée", c.name + " a été notifié par push, e-mail et SMS.", "success");
    } else if (a === "send-msg") {
      const i = $("#mChat");
      const v = (i.value || "").trim();
      if (!v) return;
      const t = st().threads.find((x) => x.id === b.dataset.v);
      if (t) { t.messages.push({ me: true, text: v, t: "9:41" }); t.unread = 0; }
      TTM.toast("Message envoyé", "Le club répond généralement sous 2 h en journée.", "success", { duration: 3000 });
      render();
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target.id === "mSearch") { state.filters.q = e.target.value; render(); const i = $("#mSearch"); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
  });

  document.addEventListener("click", function (e) {
    const c = e.target.closest(".s-clear");
    if (c) { state.filters.q = ""; render(); }
  });

  /* ---------- init ---------- */

  function clock() {
    const d = new Date();
    $("#mClock").textContent = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    clock();
    setInterval(clock, 20000);
    $("#btnTheme").onclick = function () { TTM.theme.toggle(); render(); };
    TTM.toast("Prototype mobile", "14 écrans interactifs · les données sont synthétiques (Île-de-France).", "info", { duration: 4600 });
  });
})();
