# TTM — Le réseau intelligent des clubs de football

Prototype d'une plateforme de mise en relation entre clubs de football : recommandations
de matchs fondées sur un score de compatibilité explicable, workflow de demande
automatisé, calendrier partagé, messagerie et module Parents.

**Trouve ton match.**

> Toutes les données sont synthétiques. Clubs, personnes, chiffres de marché et
> témoignages sont fictifs et servent uniquement la démonstration. Aucun tarif n'est
> affiché : les offres sont chiffrées sur devis.

## Démarrage

Le projet est 100 % statique : HTML, CSS et JavaScript vanilla. **Aucun build, aucune
dépendance, aucun serveur requis.**

Ouvrez simplement `index.html` dans un navigateur (double-clic). La page d'accueil est la
landing page.

| Page | Fichier |
| --- | --- |
| **Landing page** (page d'accueil) | `index.html` |
| Prototype web | `web/index.html` |
| Prototype mobile | `mobile/index.html` |
| Deck (20 slides) | `deck/index.html` |

Les liens entre les pages fonctionnent également en `file://` : ouvrez `index.html`, puis
utilisez les boutons « Ouvrir le prototype » et « Voir l'app mobile ».

## Contenu

| Livrable | Détail |
| --- | --- |
| **Landing page** (`index.html`) | Hero, problème, moteur de compatibilité, parcours, produit, offres sur devis, témoignages fictifs signalés, FAQ |
| **Prototype web** (`web/`) | 15 vues, routeur par hash, 14 modales, marché filtrable, messagerie simulée, gestion des demandes, calendrier, équipes, coachs, clubs, tournois, statistiques, carte du réseau, thème clair/sombre, responsive 1440 / 1024 / 390 px |
| **Prototype mobile** (`mobile/`) | 14 écrans (connexion → confirmation), onglets, notifications, agenda, module Parents, dans un châssis 390 × 844 |
| **Deck** (`deck/`) | 20 slides 16:9, notes du présentateur, vue d'ensemble, plein écran, impression |

## Structure

```
ttm application/
├── index.html              Landing page (page d'accueil)
├── README.md
├── assets/
│   ├── css/                tokens · base · components · animations
│   ├── js/                 ttm-data · ttm-core · ttm-engine · ttm-pitch
│   └── logo/               identité SVG
├── web/                    index.html · app.css · app.js
├── mobile/                 index.html · mobile.css · mobile.js
├── landing/                copie autonome de la landing (landing.css · landing.js)
└── deck/                   index.html · deck.css · deck.js
```

## Noyau partagé

| Fichier | Rôle |
| --- | --- |
| `assets/js/ttm-data.js` | Jeu de données : 14 clubs, 7 équipes, 8 coachs, 26 matchs, 6 tournois, 6 demandes, 5 conversations, 9 notifications |
| `assets/js/ttm-core.js` | Icônes SVG, helpers, store, thème, toasts, modales, feuilles, graphiques |
| `assets/js/ttm-engine.js` | Score de compatibilité, filtres, envoi de demande, workflow, notifications |
| `assets/js/ttm-pitch.js` | Terrain et carte du réseau |

## Moteur de compatibilité

7 critères pondérés, score explicable de 0 à 100 % :

| Critère | Poids | Critère | Poids |
| --- | --- | --- | --- |
| Distance | 20 | Surface | 12 |
| Créneau | 18 | Type | 10 |
| Format | 16 | Fiabilité | 9 |
| Niveau | 15 | | |

```
score = round( Σ ( poids[i] × valeur[i] ) / Σ poids[i] )
```

## Parcours de démonstration

1. **Marché** — filtrer par catégorie, distance et créneau ; rechercher un club.
2. **Fiche match** — lire les 7 critères de compatibilité.
3. **Demande** — envoyer la demande et suivre les 4 étapes du workflow.
4. **Notification puis calendrier** — le match est confirmé et apparaît dans l'agenda.
5. **Équipe** — modifier les préférences, les recommandations sont recalculées.
6. **Messagerie** — échanger avec le club, lire la réponse simulée.
7. **Paramètres** — changer de thème, modifier l'identité du club, ouvrir les offres sur devis.

## Contrôles effectués

| Contrôle | Résultat |
| --- | --- |
| `node --check` sur les 6 scripts | Syntaxe valide |
| Audit des icônes SVG et des API `TTM.*` | Aucune référence manquante |
| Parcours automatisé (Chrome headless) : 15 vues web, 14 écrans mobiles, 20 slides | 0 erreur console |

## Conventions

- Aucun CDN, aucun bundler, aucun framework : tout fonctionne en `file://`.
- Tout texte dynamique est échappé via `TTM.esc` avant insertion.
- Les intentions d'interface passent par la délégation globale (`data-act`, `data-f`,
  `data-go`) ou par des écouteurs locaux dédiés (`data-local`), pour éviter toute double
  exécution.
- Les références à la France et les clubs de démonstration sont ceux du jeu de données :
  ne pas réintroduire d'anciens clubs ni de coachs hors France.
