/* ============================================================
   TTM — Core
   Icônes · Helpers · Store · Thème · Composants interactifs
   (toast, modal, sheet, confirm) · Compteurs · Reveal · Charts
   ============================================================ */
(function (global) {
  "use strict";

  const TTM = global.TTM || {};
  global.TTM = TTM;

  /* ==========================================================
     1. ICONES (SVG inline — trait 1.8, grille 24)
     ========================================================== */
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
    mapPin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    users: '<path d="M16 20v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="9" cy="7" r="3.4"/><path d="M22 20v-1.6a4 4 0 0 0-3-3.87M16.5 3.9a4 4 0 0 1 0 6.2"/>',
    user: '<path d="M19 21v-2a5 5 0 0 0-5-5h-4a5 5 0 0 0-5 5v2"/><circle cx="12" cy="7" r="4"/>',
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.6V20a1 1 0 0 0 1 1h3.5v-6h5v6H18a1 1 0 0 0 1-1V9.6"/>',
    message: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.7-.8L3 20.5l1.5-4.6A8.4 8.4 0 0 1 3.6 11 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
    bell: '<path d="M18 8a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14 18 8"/><path d="M13.7 19.5a2 2 0 0 1-3.4 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.9 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.7 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.7 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.7a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.1 4.7a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v0a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    checkCircle: '<circle cx="12" cy="12" r="9.2"/><path d="m8 12.2 2.7 2.7L16 9.6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevronRight: '<path d="m9 5 7 7-7 7"/>',
    chevronLeft: '<path d="m15 5-7 7 7 7"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronUp: '<path d="m6 15 6-6 6 6"/>',
    chevronRightCircle: '<circle cx="12" cy="12" r="9.2"/><path d="m9.5 9.5 4 2.5-4 2.5z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.5 3c0 5-7.5 9.6-7.5 9.6z"/>',
    share: '<circle cx="17.5" cy="6" r="2.6"/><circle cx="6.5" cy="12" r="2.6"/><circle cx="17.5" cy="18" r="2.6"/><path d="m8.8 10.8 6.4-3.6M8.8 13.2l6.4 3.6"/>',
    clock: '<circle cx="12" cy="12" r="9.2"/><path d="M12 7v5.2l3.4 2"/>',
    navigation: '<path d="M20.5 3.5 3.5 10.2l7.4 3.1 3.1 7.4z"/>',
    target: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>',
    zap: '<path d="M13.5 2.5 4 14h6.5L10 21.5 20 10h-6.5z"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 5M17 6h2.5a2.5 2.5 0 0 1-2.5 5M10 14v3.5M14 14v3.5M8 21h8M9.5 17.5h5V21h-5z"/>',
    star: '<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8z"/>',
    shield: '<path d="M12 21s7-3.2 7-8.6V5.9L12 3 5 5.9v6.5C5 17.8 12 21 12 21z"/><path d="m9 12 2 2 4-4"/>',
    layout: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 10h18M9.5 10v10"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
    logOut: '<path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9"/><path d="M15.5 16.5 20 12l-4.5-4.5M20 12H9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
    moon: '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/>',
    edit: '<path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5z"/><path d="M14.5 6.5 17.5 9.5"/>',
    trash: '<path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
    send: '<path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8z"/>',
    image: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m3.5 17 4.7-4.2a2 2 0 0 1 2.7 0l3.3 3M14 14.5l1.7-1.5a2 2 0 0 1 2.7 0l2.1 1.9"/>',
    paperclip: '<path d="M20 11.5 12 19.4a5 5 0 0 1-7-7l8.4-8.3a3.3 3.3 0 0 1 4.7 4.7l-8.4 8.3a1.7 1.7 0 0 1-2.4-2.4l7.7-7.6"/>',
    phone: '<path d="M21 16.5v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 3.3 5a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14.4 14.4 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.6 1.6z"/>',
    mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
    arrowUp: '<path d="M12 20V5M6 11l6-6 6 6"/>',
    arrowDown: '<path d="M12 4v15M6 13l6 6 6-6"/>',
    download: '<path d="M21 15.5v3A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-3M7.5 10.5 12 15l4.5-4.5M12 15V3.5"/>',
    refresh: '<path d="M20.5 11a8.5 8.5 0 0 0-14.6-5L3 9M3 4v5h5M3.5 13a8.5 8.5 0 0 0 14.6 5l2.9-3M21 20v-5h-5"/>',
    alert: '<path d="M12 3.5 22 20H2z"/><path d="M12 9.5v5M12 17.5h.01"/>',
    alertCircle: '<circle cx="12" cy="12" r="9.2"/><path d="M12 7.5v5M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="9.2"/><path d="M12 16.5v-5M12 7.8h.01"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3.2"/>',
    lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2.2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
    sparkles: '<path d="m12 3 1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9zM18 15l.9 2.1 2.1.9-2.1.9L18 21l-.9-2.1-2.1-.9 2.1-.9z"/>',
    trendingUp: '<path d="m3 16.5 6-6 4 4 8-8"/><path d="M15 6.5h6v6"/>',
    trendingDown: '<path d="m3 7.5 6 6 4-4 8 8"/><path d="M15 17.5h6v-6"/>',
    more: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
    moreV: '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
    activity: '<path d="M3 12h4l3 8 4-16 3 8h4"/>',
    barChart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    pieChart: '<path d="M21.2 15.5A9.5 9.5 0 1 1 8.5 2.8"/><path d="M21.5 11.5A9.5 9.5 0 0 0 12.5 2.5v9z"/>',
    layers: '<path d="m12 2.8 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5M3 17l9 5 9-5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    play: '<path d="M7 4.5 19.5 12 7 19.5z"/>',
    smartphone: '<rect x="6" y="2.5" width="12" height="19" rx="2.8"/><path d="M10.5 5.4h3M11 18.6h2"/>',
    monitor: '<rect x="2.5" y="4" width="19" height="13" rx="2.2"/><path d="M8 21h8M12 17v4"/>',
    server: '<rect x="3" y="4" width="18" height="6.5" rx="2"/><rect x="3" y="13.5" width="18" height="6.5" rx="2"/><path d="M7 7.2h.01M7 16.8h.01"/>',
    database: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    code: '<path d="m8.5 8-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13.5 5l-3 14"/>',
    gitBranch: '<circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 7.5v9M18 11.5c0 3.5-3 4-6 4.5"/>',
    globe: '<circle cx="12" cy="12" r="9.2"/><path d="M2.8 12h18.4M12 2.8a15 15 0 0 1 0 18.4 15 15 0 0 1 0-18.4z"/>',
    cpu: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.2"/><path d="M9.5 2.5v4M14.5 2.5v4M9.5 17.5v4M14.5 17.5v4M2.5 9.5h4M2.5 14.5h4M17.5 9.5h4M17.5 14.5h4"/>',
    cloud: '<path d="M17.5 19.5a4.5 4.5 0 0 0 .3-9A6.5 6.5 0 0 0 5.4 11a3.8 3.8 0 0 0 .6 8.5z"/>',
    bellOff: '<path d="M18 8a6 6 0 0 0-9.3-5M5.2 8.5c-.1.3-.2.6-.2 1C5 15.5 2.5 17 2.5 17h14M13.7 19.5a2 2 0 0 1-3.4 0M2.5 2.5l19 19"/>',
    bookmark: '<path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1z"/>',
    thumbsUp: '<path d="M7 10.5v9.5H4.5a1 1 0 0 1-1-1v-8.5h3zM7 10.5 11 3a2.2 2.2 0 0 1 2.2 2.2v3.3h5.3a2 2 0 0 1 2 2.4l-1.4 7.4a2 2 0 0 1-2 1.6H7z"/>',
    flag: '<path d="M4.5 21V4M4.5 4.5h11l-1.5 3.5 1.5 3.5h-11"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.6-1 7.4 4.5-2.4 4.5 2.4-1-7.4"/>',
    users2: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16.5 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
    whistle: '<path d="M13.5 8.5h4.2a2 2 0 0 1 1.9 2.6l-.7 2a2 2 0 0 1-1.9 1.4h-3.5"/><circle cx="9" cy="12.5" r="5.5"/><path d="M9 10.5v2l1.6 1"/>',
    clipboard: '<rect x="6" y="4.5" width="12" height="16.5" rx="2.2"/><path d="M9.5 4.5V3.5h5v1"/><path d="M9.2 10.5h5.6M9.2 14.5h5.6M9.2 18h3.4"/>',
    building: '<path d="M4 20.5h16M5.5 20.5V5.5a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v15M14.5 10h3.5a1 1 0 0 1 1 1v9.5M8.5 8h3M8.5 12h3M8.5 16h3"/>',
    shieldCheck: '<path d="M12 21s7-3.2 7-8.6V5.9L12 3 5 5.9v6.5C5 17.8 12 21 12 21z"/><path d="m9 12 2 2 4-4"/>',
    bolt: '<path d="M11 21 4 12.5h5.5L9 3l7.5 8.5H11z"/>',
    scan: '<path d="M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5"/><path d="M4 12h16"/>',
    qr: '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2"/><path d="M14 14h2.5v2.5H14zM19.5 14H21M14 19.5h2.5M19.5 19.5H21"/>',
    wallet: '<rect x="3" y="5.5" width="18" height="14" rx="2.5"/><path d="M3 10h18M16.5 15h1.5"/>',
    rocket: '<path d="M13.5 3.5c3 0 7 4 7 7 0 2.5-2 4-3.5 5.5L14 19l-1.5-3L9.5 15l-1.5-3c1.5-1.5 3-3.5 5.5-3.5z"/><circle cx="15" cy="9" r="1.6"/><path d="M8 14c-1.8.5-3 2-3.5 3.5 1.5-.5 3-1.7 3.5-3.5M10 16c-.5 1.8-2 3-3.5 3.5.5-1.5 1.7-3 3.5-3.5"/>',
    handshake: '<path d="m8.5 12.5 2 2a1.8 1.8 0 0 0 2.5 0l3.5-3.5"/><path d="M2.5 9.5 6 6.5l3 1.5 3-1.5 3.5 3 3 1-3 4-2.5-1.5-3.5 4-3-1.5z"/>',
    key: '<circle cx="8" cy="12" r="4.5"/><path d="M12.5 12H21M17.5 12v3.5M20 12v2.5"/>',
    infinity: '<path d="M8.5 12s-2.5-4-4.5-4a3.5 3.5 0 0 0 0 7c2 0 4.5-3 4.5-3s2.5 3 4.5 3a3.5 3.5 0 0 0 0-7c-2 0-4.5 4-4.5 4z"/>',
    rotate: '<path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9L21 9"/><path d="M21 4v5h-5M20.5 12a8.5 8.5 0 0 1-14.6 5.9L3 15"/><path d="M3 20v-5h5"/>',
    clipboardCheck: '<path d="M9 4.5V3.5h6v1"/><rect x="6" y="4.5" width="12" height="16.5" rx="2.2"/><path d="m9.2 12.2 2 2 3.6-3.6"/>',
    coach: '<path d="M3 20.5h18M4.5 20.5V13l7.5-4.5L19.5 13v7.5"/><path d="M9 20.5v-4h6v4"/><path d="M8 10.5h8"/>',
    whistle2: '<circle cx="10" cy="14" r="6"/><path d="M15 11h5.5M4.5 9.5 3 6h4l2 3"/>',
    userPlus: '<path d="M15 20v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="8.5" cy="7" r="3.4"/><path d="M19 8v6M16 11h6"/>',
    inbox: '<path d="M21 12h-5l-1.5 3h-5L8 12H3"/><path d="M5.4 5.2 3 12v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5l-2.4-6.8A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.9 1.2z"/>',
    pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><path d="M12 8v4M12 14.5h.01"/>',
    gauge: '<path d="M12 14 16 9"/><path d="M20.5 17a9.5 9.5 0 1 0-17 0"/><circle cx="12" cy="14" r="1.6"/>',
    userCheck: '<path d="M15 20v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="8.5" cy="7" r="3.4"/><path d="m16 11 2 2 4-4"/>',
    userX: '<path d="M15 20v-1.6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="8.5" cy="7" r="3.4"/><path d="m17 9 5 5M22 9l-5 5"/>',
    calendarPlus: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/>',
    listChecks: '<path d="M10 6h11M10 12h11M10 18h11"/><path d="m3 6 1.6 1.6L7.4 4.6M3 12l1.6 1.6L7.4 10.6M3 18l1.6 1.6L7.4 16.6"/>',
    tag: '<path d="M3.5 11.2V4.5a1 1 0 0 1 1-1h6.7a1 1 0 0 1 .7.3l8.3 8.3a1 1 0 0 1 0 1.4l-6.7 6.7a1 1 0 0 1-1.4 0L3.8 11.9a1 1 0 0 1-.3-.7z"/><circle cx="7.8" cy="7.8" r="1.4"/>'
  };

  TTM.icon = function (name, size, cls) {
    const d = P[name];
    if (!d) return "";
    const s = size || 20;
    return '<svg class="i ' + (cls || "") + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  };
  TTM.icons = P;

  /* ==========================================================
     2. HELPERS
     ========================================================== */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const DAYS_MIN = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

  const D = TTM.date = {
    parse: (iso) => {
      const p = String(iso).split("-");
      return new Date(+p[0], +p[1] - 1, +p[2]);
    },
    fmt: (iso, opt) => {
      const d = typeof iso === "string" ? D.parse(iso) : iso;
      const o = opt || {};
      let s = "";
      if (o.d !== false) s += d.getDate() + " ";
      if (o.m === "long") s += MONTHS[d.getMonth()] + " ";
      else if (o.m !== false) s += MONTHS[d.getMonth()].slice(0, 4) + " ";
      if (o.y) s += d.getFullYear();
      return s.trim();
    },
    day: (iso) => DAYS[D.parse(iso).getDay()],
    dayMin: (iso) => DAYS_MIN[D.parse(iso).getDay()],
    num: (iso) => D.parse(iso).getDate(),
    dow: (iso) => DAYS_MIN[D.parse(iso).getDay()],
    rel: (iso) => {
      const d = typeof iso === "string" ? new Date(iso) : iso;
      const now = new Date(2026, 8, 26, 20, 0);
      const diff = Math.round((d - now) / 86400000);
      if (diff === 0) return "aujourd'hui";
      if (diff === 1) return "demain";
      if (diff === -1) return "hier";
      if (diff > 1) return "dans " + diff + " j";
      return "il y a " + Math.abs(diff) + " j";
    }
  };

  TTM.$ = $; TTM.$$ = $$; TTM.esc = esc;
  TTM.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  TTM.initials = (n) => String(n).split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const GRAD = ["#2563EB,#0EA5E9", "#22D3EE,#0891B2", "#8B5CF6,#EC4899", "#F59E0B,#EF4444", "#22C55E,#0D9488", "#EC4899,#8B5CF6", "#3B82F6,#22D3EE", "#F43F5E,#FB923C", "#0F766E,#0891B2", "#EA580C,#FACC15", "#111827,#F59E0B", "#15803D,#65A30D", "#0369A1,#38BDF8"];

  const deep = (c) => "color-mix(in srgb," + c + " 52%,#0A1220)";
  const grad = (a, b) => "linear-gradient(135deg," + deep(a) + "," + deep(b) + ")";

  TTM.clubLogo = function (club, size) {
    const c = typeof club === "string" ? global.TTM_DATA.club(club) : club;
    if (!c) return "";
    const g = c.colors ? grad(c.colors[0], c.colors[1] || c.colors[0]) : grad(GRAD[0].split(",")[0], GRAD[0].split(",")[1]);
    return '<div class="club-logo ' + (size || "") + '" style="background:' + g + '">' + esc(c.short || TTM.initials(c.name)) + "</div>";
  };
  TTM.avatar = function (name, size, gradIdx, status) {
    const pair = GRAD[(gradIdx || 0) % GRAD.length].split(",");
    return '<div class="avatar ' + (size || "") + '" style="background:' + grad(pair[0], pair[1]) + '">' + esc(TTM.initials(name)) +
      (status ? '<span class="avatar-status ' + status + '"></span>' : "") + "</div>";
  };
  TTM.catBadge = function (cat) {
    const k = String(cat).toLowerCase();
    return '<span class="cat-badge cat-' + k + '">' + esc(cat) + "</span>";
  };
  TTM.typeLabel = { friendly: "Amical", league: "Championnat", cup: "Coupe", tournament: "Tournoi" };
  TTM.levelLabel = { 1: "Débutant", 2: "Intermédiaire", 3: "Avancé" };

  /* Distance haversine */
  TTM.distance = function (a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLa = (b.lat - a.lat) * r, dLo = (b.lng - a.lng) * r;
    const x = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)) * 10) / 10;
  };

  TTM.logo = function (size, mono) {
    const s = size || 32;
    const u = "ttmMk" + s + (mono ? "m" : "");
    const ink = mono ? "currentColor" : "#ffffff";
    const ball = mono ? "currentColor" : "#0E2C56";
    return '<svg class="ttm-mark" width="' + s + '" height="' + s + '" viewBox="0 0 64 64" fill="none" role="img" aria-label="TTM — Trouve ton match">' +
      "<defs>" +
      '<linearGradient id="' + u + 'Bg" x1="4" y1="2" x2="60" y2="62" gradientUnits="userSpaceOnUse"><stop stop-color="' + (mono ? "currentColor" : "#0C2748") + '"/><stop offset=".46" stop-color="' + (mono ? "currentColor" : "#0E2C56") + '"/><stop offset="1" stop-color="' + (mono ? "currentColor" : "#17457F") + '"/></linearGradient>' +
      '<linearGradient id="' + u + 'Sh" x1="6" y1="2" x2="42" y2="46" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".26"/><stop offset=".5" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="' + u + 'Gl" cx="32" cy="41.5" r="15" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="' + u + 'Cp"><rect x="1" y="1" width="62" height="62" rx="19.5"/></clipPath>' +
      "</defs>" +
      '<rect x="1" y="1" width="62" height="62" rx="19.5" fill="url(#' + u + 'Bg)"/>' +
      '<g clip-path="url(#' + u + 'Cp)">' +
      '<rect x="1" y="1" width="62" height="62" rx="19.5" fill="url(#' + u + 'Sh)"/>' +
      '<circle cx="32" cy="41.5" r="15" fill="url(#' + u + 'Gl)"/>' +
      '<g stroke="#ffffff" fill="none" stroke-linecap="round"><path d="M9 41.5h46" stroke-opacity=".11" stroke-width="1.6"/>' +
      '<circle cx="32" cy="41.5" r="13.2" stroke-opacity=".24" stroke-width="1.5" stroke-dasharray="3.2 4.4"/></g>' +
      '<path d="M14 15.6h36a2.4 2.4 0 0 1 2.4 2.4v3.6a2.4 2.4 0 0 1-2.4 2.4H36.5v7.6a2.4 2.4 0 0 1-2.4 2.4h-4.2a2.4 2.4 0 0 1-2.4-2.4V24H14a2.4 2.4 0 0 1-2.4-2.4V18a2.4 2.4 0 0 1 2.4-2.4Z" fill="' + ink + '"/>' +
      '<circle cx="32" cy="41.6" r="8.6" fill="' + ink + '"/>' +
      '<circle cx="32" cy="41.6" r="4.9" fill="none" stroke="' + ball + '" stroke-width="1.9"/>' +
      '<circle cx="32" cy="41.6" r="1.55" fill="' + ball + '"/>' +
      '<circle cx="19.78" cy="45.95" r="3" fill="' + ink + '" fill-opacity=".94"/>' +
      '<circle cx="44.22" cy="45.95" r="3" fill="' + ink + '" fill-opacity=".94"/>' +
      "</g>" +
      '<rect x="1.75" y="1.75" width="60.5" height="60.5" rx="19.25" fill="none" stroke="#ffffff" stroke-opacity=".16" stroke-width="1.5"/>' +
      "</svg>";
  };

  TTM.wordmark = function () {
    return '<span class="ttm-lockup">' + TTM.logo(34) +
      '<span class="ttm-lockup-txt"><b>TTM</b><i>TROUVE TON MATCH</i></span></span>';
  };

  /* ==========================================================
     3. STORE
     ========================================================== */
  const listeners = [];
  const S = {
    theme: "light",
    user: null,
    clubId: "courbevoie",
    activeTeam: "all",
    view: "dashboard",
    filters: { cats: [], dist: 60, dates: [], times: [], levels: [], types: [], cities: [], onlyCompat: true, q: "" },
    requests: [],
    notifications: [],
    threads: null,
    toasts: []
  };
  S.requests = JSON.parse(JSON.stringify(global.TTM_DATA.REQUESTS));
  S.notifications = JSON.parse(JSON.stringify(global.TTM_DATA.NOTIFICATIONS));
  S.threads = JSON.parse(JSON.stringify(global.TTM_DATA.THREADS));
  S.user = global.TTM_DATA.USERS[0];

  TTM.store = {
    get: () => S,
    set(patch, silent) {
      Object.assign(S, patch);
      if (!silent) listeners.forEach((f) => f(S, patch));
    },
    sub(f) { listeners.push(f); return () => { const i = listeners.indexOf(f); if (i > -1) listeners.splice(i, 1); }; },
    emit() { listeners.forEach((f) => f(S, {})); },
    reset() {
      S.requests = JSON.parse(JSON.stringify(global.TTM_DATA.REQUESTS));
      S.notifications = JSON.parse(JSON.stringify(global.TTM_DATA.NOTIFICATIONS));
      S.threads = JSON.parse(JSON.stringify(global.TTM_DATA.THREADS));
      S.activeTeam = "all";
      S.filters = { cats: [], dist: 60, dates: [], times: [], levels: [], types: [], cities: [], onlyCompat: true, q: "" };
      TTM.toast("Prototype réinitialisé", "Toutes les données de démonstration sont revenues à leur état initial.", "info");
      TTM.store.emit();
    }
  };

  /* ==========================================================
     4. THÈME
     ========================================================== */
  TTM.theme = {
    get: () => (document.documentElement.getAttribute("data-theme") || "light"),
    set(t) {
      document.documentElement.classList.add("theme-transition");
      document.documentElement.setAttribute("data-theme", t);
      S.theme = t;
      try { localStorage.setItem("ttm-theme", t); } catch (e) {}
      setTimeout(() => document.documentElement.classList.remove("theme-transition"), 460);
      TTM.$$("[data-theme-toggle]").forEach((b) => {
        b.innerHTML = TTM.icon(t === "dark" ? "sun" : "moon", 18);
        b.setAttribute("aria-label", t === "dark" ? "Passer en mode clair" : "Passer en mode sombre");
      });
    },
    toggle() { TTM.theme.set(TTM.theme.get() === "dark" ? "light" : "dark"); },
    init() {
      document.documentElement.setAttribute("data-theme", "light");
      S.theme = "light";
      try { localStorage.removeItem("ttm-theme"); } catch (e) {}
    }
  };

  /* ==========================================================
     5. HAPTIC (simulé)
     ========================================================== */
  TTM.haptic = function (pattern) {
    if (!("vibrate" in navigator)) return;
    const p = pattern || 12;
    if (navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} }
    const host = document.getElementById("ttm-haptic");
    if (!host) return;
    const d = document.createElement("div");
    d.style.cssText = "position:fixed;width:2px;height:2px;opacity:.01;";
    host.appendChild(d);
  };

  /* ==========================================================
     6. TOASTS
     ========================================================== */
  function toastHost() {
    let h = document.getElementById("toastHost");
    if (!h) { h = document.createElement("div"); h.id = "toastHost"; h.className = "toast-host"; h.setAttribute("role", "status"); h.setAttribute("aria-live", "polite"); document.body.appendChild(h); }
    return h;
  }
  TTM.toast = function (title, msg, kind, opts) {
    const o = opts || {};
    const k = kind || "info";
    const ico = { success: "checkCircle", info: "info", warning: "alertCircle", error: "alertCircle" }[k] || "info";
    const el = document.createElement("div");
    el.className = "toast toast-" + k;
    el.innerHTML =
      '<div class="toast-ico">' + TTM.icon(ico, 18) + "</div>" +
      '<div class="flex-1"><div class="toast-title">' + esc(title) + "</div>" +
      (msg ? '<div class="toast-msg">' + esc(msg) + "</div>" : "") +
      (o.action ? '<button class="toast-action">' + esc(o.action) + "</button>" : "") + "</div>" +
      '<button class="toast-close" aria-label="Fermer">' + TTM.icon("x", 15) + "</button>";
    const close = () => { el.classList.add("is-out"); setTimeout(() => el.remove(), 320); };
    el.querySelector(".toast-close").onclick = close;
    if (o.action) el.querySelector(".toast-action").onclick = () => { close(); o.onAction && o.onAction(); };
    toastHost().appendChild(el);
    requestAnimationFrame(() => el.classList.add("is-in"));
    setTimeout(() => el.classList.add("is-in"), 24);
    if (o.duration !== 0) setTimeout(close, o.duration || 4200);
    TTM.haptic(10);
    return el;
  };
  TTM.notifySuccess = (t, m) => TTM.toast(t, m, "success");
  TTM.notifyInfo = (t, m) => TTM.toast(t, m, "info");

  /* ==========================================================
     7. OVERLAY / MODAL / SHEET
     ========================================================== */
  function overlayEl() {
    let o = document.getElementById("ttmOverlay");
    if (!o) { o = document.createElement("div"); o.id = "ttmOverlay"; o.className = "overlay"; document.body.appendChild(o); }
    return o;
  }
  TTM.closeAll = function () {
    TTM.$$(".modal.is-open, .sheet.is-open, .drawer.is-open").forEach((e) => e.classList.remove("is-open"));
    overlayEl().classList.remove("is-open");
    document.body.classList.remove("is-locked");
    TTM.$$(".dropdown.is-open").forEach((e) => e.classList.remove("is-open"));
    TTM.$$(".modal, .sheet, .drawer").forEach((e) => {
      if (e.classList.contains("is-open")) return;
      setTimeout(function () { if (!e.classList.contains("is-open") && e.parentNode) e.parentNode.removeChild(e); }, 380);
    });
  };
  function openOverlay() { overlayEl().classList.add("is-open"); document.body.classList.add("is-locked"); }

  TTM.modal = function (o) {
    const opts = o || {};
    TTM.closeAll();
    const el = document.createElement("div");
    el.className = "modal " + (opts.size === "wide" ? "modal-wide" : "");
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.innerHTML =
      (opts.title || opts.closable !== false ?
        '<div class="modal-header"><div><div class="modal-title t-h3">' + (opts.title || "") + "</div>" +
        (opts.subtitle ? '<div class="t-caption t-secondary" style="margin-top:4px">' + opts.subtitle + "</div>" : "") + "</div>" +
        '<button class="btn btn-ghost btn-icon btn-sm" data-x aria-label="Fermer">' + TTM.icon("x", 18) + "</button></div>" : "") +
      '<div class="modal-body">' + (opts.body || "") + "</div>" +
      (opts.footer ? '<div class="modal-footer">' + opts.footer + "</div>" : "");
    document.body.appendChild(el);
    openOverlay();
    requestAnimationFrame(() => el.classList.add("is-open"));
    const close = () => { el.classList.remove("is-open"); setTimeout(() => { el.remove(); TTM.closeAll(); }, 340); TTM.haptic(8); };
    el.querySelectorAll("[data-x]").forEach((b) => (b.onclick = close));
    if (opts.onMount) opts.onMount(el, close);
    return { el, close };
  };

  TTM.sheet = function (o) {
    const opts = o || {};
    TTM.closeAll();
    const el = document.createElement("div");
    el.className = "sheet";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.innerHTML =
      '<div class="sheet-grab"></div>' +
      '<div class="sheet-header"><div class="t-h4">' + (opts.title || "") + "</div>" +
      '<button class="btn btn-ghost btn-icon btn-sm" data-x aria-label="Fermer">' + TTM.icon("x", 18) + "</button></div>" +
      '<div class="sheet-body">' + (opts.body || "") + "</div>" +
      (opts.footer ? '<div class="sheet-footer">' + opts.footer + "</div>" : "");
    document.body.appendChild(el);
    openOverlay();
    requestAnimationFrame(() => el.classList.add("is-open"));
    const close = () => { el.classList.remove("is-open"); setTimeout(() => { el.remove(); TTM.closeAll(); }, 340); };
    el.querySelectorAll("[data-x]").forEach((b) => (b.onclick = close));
    if (opts.onMount) opts.onMount(el, close);
    return { el, close };
  };

  TTM.confirm = function (o) {
    const opts = o || {};
    return new Promise((res) => {
      const m = TTM.modal({
        title: opts.title || "Confirmer",
        body: '<p class="t-body t-secondary">' + (opts.body || "Êtes-vous sûr ?") + "</p>",
        footer:
          '<button class="btn btn-outline" data-no>' + (opts.cancel || "Annuler") + "</button>" +
          '<button class="btn ' + (opts.danger ? "btn-danger" : "btn-primary") + '" data-yes>' + (opts.ok || "Confirmer") + "</button>",
        onMount: (el, close) => {
          el.querySelector("[data-no]").onclick = () => { close(); res(false); };
          el.querySelector("[data-yes]").onclick = () => { close(); res(true); };
        }
      });
      TTM.$$("[data-x]", m.el).forEach((b) => (b.onclick = () => res(false)));
    });
  };

  TTM.drawer = function (o) {
    const opts = o || {};
    TTM.closeAll();
    const el = document.createElement("div");
    el.className = "drawer";
    el.innerHTML = opts.body || "";
    document.body.appendChild(el);
    openOverlay();
    requestAnimationFrame(() => el.classList.add("is-open"));
    if (opts.onMount) opts.onMount(el, () => TTM.closeAll());
    return el;
  };

  /* Overlay click → close everything */
  document.addEventListener("DOMContentLoaded", () => {
    overlayEl().addEventListener("click", TTM.closeAll);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") TTM.closeAll();
    });
  });

  /* ==========================================================
     8. DROPDOWNS
     ========================================================== */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-dd]");
    TTM.$$(".dropdown.is-open").forEach((d) => { if (!t || !d.contains(t)) d.classList.remove("is-open"); });
    if (t) {
      const dd = t.closest(".dropdown");
      if (dd) { e.stopPropagation(); dd.classList.toggle("is-open"); TTM.haptic(6); }
    }
    const tab = e.target.closest("[data-tab]");
    if (tab) {
      const group = tab.closest("[data-tabs]");
      if (group) {
        TTM.$$("[data-tab]", group).forEach((b) => b.classList.toggle("is-active", b === tab));
        TTM.$$("[data-panel]", group).forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.tab));
        TTM.haptic(8);
        if (tab.dataset.tabCb && TTM[tab.dataset.tabCb]) TTM[tab.dataset.tabCb](tab);
      }
    }
    const chip = e.target.closest("[data-chip]");
    if (chip) {
      chip.classList.toggle("is-active");
      TTM.haptic(8);
      if (chip.dataset.chipCb && TTM[chip.dataset.chipCb]) TTM[chip.dataset.chipCb](chip);
    }
    const sw = e.target.closest("[data-switch]") ? e.target.closest("[data-switch]").querySelector("input") : null;
    if (sw && sw.dataset.switchCb && TTM[sw.dataset.switchCb]) TTM[sw.dataset.switchCb](sw);
  });

  /* ==========================================================
     9. COMPTEURS ANIMÉS
     ========================================================== */
  TTM.countUp = function (el, to, opt) {
    const o = opt || {};
    const dur = o.duration || 1100;
    const dec = o.decimals != null ? o.decimals : 0;
    const pre = o.prefix || "";
    const suf = o.suffix || "";
    const from = o.from != null ? o.from : 0;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = pre + to.toFixed(dec) + suf; return; }
    const t0 = performance.now();
    function step(t) {
      const k = TTM.clamp((t - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (from + (to - from) * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
      else { el.textContent = pre + to.toFixed(dec) + suf; if (o.onEnd) o.onEnd(); }
    }
    requestAnimationFrame(step);
  };

  TTM.countAll = function (root) {
    TTM.$$("[data-count]", root || document).forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const to = parseFloat(el.dataset.count);
      TTM.countUp(el, to, {
        decimals: (el.dataset.count.split(".")[1] || "").length,
        prefix: el.dataset.prefix || "",
        suffix: el.dataset.suffix || ""
      });
    });
  };

  /* ==========================================================
     10. COMPAT RING (animation)
     ========================================================== */
  TTM.setCompat = function (el, pct) {
    el.style.setProperty("--pct", pct);
    const v = el.querySelector(".compat-val b");
    if (v) TTM.countUp(v, pct, { duration: 900, suffix: "" });
    el.classList.remove("compat-hi", "compat-md", "compat-lo");
    el.classList.add(pct >= 85 ? "compat-hi" : pct >= 65 ? "compat-md" : "compat-lo");
  };
  TTM.compatHTML = function (pct, size) {
    return '<div class="compat ' + (size || "") + ' compat-hi" data-compat="' + pct + '"><span class="compat-val"><b>' + pct + "</b><sup>%</sup></span></div>";
  };
  TTM.initCompat = function (root) {
    TTM.$$("[data-compat]", root || document).forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      setTimeout(() => TTM.setCompat(el, +el.dataset.compat), 60);
    });
  };

  /* ==========================================================
     11. REVEAL AU SCROLL
     ========================================================== */
  TTM.initReveal = function (root) {
    const els = TTM.$$(".reveal:not(.in)", root || document);
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const d = parseFloat(en.target.dataset.revealDelay || 0);
            setTimeout(() => en.target.classList.add("in"), d * 1000);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
  };

  /* ==========================================================
     12. CHARTS SVG (animés, sans dépendance)
     ========================================================== */
  const CH = {};

  CH.line = function (o) {
    const w = o.width || 640, h = o.height || 200, pad = { t: 14, r: 12, b: 26, l: 30 };
    const data = o.data || [];
    const max = o.max || Math.max.apply(null, data) * 1.12;
    const min = o.min || 0;
    const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
    const X = (i) => pad.l + (iw * i) / Math.max(1, data.length - 1);
    const Y = (v) => pad.t + ih - ((v - min) / (max - min)) * ih;
    let d = "", a = "";
    data.forEach((v, i) => { const x = X(i), y = Y(v); d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1); });
    a = d + " L" + X(data.length - 1).toFixed(1) + " " + (pad.t + ih) + " L" + pad.l + " " + (pad.t + ih) + " Z";
    const grad = "g" + Math.random().toString(36).slice(2, 7);
    let grid = "";
    for (let i = 0; i <= 3; i++) { const y = pad.t + (ih * i) / 3; grid += '<line x1="' + pad.l + '" y1="' + y + '" x2="' + (w - pad.r) + '" y2="' + y + '"/>'; }
    let xl = o.xLabels ? o.xLabels.map((l, i) => '<text class="chart-axis" x="' + X(i) + '" y="' + (h - 7) + '" text-anchor="middle">' + esc(l) + "</text>").join("") : "";
    const len = 1400;
    return '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none" role="img" aria-label="' + esc(o.label || "Graphique") + '">' +
      "<defs><linearGradient id='" + grad + "' x1='0' y1='0' x2='0' y2='1'>" +
      '<stop offset="0" stop-color="' + (o.color || "#2563EB") + '" stop-opacity=".45"/>' +
      '<stop offset="1" stop-color="' + (o.color || "#2563EB") + '" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="' + grad + 's" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="' + (o.color2 || "#2563EB") + '"/><stop offset="1" stop-color="' + (o.color || "#22D3EE") + '"/></linearGradient></defs>' +
      '<g class="chart-grid">' + grid + "</g>" + xl +
      '<path class="chart-area" d="' + a + '" fill="url(#' + grad + ')"/>' +
      '<path class="chart-line" d="' + d + '" stroke="url(#' + grad + 's)" stroke-dasharray="' + len + '" stroke-dashoffset="' + len + '" style="animation:ttm-draw 1.4s cubic-bezier(.22,1,.36,1) forwards"/>' +
      data.map((v, i) => '<circle class="chart-dot" cx="' + X(i) + '" cy="' + Y(v) + '" r="3" fill="' + (o.color || "#2563EB") + '"><animate attributeName="r" from="0" to="3" dur=".5s" begin="' + (0.7 + i * 0.05) + 's" fill="freeze"/></circle>').join("") +
      "</svg>";
  };

  CH.bars = function (o) {
    const w = o.width || 640, h = o.height || 200, pad = { t: 18, r: 8, b: 30, l: 30 };
    const data = o.data || [];
    const max = Math.max.apply(null, data.map((d) => d.value)) * 1.15;
    const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
    const bw = Math.min(o.barWidth || 44, (iw / data.length) * 0.6);
    let grid = "";
    for (let i = 0; i <= 3; i++) { const y = pad.t + (ih * i) / 3; grid += '<line x1="' + pad.l + '" y1="' + y + '" x2="' + (w - pad.r) + '" y2="' + y + '"/>'; }
    const bars = data.map((d, i) => {
      const x = pad.l + (iw / data.length) * (i + 0.5) - bw / 2;
      const bh = (d.value / max) * ih;
      const y = pad.t + ih - bh;
      const c = d.color || o.color || "#2563EB";
      return '<g class="chart-bar" data-tip="' + esc(d.label + " · " + d.value + (o.unit || "")) + '">' +
        '<rect class="chart-hit" x="' + (x - 6) + '" y="' + pad.t + '" width="' + (bw + 12) + '" height="' + ih + '"/>' +
        '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="0" rx="' + Math.min(7, bw / 3) + '" fill="' + c + '">' +
        '<animate attributeName="height" from="0" to="' + bh + '" dur=".85s" begin="' + (0.06 * i + 0.1) + 's" fill="freeze" calcMode="spline" keySplines=".22 1 .36 1" keyTimes="0;1"/>' +
        '<animate attributeName="y" from="' + (pad.t + ih) + '" to="' + y + '" dur=".85s" begin="' + (0.06 * i + 0.1) + 's" fill="freeze" calcMode="spline" keySplines=".22 1 .36 1" keyTimes="0;1"/></rect>' +
        '<text class="chart-axis" x="' + (x + bw / 2) + '" y="' + (pad.t + ih + 17) + '" text-anchor="middle">' + esc(d.label) + "</text>" +
        '<text class="chart-axis" x="' + (x + bw / 2) + '" y="' + (y - 6) + '" text-anchor="middle" style="font-weight:700;fill:var(--ttm-text)">' + d.value + "</text></g>";
    }).join("");
    return '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(o.label || "Graphique") + '">' +
      '<g class="chart-grid">' + grid + "</g>" + bars + "</svg>";
  };

  CH.hbars = function (o) {
    const data = o.data || [], max = Math.max.apply(null, data.map((d) => d.value)) || 1;
    return '<div class="stack stack-3">' + data.map((d, i) =>
      '<div class="stack stack-2">' +
      '<div class="row-between"><span class="t-caption t-secondary">' + esc(d.label) + "</span>" +
      '<span class="t-caption t-num" style="font-weight:700">' + d.value + (o.unit || "") + "</span></div>" +
      '<div class="bar ' + (d.cls || "") + '"><div class="bar-fill" data-w="' + ((d.value / max) * 100).toFixed(1) + '" style="background:' + (d.color ? "linear-gradient(90deg," + d.color + ")" : "") + '"></div></div></div>'
    ).join("") + "</div>";
  };

  CH.donut = function (o) {
    const data = o.data || [];
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const size = o.size || 200, r = size / 2 - 14, cx = size / 2, cy = size / 2, C = 2 * Math.PI * r;
    let acc = 0;
    const segs = data.map((d, i) => {
      const frac = d.value / total, off = acc * C;
      acc += frac;
      return '<circle class="chart-bar" cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + d.color + '" stroke-width="' + (o.thickness || 20) + '" stroke-dasharray="' + (frac * C).toFixed(2) + " " + C + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 ' + cx + " " + cy + ')"><title>' + esc(d.label + " " + d.value) + "</title>" +
        '<animate attributeName="stroke-dasharray" from="0 ' + C + '" to="' + (frac * C).toFixed(2) + " " + C + '" dur=".9s" begin="' + (0.1 * i) + 's" fill="freeze"/></circle>';
    }).join("");
    return '<div style="position:relative;width:' + size + "px;height:" + size + 'px;flex:none">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" role="img" aria-label="' + esc(o.label || "Répartition") + '">' + segs + "</svg>" +
      '<div style="position:absolute;inset:0;display:grid;place-content:center;text-align:center">' +
      '<div style="font-size:' + (o.centerSize || 30) + 'px;font-weight:800;letter-spacing:-.04em" class="t-num">' + (o.center != null ? o.center : total) + "</div>" +
      (o.centerLabel ? '<div class="t-micro t-muted">' + esc(o.centerLabel) + "</div>" : "") + "</div></div>";
  };

  CH.progress = function (o) {
    return '<div class="stack stack-2"><div class="row-between"><span class="t-caption t-secondary">' + esc(o.label) + "</span>" +
      '<span class="t-caption t-num" style="font-weight:700">' + o.value + (o.max != null ? "/" + o.max : (o.unit || "")) + "</span></div>" +
      '<div class="bar ' + (o.cls || "") + '"><div class="bar-fill" data-w="' + (((o.max ? o.value / o.max : o.value / 100)) * 100).toFixed(1) + '"></div></div></div>';
  };

  TTM.charts = CH;
  TTM.animBars = function (root) {
    TTM.$$(".bar-fill[data-w]", root || document).forEach((b) => { if (!b.dataset.done) { b.dataset.done = "1"; requestAnimationFrame(() => (b.style.width = b.dataset.w + "%")); } });
  };

  /* ==========================================================
     13. MISC
     ========================================================== */
  TTM.hydrateIcons = function (root) {
    TTM.$$("[data-icon]", root).forEach((el) => {
      if (el.firstChild) return;
      const n = el.getAttribute("data-icon");
      el.innerHTML = TTM.icon(n, parseInt(el.getAttribute("data-size") || "20", 10), el.getAttribute("data-icon-cls") || "");
    });
  };

  TTM.init = function () {
    TTM.theme.init();
    TTM.theme.set(TTM.theme.get());
    TTM.hydrateIcons();
    TTM.initReveal();
    TTM.initCompat();
    TTM.countAll();
    TTM.animBars();
  };
  document.addEventListener("DOMContentLoaded", TTM.init);
})(window);
