# Medicalcul - Plan initial

## Analyse de l'existant

Medicalcul original (Dr Philippe Mignard) :
- **386 pages HTML statiques** avec JavaScript inline
- 30 spécialités → index alphabétique + index par spécialité
- Pas de framework, pas de base de données, pas d'API
- App Android APK (Java, export PDF via Intent)
- Design responsive basique, pas de search, pas de thème sombre
- Contenu médical français de haute qualité

## Fonctionnalités cibles (sprint 0)

### MVP
- [ ] Scraper/convertir les 386 formules en JSON structuré
- [ ] Moteur de recherche instantané (fuse.js ou similar)
- [ ] Index alphabétique + par spécialité (comme l'original)
- [ ] Mode calcul interactif (comme l'original mais plus fluide)
- [ ] PWA offline-ready
- [ ] Design responsive, thème clair/sombre

### V2
- [ ] Historique des calculs (localStorage/IndexedDB)
- [ ] Export PDF au lit du patient
- [ ] Favoris / récents
- [ ] Mode comparaison (plusieurs scores côte à côte)
- [ ] Notes cliniques attachées à un score
- [ ] Intégration Android (via WebView + intent PDF comme l'original)

### V3
- [ ] API REST pour intégration DPI
- [ ] Mode DPI simplifié (nom/prénom/DDN → s'affiche dans le PDF généré)
- [ ] i18n (français + anglais + arabe ?)
- [ ] Contributions communautaires (ajout de formules)
- [ ] Tests automatisés des formules (validation croisée)

## Questions de brainstorming

1. **Stack** : React/Next.js vs SvelteKit vs vanilla HTML/CSS/JS modernisé ?
2. **Stockage des formules** : JSON versionné vs SQLite vs CMS headless ?
3. **Design** : Reprendre le look Medicalcul (reconnaissable) ou tout refaire ?
4. **Scraping** : Extraire les formules du site original automagiquement ?
5. **Mobile** : PWA suffit ou app native (Flutter) nécessaire pour les features offline avancées ?
6. **Contenu** : Contacter Dr Mignard pour collaboration/autorisation ?
