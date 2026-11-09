# Adaptation PWA et capacités des plateformes

**Statut :** référence de conception V1 — implémentation et validation appareil réel à poursuivre.  
**Portée :** Android, iOS, tablettes et ordinateurs, dans les navigateurs compatibles et en mode installé.

## 1. Principe directeur

Vitalis s'adapte aux **capacités réellement disponibles**, et non à une supposition fondée uniquement sur la marque, le nom du système ou le navigateur déclaré.

L'application doit d'abord vérifier si une fonction est disponible et utilisable. Elle choisit ensuite le meilleur parcours compatible, avec une solution de repli claire lorsque la fonction manque ou que l'autorisation n'est pas accordée.

La détection de plateforme ne doit jamais devenir une condition qui bloque inutilement l'accès à une fonction pourtant prise en charge.

## 2. Ordre de décision

1. **Détection de capacité :** vérifier l'API et son comportement disponible au moment de l'action.
2. **Contexte d'exécution :** distinguer navigateur, mode autonome/installé et contraintes de fenêtre.
3. **Préférences et autorisations :** respecter les permissions accordées, refusées ou non encore demandées.
4. **Adaptation de l'interface :** proposer la meilleure interaction prise en charge.
5. **Solution de repli :** conserver une action compréhensible lorsque la capacité est absente ou échoue.

Le User-Agent et le nom commercial d'un appareil ne sont que des indices secondaires. Ils ne doivent pas remplacer la détection fonctionnelle.

## 3. Capacités à prendre en compte

| Domaine | Capacité à vérifier | Comportement attendu si indisponible |
| --- | --- | --- |
| Installation | événement d'installation, mode autonome, plateforme compatible | proposer l'accès web et expliquer simplement l'installation manuelle si elle est possible |
| Service Worker | prise en charge, enregistrement, contrôle de la page, mise à jour | conserver une expérience web fonctionnelle sans promettre le hors-ligne |
| Réseau | état en ligne/hors ligne, échec réel des requêtes, reprise | conserver localement uniquement les actions prévues et annoncer leur état réel |
| Position | API, permission, précision et délai | expliquer pourquoi la position manque et permettre de réessayer ou de continuer sans elle lorsque le parcours le permet |
| Notifications | permission, API et contexte sécurisé | garder les notifications consultables dans l'application |
| Navigation | historique, bouton retour, clavier, gestes et mode autonome | fournir un retour cohérent sans détourner le comportement natif |
| Affichage | viewport, orientation, zones sûres, pointeur et densité d'interaction | réorganiser la mise en page sans masquer de fonction essentielle |
| Mouvement | préférence de réduction des animations | réduire ou supprimer les mouvements non essentiels |
| Partage et presse-papiers | API disponible et permission/contexte requis | proposer une copie ou un partage manuel explicite |
| Performance | mémoire, cœurs, visibilité et capacités observables | alléger les effets et le travail non essentiel sans retirer les fonctions utiles |

Cette matrice est un contrat de conception. Elle ne signifie pas que chaque API ou chaque solution de repli est déjà implémentée.

## 4. Règles d'implémentation

- Centraliser la lecture des capacités dans la couche plateforme ; éviter les tests dispersés dans les composants.
- Garder séparées les informations de viewport, de pointeur, de préférences système et les capacités fonctionnelles des API.
- Ne demander une permission qu'au moment où l'utilisateur déclenche une fonction qui en a besoin, avec une explication compréhensible.
- Distinguer permission refusée, fonction non prise en charge, délai dépassé et erreur temporaire.
- Ne jamais simuler une réussite lorsque le navigateur ou le système n'a pas confirmé l'opération.
- Ne jamais supposer qu'Android, iOS ou un navigateur donné autorise toujours une fonction.
- Ne pas multiplier les chemins spécifiques à une marque lorsque la détection de capacité suffit.
- Les solutions de repli doivent rester accessibles, localisées et testables.

## 5. PWA, cycle de vie et mises à jour

- Le manifeste décrit l'identité de l'application et ses possibilités d'installation ; il ne prouve pas l'installabilité sur tous les appareils.
- Le Service Worker doit être enregistré une seule fois, dans un contexte compatible et selon la politique de production définie.
- Le mode installé/standalone doit être détecté sans confondre installation et simple ouverture dans un navigateur.
- Les mises à jour doivent être signalées clairement ; l'utilisateur ne doit pas perdre une action en attente lors d'un rechargement.
- Le cache ne doit pas intercepter les API ou Server Functions avec une règle générique de navigation.
- Le hors-ligne ne doit être annoncé que pour les fonctions réellement disponibles hors connexion.
- La synchronisation reprend selon les règles métier et les capacités du navigateur ; aucune promesse de synchronisation en arrière-plan ne doit être faite sans preuve sur la plateforme concernée.

## 6. Fondations existantes et limites connues

- `src/lib/platform/useDevice.ts` fournit actuellement la classe d'appareil, le viewport, l'orientation, le pointeur tactile, la préférence de réduction du mouvement et une approximation de capacité matérielle.
- `useDevice` n'est **pas** encore une couche complète de détection des capacités PWA ou des API de plateforme.
- `src/platform/pwa/install.ts` et `src/platform/pwa/update.ts` portent les fondations d'installation et de mise à jour.
- `public/manifest.webmanifest` porte les métadonnées PWA.
- Les composants ne doivent pas étendre `useDevice` à toutes les capacités sans contrat explicite ; les capacités fonctionnelles devront être regroupées dans une couche dédiée et testable.

## 7. Matrice de validation

Chaque capacité utilisée dans un parcours V1 doit être testée au minimum dans les contextes pertinents suivants :

- Android : navigateur courant et mode installé.
- iOS : Safari et mode ajouté à l'écran d'accueil lorsque pris en charge.
- Tablette : portrait et paysage.
- Desktop : navigateur avec clavier, souris et fenêtre redimensionnable.
- Réseau : connexion stable, réseau lent, perte réseau, retour réseau.
- Permissions : non demandée, accordée, refusée, retirée après accord.
- Préférences : mouvement réduit, pointeur grossier et fin.

Les résultats doivent préciser l'appareil, la version du système, le navigateur, son mode d'exécution, la capacité testée et le résultat observé. Une capture visuelle seule ne prouve pas le fonctionnement d'une API.

## 8. Critères d'acceptation

- Une fonction n'est affichée comme disponible que si la capacité correspondante est vérifiée.
- Une absence de capacité n'empêche pas les parcours qui peuvent fonctionner sans elle.
- Les permissions sont demandées au bon moment et leur refus est traité sans blocage inutile.
- Les états d'erreur et les solutions de repli sont humains, localisés et accessibles.
- Les tests automatisés couvrent les branches de capacité et les solutions de repli.
- Les parcours Android/iOS réels sont vérifiés avant toute déclaration de compatibilité certifiée.

## Références liées

- [Standards UX et accessibilité — Phase 2](./phase-2-ux-standards.md)
- [Performance PWA](../06-operations/performance-pwa.md)
- [Standards de navigation mobile](../02-architecture/mobile-navigation-standards.md)
