# Scan — fiche de cadrage du moteur

## Statut
Dossier de cadrage initial. Il réserve le périmètre du moteur et distingue les décisions connues des sujets à spécifier. Il ne certifie pas l'état d'implémentation du runtime.

## Rôle du moteur
Scan permet de **démarrer le scanner des possibilités**. Il répond à une recherche ponctuelle déclenchée par l'utilisateur : qu'est-ce qui est disponible ou pertinent maintenant, dans le périmètre que je viens de choisir ?

Scan n'est ni un flux de publication, ni une présence en temps réel, ni une mission de recherche continue.

## Repères d'interface déjà établis
- En-tête propre à Scan : icône et nom du moteur à gauche, commandes propres à Scan à droite.
- Aucun titre, icône ou décor au centre de l'en-tête.
- L'action principale au centre de la page est le démarrage du scanner.
- Les informations et résultats propres à Scan apparaissent sous l'en-tête.

## Configuration avant un Scan
Avant chaque lancement, l'utilisateur définit ou confirme les paramètres qui déterminent ce que le moteur explore :
- **Rayon de scan** : distance maximale autour du point de référence autorisé pour ce scan.
- **Types de résultats recherchés** : possibilités ou catégories que l'utilisateur souhaite détecter.
- **Mode de sélection** : filtre strict (exclure les catégories non sélectionnées) ou priorité/classement (mettre certains résultats en avant sans masquer les autres résultats pertinents).
- **Point de référence** : position actuelle ou autre lieu choisi et autorisé, selon les possibilités réellement prises en charge.

Distinguer :
1. les préférences par défaut enregistrées dans les paramètres de Scan ;
2. les paramètres du lancement en cours, que l'utilisateur peut ajuster avant de démarrer.

Les réglages par défaut ne doivent jamais empêcher l'utilisateur de voir les paramètres réellement appliqués au scan en cours. Le rayon, les catégories, le mode de sélection et le point de référence choisis doivent être transmis au moteur et appliqués par les sources de données. L'interface ne doit jamais afficher un paramètre comme appliqué si le service de recherche ne le respecte pas.

Les valeurs de rayon disponibles, les catégories et les modalités de choix du point de référence restent à valider. Ne pas reprendre automatiquement les rayons d'Instant ou de Radar : ces paramètres répondent à des usages différents.

## Sources et limites de recherche
- La documentation technique historique de Radar identifie les Flash actifs comme une source de recherche de Scan. Cette source constitue le premier périmètre documentaire connu ; sa disponibilité effective dans le runtime doit être vérifiée.
- D'autres sources (par exemple des disponibilités ou des opportunités issues d'autres domaines) ne peuvent être ajoutées qu'après définition de leur contrat, de leur fraîcheur, de leurs règles d'accès et de leur coût.
- Scan ne doit pas présenter une source non raccordée comme consultée.
- Un résultat doit permettre d'identifier sa source, sa date ou fraîcheur connue, et les critères qui ont conduit à sa présentation.
- La recherche est ponctuelle : elle s'achève avec le scan et ses résultats. Toute surveillance ultérieure dans le temps relève d'une mission Radar ou d'une veille explicitement créée.

## Frontière avec les autres moteurs
- **Instant** montre les présences proches maintenant ; Scan ne recherche pas les personnes simplement parce qu'elles sont présentes.
- **Flash** publie des informations courtes ; Scan peut découvrir les Flash actifs autorisés dans son périmètre, sans modifier leur contenu ni les autorisations de leur auteur.
- **Radar** suit une intention dans le temps ; Scan ne crée pas automatiquement une mission Radar et ne continue pas à chercher après la fin du scan.
- **Veille** peut présenter des tendances agrégées ; Scan n'accède pas aux données personnelles ou aux missions privées utilisées pour ces analyses.

## Utilisation du profil et confidentialité
Scan définit sa propre projection du profil selon les informations strictement nécessaires à ses résultats et interactions. Il ne doit pas hériter automatiquement du profil complet ni des réglages de visibilité d'Instant ou de Flash.

Les champs visibles, l'éventuel accès au profil complet et les règles membre/invité restent à définir dans le contrat propre à Scan. En attendant cette décision, ne pas supposer qu'un résultat de scan autorise l'affichage de l'identité complète d'une personne.

Les paramètres de recherche (rayon, catégories, priorité et point de référence) ne constituent pas des autorisations de profil et ne doivent pas élargir la visibilité des personnes ou publications. Toute donnée non autorisée est exclue de la réponse côté service/API.

## Sections à compléter pendant la conception
- Catégories de possibilités et sources V1 autorisées.
- Valeurs de rayon et point de référence.
- Déclenchement, progression, arrêt et reprise du scan.
- Présentation, classement et actualisation des résultats.
- Permissions système et consentements nécessaires.
- États sans résultat, hors ligne, erreur et limitation.
- Données, API, sécurité, coûts et critères de test.

## Garde-fous
- Le scanner ne doit pas prétendre détecter une possibilité si aucune source réelle n'est raccordée.
- Les permissions sont demandées au moment où elles deviennent utiles.
- V1 privilégie des critères simples, explicables et peu coûteux.
- Les choix de visibilité du profil restent propres à Scan.
- Le rayon et les critères affichés correspondent aux paramètres réellement appliqués côté service.
- Un scan ponctuel ne doit pas être présenté comme une surveillance continue.
