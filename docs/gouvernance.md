# GOUVERNANCE — Nyx IDE

## Objectif
Ce document définit les règles de fonctionnement du projet, le périmètre du MVP, les limites des responsabilités et les règles d'utilisation de l'IA. 
Il ne décrit PAS l'architecture technique, l'interface utilisateur ou la structure des composants.

## Périmètre du MVP (Minimum Viable Product)
Le MVP est figé. Tout ajout non listé ici bascule en V2+.

```txt
Fonctionnalités MVP verrouillées :
- Explorateur de fichiers local (lecture/écriture via Tauri)
- Éditeur de code tactile (CodeMirror 6)
- Île flottante interactive (Ancrage, Sélection, Copier/Coller)
- Panneau GitHub (Pull, Commit, Push, Lancer Build distant)
```

## Couches et responsabilités

```txt
Couche UI (React)       → Affiche l'état, capte les actions.
Couche Services (TS)    → Gère la logique métier et orchestre les flux.
Couche Système (Rust)   → Accède au stockage sécurisé (I/O). Ne connaît rien de l'UI.
Couche Cloud (GitHub)   → Exécute les builds lourds (Android APK).
```

## Règles strictes
1. **Règle 1** : L'humain décide. Le système organise. La documentation guide. Le code exécute.
2. **Règle 2** : Toute nouvelle idée doit être classée MVP ou V2+ explicitement avant toute implémentation.
3. **Règle 3** : L'IA propose, structure et génère, mais ne prend aucune décision produit et ne modifie pas l'architecture sans demande.
4. **Règle 4** : La source de vérité absolue suit cet ordre : Code → Documentation → Interprétation.
5. **Règle 5** : Avant de créer un nouveau document, l'existant doit être mis à jour.

## À éviter
- Inventer des besoins hors MVP.
- Implémenter une fonctionnalité sans validation explicite de l'humain.
- La sur-ingénierie et l'ajout d'abstractions inutiles.

## Phrase simple
Ce document est la loi fondamentale de Nyx IDE. Il garantit que le projet reste focalisé sur son MVP et définit strictement les rôles entre l'humain, le code et l'IA.