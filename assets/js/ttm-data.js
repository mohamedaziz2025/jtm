/* ============================================================
   TTM — Données de démonstration (France)
   Clubs, équipes, coachs, matchs, tournois, conversations,
   notifications, activité, statistiques.
   Jeu de données synthétique utilisé pour la démonstration
   commerciale du prototype.
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- 1. CLUBS ---------- */
  /* cat-richesse : niveau de Ecosystem TTM (nombre de matchs publiés) */
  const CLUBS = [
    { id: "courbevoie", name: "AS Courbevoie", short: "CBE", city: "Courbevoie", dept: "Hauts-de-Seine (92)",
      lat: 48.9070, lng: 2.2520, colors: ["#2563EB", "#0EA5E9"], since: 1924,
      stadium: "Stade des Quatre-Chemins", seats: 1200, president: "Karim Benali",
      desc: "Club de la proche banlieue parisienne, reconnu pour son école de football et la formation des U11 à U19." },

    { id: "montreuil", name: "FC Montreuil", short: "FCM", city: "Montreuil", dept: "Seine-Saint-Denis (93)",
      lat: 48.8630, lng: 2.4480, colors: ["#DC2626", "#7F1D1D"], since: 1919,
      stadium: "Stade Arthur Ashe", seats: 3500, president: "Nabil Chabane",
      desc: "Club historique de l'est parisien, forte tradition de club populaire et de football de qualité." },

    { id: "saintdenis", name: "US Saint-Denis", short: "USD", city: "Saint-Denis", dept: "Seine-Saint-Denis (93)",
      lat: 48.9362, lng: 2.3574, colors: ["#16A34A", "#0D9488"], since: 1908,
      stadium: "Stade Auguste Delaune", seats: 3000, president: "Farid Benamara",
      desc: "Vieux club francilien, passé par la première division et réputé pour ses centres de formation." },

    { id: "argenteuil", name: "RC Argenteuil", short: "RCA", city: "Argenteuil", dept: "Val-d'Oise (95)",
      lat: 48.9474, lng: 2.2467, colors: ["#F59E0B", "#EA580C"], since: 1931,
      stadium: "Stade du Marais", seats: 1500, president: "Jean-Marc Dupuis",
      desc: "Club historique du Val-d'Oise, très présent dans les catégories jeunes et sur les plateaux régionaux." },

    { id: "epinay", name: "FC Épinay-sur-Seine", short: "FCE", city: "Épinay-sur-Seine", dept: "Seine-Saint-Denis (93)",
      lat: 48.9558, lng: 2.3472, colors: ["#EAB308", "#111827"], since: 1936,
      stadium: "Stade de la Corniche", seats: 1200, president: "Sofiane Kaddour",
      desc: "Club de la proche banlieue nord, ambiance de quartier et vraie culture du fair-play." },

    { id: "versailles", name: "Olympique de Versailles", short: "OVB", city: "Versailles", dept: "Yvelines (78)",
      lat: 48.8014, lng: 2.1301, colors: ["#1D4ED8", "#7C3AED"], since: 1904,
      stadium: "Stade Montbauron", seats: 4000, president: "Philippe Aubert",
      desc: "Institution du football yvelines, organisation impeccable et événements de référence." },

    { id: "meaux", name: "Racing Club de Meaux", short: "RCM", city: "Meaux", dept: "Seine-et-Marne (77)",
      lat: 48.9640, lng: 2.8770, colors: ["#0891B2", "#2563EB"], since: 1945,
      stadium: "Stade Jules Ladoumègue", seats: 2000, president: "Alain Chevalier",
      desc: "Club de Brie, structuré avec une cellule administrative solide et un calendrier clair." },

    { id: "cergy", name: "FC Cergy", short: "FCC", city: "Cergy", dept: "Val-d'Oise (95)",
      lat: 49.0580, lng: 2.0760, colors: ["#0F766E", "#22C55E"], since: 1994,
      stadium: "Stade Pierre Brisson", seats: 5500, president: "Mehdi Ziani",
      desc: "Club de la ville nouvelle, très dynamique sur les catégories U13 et U15." },

    { id: "nancy", name: "AS Nancy", short: "ASN", city: "Nancy", dept: "Meurthe-et-Moselle (54)",
      lat: 48.6921, lng: 6.1844, colors: ["#EF4444", "#FB923C"], since: 1967,
      stadium: "Stade Marcel Picot", seats: 6000, president: "Lionel Weber",
      desc: "Grand club de l'Est, puissant vivier de jeunes et organisateur de tournois régionaux." },

    { id: "orleans", name: "US Orléans", short: "USO", city: "Orléans", dept: "Loiret (45)",
      lat: 47.9029, lng: 1.9093, colors: ["#7C3AED", "#2563EB"], since: 1938,
      stadium: "Stade de la Source", seats: 4000, president: "Franck Delaunay",
      desc: "Club du Loiret, régulier en championnat régional et apprécié pour son fair-play." },

    { id: "rouen", name: "FC Rouen", short: "FCR", city: "Rouen", dept: "Seine-Maritime (76)",
      lat: 49.4432, lng: 1.0999, colors: ["#DC2626", "#1F2937"], since: 1896,
      stadium: "Stade Michel-Dolo", seats: 7000, president: "Théo Lambert",
      desc: "Club normand historique, grande expérience des plateaux régionaux et des déplacements organisés." },

    { id: "nantes", name: "FC Nantes", short: "FCN", city: "Nantes", dept: "Loire-Atlantique (44)",
      lat: 47.2184, lng: -1.5536, colors: ["#FACC15", "#16A34A"], since: 1943,
      stadium: "Stade de la Beaujoire", seats: 35000, president: "Yannick Le Roux",
      desc: "Grand club de l'Ouest, réseau d'écoles de football et tournois de qualité." },

    { id: "lyon", name: "Olympique Lyonnais", short: "OL", city: "Lyon", dept: "Rhône (69)",
      lat: 45.7640, lng: 4.8357, colors: ["#2563EB", "#F8FAFC"], since: 1950,
      stadium: "Stade de Gerland", seats: 41000, president: "Olivier Mercier",
      desc: "Institution rhône-alpine, référence nationale de la formation." },

    { id: "strasbourg", name: "RC Strasbourg", short: "RCS", city: "Strasbourg", dept: "Bas-Rhin (67)",
      lat: 48.5734, lng: 7.7521, colors: ["#0EA5E9", "#1D4ED8"], since: 1906,
      stadium: "Stade de la Meinau", seats: 26000, president: "Karim Haddad",
      desc: "Club alsacien, très structuré sur la détection et la préparation de tournois." }
  ];

  /* ---------- 2. ÉQUIPES DU CLUB DÉMO (AS Courbevoie) ---------- */
  const TEAMS = [
    { id: "u11a", name: "U11 A", cat: "U11", coachId: "c1", jersey: "#22C55E", level: "Débutant", home: true },
    { id: "u11b", name: "U11 B", cat: "U11", coachId: "c2", jersey: "#16A34A", level: "Débutant", home: false },
    { id: "u13",  name: "U13",  cat: "U13", coachId: "c3", jersey: "#22D3EE", level: "Intermédiaire", home: true },
    { id: "u15a", name: "U15 A", cat: "U15", coachId: "c4", jersey: "#2563EB", level: "Avancé", home: true },
    { id: "u15b", name: "U15 B", cat: "U15", coachId: "c5", jersey: "#4F46E5", level: "Intermédiaire", home: false },
    { id: "u17",  name: "U17",  cat: "U17", coachId: "c6", jersey: "#8B5CF6", level: "Avancé", home: true },
    { id: "u19",  name: "U19",  cat: "U19", coachId: "c7", jersey: "#EC4899", level: "Éligible jeunes", home: false }
  ];

  /* ---------- 3. COACHS & STAFF ---------- */
  const COACHES = [
    { id: "c1", name: "Karim Bouzid", role: "Coach", teamId: "u11a", cat: "U11", phone: "+33 6 12 34 56 78", mail: "k.bouzid@as-courbevoie.fr", since: 2019, perms: ["calendar", "requests", "messages"] },
    { id: "c2", name: "Thomas Leroy", role: "Coach", teamId: "u11b", cat: "U11", phone: "+33 6 45 87 21 09", mail: "t.leroy@as-courbevoie.fr", since: 2021, perms: ["calendar", "requests", "messages"] },
    { id: "c3", name: "Sofia Benali", role: "Coach", teamId: "u13", cat: "U13", phone: "+33 6 78 21 45 03", mail: "s.benali@as-courbevoie.fr", since: 2017, perms: ["calendar", "requests", "messages", "roster"] },
    { id: "c4", name: "Yacine Belkacem", role: "Coach", teamId: "u15a", cat: "U15", phone: "+33 6 09 87 45 62", mail: "y.belkacem@as-courbevoie.fr", since: 2015, perms: ["calendar", "requests", "messages", "roster", "stats"] },
    { id: "c5", name: "Claire Dubois", role: "Coach", teamId: "u15b", cat: "U15", phone: "+33 6 34 56 78 90", mail: "c.dubois@as-courbevoie.fr", since: 2022, perms: ["calendar", "requests", "messages"] },
    { id: "c6", name: "Nicolas Ferrand", role: "Coach", teamId: "u17", cat: "U17", phone: "+33 6 21 43 65 87", mail: "n.ferrand@as-courbevoie.fr", since: 2018, perms: ["calendar", "requests", "messages", "roster", "stats"] },
    { id: "c7", name: "Samir Haddadi", role: "Coach", teamId: "u19", cat: "U19", phone: "+33 6 98 76 54 32", mail: "s.haddadi@as-courbevoie.fr", since: 2020, perms: ["calendar", "requests", "messages", "roster"] },
    { id: "c8", name: "Hugo Marchand", role: "Adjoint", teamId: "u15a", cat: "U15", phone: "+33 6 55 12 78 34", mail: "h.marchand@as-courbevoie.fr", since: 2023, perms: ["calendar", "requests"] }
  ];

  const USERS = [
    { id: "u1", name: "Karim Benali", role: "Président", avatar: "KB", clubId: "courbevoie" },
    { id: "u2", name: "Yacine Belkacem", role: "Coach U15 A", avatar: "YB", clubId: "courbevoie" }
  ];

  /* ---------- 4. STADES ---------- */
  const STADIUMS = [
    { id: "st1", name: "Stade des Quatre-Chemins", clubId: "courbevoie", city: "Courbevoie", lat: 48.9070, lng: 2.2520, surface: "Gazon synthétique", size: "105×68" },
    { id: "st2", name: "Stade Arthur Ashe", clubId: "montreuil", city: "Montreuil", lat: 48.8630, lng: 2.4480, surface: "Gazon naturel", size: "105×68" },
    { id: "st3", name: "Stade Auguste Delaune", clubId: "saintdenis", city: "Saint-Denis", lat: 48.9362, lng: 2.3574, surface: "Gazon naturel", size: "105×68" },
    { id: "st4", name: "Stade du Marais", clubId: "argenteuil", city: "Argenteuil", lat: 48.9474, lng: 2.2467, surface: "Gazon synthétique", size: "100×64" },
    { id: "st5", name: "Stade de la Corniche", clubId: "epinay", city: "Épinay-sur-Seine", lat: 48.9558, lng: 2.3472, surface: "Gazon synthétique", size: "100×64" },
    { id: "st6", name: "Stade Montbauron", clubId: "versailles", city: "Versailles", lat: 48.8014, lng: 2.1301, surface: "Gazon naturel", size: "105×68" },
    { id: "st7", name: "Stade Pierre Brisson", clubId: "cergy", city: "Pontoise", lat: 49.0500, lng: 2.1000, surface: "Gazon naturel", size: "105×68" }
  ];

  /* ---------- 5. MATCHS DISPONIBLES (marketplace) ----------
     level : 1 = Débutant · 2 = Intermédiaire · 3 = Avancé
     type  : friendly | league | cup | tournament
     dist  : km depuis le club de démonstration (calculé)
  */
  const AVAILABLE = [
    { id: "m101", clubId: "montreuil",  cat: "U15", date: "2026-10-03", time: "15:00", venue: "Stade Arthur Ashe", city: "Montreuil", level: 3, type: "friendly", pitch: "Gazon naturel", format: "11v11", dist: 15, note: "Match amical de préparation, accueil assuré. Parking visiteurs gratuit." },
    { id: "m102", clubId: "saintdenis", cat: "U13", date: "2026-10-03", time: "10:00", venue: "Stade Auguste Delaune", city: "Saint-Denis", level: 2, type: "league", pitch: "Gazon naturel", format: "9v9", dist: 8, note: "Championnat régional, présence obligatoire du délégué." },
    { id: "m103", clubId: "versailles", cat: "U17", date: "2026-10-03", time: "16:30", venue: "Stade Montbauron", city: "Versailles", level: 3, type: "cup", pitch: "Gazon naturel", format: "11v11", dist: 15, note: "1/8e de finale régionale." },
    { id: "m104", clubId: "epinay",    cat: "U15", date: "2026-10-03", time: "11:00", venue: "Stade de la Corniche", city: "Épinay-sur-Seine", level: 2, type: "friendly", pitch: "Gazon synthétique", format: "11v11", dist: 9, note: "Terrain en excellent état, parking à l'arrière du stade." },
    { id: "m105", clubId: "argenteuil", cat: "U11", date: "2026-10-04", time: "09:30", venue: "Stade du Marais", city: "Argenteuil", level: 1, type: "friendly", pitch: "Gazon synthétique", format: "7v7", dist: 5, note: "Première confrontation, format 7 contre 7." },
    { id: "m106", clubId: "saintdenis", cat: "U15", date: "2026-10-10", time: "15:00", venue: "Stade Auguste Delaune", city: "Saint-Denis", level: 3, type: "league", pitch: "Gazon naturel", format: "11v11", dist: 8, note: "3e journée du championnat départemental." },
    { id: "m107", clubId: "epinay",    cat: "U13", date: "2026-10-04", time: "14:00", venue: "Stade de la Corniche", city: "Épinay-sur-Seine", level: 2, type: "friendly", pitch: "Gazon synthétique", format: "9v9", dist: 9, note: "Recherche d'un adversaire de niveau régulier." },
    { id: "m108", clubId: "versailles",cat: "U17", date: "2026-10-10", time: "17:00", venue: "Stade Montbauron", city: "Versailles", level: 3, type: "cup", pitch: "Gazon naturel", format: "11v11", dist: 15, note: "Match de coupe, tenue du club obligatoire." },
    { id: "m109", clubId: "argenteuil", cat: "U11", date: "2026-10-04", time: "10:30", venue: "Stade du Marais", city: "Argenteuil", level: 1, type: "friendly", pitch: "Gazon synthétique", format: "7v7", dist: 5, note: "Initiation, deux mi-temps de 20 minutes." },
    { id: "m110", clubId: "montreuil",  cat: "U13", date: "2026-10-04", time: "16:00", venue: "Stade Arthur Ashe", city: "Montreuil", level: 2, type: "league", pitch: "Gazon naturel", format: "9v9", dist: 15, note: "Championnat régional, phase 1." },
    { id: "m111", clubId: "saintdenis", cat: "U15", date: "2026-10-10", time: "14:00", venue: "Stade Auguste Delaune", city: "Saint-Denis", level: 2, type: "friendly", pitch: "Gazon naturel", format: "11v11", dist: 8, note: "Amical long format, deux périodes de 30 minutes." },
    { id: "m112", clubId: "epinay",    cat: "U13", date: "2026-10-10", time: "11:00", venue: "Stade de la Corniche", city: "Épinay-sur-Seine", level: 2, type: "friendly", pitch: "Gazon synthétique", format: "9v9", dist: 9, note: "Accueil décontracté, terrain impeccable." },
    { id: "m113", clubId: "cergy",     cat: "U17", date: "2026-10-17", time: "16:00", venue: "Stade Pierre Brisson", city: "Pontoise", level: 3, type: "friendly", pitch: "Gazon naturel", format: "11v11", dist: 21, note: "Plateau de 6 clubs, 3 matchs, arbitrage partagé." },
    { id: "m114", clubId: "montreuil",  cat: "U15", date: "2026-10-10", time: "09:00", venue: "Stade Arthur Ashe", city: "Montreuil", level: 2, type: "friendly", pitch: "Gazon naturel", format: "11v11", dist: 15, note: "Matinée, covoiturage possible depuis Paris." },
    { id: "m115", clubId: "epinay",    cat: "U11", date: "2026-10-11", time: "09:00", venue: "Stade de la Corniche", city: "Épinay-sur-Seine", level: 1, type: "friendly", pitch: "Gazon synthétique", format: "7v7", dist: 9, note: "Très décontracté, idéal pour une première confrontation." },
    { id: "m116", clubId: "saintdenis", cat: "U13", date: "2026-10-17", time: "15:00", venue: "Stade Auguste Delaune", city: "Saint-Denis", level: 2, type: "league", pitch: "Gazon naturel", format: "9v9", dist: 8, note: "Championnat régional, arbitre fourni par le club." },
    { id: "m117", clubId: "montreuil",  cat: "U17", date: "2026-10-18", time: "15:30", venue: "Stade Arthur Ashe", city: "Montreuil", level: 3, type: "cup", pitch: "Gazon naturel", format: "11v11", dist: 15, note: "Coupe régionale, quart de finale." },
    { id: "m118", clubId: "versailles",cat: "U15", date: "2026-10-24", time: "15:00", venue: "Stade Montbauron", city: "Versailles", level: 3, type: "league", pitch: "Gazon naturel", format: "11v11", dist: 15, note: "Championnat, 4e journée." },
    { id: "m119", clubId: "saintdenis", cat: "U11", date: "2026-10-25", time: "10:00", venue: "Stade Auguste Delaune", city: "Saint-Denis", level: 1, type: "friendly", pitch: "Gazon synthétique", format: "7v7", dist: 8, note: "Plateau de 6 clubs toute la matinée." },
    { id: "m120", clubId: "meaux",     cat: "U15", date: "2026-10-24", time: "14:30", venue: "Stade Jules Ladoumègue", city: "Meaux", level: 3, type: "cup", pitch: "Gazon naturel", format: "11v11", dist: 46, note: "Coupe départementale, déplacement en covoiturage." },
    { id: "m121", clubId: "cergy",     cat: "U13", date: "2026-10-18", time: "10:00", venue: "Stade Pierre Brisson", city: "Pontoise", level: 2, type: "friendly", pitch: "Gazon naturel", format: "9v9", dist: 21, note: "Recherche un club de même niveau." },
    { id: "m122", clubId: "argenteuil", cat: "U11", date: "2026-10-25", time: "09:30", venue: "Stade du Marais", city: "Argenteuil", level: 1, type: "friendly", pitch: "Gazon synthétique", format: "7v7", dist: 5, note: "Matinée détente, trois rencontres." },
    { id: "m123", clubId: "epinay",    cat: "U15", date: "2026-10-18", time: "16:00", venue: "Stade de la Corniche", city: "Épinay-sur-Seine", level: 2, type: "cup", pitch: "Gazon synthétique", format: "11v11", dist: 9, note: "1/4 de finale régionale." },
    { id: "m124", clubId: "cergy",     cat: "U15", date: "2026-10-31", time: "15:00", venue: "Stade Pierre Brisson", city: "Pontoise", level: 3, type: "league", pitch: "Gazon naturel", format: "11v11", dist: 21, note: "Championnat régional élite." },
    { id: "m125", clubId: "rouen",     cat: "U15", date: "2026-10-11", time: "15:00", venue: "Stade Michel-Dolo", city: "Rouen", level: 3, type: "friendly", pitch: "Gazon naturel", format: "11v11", dist: 103, note: "Amical longue distance, budget transport à organiser." },
    { id: "m126", clubId: "orleans",   cat: "U13", date: "2026-10-11", time: "14:00", venue: "Stade de la Source", city: "Orléans", level: 2, type: "friendly", pitch: "Gazon naturel", format: "9v9", dist: 115, note: "Départ 7h30, organisation du covoiturage à discuter." }
  ];

  /* ---------- 6. MATCHS DE MON CLUB (calendrier) ---------- */
  const MY_MATCHES = [
    { id: "my1", opp: "FC Montreuil",       oppId: "montreuil",  teamId: "u15a", cat: "U15", date: "2026-10-03", time: "15:00", venue: "Stade des Quatre-Chemins", city: "Courbevoie", type: "league",   status: "confirmed", home: true,  result: null },
    { id: "my2", opp: "FC Épinay-sur-Seine", oppId: "epinay",    teamId: "u13",  cat: "U13", date: "2026-10-03", time: "16:00", venue: "Stade de la Corniche", city: "Épinay-sur-Seine", type: "friendly", status: "confirmed", home: false, result: null },
    { id: "my3", opp: "Olympique de Versailles", oppId: "versailles", teamId: "u17", cat: "U17", date: "2026-10-10", time: "17:00", venue: "Stade des Quatre-Chemins", city: "Courbevoie", type: "cup", status: "confirmed", home: true, result: null },
    { id: "my4", opp: "US Saint-Denis",     oppId: "saintdenis", teamId: "u15a", cat: "U15", date: "2026-10-10", time: "15:00", venue: "Stade Auguste Delaune", city: "Saint-Denis", type: "league", status: "confirmed", home: false, result: null },
    { id: "my5", opp: "RC Argenteuil",      oppId: "argenteuil", teamId: "u11a", cat: "U11", date: "2026-10-04", time: "09:30", venue: "Stade du Marais", city: "Argenteuil", type: "friendly", status: "pending", home: false, result: null },
    { id: "my6", opp: "FC Cergy",           oppId: "cergy",     teamId: "u17",  cat: "U17", date: "2026-09-20", time: "16:00", venue: "Stade Pierre Brisson", city: "Pontoise", type: "league", status: "played", home: false, result: "1-3" },
    { id: "my7", opp: "US Saint-Denis",     oppId: "saintdenis", teamId: "u13",  cat: "U13", date: "2026-09-13", time: "14:00", venue: "Stade des Quatre-Chemins", city: "Courbevoie", type: "friendly", status: "played", home: true, result: "3-2" }
  ];

  /* ---------- 7. DEMANDES DE MATCH ---------- */
  const REQUESTS = [
    { id: "r1", matchId: "m101", from: "courbevoie", to: "montreuil", teamId: "u15a", cat: "U15", date: "2026-10-03", status: "pending", sent: "2026-09-25T18:12:00",
      msg: "Bonjour, nous serions ravis de disputer ce match. Notre U15 A est disponible à 15h00 et dispose d'un arbitre. Nous fournissons les licences." },
    { id: "r2", matchId: "m105", from: "argenteuil", to: "courbevoie", teamId: "u11a", cat: "U11", date: "2026-10-04", status: "accepted", sent: "2026-09-24T09:40:00",
      msg: "Bonjour, seriez-vous disponibles le 4 octobre à 9h30 ? Nous cherchons un club de niveau similaire." },
    { id: "r3", matchId: "m107", from: "epinay", to: "courbevoie", teamId: "u13", cat: "U13", date: "2026-10-04", status: "pending", sent: "2026-09-26T08:05:00",
      msg: "Match amical U13, nous cherchons un adversaire régulier sur la saison." },
    { id: "r4", matchId: "m114", from: "montreuil", to: "courbevoie", teamId: "u15a", cat: "U15", date: "2026-10-10", status: "accepted", sent: "2026-09-22T16:30:00",
      msg: "Bonjour, disponible côté U15 le 10 octobre à 9h00. Confirmez-nous le nombre de joueurs." },
    { id: "r5", matchId: "m110", from: "courbevoie", to: "montreuil", teamId: "u13", cat: "U13", date: "2026-10-04", status: "declined", sent: "2026-09-24T11:15:00",
      msg: "Demande de rencontre pour notre U13, format 9 contre 9." },
    { id: "r6", matchId: "m119", from: "courbevoie", to: "saintdenis", teamId: "u11a", cat: "U11", date: "2026-10-25", status: "pending", sent: "2026-09-26T20:02:00",
      msg: "Bonjour, avez-vous de la place pour notre U11 A lors du plateau du 25 octobre ? Merci." }
  ];

  /* ---------- 8. TOURNOIS ---------- */
  const TOURNAMENTS = [
    { id: "t1", name: "Tournoi U11 — Coupe du Printemps", orgId: "argenteuil", cat: "U11", date: "2026-10-04", endDate: "2026-10-04", venue: "Stade du Marais", city: "Argenteuil", teams: 12, maxTeams: 12, slots: 2, level: 1, format: "7v7", prize: "Trophée + ballons", fee: false, dist: 5, age: "6-7 ans" },
    { id: "t2", name: "Challenge Young Paris U13", orgId: "saintdenis", cat: "U13", date: "2026-10-11", endDate: "2026-10-11", venue: "Stade Auguste Delaune", city: "Saint-Denis", teams: 16, maxTeams: 16, slots: 6, level: 2, format: "9v9", prize: "3 trophées + tenues", fee: false, dist: 8, age: "8-9 ans" },
    { id: "t3", name: "Coupe Régionale U15", orgId: "montreuil", cat: "U15", date: "2026-10-18", endDate: "2026-10-25", venue: "Stade Arthur Ashe", city: "Montreuil", teams: 16, maxTeams: 16, slots: 4, level: 3, format: "11v11", prize: "Coupe + qualification", fee: true, dist: 15, age: "10-11 ans" },
    { id: "t4", name: "Festival des Petits Clubs", orgId: "epinay", cat: "U11", date: "2026-10-25", endDate: "2026-10-25", venue: "Stade de la Corniche", city: "Épinay-sur-Seine", teams: 8, maxTeams: 8, slots: 1, level: 1, format: "7v7", prize: "Médailles + kits", fee: false, dist: 9, age: "6-7 ans" },
    { id: "t5", name: "Tournoi U17 Élite", orgId: "versailles", cat: "U17", date: "2026-11-07", endDate: "2026-11-08", venue: "Stade Montbauron", city: "Versailles", teams: 8, maxTeams: 8, slots: 2, level: 3, format: "11v11", prize: "Trophée + frais de déplacement", fee: true, dist: 15, age: "12-13 ans" },
    { id: "t6", name: "Festival du Val-d'Oise", orgId: "cergy", cat: "U11", date: "2026-11-14", endDate: "2026-11-14", venue: "Stade Pierre Brisson", city: "Pontoise", teams: 10, maxTeams: 12, slots: 2, level: 1, format: "7v7", prize: "Médailles + bons d'achat", fee: false, dist: 21, age: "6-7 ans" }
  ];

  /* ---------- 9. PRÉFÉRENCES PAR ÉQUIPE ---------- */
  const PREFS = {
    u11a: { maxDist: 20, days: ["samedi", "dimanche"], timeFrom: "08:00", timeTo: "12:00", levels: [1, 2], formats: ["7v7", "9v9"], notify: true },
    u11b: { maxDist: 15, days: ["samedi"], timeFrom: "09:00", timeTo: "12:00", levels: [1], formats: ["7v7"], notify: true },
    u13:  { maxDist: 30, days: ["samedi", "dimanche"], timeFrom: "09:00", timeTo: "17:00", levels: [2, 3], formats: ["9v9", "11v11"], notify: true },
    u15a: { maxDist: 45, days: ["samedi", "dimanche"], timeFrom: "14:00", timeTo: "18:00", levels: [2, 3], formats: ["11v11"], notify: true },
    u15b: { maxDist: 35, days: ["samedi"], timeFrom: "10:00", timeTo: "17:00", levels: [2], formats: ["11v11"], notify: true },
    u17:  { maxDist: 60, days: ["samedi", "dimanche"], timeFrom: "15:00", timeTo: "19:00", levels: [3], formats: ["11v11"], notify: true },
    u19:  { maxDist: 80, days: ["dimanche"], timeFrom: "10:00", timeTo: "16:00", levels: [2, 3], formats: ["11v11"], notify: false }
  };

  /* ---------- 10. CONVERSATIONS ---------- */
  const THREADS = [
    {
      id: "s1", clubId: "montreuil", unread: 2, online: true, updated: "2026-09-26T19:42:00",
      messages: [
        { me: false, text: "Bonjour, nous avons bien reçu votre demande pour le match U15 de samedi.", t: "18:52" },
        { me: false, text: "Nous confirmons le créneau 15h00 au stade Arthur Ashe si cela vous convient.", t: "18:53" },
        { me: true, text: "Parfait, c'est noté de notre côté. Le car de nos U15 arrivera vers 14h15.", t: "19:04" },
        { me: false, text: "Très bien, l'arbitre adverse sera prévenu. Notre gardien sera disponible dès 14h00.", t: "19:10" },
        { me: false, text: "Pouvez-vous nous confirmer les licences de vos joueurs ?", t: "19:41" },
        { me: false, text: "Il nous manque le document de l'ailier droit.", t: "19:42" }
      ]
    },
    {
      id: "s2", clubId: "argenteuil", unread: 0, online: false, updated: "2026-09-26T10:05:00",
      messages: [
        { me: false, text: "Bonjour, avez-vous de la place pour votre U11 le 4 octobre ?", t: "09:20" },
        { me: true, text: "Bonjour, oui pour le 4 octobre à 9h30. Nous envoyons la liste des joueurs demain.", t: "09:48" },
        { me: false, text: "Impeccable, à dimanche !", t: "10:05" }
      ]
    },
    {
      id: "s3", clubId: "saintdenis", unread: 1, online: true, updated: "2026-09-25T17:20:00",
      messages: [
        { me: true, text: "Bonjour, souhaitez-vous une place pour votre U11 au Challenge Young Paris du 11 octobre ?", t: "16:44" },
        { me: false, text: "Bonjour, il nous reste 6 places.", t: "17:12" },
        { me: false, text: "Confirmation attendue avant le 30 septembre.", t: "17:20" }
      ]
    },
    {
      id: "s4", clubId: "cergy", unread: 0, online: false, updated: "2026-09-24T12:31:00",
      messages: [
        { me: true, text: "Merci pour le match, bon retour !", t: "12:28" },
        { me: false, text: "Avec plaisir, à très vite.", t: "12:31" }
      ]
    },
    {
      id: "s5", clubId: "epinay", unread: 0, online: false, updated: "2026-09-22T15:12:00",
      messages: [
        { me: false, text: "On maintient la rencontre du 3 octobre ?", t: "15:02" },
        { me: true, text: "Oui, confirmé chez nous. 16h00, terrain principal.", t: "15:12" }
      ]
    }
  ];

  /* ---------- 11. NOTIFICATIONS ---------- */
  const NOTIFICATIONS = [
    { id: "n1", type: "match_offer",     level: "urgent",    title: "Un match U15 à 15 km correspond à vos préférences",
      body: "FC Montreuil cherche un adversaire U15 samedi 3 octobre à 15h00. 92% compatible.", t: "il y a 12 min", read: false, link: "match/m101" },
    { id: "n2", type: "request_accepted",level: "success",   title: "RC Argenteuil a accepté votre demande",
      body: "Match U11 du 4 octobre à 9h30 confirmé. Ajouté à vos calendriers.", t: "il y a 1 h", read: false, link: "calendar" },
    { id: "n3", type: "tournament",     level: "important", title: "Un tournoi U11 vient d'être publié",
      body: "Festival des Petits Clubs — 25 octobre, 8 équipes, 1 place restante.", t: "il y a 2 h", read: false, link: "tournaments" },
    { id: "n4", type: "new_message",    level: "info",      title: "Nouveau message de FC Montreuil",
      body: "« Pouvez-vous nous confirmer les licences de vos joueurs ? »", t: "il y a 2 h", read: false, link: "messages" },
    { id: "n5", type: "time_change",    level: "important", title: "Modification d'horaire",
      body: "Match U17 vs Olympique de Versailles décalé au 10 octobre à 17h00.", t: "hier", read: true, link: "calendar" },
    { id: "n6", type: "request_received",level: "info",     title: "Nouvelle demande de match",
      body: "FC Épinay-sur-Seine demande une rencontre U13 le 4 octobre.", t: "hier", read: true, link: "requests" },
    { id: "n7", type: "request_declined",level: "info",     title: "Demande refusée",
      body: "FC Montreuil n'est pas disponible le 4 octobre à 16h00.", t: "hier", read: true, link: "requests" },
    { id: "n8", type: "location_change",level: "important", title: "Modification de lieu",
      body: "Match U15 vs US Saint-Denis : terrain principal indisponible.", t: "il y a 2 j", read: true, link: "calendar" },
    { id: "n9", type: "convocation",    level: "info",      title: "Convocation — 7 joueurs",
      body: "Convocations envoyées pour U15 A vs FC Montreuil (samedi 15h00).", t: "il y a 2 j", read: true, link: "calendar" }
  ];

  /* ---------- 12. ACTIVITÉ RÉCENTE ---------- */
  const ACTIVITY = [
    { icon: "checkCircle", cls: "ok",   text: "RC Argenteuil a accepté votre demande U11 pour le 4 octobre", time: "il y a 1 h" },
    { icon: "send",        cls: "brand",text: "Demande envoyée à FC Montreuil pour le match U15 du 3 octobre", time: "il y a 3 h" },
    { icon: "trophy",      cls: "warn", text: "Nouveau tournoi U13 publié par la US Saint-Denis", time: "il y a 5 h" },
    { icon: "users",       cls: "brand",text: "Yacine Belkacem a convoqué 7 joueurs pour samedi", time: "hier" },
    { icon: "message",     cls: "",     text: "2 nouveaux messages de FC Montreuil", time: "hier" }
  ];

  /* ---------- 13. STATISTIQUES ---------- */
  const STATS = {
    kpi: {
      available: 24, teams: 7, requests: 6, notifications: 4,
      matchesPlayed: 38, winRate: 68, avgDist: 12.6, confirmRate: 84, timeSaved: 7.5
    },
    activity12w: [4, 6, 5, 9, 7, 12, 10, 14, 11, 16, 13, 19],
    byCat: [
      { label: "U11", value: 14, color: "#22C55E" },
      { label: "U13", value: 11, color: "#22D3EE" },
      { label: "U15", value: 19, color: "#2563EB" },
      { label: "U17", value: 9,  color: "#8B5CF6" },
      { label: "U19", value: 4,  color: "#EC4899" }
    ],
    distBuckets: [
      { label: "0-5 km", value: 6 },
      { label: "5-10 km", value: 9 },
      { label: "10-20 km", value: 15 },
      { label: "20-40 km", value: 8 },
      { label: "40 km +", value: 3 }
    ],
    requestsFunnel: [
      { label: "Matchs vus", value: 148 },
      { label: "Demandes envoyées", value: 61 },
      { label: "Réponses reçues", value: 44 },
      { label: "Matchs confirmés", value: 37 }
    ],
    monthly: [12, 18, 15, 24, 21, 29, 27, 33, 30, 38, 41, 47]
  };

  /* ---------- 14. ÉTAPES DU WORKFLOW ---------- */
  const WORKFLOW = ["Demande envoyée", "Club notifié", "Club répond", "Match confirmé"];

  /* ---------- 15. ACTIVITÉ DES CLUBS (annuaire) ---------- */
  const CLUB_EXTRA = {
    courbevoie:  { matches: 38, teams: 7,  tournaments: 2, rating: 4.6, members: 210, founded: 1924, verified: true,  trend: "+18%" },
    montreuil:   { matches: 74, teams: 11, tournaments: 5, rating: 4.7, members: 480, founded: 1919, verified: true,  trend: "+24%" },
    saintdenis:  { matches: 62, teams: 9,  tournaments: 4, rating: 4.5, members: 390, founded: 1908, verified: true,  trend: "+21%" },
    argenteuil:  { matches: 41, teams: 6,  tournaments: 2, rating: 4.2, members: 240, founded: 1931, verified: true,  trend: "+9%" },
    epinay:      { matches: 33, teams: 5,  tournaments: 3, rating: 4.3, members: 180, founded: 1936, verified: true,  trend: "+12%" },
    versailles:  { matches: 89, teams: 13, tournaments: 7, rating: 4.8, members: 620, founded: 1904, verified: true,  trend: "+31%" },
    meaux:       { matches: 28, teams: 4,  tournaments: 1, rating: 4.1, members: 150, founded: 1945, verified: false, trend: "+5%" },
    cergy:       { matches: 58, teams: 8,  tournaments: 4, rating: 4.4, members: 350, founded: 1994, verified: true,  trend: "+15%" },
    nancy:       { matches: 95, teams: 12, tournaments: 6, rating: 4.7, members: 700, founded: 1967, verified: true,  trend: "+27%" },
    orleans:     { matches: 41, teams: 6,  tournaments: 2, rating: 4.2, members: 260, founded: 1938, verified: true,  trend: "+10%" },
    rouen:       { matches: 78, teams: 11, tournaments: 5, rating: 4.6, members: 520, founded: 1896, verified: true,  trend: "+22%" },
    nantes:      { matches: 104, teams: 14, tournaments: 6, rating: 4.8, members: 820, founded: 1943, verified: true,  trend: "+29%" },
    lyon:        { matches: 132, teams: 16, tournaments: 8, rating: 4.9, members: 1200, founded: 1950, verified: true, trend: "+35%" },
    strasbourg:  { matches: 86, teams: 12, tournaments: 6, rating: 4.6, members: 640, founded: 1906, verified: true,  trend: "+25%" }
  };

  /* ---------- Exports ---------- */
  global.TTM_DATA = {
    CLUBS, TEAMS, COACHES, USERS, STADIUMS, AVAILABLE, MY_MATCHES,
    REQUESTS, TOURNAMENTS, PREFS, THREADS, NOTIFICATIONS, ACTIVITY,
    STATS, WORKFLOW, CLUB_EXTRA,
    club: (id) => CLUBS.find((c) => c.id === id),
    team: (id) => TEAMS.find((t) => t.id === id),
    coach: (id) => COACHES.find((c) => c.id === id),
    match: (id) => AVAILABLE.find((m) => m.id === id),
    byCat: (cat) => AVAILABLE.filter((m) => m.cat === cat)
  };
})(window);
