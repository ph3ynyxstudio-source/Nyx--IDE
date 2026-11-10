# ARCHITECTURE — Nyx IDE

## Objectif

Ce document décrit les flux de communication, l'organisation du système et les interactions entre les différentes couches de l'application.
Il ne décrit PAS les couleurs, les textes, l'interface utilisateur (UI) ni le détail interne des données.

## Flux de communication système

```
1. Interaction Utilisateur (Interface)
   UI (React) → Service (TypeScript)

2. Lecture / Écriture de Fichiers (Local-First)
   Service (TypeScript) → Tauri IPC → Rust Backend → Stockage Sandboxé

3. Synchronisation Git & Compilation (Cloud)
   Service (TypeScript) → isomorphic-git (TS pur) → GitHub HTTPS
   Service (TypeScript) → requêtes fetch HTTPS → GitHub Actions (Runner Linux)

```

## Séparation des couches

```
[ Frontend / React ]
- Composants "muets" (reçoivent props, émettent événements).
- Ne contiennent aucune logique d'accès système ou réseau.

[ Orchestration / Services TS ]
- Reçoivent les intentions de l'UI.
- Interrogent les couches inférieures (Tauri, Git, GitHub API).

[ Moteur / Rust Tauri ]
- Exécute uniquement les commandes I/O natives sécurisées.
- Totalement agnostique du visuel.

```

## Règles strictes

1. **Règle 1** : Un composant UI (`src/components/`) ne doit jamais faire d'appel direct à l'API Tauri (Rust) ou à l'API GitHub.

2. **Règle 2** : Tous les appels externes et interactions système doivent passer par un fichier de service dédié dans `src/services/`.

3. **Règle 3** : Le backend Rust renvoie uniquement des données brutes, jamais de données formatées spécifiquement pour l'affichage visuel.

## À éviter

* Mélanger la logique métier et l'interface utilisateur dans le même fichier.

* Faire communiquer la couche UI directement avec la couche Système (Rust).

* Créer des flux bidirectionnels complexes ; maintenir un flux I/O unidirectionnel.

## Phrase simple

L'architecture de Nyx IDE isole l'affichage (React), la logique (Services TS) et le système (Rust) pour garantir des flux de données stables, prévisibles et découplés.