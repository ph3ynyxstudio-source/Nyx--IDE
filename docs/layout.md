# LAYOUT — Nyx IDE

## Objectif
Ce document décrit la structure visuelle principale de l'écran et la répartition spatiale des grands blocs.
Il ne décrit PAS les couleurs, la logique interne ou la structure des petits composants.

## Structure visuelle (Mobile-First)

```txt
[ ÉCRAN COMPLET : 100dvh, pas de scroll global ]

+-------------------------------------------------+
| [ Zone 1 : TopBar ] Fixe en haut (Navigation)   |
+-------------------------------------------------+
| [ Zone 2 : Main Content ] Prend l'espace restant|
|                                                 |
|  Options dynamiques (selon onglet actif) :      |
|  - Explorateur (Plein écran ou tiroir)          |
|  - Éditeur (Plein écran)                        |
|  - Panneau GitHub (Plein écran)                 |
|                                                 |
+-------------------------------------------------+

[ Couche Superposée (Z-Index élevé) ]
→ Floating Island (Libre ou ancrée sur le code)
```

## Règles strictes
1. **Règle 1** : L'application ne doit jamais scroller dans son ensemble. Le `body` et `#root` sont verrouillés (`overflow: hidden`, `height: 100dvh`). Seules les zones internes (comme l'éditeur ou l'explorateur) peuvent scroller.
2. **Règle 2** : Le positionnement absolu (`position: absolute/fixed`) est strictement réservé à la TopBar et à la Floating Island.
3. **Règle 3** : La disposition principale utilise Flexbox (`display: flex`) pour répartir l'espace verticalement.

## À éviter
- Utiliser `100vh` classique (problème avec la barre d'adresse/clavier mobile), utiliser `100dvh`.
- Coder des marges ou positions en pixels absolus hors de l'île flottante.

## Phrase simple
Le layout verrouille l'écran comme une application native : une barre de contrôle fixe en haut, une zone de travail flexible au centre, et une île flottante superposée, sans aucun défilement global accidentel.