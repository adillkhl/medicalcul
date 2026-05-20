# Medicalcul 🏥

Clone moderne de [**Medicalcul**](http://medicalcul.free.fr/) — l'encyclopédie de scores et calculateurs médicaux du Dr Philippe Mignard (Urgences/SMUR, GHEF Marne-la-Vallée).

> **~386 calculateurs couvrant 30 spécialités médicales**, du CHA₂DS₂-VASc au score de Glasgow, en passant par l'IMC, APACHE II, les clearance de créatinine et bien plus.

## Objectif

Reprendre l'existant, le moderniser et le déployer comme une **PWA moderne, rapide, utilisable hors-ligne** — tout en gardant l'essence : des outils cliniques simples, directement utilisables au lit du patient.

## Stack (proposée)

| Couche | Technologie |
|--------|-------------|
| Frontend | React / Next.js (ou SvelteKit) |
| Style | Tailwind CSS + Shadcn/ui |
| PWA | Service Worker + Cache API |
| Base de données | SQLite (formules) ou fichiers JSON versionnés |
| API | REST (FastAPI ou Next API routes) |
| Mobile | PWA (Android + iOS via Safari) |
| Déploiement | GitHub Pages / Vercel / Cloudflare Pages |

## Structure initiale

```
medicalcul/
├── formulas/          # Le cœur : définitions JSON des calculateurs
│   ├── cardiologie/
│   ├── urgence/
│   ├── neurologie/
│   ├── pediatrie/
│   ├── orl/
│   └── ...
├── src/               # App source
├── public/            # Static assets
├── scripts/           # Scraping / import des données originales
└── ...
```

## Licence

Projet personnel. Les scores et formules médicales sont du domaine public ou sous licence libre selon leurs auteurs originaux. Le design et l'implémentation sont © Adil Lekhbal.

---

*"L'évaluation d'un patient est avant tout clinique et/ou biologique. Le traitement d'un patient ne peut reposer sur le seul résultat de ce site."* — Dr Philippe Mignard
