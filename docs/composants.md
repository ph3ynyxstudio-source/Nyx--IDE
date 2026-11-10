# COMPOSANTS — Nyx IDE

## Objectif
Ce document définit la structure de la librairie de composants UI et la liste figée des composants du MVP.
Il ne décrit PAS la logique métier, les appels système ou l'architecture des données.

## Structure d'un composant

```txt
src/components/
  [NomDuComposant]/
    [NomDuComposant].tsx          → Rendu et comportement local
    [NomDuComposant].module.css   → Styles isolés (modules)
    index.ts                      → Export propre (facultatif)
```

## Liste des composants MVP verrouillés

```txt
- TopBar            → Barre de navigation (Explorateur, Éditeur, GitHub, etc.)
- FileTree          → Arborescence des fichiers du projet
- CodeEditor        → Conteneur CodeMirror 6
- FloatingIsland    → Capsule tactile (Sélection, Copier, Coller, Pin)
- GitHubPanel       → Panneau de synchronisation (Pull, Commit, Push, Build)
- TerminalView      → Affichage des logs en lecture seule
```

## Règles strictes
1. **Règle 1** : Isolation totale. Un composant = un dossier dédié.
2. **Règle 2** : Les composants doivent être "bêtes" (dumb components). Ils reçoivent des données par `props` et renvoient des événements.
3. **Règle 3** : Taille maximale fixée à 150 lignes par fichier composant. Si dépassement, sous-découpage obligatoire (ex: `PinButton` pour `FloatingIsland`).
4. **Règle 4** : Aucun style global dans le composant, utilisation stricte des CSS Modules.

## À éviter
- Créer des composants massifs faisant à la fois l'affichage et les requêtes réseaux.
- Laisser des fichiers composants "en vrac" à la racine de `src/components/`.

## Phrase simple
La structure des composants garantit que l'interface de Nyx IDE est modulaire, isolée et facilement maintenable, chaque bloc visuel vivant dans son propre silo.