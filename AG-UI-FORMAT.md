# AG-UI — Format JSON & Configuration n8n

## Format JSON attendu par le frontend

Le Socle doit retourner un objet JSON structuré dans le champ `output`.
Le frontend détecte automatiquement ce format et rend les composants visuels.

```json
{
  "type": "rentabilite",
  "restaurant": "L'Uni Vert",
  "periode": "Mai 2026",
  "contexte": "9 jours week-end dont 2 fériés. Météo favorable 26°C. Impact positif sur fréquentation.",

  "alertes": [
    { "level": "alerte", "message": "Masse salariale à 45% du CA → au-dessus du seuil (40%)" },
    { "level": "critique", "message": "Objectif CA réalisé à 83.5% — écart de -52 899 €" },
    { "level": "info", "message": "Tickets out : 3.6% du CA — dans la zone d'alerte (> 3%)" }
  ],

  "kpis": [
    { "label": "CA HT",              "value": 268101, "unit": "€",  "trend": -2.57, "sub": "Objectif : 321 000 € · 83.5%" },
    { "label": "Marge brute",        "value": 83.9,   "unit": "%",  "trend": -0.3 },
    { "label": "Coûts primaires",    "value": 61.2,   "unit": "%",  "warning": true },
    { "label": "Marge coûts prim.",  "value": 104181, "unit": "€",  "trend": -5.26 },
    { "label": "Charges exploit.",   "value": 0,      "unit": "€",  "sub": "Données Zeendoc manquantes" },
    { "label": "Marge coûts dir.",   "value": 104181, "unit": "€" },
    { "label": "Masse salariale",    "value": 45.0,   "unit": "%",  "alert": true },
    { "label": "Tickets",            "value": 4745,   "unit": "N",  "trend": -1.49 },
    { "label": "Couverts",           "value": 8908,   "unit": "N",  "trend": -2.43 },
    { "label": "Panier / table",     "value": 56.50,  "unit": "€" },
    { "label": "Tickets out",        "value": 3.61,   "unit": "%",  "warning": true }
  ],

  "charts": {
    "ca": [
      { "label": "S-4", "ca": 275169 },
      { "label": "S-3", "ca": 260000 },
      { "label": "S-2", "ca": 255000 },
      { "label": "Période", "ca": 268101, "objectif": 321000 }
    ],
    "marges": [
      { "label": "CA HT",              "value": 268101, "color": "green" },
      { "label": "Coût matière",        "value": 43260,  "color": "red" },
      { "label": "Masse salariale",     "value": 120661, "color": "red" },
      { "label": "Marge coûts prim.",   "value": 104181, "color": "green" },
      { "label": "Charges exploit.",    "value": 0,      "color": "amber" },
      { "label": "Marge coûts dir.",    "value": 104181, "color": "green" }
    ],
    "food": 166118,
    "no_food": 101983,
    "horaires": [
      { "heure": "09h", "ca": 1200 },
      { "heure": "10h", "ca": 2400 },
      { "heure": "11h", "ca": 4800 },
      { "heure": "12h", "ca": 18000 },
      { "heure": "13h", "ca": 22000 },
      { "heure": "14h", "ca": 15000 },
      { "heure": "15h", "ca": 5000 },
      { "heure": "19h", "ca": 8000 },
      { "heure": "20h", "ca": 18000 },
      { "heure": "21h", "ca": 24000 },
      { "heure": "22h", "ca": 16000 },
      { "heure": "23h", "ca": 6000 }
    ]
  },

  "charges_exploitation": {
    "total_ht": 8450.20,
    "pct_ca": 3.15,
    "rows": [
      { "categorie": "ENERGIE", "fournisseur": "EDF", "nb_factures": 2, "total_ht": 3200.00, "pct": 37.9 },
      { "categorie": "LOYER", "fournisseur": "SCI Réunion", "nb_factures": 1, "total_ht": 2800.00, "pct": 33.1 },
      { "categorie": "MAINTENANCE", "fournisseur": "Climatech", "nb_factures": 3, "total_ht": 1450.20, "pct": 17.2 },
      { "categorie": "ASSURANCE", "fournisseur": "AXA", "nb_factures": 1, "total_ht": 1000.00, "pct": 11.8 }
    ]
  },

  "tables": {
    "serveurs": [
      { "nom": "GREGORY1", "ca": 45200, "tickets": 320, "couverts": 620, "panier": 141.25, "marge_pct": 82.1 },
      { "nom": "MARIE2",   "ca": 38600, "tickets": 290, "couverts": 540, "panier": 133.10, "marge_pct": 84.5 }
    ],
    "articles": [
      { "nom": "Côte de bœuf", "famille": "Viandes", "quantite": 340, "ca": 15300, "marge_pct": 72.0 },
      { "nom": "Rhum arrangé", "famille": "Boissons", "quantite": 680, "ca": 8160,  "marge_pct": 88.5 }
    ],
    "out": [
      { "type": "Retour",  "montant": 4126.60, "pct": 42.6 },
      { "type": "Offert",  "montant": 3162.40, "pct": 32.7 },
      { "type": "Annulé",  "montant": 1933.95, "pct": 20.0 },
      { "type": "Perdu",   "montant": 462.00,  "pct": 4.8 }
    ]
  }
}
```

