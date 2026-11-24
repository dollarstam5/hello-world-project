# Composition

Cette couche assemble les modules métier pour former des expériences produit sans reprendre leurs règles métier.

- `widgets/` : blocs d'interface composés de plusieurs modules.
- `layouts/` : structures de présentation responsive et shells d'expérience.
- `experiences/` : parcours/expériences complètes assemblant plusieurs capacités.

La coque globale, le bootstrap, les guards et le routage restent dans `src/app/`. Les routes TanStack restent dans `src/routes/`.

Tout déplacement depuis `src/widgets/`, `src/layouts/` ou `src/components/experience/` exige un inventaire des importeurs et une migration atomique avec compatibilité temporaire.
