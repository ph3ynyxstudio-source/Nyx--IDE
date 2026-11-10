# STOCKAGE — Nyx IDE

## Objectif
Ce document définit où et comment vivent les données de l'application.
Il ne décrit PAS l'interface, ni les flux réseau externes.

## Répartition des données

```txt
1. Fichiers du Projet (Workspace / Code source)
   → Emplacement : Répertoire privé sandboxé Android (via Rust/Tauri FS).
   → Responsable : Backend Rust (Tauri).
   → Persistance : Définitive (Fichiers réels).

2. Paramètres Utilisateur & Session (Token PAT GitHub, Thème actif)
   → Emplacement : LocalStorage du navigateur Webview.
   → Responsable : Frontend React / Services TS.
   → Persistance : Entre les sessions.

3. État d'Édition Actif (Cache CodeMirror)
   → Emplacement : Mémoire vive (RAM) de la Webview.
   → Responsable : React State / CodeMirror instance.
   → Persistance : Détruit à la fermeture de l'app si non sauvegardé.
```

## Règles strictes
1. **Règle 1** : Le code source lu depuis le stockage système (Rust) est la seule et unique vérité absolue.
2. **Règle 2** : Ne jamais dupliquer le contenu des fichiers de code dans le LocalStorage ou IndexedDB.
3. **Règle 3** : Le jeton GitHub (PAT) doit être stocké uniquement pour la session en cours ou dans un stockage local sécurisé, jamais poussé dans les fichiers du projet.

## À éviter
- Stocker de gros volumes de texte ou des historiques complets de code dans le LocalStorage.
- Faire aveuglément confiance à l'état en mémoire sans vérifier l'état du fichier sur le disque lors d'un commit.

## Phrase simple
Les fichiers de code appartiennent au disque dur via Rust, les petites préférences vivent dans le LocalStorage, et le code en train d'être tapé reste en mémoire vive jusqu'à la sauvegarde.