---

## Règles de format par type de question

| Question | type JSON | Champs obligatoires |
|---|---|---|
| Rentabilité complète | `rentabilite` | kpis, charts, alertes, tables, charges_exploitation |
| CA uniquement | `ca` | kpis (CA + objectif), charts.ca |
| Autres charges | `charges` | charges_exploitation |
| Serveurs | `serveurs` | tables.serveurs |
| Articles | `articles` | tables.articles |
| Tickets out | `out` | tables.out |
| Question simple | `texte` | aucun (réponse text seule) |

---

## Prompt à ajouter dans le Socle (section FORMAT DE SORTIE)

Ajouter à la fin du system prompt du Socle :

```
FORMAT DE SORTIE — INTERFACE WEB :
Si la source de la requête est 'web' (champ source dans le JSON d'entrée),
retourner OBLIGATOIREMENT la réponse dans ce format :

{
  "output": "<texte de synthèse optionnel>",
  "structured": { ... bloc JSON selon le type de question ... }
}

Le bloc structured doit suivre exactement le schéma défini.
- type: rentabilite | ca | charges | serveurs | articles | out | texte
- kpis: tableau d'objets { label, value, unit, trend?, sub?, alert?, warning? }
  - unit: "€" | "%" | "N"
  - alert: true = bordure rouge (seuil critique dépassé)
  - warning: true = bordure orange (seuil d'alerte)
  - trend: variation en % vs période précédente (positif = hausse)
- alertes: tableau { level: "critique"|"alerte"|"info", message: string }
- charts.ca: [{ label, ca, objectif? }] — max 6 points
- charts.marges: [{ label, value, color: "green"|"red"|"amber" }]
- charts.food / charts.no_food: valeurs numériques HT
- charts.horaires: [{ heure, ca }]
- tables.serveurs: [{ nom, ca, tickets, couverts, panier, marge_pct }]
- tables.articles: [{ nom, famille, quantite, ca, marge_pct }]
- tables.out: [{ type, montant, pct }]
- charges_exploitation: { total_ht, pct_ca, rows: [{ categorie, fournisseur, nb_factures, total_ht, pct }] }

Si source != 'web' (WhatsApp, etc.) → continuer à répondre en texte formaté normal.
```

---

## Configuration n8n — Node "Respond to Webhook"

Dans le node **Respond to Webhook** du Socle :
- Response Code : 200
- Response Body : `{{ $json.output }}`
- Headers : `Content-Type: application/json`

Pour le streaming SSE (optionnel, phase 2) :
- Response Body mode : Stream
- Émettre des events SSE via un node Code avant le Respond

---

## Déploiement Netlify

1. Push le dossier `abondance-ui` sur GitHub
2. New site from Git → branch main → build command `npm run build` → publish dir `dist`
3. Environment variables : `VITE_WEBHOOK_URL=https://mbouab.app.n8n.cloud/webhook/abondance-chat`
4. Dans n8n, le webhook doit accepter les requêtes depuis `*.netlify.app`
   → Ajouter le header CORS : `Access-Control-Allow-Origin: *`
