/* TTM — Landing page (contenu dynamique + interactions) */
(function () {
  "use strict";
  const TTM = window.TTM;
  const E = TTM.esc;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [].slice.call((r || document).querySelectorAll(s));

  const CRITERIA = [
    { n: "Distance", w: 20, d: "Rayon club → stade, en kilomètres" },
    { n: "Créneau", w: 18, d: "Jour et heure d'indisponibilité" },
    { n: "Format", w: 16, d: "7v7, 9v9 ou 11v11" },
    { n: "Niveau", w: 15, d: "Débutant, intermédiaire, avancé" },
    { n: "Surface", w: 12, d: "Gazon naturel ou synthétique" },
    { n: "Type", w: 10, d: "Amical, championnat, coupe" },
    { n: "Fiabilité", w: 9, d: "Licences, encadrement, club vérifié" }
  ];

  const STEPS = [
    { t: "L'équipe publie ses préférences", d: "Rayon, jours, créneaux, formats, niveaux et surfaces souhaités." },
    { t: "TTM calcule les correspondances", d: "Chaque match disponible reçoit un score de 0 à 100 %, critère par critère." },
    { t: "La demande part en un clic", d: "Notification push, e-mail et SMS au club, avec relance automatique à 48 h." },
    { t: "Le match est confirmé", d: "Ajout au calendrier, convocations envoyées, module Parents mis à jour." }
  ];

  const FEATURES = [
    ["Moteur de compatibilité", "Score explicable sur 7 critères pondérés, recalculé à chaque publication."],
    ["Marketplace de matchs", "Filtres par catégorie, distance, créneau, surface, niveau et type de rencontre."],
    ["Workflow de demande", "Envoi, notification, réponse, confirmation : chaque étape est visible et tracée."],
    ["Calendrier club", "Vue mensuelle, liste des matchs confirmés, demandes en cours et résultats."],
    ["Convocations", "Liste des joueurs, confirmation de présence et envoi SMS/e-mail aux parents."],
    ["Module Parents", "Vue lecture seule : agenda, convocations, licences et itineraires."],
    ["Messagerie club", "Échanges liés aux matchs, aux convocations et aux documents, sans quitter la plateforme."],
    ["Statistiques", "Taux de confirmation, distances parcourues, volume de matchs et efficacité du moteur."],
    ["Carte du réseau", "14 clubs, 7 stades référencés, regroupés par ville et filtres par catégorie."]
  ];

  const PLANS = [
    { n: "Essentiel", t: "Pour un club qui cherche ses matchs", f: ["Jusqu'à 2 équipes", "Demandes illimitées", "Calendrier partagé", "Notifications e-mail"], best: false },
    { n: "Pro Club", t: "Pour les clubs structurés", f: ["Équipes illimitées", "Moteur prioritaire", "Tableau de bord et statistiques", "Comptes coachs et adjoints", "Module Parents (lecture)", "Support prioritaire"], best: true },
    { n: "Réseau", t: "Pour les structures multi-clubs", f: ["Multi-clubs et licences", "Marque blanche et API", "Pilotage inter-clubs", "Arbitrage et tournois", "Accompagnement dédié"], best: false }
  ];

  const QUOTES = [
    { n: "Karim Benali", r: "Président · AS Courbevoie", i: "shield" },
    { n: "Sophie Nguyen", r: "Coach U15 · FC Montreuil", i: "coach" },
    { n: "Marc Delcourt", r: "Directeur sportif · US Saint-Denis", i: "whistle" }
  ];

  const FAQ = [
    ["Comment est calculé le score de compatibilité ?", "Chaque équipe renseigne ses préférences (rayon, jours, créneaux, formats, niveaux, surfaces, type de rencontre). Pour chaque match disponible, TTM compare ces critères et pondère chaque écart : plus l'écart est faible, plus le score est élevé. Le détail du calcul est affiché sous chaque match."],
    ["Que se passe-t-il après l'envoi d'une demande ?", "Le club reçoit une notification push, e-mail et SMS. La demande apparaît dans son espace avec le message joint. Une relance automatique est programmée à 48 h. En cas d'acceptation, le match est ajouté au calendrier et les convocations peuvent être envoyées."],
    ["Les parents ont-ils accès à l'application ?", "Oui, via le module Parents en lecture seule : agenda de l'équipe, convocations, confirmations de présence, licences à jour et itinéraire du stade. Les parents n'accèdent jamais aux autres conversations ni aux données des autres joueurs."],
    ["Les données sont-elles hébergées en France ?", "Le prototype présente une architecture prévue pour une hébergement en France (RGPD), avec hébergement des données en France et chiffrement des échanges. Aucune donnée réelle n'est utilisée dans cette démonstration."],
    ["Quels clubs sont concernés ?", "Le jeu de démonstration repose sur 14 clubs d'Île-de-France et d'autres régions françaises, avec 7 équipes, 8 coachs, 26 matchs disponibles et 6 tournois. Les clubs réels pourront rejoindre le réseau progressivement."],
    ["Comment le club est-il tarifé ?", "Aucun prix n'est affiché : chaque offre est chiffrée sur devis selon le nombre d'équipes, de coachs, de stades et de tournois organisés. Trois paliers sont proposés : Essentiel, Pro Club et Réseau."]
  ];

  const CLUBS = ["AS Courbevoie", "FC Montreuil", "US Saint-Denis", "RC Argenteuil", "FC Épinay-sur-Seine", "Olympique de Versailles", "Racing Club de Meaux", "FC Cergy", "AS Nancy", "US Orléans", "FC Rouen", "FC Nantes", "Olympique Lyonnais", "RC Strasbourg"];

  function build() {
    $("#lpClubs").innerHTML = CLUBS.map((c) => '<span class="lp-club-pill"><i></i>' + E(c) + "</span>").join("");

    $("#lpCrit").innerHTML = CRITERIA.map((c) =>
      '<article class="lp-crit-item"><div class="lp-crit-top"><b class="t-body-sm">' + E(c.n) + '</b><span class="lp-crit-w">poids ' + c.w + " %</span></div>" +
      '<div class="lp-crit-bar"><i style="width:' + c.w * 4 + '%"></i></div>' +
      '<span class="t-micro t-muted">' + E(c.d) + "</span></article>").join("");

    $("#lpSteps").innerHTML = STEPS.map((s, i) =>
      '<li class="lp-step"><span class="lp-step-n">' + (i + 1) + "</span><b class=\"t-body-sm\">" + E(s.t) + '</b><span class="t-caption t-secondary">' + E(s.d) + "</span></li>").join("");

    $("#lpFeatures").innerHTML = FEATURES.map((f) =>
      "<li>" + TTM.icon("checkCircle", 15) + "<span><b>" + E(f[0]) + "</b> — " + E(f[1]) + "</span></li>").join("");

    $("#lpPlans").innerHTML = PLANS.map((p) =>
      '<article class="card card-pad lp-plan ' + (p.best ? "is-best" : "") + '">' +
      (p.best ? '<span class="lp-plan-off">RECOMMANDÉ</span>' : "") +
      "<div><b class=\"t-h4\">" + E(p.n) + '</b><div class="t-caption t-secondary" style="margin-top:4px">' + E(p.t) + "</div></div>" +
      '<div class="stat-strip"><b>Sur devis</b><span class="t-micro t-muted">selon le nombre d\'équipes</span></div>' +
      '<div class="lp-plan-feat-list lp-plan-feats">' + p.f.map((x) => '<div class="lp-plan-feat">' + TTM.icon("check", 14) + "<span>" + E(x) + "</span></div>").join("") + "</div>" +
      '<a class="btn ' + (p.best ? "btn-primary" : "btn-outline") + ' btn-block" href="#contact">Demander un devis</a></article>').join("");

    $("#lpQuotes").innerHTML = QUOTES.map((q, i) =>
      '<article class="card card-pad lp-quote"><div class="row-2" style="gap:10px">' + TTM.avatar(q.n, "avatar-sm", i) +
      "<div><b class=\"t-body-sm\">" + E(q.n) + '</b><div class="t-micro t-muted">' + E(q.r) + "</div></div></div>" +
      "<p>" + E([
        "« En une saison, nous avons doublé le nombre de matchs U15. Le moteur nous propose des adversaires à 15 km, au bon créneau, avec les bonnes licences. »",
        "« Les parents sont informés immédiatement, et je ne perds plus une demi-heure à relancer des licenciés par SMS la veille d'un match. »",
        "« Nous avons intégré trois clubs voisins en un trimestre. La demande part en deux clics, la réponse arrive le jour même. »"
      ][i]) + "</p>" +
      '<span class="badge badge-warning">Exemple fictif</span></article>').join("");

    $("#lpFaq").innerHTML = FAQ.map((f, i) =>
      '<div class="lp-faq-item ' + (i === 0 ? "is-open" : "") + '"><button class="lp-faq-q">' + E(f[0]) + TTM.icon("chevronDown", 16) + "</button>" +
      '<div class="lp-faq-a"><p>' + E(f[1]) + "</p></div></div>").join("");
  }

  function bind() {
    const nav = $("#lpNav");
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    document.addEventListener("click", function (e) {
      const q = e.target.closest(".lp-faq-q");
      if (q) {
        const item = q.parentElement;
        const open = item.classList.contains("is-open");
        $$(".lp-faq-item").forEach((i) => i.classList.remove("is-open"));
        if (!open) item.classList.add("is-open");
        return;
      }
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 78, behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    build();
    bind();
    TTM.initReveal(document);
  });
})();
