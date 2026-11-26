import type { Locale } from "./messages";

/** Long-form copy loaded only with the lazy /vision route. */
export const visionMessages = {
  fr: {
    "vision.photo.flash.alt":
      "Une femme souriante porte un bidon reçu lors d’une distribution, entourée de voisines.",
    "vision.photo.scan.alt":
      "Un homme en tenue traditionnelle consulte son téléphone sur une terrasse.",
    "vision.photo.reel.alt":
      "Un groupe de femmes réunies dans une cour se salue avec enthousiasme.",
    "vision.photo.radar.alt":
      "Une femme concentrée regarde au loin devant son ordinateur portable.",
    "vision.back": "Retour à l’accueil",
    "vision.eyebrow": "Au-delà des écrans",
    "vision.title": "Vitalis rapproche les personnes des possibilités utiles.",
    "vision.intro":
      "Vitalis est un espace de découverte, de confiance et d’opportunités concrètes. Il aide à transformer un besoin, une idée, une compétence ou une occasion en une action utile dans la vie réelle.",
    "vision.what.title": "Ce qu’est Vitalis — et ce qu’il n’est pas",
    "vision.what.body":
      "Vitalis met en relation des besoins, des propositions, des ressources, des compétences et des personnes autour d’actions concrètes : trouver de l’aide, proposer un service, repérer une possibilité, partager une information utile ou créer une relation de confiance.",
    "vision.what.not":
      "Vitalis n’a pas vocation à être un réseau social fondé sur la popularité, un fil de divertissement ou une messagerie libre permanente. Les échanges doivent rester liés à une intention, une opportunité ou une action identifiable.",
    "vision.engines.title": "Les quatre moteurs, chacun avec son rôle",
    "vision.engines.intro":
      "Ils sont complémentaires, mais ne font pas la même chose. Choisissez celui qui correspond à ce que vous voulez faire maintenant.",
    "vision.engine.label": "Moteur",
    "vision.engine.actionTitle": "L’action principale",
    "vision.engine.stepsTitle": "Comment l’utiliser",
    "vision.engine.flash.title": "Flash — partager une information utile",
    "vision.engine.flash.role":
      "Flash sert à préparer un besoin, une proposition ou une information courte, locale et limitée dans le temps. La création d’un brouillon est disponible ; sa publication ne l’est pas encore dans le parcours actuel.",
    "vision.engine.flash.action":
      "Préparer un brouillon Flash : décrivez simplement ce que vous cherchez ou proposez, puis vérifiez les informations avant d’enregistrer le brouillon sur cet appareil.",
    "vision.engine.flash.steps":
      "Ouvrez Flash pour découvrir les publications disponibles ou préparer un nouveau brouillon. Vous pouvez reprendre et modifier vos brouillons enregistrés sur cet appareil.",
    "vision.engine.flash.boundary":
      "Un brouillon Flash n’est pas une publication visible par les autres. La diffusion ne commence qu’après une véritable publication, lorsque ce parcours sera disponible ; elle ne donne pas automatiquement accès au profil complet.",
    "vision.engine.scan.title": "Scan — chercher maintenant",
    "vision.engine.scan.role":
      "Scan répond à une recherche ponctuelle : repérer les publications Flash actives et pertinentes dans le périmètre que vous choisissez, selon les sources réellement disponibles.",
    "vision.engine.scan.action":
      "Définir ce que vous recherchez et le périmètre autorisé, lancer le scan, puis examiner les résultats et leur contexte.",
    "vision.engine.scan.steps":
      "Ouvrez Scan, vérifiez les critères proposés, lancez la recherche et consultez les résultats retournés. Un scan est une recherche à un instant donné.",
    "vision.engine.scan.boundary":
      "Scan ne publie pas à votre place, ne montre pas automatiquement les personnes simplement présentes et ne continue pas à surveiller après la recherche. Un résultat ne doit apparaître que si sa source est effectivement raccordée.",
    "vision.engine.reel.title": "En direct — se retrouver au même endroit",
    "vision.engine.reel.role":
      "En direct concerne la présence à proximité, ici et maintenant. Vous choisissez séparément si vous souhaitez découvrir les personnes proches et si vous souhaitez rendre votre propre présence visible.",
    "vision.engine.reel.action":
      "Autoriser la découverte si vous le souhaitez, régler votre présence et votre rayon, puis activer volontairement votre présence. Vous pouvez consulter les profils autorisés et envoyer un bip lorsque les conditions le permettent.",
    "vision.engine.reel.steps":
      "Entrez dans En direct, prenez connaissance de la demande de localisation, choisissez vos réglages et activez votre présence uniquement si vous le décidez. Vous pouvez arrêter cette présence et gérer les bips ou relations disponibles.",
    "vision.engine.reel.boundary":
      "La localisation accordée à un autre moteur ne vaut pas accord pour En direct. Découvrir et être visible sont deux choix distincts. Le mode invité reste temporaire ; il ne donne pas de droits de membre ni d’historique persistant.",
    "vision.engine.radar.title": "Radar — suivre une recherche",
    "vision.engine.radar.role":
      "Radar permet de préparer une intention de recherche et d’enregistrer un brouillon privé. Le suivi automatique, les correspondances et les alertes ne sont pas encore actifs.",
    "vision.engine.radar.action":
      "Décrire ce que vous souhaitez trouver, définir les critères utiles et enregistrer un brouillon privé de recherche sur cet appareil.",
    "vision.engine.radar.steps":
      "Ouvrez Radar, préparez un brouillon de recherche, consultez les brouillons enregistrés et ajustez ou annulez ceux dont vous n’avez plus besoin.",
    "vision.engine.radar.boundary":
      "Radar est destiné à conserver une intention dans la durée, mais la version actuelle enregistre seulement un brouillon privé. Aucun suivi automatique, aucune correspondance et aucune alerte ne sont actifs.",
    "vision.principles.title": "Les principes qui guident l’expérience",
    "vision.principle.trust.title": "La confiance avant la popularité",
    "vision.principle.trust.body":
      "La crédibilité doit s’appuyer sur des éléments compréhensibles, des actions et des références utiles, pas sur une course aux likes ou aux étoiles.",
    "vision.principle.action.title": "L’action avant la discussion",
    "vision.principle.action.body":
      "Les échanges servent à avancer sur un besoin ou une opportunité précise. Vitalis privilégie des relations utiles, avec des choix et des limites clairs.",
    "vision.honesty.title": "Ce qui est disponible doit rester clair",
    "vision.honesty.body":
      "Les écrans peuvent présenter des exemples pédagogiques pour expliquer un parcours. Ils doivent être identifiés comme des exemples et ne jamais se faire passer pour des publications, des personnes proches, des résultats ou des alertes réels.",
    "vision.honesty.privacy":
      "Chaque moteur applique ses propres règles de visibilité et de consentement. Une autorisation donnée dans un espace ne doit pas être considérée comme une autorisation générale dans toute l’application.",
    "vision.end.title": "Vous savez maintenant où commencer.",
    "vision.end.body":
      "Choisissez le moteur qui correspond à votre besoin du moment. Vous pourrez revenir à cette présentation à tout moment.",
    "vision.deep.flash.why":
      "Quand vous avez quelque chose d’utile à faire savoir, Flash vous aide à le formuler et à préparer un brouillon avec la durée et la zone souhaitées. Cela peut être un besoin ponctuel, un service proposé, une aide recherchée ou une information locale.",
    "vision.deep.flash.use":
      "Décrivez votre besoin ou votre proposition avec vos mots. Précisez la catégorie, le moment concerné et la portée souhaitée. Relisez le récapitulatif puis enregistrez le brouillon sur cet appareil. La publication n’est pas encore activée dans le parcours actuel.",
    "vision.deep.flash.flow":
      "1. Choisir ce que vous souhaitez préparer. 2. Expliquer simplement la situation. 3. Ajouter le moment et la zone utiles. 4. Vérifier puis enregistrer le brouillon sur cet appareil. 5. Le retrouver et le modifier avant toute publication future.",
    "vision.deep.flash.example":
      "Exemples : chercher une personne pour garder des enfants ce week-end, proposer un repas pour une réunion, demander un coup de main pour un déménagement dans deux heures. Chaque exemple affiché dans la démonstration reste clairement marqué « Exemple ».",
    "vision.deep.flash.difference":
      "Une fois publiée, une fiche Flash informe les autres. Dans le parcours actuel, la création conserve un brouillon local qui n’est pas diffusé ; Flash ne suit pas automatiquement votre recherche et ne signale pas votre présence physique.",
    "vision.deep.scan.why":
      "Scan sert à chercher maintenant. Il interroge les publications Flash actives qui correspondent aux critères et à la zone autorisée, puis présente les résultats réellement disponibles à cet instant.",
    "vision.deep.scan.use":
      "Indiquez ce que vous cherchez, choisissez les critères et la zone proposés, lancez la recherche puis examinez chaque résultat, son contexte et sa date. Vous gardez la maîtrise du lancement : une recherche ponctuelle ne devient pas une surveillance continue.",
    "vision.deep.scan.flow":
      "1. Formuler une recherche. 2. Définir les critères disponibles. 3. Choisir la zone. 4. Lancer Scan. 5. Lire les résultats et ouvrir les détails utiles.",
    "vision.deep.scan.example":
      "Exemple : rechercher un Flash actif proposant une aide au déménagement dans votre secteur. Si aucune publication pertinente n’est disponible ou si la source n’est pas connectée, Scan doit le dire clairement plutôt que d’inventer un résultat.",
    "vision.deep.scan.difference":
      "Scan répond à une question à un instant donné. Il ne crée pas de publication, ne rend pas votre présence visible et ne continue pas à chercher après la fin de la recherche.",
    "vision.deep.reel.why":
      "En direct concerne les personnes qui se trouvent réellement dans un même lieu ou à proximité au même moment : un événement, un quartier, une salle ou un espace public. La présence est volontaire et temporaire.",
    "vision.deep.reel.use":
      "À l’entrée, choisissez séparément si vous souhaitez découvrir les présences proches et si vous souhaitez rendre la vôtre visible. Réglez les options proposées, activez votre présence uniquement si vous le décidez, puis consultez les profils autorisés et envoyez un bip si les conditions le permettent. Vous pouvez arrêter votre présence.",
    "vision.deep.reel.flow":
      "1. Ouvrir En direct. 2. Examiner la demande de localisation propre à cet espace. 3. Choisir de découvrir les alentours. 4. Préparer puis activer volontairement sa présence. 5. Consulter les profils, envoyer ou gérer les bips et les mises en relation. 6. Arrêter la présence quand on le souhaite.",
    "vision.deep.reel.example":
      "Exemple : vous arrivez à un concert et choisissez de rendre votre présence visible aux personnes proches. Vous pouvez aussi choisir de découvrir sans vous rendre visible. L’un n’implique jamais l’autre.",
    "vision.deep.reel.difference":
      "En direct n’est ni un fil de publications ni un suivi permanent. Une autorisation donnée à Flash ou Scan ne vaut pas autorisation ici. Le mode invité reste temporaire et ne donne pas les droits d’un membre ni un historique persistant.",
    "vision.deep.radar.why":
      "Radar est conçu pour préparer une intention de recherche à conserver dans le temps. Dans la version actuelle, les critères sont enregistrés comme brouillon privé ; le suivi automatique n’est pas encore actif.",
    "vision.deep.radar.use":
      "Décrivez ce que vous souhaitez trouver, indiquez la zone, la portée et la durée proposées, puis enregistrez le brouillon privé sur cet appareil. Vous pourrez le consulter, modifier ses critères ou l’annuler. Aucun résultat ni aucune alerte n’est généré par ce brouillon.",
    "vision.deep.radar.flow":
      "1. Décrire ce que vous souhaitez trouver. 2. Définir les critères et la zone. 3. Choisir une durée indicative. 4. Enregistrer un brouillon privé. 5. Le modifier ou l’annuler. Le suivi et les alertes restent à développer.",
    "vision.deep.radar.example":
      "Exemple : préparer un brouillon pour une recherche de garde d’enfants les prochains week-ends, ou une opportunité professionnelle dans une zone définie. Ce brouillon ne lance pas encore de suivi et ne signale aucune correspondance.",
    "vision.deep.radar.difference":
      "Radar conserve actuellement un brouillon privé ; Scan effectue une recherche ponctuelle à partir des sources disponibles. Le suivi automatique et les alertes Radar restent à développer.",
    "vision.deep.status.title": "Ce qui est disponible, ce qui se prépare",
    "vision.deep.status.body":
      "Vitalis évolue moteur par moteur. Certaines actions peuvent déjà être proposées, d’autres restent en préparation ou dépendent d’une source serveur. L’écran doit toujours distinguer une action réellement exécutée, un brouillon conservé et une fonction annoncée mais pas encore active.",
    "vision.deep.privacy.title": "Vous gardez la maîtrise",
    "vision.deep.privacy.body":
      "La localisation, la visibilité, les notifications et les mises en relation ont des règles propres à chaque moteur. Une permission n’est jamais globale. Vous devez pouvoir comprendre ce qui est partagé, avec qui, pendant combien de temps et comment arrêter le partage.",
    "vision.deep.visual.flashTag": "FLASH · EXEMPLE",
    "vision.deep.visual.flashTitle": "Un coup de main ?",
    "vision.deep.visual.flashDescription": "Déménagement aujourd’hui, vers 16 h",
    "vision.deep.visual.today": "Aujourd’hui",
    "vision.deep.visual.nearby": "À proximité",
    "vision.deep.visual.flashFooter": "Publication courte",
    "vision.deep.visual.scan": "Recherche ponctuelle",
    "vision.deep.visual.live": "Présence volontaire",
    "vision.deep.visual.radarSearch": "Brouillon de recherche",
    "vision.deep.visual.radarCriteria": "Critères enregistrés",
    "vision.deep.visual.radarNew": "Nouvelle possibilité",
    "vision.deep.visual.radarSource": "Si une source la signale",
    "vision.deep.visual.radarActions": "Suivre · Ajuster · Arrêter",
    "vision.deep.open": "Ouvrir",
    "vision.deep.discover": "Découvrir les quatre moteurs",
    "vision.deep.realLife": "Dans la vie réelle",
    "vision.deep.unique": "Ce qui rend ce moteur unique",
    "vision.deep.remember": "À retenir",
    "vision.deep.whatHeading": "Une application tournée vers la vie réelle.",
    "vision.deep.enginesHeading": "Quatre façons d’agir, un même objectif.",
    "vision.deep.navLabel": "Accès direct aux moteurs",
    "vision.end.action": "Revenir à l’accueil",
  },
  en: {
    "vision.photo.flash.alt":
      "A smiling woman carries a container received at a distribution, surrounded by neighbours.",
    "vision.photo.scan.alt": "A man in traditional attire checks his phone on a rooftop.",
    "vision.photo.reel.alt": "A group of women gathered in a courtyard greet each other warmly.",
    "vision.photo.radar.alt": "A focused woman looks into the distance in front of her laptop.",
    "vision.back": "Back to home",
    "vision.eyebrow": "Beyond the screens",
    "vision.title": "Vitalis brings people closer to useful possibilities.",
    "vision.intro":
      "Vitalis is a place for discovery, trust, and practical opportunities. It helps turn a need, an idea, a skill, or an opening into a useful real-world action.",
    "vision.what.title": "What Vitalis is — and what it is not",
    "vision.what.body":
      "Vitalis connects needs, offers, resources, skills, and people around practical actions: finding help, offering a service, spotting an opportunity, sharing useful information, or building a trusted connection.",
    "vision.what.not":
      "Vitalis is not intended to be a popularity-driven social network, an entertainment feed, or an always-open messaging service. Interactions should relate to a clear intention, opportunity, or action.",
    "vision.engines.title": "Four engines, each with a distinct role",
    "vision.engines.intro":
      "They complement one another, but they do different jobs. Choose the one that matches what you want to do now.",
    "vision.engine.label": "Engine",
    "vision.engine.actionTitle": "Main action",
    "vision.engine.stepsTitle": "How to use it",
    "vision.engine.flash.title": "Flash — share useful information",
    "vision.engine.flash.role":
      "Flash helps you prepare a short-lived, local need, offer, or piece of information. The current flow saves a draft; publication is not yet available.",
    "vision.engine.flash.action":
      "Prepare a Flash draft: briefly describe what you need or offer, review the details, and save the draft on this device.",
    "vision.engine.flash.steps":
      "Open Flash to discover available posts or prepare a new draft. You can revisit and edit drafts saved on this device.",
    "vision.engine.flash.boundary":
      "A Flash draft is not visible to other people. Distribution starts only after an actual publication, when that flow becomes available; it does not automatically grant access to the full profile.",
    "vision.engine.scan.title": "Scan — search right now",
    "vision.engine.scan.role":
      "Scan answers a one-time search: find active and relevant Flash posts within the area you choose, using sources that are actually available.",
    "vision.engine.scan.action":
      "Choose what you are looking for and the permitted search area, run the scan, then review the returned results and their context.",
    "vision.engine.scan.steps":
      "Open Scan, check the available criteria, start the search, and review the returned results. A scan is a search at a specific moment.",
    "vision.engine.scan.boundary":
      "Scan does not publish on your behalf, automatically show people simply because they are nearby, or keep monitoring after the search. A result should only appear when its source is genuinely connected.",
    "vision.engine.reel.title": "Live — meet people in the same place",
    "vision.engine.reel.role":
      "Live is about nearby presence, here and now. You separately choose whether to discover nearby people and whether to make your own presence visible.",
    "vision.engine.reel.action":
      "Allow discovery if you wish, configure your presence and radius, then voluntarily activate your presence. You can view permitted profiles and send a ping when the required conditions are met.",
    "vision.engine.reel.steps":
      "Enter Live, review the location request, choose your settings, and activate your presence only if you decide to. You can stop sharing and manage available pings or connections.",
    "vision.engine.reel.boundary":
      "Location permission granted to another engine does not grant permission to Live. Discovering others and being visible are separate choices. Guest mode is temporary; it does not grant member rights or persistent history.",
    "vision.engine.radar.title": "Radar — keep track of a search",
    "vision.engine.radar.role":
      "Radar lets you prepare a search intention and save it as a private draft. Automatic tracking, matches, and alerts are not active yet.",
    "vision.engine.radar.action":
      "Describe what you want to find, set useful criteria, and save a private search draft on this device.",
    "vision.engine.radar.steps":
      "Open Radar, prepare a search draft, review saved drafts, and edit or cancel those you no longer need.",
    "vision.engine.radar.boundary":
      "Radar is intended to retain a search intention over time, but the current version only saves a private draft. Automatic tracking, matches, and alerts are not active.",
    "vision.principles.title": "The principles behind the experience",
    "vision.principle.trust.title": "Trust before popularity",
    "vision.principle.trust.body":
      "Credibility should be based on understandable signals, actions, and useful references, not a race for likes or stars.",
    "vision.principle.action.title": "Action before discussion",
    "vision.principle.action.body":
      "Interactions help move a specific need or opportunity forward. Vitalis favors useful connections with clear choices and boundaries.",
    "vision.honesty.title": "Availability must always be clear",
    "vision.honesty.body":
      "Screens may show teaching examples to explain a journey. They must be labelled as examples and never presented as real posts, nearby people, results, or alerts.",
    "vision.honesty.privacy":
      "Each engine applies its own visibility and consent rules. Permission granted in one space must never be treated as blanket permission across the app.",
    "vision.end.title": "You now know where to start.",
    "vision.end.body":
      "Choose the engine that matches your current need. You can return to this guide at any time.",
    "vision.deep.flash.why":
      "When you have something useful to share, Flash helps you put it into words and prepare a draft with a chosen time and area. It can be a one-off need, a service offer, a request for help, or useful local information.",
    "vision.deep.flash.use":
      "Describe your need or offer in your own words. Choose a category, the relevant time, and the intended reach. Review the summary and save the draft on this device. Publication is not yet active in the current flow.",
    "vision.deep.flash.flow":
      "1. Choose what you want to prepare. 2. Explain the situation simply. 3. Add the useful time and area. 4. Review and save the draft on this device. 5. Revisit and edit it before any future publication.",
    "vision.deep.flash.example":
      "Examples: find someone to look after children this weekend, offer to prepare food for a gathering, or ask for moving help in two hours. Every demonstration example remains clearly labelled “Example”.",
    "vision.deep.flash.difference":
      "Once published, a Flash post informs others. The current flow saves a local draft that is not distributed; Flash does not automatically track your search or announce your physical presence.",
    "vision.deep.scan.why":
      "Scan is for searching right now. It checks active Flash publications that match the available criteria and permitted area, then presents the results genuinely available at that moment.",
    "vision.deep.scan.use":
      "Say what you are looking for, choose the available criteria and area, run the search, then review each result, its context, and its date. You control when it starts: a one-off search does not become continuous monitoring.",
    "vision.deep.scan.flow":
      "1. Describe a search. 2. Set the available criteria. 3. Choose an area. 4. Run Scan. 5. Review results and open useful details.",
    "vision.deep.scan.example":
      "Example: look for an active Flash offering moving help in your area. If no relevant publication is available or the source is not connected, Scan must say so rather than inventing a result.",
    "vision.deep.scan.difference":
      "Scan answers a question at a specific moment. It does not create a publication, make your presence visible, or keep searching after the search ends.",
    "vision.deep.reel.why":
      "Live is about people who are genuinely in the same place or nearby at the same time: an event, neighbourhood, room, or public space. Presence is voluntary and temporary.",
    "vision.deep.reel.use":
      "When you enter, choose separately whether you want to discover nearby presence and whether you want to make your own presence visible. Review the available settings, activate your presence only if you choose, then view permitted profiles and send a ping when conditions allow. You can stop sharing at any time.",
    "vision.deep.reel.flow":
      "1. Open Live. 2. Review the location request for this space. 3. Choose whether to discover nearby people. 4. Prepare and voluntarily activate your presence. 5. View profiles, send or manage pings and connections. 6. Stop your presence whenever you wish.",
    "vision.deep.reel.example":
      "Example: you arrive at a concert and choose to make your presence visible to people nearby. You may also choose to discover others without becoming visible. One never implies the other.",
    "vision.deep.reel.difference":
      "Live is neither a publication feed nor permanent tracking. Permission granted to Flash or Scan does not grant permission here. Guest mode is temporary and does not provide member rights or persistent history.",
    "vision.deep.radar.why":
      "Radar is designed to prepare a search intention for future use. In the current version, criteria are saved as a private draft; automatic tracking is not active yet.",
    "vision.deep.radar.use":
      "Describe what you want to find, set the proposed area, reach, and duration, then save the private draft on this device. You can review it, change its criteria, or cancel it. This draft does not generate results or alerts.",
    "vision.deep.radar.flow":
      "1. Describe what you want to find. 2. Set criteria and area. 3. Choose an indicative duration. 4. Save a private draft. 5. Edit or cancel it. Automatic tracking and alerts remain future work.",
    "vision.deep.radar.example":
      "Example: prepare a draft for childcare on upcoming weekends, or a job opportunity in a defined area. This draft does not start tracking or report matches.",
    "vision.deep.radar.difference":
      "Radar currently saves a private draft; Scan performs a one-off search using available sources. Automatic Radar tracking and alerts remain future work.",
    "vision.deep.status.title": "What is available and what is being prepared",
    "vision.deep.status.body":
      "Vitalis evolves engine by engine. Some actions may already be available, others are being prepared or depend on a server source. The interface must always distinguish an action that actually ran, a saved draft, and a feature that is announced but not yet active.",
    "vision.deep.privacy.title": "You stay in control",
    "vision.deep.privacy.body":
      "Location, visibility, notifications, and connections have rules specific to each engine. Permission is never global. You should be able to understand what is shared, with whom, for how long, and how to stop sharing.",
    "vision.deep.visual.flashTag": "FLASH · EXAMPLE",
    "vision.deep.visual.flashTitle": "Need an extra hand?",
    "vision.deep.visual.flashDescription": "Moving help today, around 4 pm",
    "vision.deep.visual.today": "Today",
    "vision.deep.visual.nearby": "Nearby",
    "vision.deep.visual.flashFooter": "Short-lived post",
    "vision.deep.visual.scan": "One-time search",
    "vision.deep.visual.live": "Voluntary presence",
    "vision.deep.visual.radarSearch": "Saved search draft",
    "vision.deep.visual.radarCriteria": "Saved criteria",
    "vision.deep.visual.radarNew": "New possibility",
    "vision.deep.visual.radarSource": "When a source reports it",
    "vision.deep.visual.radarActions": "Follow · Adjust · Stop",
    "vision.deep.open": "Open",
    "vision.deep.discover": "Explore the four engines",
    "vision.deep.realLife": "In real life",
    "vision.deep.unique": "What makes this engine different",
    "vision.deep.remember": "Remember",
    "vision.deep.whatHeading": "An app built around real life.",
    "vision.deep.enginesHeading": "Four ways to take action, one shared purpose.",
    "vision.deep.navLabel": "Jump to an engine",
    "vision.end.action": "Return to home",
  },
} as const;

export type VisionMessageKey = keyof typeof visionMessages.fr;
export function getVisionMessage(locale: Locale, key: VisionMessageKey): string {
  return visionMessages[locale][key] ?? visionMessages.fr[key];
}
