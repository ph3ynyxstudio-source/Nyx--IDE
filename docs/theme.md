# THEME — Nyx IDE

## Objectif
Ce document centralise les règles de gestion des couleurs, des variables CSS (tokens) et de l'identité visuelle de l'application.
Il ne décrit PAS la disposition des éléments à l'écran (layout).

## Structure des thèmes

```txt
src/theme/
  variables.css      → Définition racine des variables (Tokens)
  ThemeProvider.tsx  → Mécanisme de bascule des thèmes
```

## Tokens officiels (MVP)

```txt
Base (Thème Sombre par défaut) :
--bg-app       : #030611  (Fond principal app)
--bg-carbon    : #0a0d14  (Fond éditeur/panneaux)
--bg-card      : rgba(8, 14, 28, 0.65) (Île flottante)
--bg-topbar    : #050814  (Barre de navigation)
--text-main    : #d6dbe3  (Texte principal)

Accents d'états (Île flottante) :
--accent-pin   : #38a169  (Vert - État ancré)
--accent-warn  : #d69e2e  (Jaune - État libre/resize)
```

## Règles strictes
1. **Règle 1** : Zéro couleur codée en dur (hardcoded) dans les fichiers composants. Tout passe par `var(--nom-du-token)`.
2. **Règle 2** : Le fichier `App.css` ne doit contenir que le reset CSS de base et l'import de `variables.css`.
3. **Règle 3** : Le thème courant est piloté par un attribut HTML global (ex: `<html data-theme="carbon">`).

## À éviter
- L'utilisation de valeurs `#hex` ou `rgb()` directement dans les fichiers `.module.css`.
- L'ajout de nouvelles variables pour des cas isolés (préférer réutiliser les tokens existants).

## Phrase simple
Le système de thème repose sur un fichier central de variables CSS, assurant une cohérence visuelle stricte et permettant de changer l'identité de l'application en modifiant un seul fichier.