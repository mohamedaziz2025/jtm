/* TTM — Deck de présentation (20 slides) */
(function () {
  "use strict";
  const TTM = window.TTM;
  const E = TTM.esc;
  const $ = (s) => document.querySelector(s);
  const D = window.TTM_DATA;

  const ico = (n, s) => TTM.icon(n, s || 16);
  const li = (h) => "<li>" + ico("checkCircle", 15) + "<span>" + h + "</span></li>";
  const card = (t, p, brand) => '<div class="dk-card ' + (brand ? "is-brand" : "") + '"><h4>' + t + "</h4><p>" + p + "</p></div>";
  const stat = (n, l) => '<div><div class="dk-num">' + n + '</div><div class="dk-lab">' + l + "</div></div>";

  const CRIT_W = [
    ["Distance", 20], ["Créneau", 18], ["Format", 16], ["Niveau", 15], ["Surface", 12], ["Type", 10], ["Fiabilité", 9]
  ];

  const S = [
    {
      k: "cover", t: "TTM", s: "Le réseau intelligent des clubs de football",
      p: "Trouve ton match. · Deck de présentation · données de démonstration (France)",
      n: "Slide de couverture. Annoncer le slogan et préciser que le deck s'appuie sur un prototype fonctionnel, pas sur des maquettes statiques.",
      b: [
        ["7", "critères pondérés"], ["26", "matchs disponibles"], ["14", "clubs connectés"],
        ["8", "coachs référencés"], ["6", "tournois publiés"]
      ]
    },
    {
      k: "split", t: "Le problème", s: "Organiser un match amateur prend 6 e-mails et 3 appels",
      l: "Les clubs cherchent des adversaires au hasard, sans vérifier la distance, le format, le créneau ni les licences. Les saisons se remplissent à moitié.",
      r: '<div class="dk-cols dk-c1" style="display:grid;gap:3%">' +
        card("Recherche manuelle", "Un président contacte les clubs un par un, sans historique ni suivi.") +
        card("Adversaires inadaptés", "Format, niveau, surface ou distance incompatibles : annulation la veille.") +
        card("Parents non informés", "Convocations perdues, licences manquantes, parents qui découvrent le match le jour même.") +
        "</div>",
      n: "Insister sur le temps perdu par les bénévoles : ce n'est pas un problème de connaissance mais de coordination."
    },
    {
      k: "split", t: "Le marché", s: "Un écosystème massif, encore très peu outillé",
      l: "Le football amateur français repose sur des milliers de clubs, des dizaines de milliers d'équipes et une forte demande de matchs de qualité, notamment en Île-de-France.",
      r: '<div class="dk-cols dk-c2" style="display:grid;gap:3%">' +
        stat("~15 000", "clubs de football en France") + stat("300 000+", "équipes en activité") +
        "</div>",
      n: "Chiffres de cadrage indicatifs, à remplacer par les sources officielles (FFF, INSEE) avant toute diffusion externe."
    },
    {
      k: "split", t: "Notre solution", s: "Une couche de mise en relation au-dessus des clubs existants",
      l: "TTM ne remplace ni les logiciels de gestion ni les réseaux sociaux. TTM orchestre la mise en relation : préférences, correspondance, demande, confirmation, calendrier, parents.",
      r: '<div class="dk-card is-brand"><h4>Le réseau, pas un logiciel de club</h4><p>Onboarding en 5 minutes, aucune installation, données partagées entre clubs selon des règles de consentement.</p></div>',
      n: "Message clé : TTM est un réseau, chaque club garde ses outils. La valeur vient de la connectivité inter-clubs."
    },
    {
      k: "grid", t: "Le moteur de compatibilité", s: "7 critères pondérés, un score explicable",
      l: "Chaque équipe publie ses préférences. Pour chaque match disponible, TTM compare les critères et renvoie un score de 0 à 100 %.",
      cells: [
        ["Distance", "20 %", "Rayon club → stade, en kilomètres"],
        ["Créneau", "18 %", "Jour et heure d'indisponibilité"],
        ["Format", "16 %", "7v7, 9v9 ou 11v11"],
        ["Niveau", "15 %", "Débutant, intermédiaire, avancé"],
        ["Surface", "12 %", "Gazon naturel ou synthétique"],
        ["Type", "10 %", "Amical, championnat, coupe"],
        ["Fiabilité", "9 %", "Licences, encadrement, club vérifié"],
        ["Traçabilité", "100 %", "Chaque écart est affiché à l'utilisateur"]
      ],
      n: "Le score est un outil d'aide à la décision, pas une vérité : le club reste libre de refuser."
    },
    {
      k: "bars", t: "Score de compatibilité", s: "Exemple réel du jeu de démonstration",
      l: "Équipe U15 A de l'AS Courbevoie face au FC Montreuil : 90 % de compatibilité.",
      bars: [["Distance", 92], ["Créneau", 100], ["Format", 100], ["Niveau", 85], ["Surface", 70], ["Type", 80], ["Fiabilité", 100]],
      n: "Montrer que le surface (gazon synthétique) est le seul critère en écart, et que l'utilisateur voit pourquoi."
    },
    {
      k: "steps", t: "Le parcours", s: "Du besoin au match confirmé en 4 étapes",
      steps: [
        ["01", "Préférences", "L'équipe renseigne rayon, jours, créneaux, formats, niveaux et surfaces."],
        ["02", "Correspondances", "TTM classe les matchs disponibles et notifie les meilleures correspondances."],
        ["03", "Demande", "La demande part en un clic : push, e-mail, SMS et relance à 48 h."],
        ["04", "Confirmation", "Calendrier mis à jour, convocations envoyées, module Parents synchronisé."]
      ],
      n: "Le même workflow existe à l'identique dans le prototype web et dans l'app mobile."
    },
    {
      k: "product", t: "Le produit", s: "Un tableau de bord club complet",
      l: "Marché filtrable, fiches détaillées, demandes, messagerie, calendrier, statistiques et carte du réseau.",
      n: "Chaque écran du prototype est cliquable : montrer le marché, un filtre, une demande et le suivi."
    },
    {
      k: "product", t: "L'app mobile", s: "14 écrans, du login à la confirmation",
      l: "L'application mobile couvre le terrain : notifications, agenda et conversations sans quitter l'app.",
      n: "Insister sur la notifications temps réel : c'est le canal qui transforme un match potentiel en match joué."
    },
    {
      k: "split", t: "Différenciation", s: "Pourquoi un club choisirait TTM demain ?",
      l: "Le réseau est l'actif : plus il y a de clubs connectés, plus la recommandation est pertinente. Un concurrent sans réseau ne peut pas le répliquer.",
      r: '<ul class="dk-list">' +
        li("<b>Effet de réseau</b> : la valeur croît avec le nombre de clubs et de joueurs.") +
        li("<b>Données propriétaires</b> : historique de matchs, taux de confirmation, préférences réelles.") +
        li("<b>Module Parents</b> : rétention des familles, argument différenciant pour les clubs.") +
        li("<b>Intégration</b> : export calendrier, notifications multicanales, API pour les logiciels de club.") +
        "</ul>",
      n: "Répondre à l'objection « un groupe WhatsApp suffit » : WhatsApp ne connaît pas les préférences ni l'historique."
    },
    {
      k: "split", t: "Le module Parents", s: "La rétention des familles est notre meilleur argument club",
      l: "Les parents suivent l'équipe en lecture seule : agenda, convocations, licences et itinéraires. Le club garde la relation, la famille garde la visibilité.",
      r: '<ul class="dk-list">' +
        li("<b>Lecture seule</b> : aucune conversation ni donnée d'un autre joueur n'est exposée.") +
        li("<b>Convocations</b> : envoi SMS et e-mail, confirmation de présence en un geste.") +
        li("<b>Licences</b> : statut à jour visible, relances automatiques avant expiration.") +
        li("<b>Impact club</b> : moins de désistements de dernière minute et moins d'appels au president.") +
        "</ul>",
      n: "Le module Parents est ce qui fait rester les familles dans le produit, donc ce qui fait rester le club."
    },
    {
      k: "model", t: "Business model", s: "Trois offres, un tarif sur devis",
      l: "Le prix dépend du nombre d'équipes, de coachs et de tournois organisés. Aucun tarif n'est affiché dans le prototype.",
      table: [
        ["Essentiel", "Jusqu'à 2 équipes", "Demandes illimitées, calendrier partagé"],
        ["Pro Club", "Équipes illimitées", "Moteur prioritaire, statistiques, module Parents"],
        ["Réseau", "Multi-clubs", "Marque blanche, API, pilotage inter-clubs"]
      ],
      n: "Le sur-devis évite l'ancrage de prix et permet de vendre la valeur (matchs réellement joués)."
    },
    {
      k: "steps", t: "Go-to-market", s: "Un club pilote, trois phases",
      steps: [
        ["Phase 1", "Pilote 3 clubs", "AS Courbevoie + 2 clubs voisins, une catégorie, 4 semaines."],
        ["Phase 2", "Preuve", "Mesure du taux de confirmation et du temps administratif gagné."],
        ["Phase 3", "Extension", "Toutes catégories, tournois, ouverture à d'autres départements."]
      ],
      n: "Le pilote court et mesurable est l'argument central face à un club réticent à changer ses habitudes."
    },
    {
      k: "metrics", t: "Traction visée", s: "Indicateurs de pilotage du pilote",
      l: "Le pilote est réussi si le club gagne du temps et joue davantage de matchs, pas si l'application est ouverte.",
      bars: [["Matchs joués / mois", 70], ["Taux de confirmation", 82], ["Délai de réponse", 64], ["Équipes actives", 55]],
      n: "Ces cibles sont des objectifs de démonstration et doivent être remplacées par les résultats réels du pilote."
    },
    {
      k: "split", t: "Équipe", s: "Les profils qui construisent TTM",
      l: "Une équipe produit, sport et club : la connaissance du terrain amateur est aussi importante que la maîtrise technique.",
      r: '<div class="dk-cols dk-c2" style="display:grid;gap:3%">' +
        card("Produit & UX", "Parcours président, coach et parent, design system SportTech.") +
        card("Sport & réseau", "Anciens dirigeants de clubs, arbitres et éducateurs en Île-de-France.") +
        card("Technique", "Moteur de correspondance, mobile, notifications temps réel.") +
        card("Conformité", "RGPD, hébergement France, données mineurs et licences.") +
        "</div>",
      n: "Profils à personnaliser : ce sont des personas de démonstration, pas l'équipe réelle."
    },
    {
      k: "roadmap", t: "Roadmap", s: "18 mois à partir du pilote",
      steps: [
        ["T1", "MVP", "Web, mobile, moteur, notifications, calendriers."],
        ["T2", "Réseau", "Multi-clubs, tournois, arbitrage, API."],
        ["T3", "Offre", "Marque blanche, Parents Premium, monétisation."],
        ["T4", "Passage à l'échelle", "Ouverture régionale, partenariats FFF et fédérations."]
      ],
      n: "Le jalon T2 est le plus important : c'est là que la réseau devient défendable."
    },
    {
      k: "split", t: "Risques", s: "Ce qui peut mal tourner",
      l: "Chaque risque a une réponse produit concrète.",
      r: '<ul class="dk-list">' +
        li("<b>Faible densité réseau</b> → pilote local dense avant toute ouverture.") +
        li("<b>Données de mineurs</b> → hébergement France, consentements, accès cloisonné.") +
        li("<b>Abandon après inscription</b> → onboarding en 5 min, première recommandation dès la première connexion.") +
        li("<b>Double saisie</b> → import depuis les logiciels de club et export calendrier.") +
        "</ul>",
      n: "Ne pas masquer les risques : la crédibilité vient de la réponse, pas de l'absence de risque."
    },
    {
      k: "table", t: "Concurrence", s: "Positionnement par rapport aux solutions existantes",
      table: [
        ["Groupes WhatsApp", "Oui", "Non", "Non", "Non"],
        ["Logiciels de club", "Non", "Non", "Oui", "Partiel"],
        ["Plateformes de tournaments", "Partiel", "Partiel", "Oui", "Non"],
        ["<b>TTM</b>", "Oui", "Oui", "Oui", "Oui"]
      ],
      head: ["Solution", "Réseau", "Compatibilité", "Calendrier", "Parents"],
      n: "TTM n'est ni un logiciel de club ni un réseau social : c'est la couche de mise en relation."
    },
    {
      k: "quote", t: "Vision", s: "Chaque club de France devrait trouver un adversaire chaque semaine.",
      q: "« Un pays où aucune saison ne s'arrête faute d'adversaire. »",
      by: "Position de marque TTM",
      n: "Slide de respiration : ralentir le rythme, enkarner la vision avant les slides de conclusion."
    },
    {
      k: "end", t: "Merci", s: "Trouve ton match.",
      l: "Le prototype web, le prototype mobile et la landing page sont disponibles dans le projet.",
      b: [["index.html", "Landing page"], ["web/index.html", "Prototype web"], ["mobile/index.html", "Prototype mobile"]],
      n: "Terminer sur l'appel à l'action : organiser d'un pilote de 4 semaines avec 3 clubs."
    }
  ];

  let i = 0;

  function foot() {
    return '<div class="dk-foot"><span class="dk-foot-logo"><img src="../assets/logo/ttm-mark.svg" alt="" height="14"> TTM · ' + (i + 1) + " / " + S.length + "</span><span>Données de démonstration · France</span></div>";
  }

  function head(k, t, s) {
    return '<div><div class="dk-kicker">' + k + "</div>" + (t ? '<h2 class="dk-h2" style="margin-top:8px">' + t + "</h2>" : "") +
      (s ? '<p class="dk-lead" style="margin-top:10px">' + s + "</p>" : "") + "</div>";
  }

  function render() {
    const d = S[i];
    let html = "";
    if (d.k === "cover") {
      html = '<div class="dk-cols dk-c-23" style="align-items:center">' +
        "<div>" + head("Levée de fonds · 2026", d.t, "") +
        '<h1 class="dk-h1" style="margin-top:14px">' + d.s + '</h1><p class="dk-lead" style="margin-top:16px">' + d.p + "</p></div>" +
        '<div class="dk-cols dk-c2" style="display:grid;gap:14px">' +
        '<div class="dk-ring" style="--p:90"><b>90%</b></div>' +
        '<div class="dk-card is-brand"><h4>Compatibilité</h4><p>Score moyen proposé aux clubs du réseau de démonstration.</p></div></div></div>' +
        '<div class="dk-cols dk-c5" style="display:grid;gap:2%;margin-top:4%">' +
        d.b.map((x) => stat(x[0], x[1])).join("") + "</div>";
    } else if (d.k === "split" || d.k === "product") {
      html = head(d.k === "product" ? "Produit" : "Contexte", d.t, d.s) +
        '<div class="dk-cols dk-c-23" style="margin-top:3%">' +
        "<div>" + (d.l ? '<p class="dk-body-txt">' + d.l + "</p>" : "") + (d.r || "") + "</div>" +
        (d.k === "product"
          ? '<div class="dk-phones">' +
            '<div class="dk-phone-mini"><span class="k">Marché</span><span class="v">26 matchs</span>' +
            '<div class="dk-chip-row"><span class="dk-chip-mini">U15</span><span class="dk-chip-mini">9v9</span><span class="dk-chip-mini">25 km</span></div>' +
            '<div class="dk-bar-track"><div class="dk-bar-fill" style="width:90%"></div></div><span class="k">compatibilité 90%</span></div>' +
            '<div class="dk-phone-mini"><span class="k">Demande</span><span class="v">FC Montreuil</span>' +
            '<div class="dk-chip-row"><span class="dk-chip-mini">samedi 15:00</span></div>' +
            '<div class="dk-bar-track"><div class="dk-bar-fill" style="width:64%"></div></div><span class="k">en attente de réponse</span></div>' +
            '<div class="dk-phone-mini"><span class="k">Agenda</span><span class="v">3 octobre</span>' +
            '<div class="dk-chip-row"><span class="dk-chip-mini">U15 A</span><span class="dk-chip-mini">15:00</span></div>' +
            '<div class="dk-bar-track"><div class="dk-bar-fill" style="width:100%"></div></div><span class="k">confirmé</span></div></div>'
          : "") + "</div>";
    } else if (d.k === "grid") {
      html = head("Moteur", d.t, d.s) + (d.l ? '<p class="dk-body-txt">' + d.l + "</p>" : "") +
        '<div class="dk-cols dk-c4" style="display:grid;gap:2.4%;margin-top:3%">' +
        d.cells.map((c) => '<div class="dk-card"><h4>' + c[0] + ' <span class="dk-lab">· ' + c[1] + "</span></h4><p>" + c[2] + "</p></div>").join("") + "</div>";
    } else if (d.k === "bars") {
      html = head("Moteur", d.t, d.s) + (d.l ? '<p class="dk-body-txt">' + d.l + "</p>" : "") +
        '<div class="dk-bars" style="margin-top:4%">' +
        d.bars.map((b) => '<div class="dk-bar"><span>' + b[0] + '</span><div class="dk-bar-track"><div class="dk-bar-fill" style="width:' + b[1] + '%"></div></div><b>' + b[1] + "</b></div>").join("") + "</div>";
    } else if (d.k === "steps") {
      html = head("Parcours", d.t, d.s) +
        '<div class="dk-timeline" style="margin-top:5%">' +
        d.steps.map((st) => '<div class="dk-tl ' + (st[0] === "Phase 1" || st[0] === "01" || st[0] === "MVP" ? "is-now" : "") + '">' +
          '<span class="dk-tl-q">' + st[0] + '</span><span class="dk-tl-t">' + st[1] + '</span><p class="dk-tl-l">' + st[2] + "</p></div>").join("") + "</div>";
    } else if (d.k === "model") {
      html = head("Business model", d.t, d.s) + (d.l ? '<p class="dk-body-txt">' + d.l + "</p>" : "") +
        '<table class="dk-table" style="margin-top:4%"><thead><tr><th>Offre</th><th>Portée</th><th>Inclus</th></tr></thead><tbody>' +
        d.table.map((r) => "<tr><td><b>" + r[0] + "</b></td><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>").join("") + "</tbody></table>";
    } else if (d.k === "table") {
      html = head("Paysage", d.t, d.s) +
        '<table class="dk-table" style="margin-top:4%"><thead><tr>' + d.head.map((h) => "<th>" + h + "</th>").join("") + "</tr></thead><tbody>" +
        d.table.map((r) => "<tr>" + r.map((c, ix) => "<td>" + (c.indexOf("dk-yes") > -1 ? '<span class="dk-yes">' + c.replace("dk-yes", "") + "</span>" : c.indexOf("dk-no") > -1 ? '<span class="dk-no">' + c.replace("dk-no", "") + "</span>" : c) + "</td>").join("") + "</tr>").join("") + "</tbody></table>";
    } else if (d.k === "quote") {
      html = '<div class="dk-cols dk-c-23" style="align-items:center;height:100%">' +
        "<div>" + head("Vision", "", "") + '<p class="dk-quote" style="margin-top:22px">' + d.q + '</p><p class="dk-quote-by" style="margin-top:18px">— ' + d.by + "</p></div>" +
        '<div class="dk-card is-brand"><h4>' + d.t + '</h4><p>' + d.s + "</p></div></div>";
    } else if (d.k === "end") {
      html = '<div class="dk-cols dk-c-23" style="align-items:center;height:100%">' +
        "<div>" + head("Contact", d.t, d.s) + '<p class="dk-lead" style="margin-top:16px">' + d.l + "</p>" +
        '<div class="dk-cols dk-c2" style="display:grid;gap:2.4%;margin-top:5%">' +
        d.b.map((x) => '<div class="dk-card"><h4>' + x[1] + '</h4><p>' + x[0] + "</p></div>").join("") + "</div></div>" +
        '<div class="dk-ring" style="--p:100;justify-self:end"><b>TTM</b></div></div>';
    } else if (d.k === "metrics") {
      html = head("Traction", d.t, d.s) + (d.l ? '<p class="dk-body-txt">' + d.l + "</p>" : "") +
        '<div class="dk-bars" style="margin-top:4%">' +
        d.bars.map((b) => '<div class="dk-bar"><span>' + b[0] + '</span><div class="dk-bar-track"><div class="dk-bar-fill" style="width:' + b[1] + '%"></div></div><b>' + b[1] + "</b></div>").join("") + "</div>";
    }
    $("#dkStage").innerHTML = '<section class="dk-slide">' + html + foot() + "</section>";
    $("#dkCount").textContent = i + 1 + " / " + S.length;
    $("#dkBar").style.width = ((i + 1) / S.length) * 100 + "%";
    $("#dkNoteText").textContent = d.n || "";
    document.title = "TTM — " + (i + 1) + "/" + S.length + " · " + d.t;
    paintGrid();
  }

  function paintGrid() {
    $("#dkGrid").innerHTML = S.map((d, x) =>
      '<button class="dk-cell ' + (x === i ? "is-on" : "") + '" data-x="' + x + '"><span class="dk-cell-n">' + (x + 1) + "</span>" +
      '<span class="dk-cell-k">' + d.k + '</span><span class="dk-cell-t">' + E(d.t) + "</span></button>").join("");
  }

  function go(n) {
    i = Math.max(0, Math.min(S.length - 1, n));
    render();
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(i + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(i - 1); }
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(S.length - 1);
    else if (e.key.toLowerCase() === "n") $("#dkNotes").hidden = !$("#dkNotes").hidden;
    else if (e.key.toLowerCase() === "o") $("#dkGrid").hidden = !$("#dkGrid").hidden;
  });

  document.addEventListener("click", function (e) {
    const b = e.target.closest("[data-k]");
    if (b) {
      const k = b.dataset.k;
      if (k === "n") $("#dkNotes").hidden = !$("#dkNotes").hidden;
      else if (k === "o") $("#dkGrid").hidden = !$("#dkGrid").hidden;
      else if (k === "f") { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); }
      return;
    }
    const c = e.target.closest(".dk-cell");
    if (c) { $("#dkGrid").hidden = true; go(+c.dataset.x); return; }
    if (e.target.closest("#dkNext")) go(i + 1);
    else if (e.target.closest("#dkPrev")) go(i - 1);
  });

  document.addEventListener("DOMContentLoaded", function () {
    render();
    TTM.toast("Deck TTM", "20 slides · flèches pour naviguer · N pour les notes · O pour la vue d'ensemble.", "info", { duration: 5000 });
  });
})();
