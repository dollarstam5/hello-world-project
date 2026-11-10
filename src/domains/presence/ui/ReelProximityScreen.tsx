import { useEffect, useState, type CSSProperties } from "react";
import { requestReelLocation } from "@/domains/presence/api/reel-location.client";
import { resolveReelZone } from "@/domains/presence/api/reel-zone.functions";
import { endReelPresence, getMyActiveReelPresence, listReelNearbyPresence, startReelPresence, type ReelPresence } from "@/domains/presence/api/reel-presence.client";
import { useAccessMode } from "@/domains/access-mode";
import { evaluateReelAccess } from "@/domains/presence/policy/reel-access-policy";
import {
  ArrowLeft, Bell, Bluetooth, Check, ChevronDown, CircleUserRound, Globe, History,
  MapPin, RadioTower, Settings2, SlidersHorizontal, UsersRound, X,
} from "lucide-react";
import "./reel-proximity.css";

export interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
  initials: string;
  angle: number;
  description?: string | null;
  category?: string | null;
  locationLabel?: string | null;
  distanceLabel?: string | null;
}

type Panel = "settings" | "activity" | "people" | "global" | null;
type ActivityTab = "notifications" | "bips" | "connections";

const MAX_RING_PEOPLE = 9;
const DURATIONS = ["30 min", "1 h", "2 h", "3 h", "6 h", "12 h", "24 h"];
const RADII = ["10 m", "25 m", "50 m", "100 m", "1 km"];

function PersonAvatar({ person, size = "person" }: { person: Person; size?: "person" | "small" | "me" }) {
  return (
    <span className={`reel-avatar reel-avatar--${size}`} aria-label={person.name}>
      {person.avatarUrl ? (
        <img
          src={person.avatarUrl}
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.parentElement?.classList.add("reel-avatar--failed");
          }}
        />
      ) : person.initials ? (
        <span className="reel-avatar__initials" aria-hidden="true">{person.initials}</span>
      ) : (
        <CircleUserRound className="reel-avatar__silhouette" aria-hidden="true" />
      )}
    </span>
  );
}

function RingPerson({ person, onSelect }: { person: Person; onSelect: (person: Person) => void }) {
  const radians = ((Number.isFinite(person.angle) ? person.angle : 0) * Math.PI) / 180;
  const orbit = 39;
  const position = {
    left: `${50 + orbit * Math.cos(radians)}%`,
    top: `${50 + orbit * Math.sin(radians)}%`,
  } satisfies CSSProperties;

  return (
    <button
      type="button"
      className="reel-ring-person"
      style={position}
      onClick={() => onSelect(person)}
      aria-label={`Voir le profil de ${person.name}`}
    >
      <PersonAvatar person={person} />
      <span className="reel-ring-person__name">{person.name}</span>
    </button>
  );
}

export function ReelProximityScreen() {
  const access = useAccessMode();
  const [discoveryAccess, setDiscoveryAccess] = useState<"prompt" | "requesting" | "granted" | "ignored" | "denied">("prompt");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [discoveredPeople, setDiscoveredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [activityTab, setActivityTab] = useState<ActivityTab>("notifications");
  const [radius, setRadius] = useState("100 m");
  const [duration, setDuration] = useState("2 h");
  const [currentPresence, setCurrentPresence] = useState<ReelPresence | null>(null);
  const [presenceConsent, setPresenceConsent] = useState(false);
  const [presenceDescription, setPresenceDescription] = useState("Disponible pour échanger autour de moi");
  const [presenceLoading, setPresenceLoading] = useState(false);
  const [presenceMessage, setPresenceMessage] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    showDistance: true,
    allowBips: true,
    showOnlyAvailable: true,
  });

  useEffect(() => {
    let cancelled = false;
    if (access.mode !== "member" || access.memberProfileState !== "active" || access.loading) {
      setCurrentPresence(null);
      return;
    }
    void getMyActiveReelPresence()
      .then((presence) => { if (!cancelled) setCurrentPresence(presence); })
      .catch(() => { if (!cancelled) setPresenceMessage("Votre présence actuelle n’a pas pu être vérifiée."); });
    return () => { cancelled = true; };
  }, [access.mode, access.memberProfileState, access.loading]);

  const activatePresence = async () => {
    const decision = evaluateReelAccess(
      { access, presenceConsent: true, consents: ["reel_presence"], online: typeof navigator === "undefined" ? false : navigator.onLine },
      "start_presence",
    );
    if (decision.status !== "server_check" || !presenceConsent) {
      setPresenceMessage(!presenceConsent ? "Confirmez d’abord que vous acceptez d’être visible dans votre secteur approximatif." : decision.message);
      return;
    }

    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const fix = await requestReelLocation();
      const zone = await resolveReelZone({
        data: { latitude: fix.latitude, longitude: fix.longitude, purpose: "presence", consent: true },
      });
      if (!zone.grantId) throw new Error("Votre autorisation de présence n’a pas pu être préparée. Réessayez.");
      const radiusMeters = radius === "1 km" ? 1000 : Number.parseInt(radius, 10);
      const durationMinutes: Record<string, number> = {
        "30 min": 30, "1 h": 60, "2 h": 120, "3 h": 180,
        "6 h": 360, "12 h": 720, "24 h": 1440,
      };
      const presence = await startReelPresence({
        zoneGrantId: zone.grantId,
        areaLabel: zone.areaLabel,
        description: presenceDescription,
        radiusMeters: radiusMeters as 10 | 25 | 50 | 100 | 1000,
        durationMinutes: durationMinutes[duration] as 30 | 60 | 120 | 180 | 360 | 720 | 1440,
        consent: true,
      });
      setCurrentPresence(presence);
      setPresenceMessage("Votre présence est maintenant visible dans votre secteur approximatif.");
    } catch (error) {
      setPresenceMessage(error instanceof Error ? error.message : "Votre présence n’a pas pu être activée.");
    } finally {
      setPresenceLoading(false);
    }
  };

  const stopPresence = async () => {
    if (!currentPresence) return;
    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const ended = await endReelPresence(currentPresence.id);
      setCurrentPresence(ended.status === "active" ? ended : null);
      setPresenceMessage("Votre présence n’est plus visible.");
    } catch (error) {
      setPresenceMessage(error instanceof Error ? error.message : "Votre présence n’a pas pu être arrêtée.");
    } finally {
      setPresenceLoading(false);
    }
  };

  const requestDiscovery = async () => {
    const decision = evaluateReelAccess(
      { access, discoveryConsent: true, online: typeof navigator === "undefined" ? false : navigator.onLine },
      "discover_presence",
    );
    if (decision.status !== "server_check") {
      setDiscoveryAccess("denied");
      setLocationMessage(decision.message);
      return;
    }

    setDiscoveryAccess("requesting");
    setLocationMessage(null);
    try {
      const fix = await requestReelLocation();
      const zone = await resolveReelZone({
        data: { latitude: fix.latitude, longitude: fix.longitude, purpose: "discover", consent: true },
      });
      const rows = await listReelNearbyPresence();
      setDiscoveredPeople(rows.map((person, index) => ({
        id: person.presence_id,
        name: person.display_name || "Profil Vitalis",
        avatarUrl: null,
        initials: (person.display_name || "V").trim().split(/\\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join(""),
        angle: (index * 137.5) % 360,
        description: person.description,
        locationLabel: person.area_label || zone.areaLabel,
      })));
      setDiscoveryAccess("granted");
    } catch (error) {
      setDiscoveryAccess("denied");
      setLocationMessage(error instanceof Error ? error.message : "La découverte à proximité n’est pas disponible pour le moment.");
    }
  };
  const ignoreLocation = () => {
    setDiscoveryAccess("ignored");
    setDiscoveredPeople([]);
    setLocationMessage(null);
  };
  const canUseMemberReel = access.mode === "member" && access.memberProfileState === "active" && !access.loading;
  const discoveryEnabled = discoveryAccess === "granted";
  const activityEnabled = discoveryEnabled || Boolean(currentPresence);
  const availablePeople = discoveryEnabled ? discoveredPeople : [];

  const openProfile = (person: Person) => {
    setPanel(null);
    setSelectedPerson(person);
    setShowFullProfile(false);
  };
  const closeProfile = () => {
    setSelectedPerson(null);
    setShowFullProfile(false);
  };
  const openActivity = (tab: ActivityTab) => {
    setActivityTab(tab);
    setPanel("activity");
  };

  const visiblePeople = availablePeople.slice(0, MAX_RING_PEOPLE);
  const nearbyPeople = availablePeople.slice(0, 3);
  const additionalCount = Math.max(0, availablePeople.length - 3);

  return (
    <section className="reel-proximity" aria-label="Temps Réel de proximité">
      <header className="reel-proximity__header">
        <button
          type="button"
          className="reel-proximity__header-action"
          onClick={() => setPanel("settings")}
          aria-label="Personnaliser mes préférences"
          title="Mes préférences"
        >
          <SlidersHorizontal aria-hidden="true" />
        </button>
        <div className="reel-proximity__heading">
          <div className="reel-proximity__heading-copy">
            <h1>RÉEL</h1>
            <p>Les personnes présentes autour de vous</p>
          </div>
        </div>
        <button
          type="button"
          className="reel-proximity__header-action reel-proximity__notification"
          onClick={() => openActivity("notifications")}
          disabled={!activityEnabled}
          aria-label={activityEnabled ? "Notifications, bips et mises en relation" : "Les notifications Réel sont en pause sans autorisation de proximité"}
          title={activityEnabled ? "Activité" : "Notifications en pause"}
        >
          <Bell aria-hidden="true" />
        </button>
      </header>

      {!discoveryEnabled && (
        <section className={`reel-location-card reel-location-card--${discoveryAccess}`} aria-label="Accès à la position">
          <div className="reel-location-card__icon"><MapPin aria-hidden="true" /></div>
          <div className="reel-location-card__copy">
            <strong>{discoveryAccess === "prompt" && !canUseMemberReel ? "La découverte locale demande un compte Vitalis actif" : discoveryAccess === "prompt" ? "Envie de découvrir ce qui se passe près de vous ?" : discoveryAccess === "requesting" ? "Nous vérifions votre position…" : discoveryAccess === "denied" ? "Votre position reste privée" : "Vous découvrez Réel à votre rythme"}</strong>
            <p>{discoveryAccess === "prompt" && !canUseMemberReel ? (access.mode === "guest" ? "Le parcours invité permet de découvrir Réel, mais la découverte réelle autour de vous n’est pas encore ouverte aux invités." : "Connectez-vous avec un compte Vitalis actif pour observer les activités autour de vous.") : discoveryAccess === "prompt" ? "Autorisez Réel à utiliser votre position pour observer les personnes et les activités autour de vous. Votre choix reste libre." : discoveryAccess === "requesting" ? "Cela ne prend que quelques instants." : locationMessage || "Vous pouvez parcourir Réel sans localisation. Les découvertes proches, les bips et les réactions resteront en pause."}</p>
            <div className="reel-location-card__actions">
              {canUseMemberReel && (discoveryAccess === "prompt" || discoveryAccess === "ignored" || discoveryAccess === "denied") && <button type="button" className="reel-location-card__primary" onClick={() => void requestDiscovery()}>{discoveryAccess === "prompt" ? "Activer la découverte" : "Réessayer"}</button>}
              {discoveryAccess === "prompt" && <button type="button" className="reel-location-card__secondary" onClick={ignoreLocation}>Pas maintenant</button>}
            </div>
          </div>
        </section>
      )}

      <div className={`reel-proximity__radar${discoveryEnabled ? "" : " reel-proximity__radar--calm"}`}>
        <div className="reel-radar__outer-halo" aria-hidden="true" />
        <div className="reel-radar__outer-ring" aria-hidden="true" />
        <div className="reel-radar__inner-ring" aria-hidden="true" />
        <div className="reel-radar__core">
          <button
            type="button"
            className="reel-radar__me"
            onClick={() => setPanel("settings")}
            aria-label="Gérer ma présence"
          >
            <span className="reel-radar__me-avatar">
              <CircleUserRound aria-hidden="true" />
            </span>
            <span className="reel-radar__me-label">Moi</span>
            <span className="reel-radar__me-hint">Ma présence</span>
          </button>
        </div>
        {visiblePeople.map((person) => (
          <RingPerson key={person.id} person={person} onSelect={openProfile} />
        ))}
      </div>

      <div className="reel-nearby">
        <p className="reel-nearby__title">
          {!discoveryEnabled ? "La découverte à proximité est en pause" : availablePeople.length === 0 ? "La découverte locale sera disponible après le raccordement du service Réel" : `${availablePeople.length} personne${availablePeople.length > 1 ? "s" : ""} à proximité`}
        </p>
        <div className="reel-nearby__row">
          <div className="reel-nearby__avatars">
            {nearbyPeople.map((person) => (
              <button
                key={person.id}
                type="button"
                className="reel-nearby__profile"
                onClick={() => openProfile(person)}
                aria-label={`Voir le profil de ${person.name}`}
              >
                <PersonAvatar person={person} size="small" />
              </button>
            ))}
            {additionalCount > 0 && (
              <button
                type="button"
                className="reel-nearby__count"
                onClick={() => setPanel("people")}
                aria-label={`Afficher les ${additionalCount} autres personnes`}
              >
                +{additionalCount}
              </button>
            )}
          </div>
          <button
            className="reel-nearby__bluetooth"
            type="button"
            disabled
            aria-label="Bluetooth — prévu en version 3"
            title="Bluetooth — sera développé en version 3"
          >
            <Bluetooth aria-hidden="true" />
          </button>
        </div>
        {discoveryEnabled && availablePeople.length > 3 && (
          <button type="button" className="reel-nearby__all" onClick={() => setPanel("people")}>
            Voir toutes les personnes
            <ChevronDown aria-hidden="true" />
          </button>
        )}
      </div>

      {!discoveryEnabled && discoveryAccess !== "prompt" && discoveryAccess !== "requesting" && (
        <div className="reel-calm-shortcuts" aria-label="Autres façons de découvrir Réel">
          <button type="button" onClick={() => setPanel("global")}>
            <Globe aria-hidden="true" />
            <span><strong>Propositions globales</strong><small>Découvrir sans partager votre position</small></span>
            <ChevronDown aria-hidden="true" />
          </button>
          <button type="button" onClick={() => openActivity("connections")}>
            <History aria-hidden="true" />
            <span><strong>Mon activité passée</strong><small>Retrouver les informations déjà disponibles</small></span>
            <ChevronDown aria-hidden="true" />
          </button>
        </div>
      )}

      {panel && (
        <div className="reel-panel-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
        }}>
          <section className="reel-panel" role="dialog" aria-modal="true" aria-labelledby="reel-panel-title">
            <button type="button" className="reel-panel__close" onClick={() => setPanel(null)} aria-label="Fermer">
              <X aria-hidden="true" />
            </button>

            {panel === "settings" && (
              <>
                <div className="reel-panel__eyebrow"><Settings2 aria-hidden="true" /> Personnalisation</div>
                <h2 id="reel-panel-title">Ma présence et mes préférences</h2>
                <p className="reel-panel__intro">Choisissez comment vous souhaitez rencontrer les personnes autour de vous.</p>

                <div className="reel-panel__section">
                  <h3>Accès à la position</h3>
                  <p className="reel-panel__note">{discoveryEnabled ? "Réel peut utiliser votre position après votre accord. Aucun suivi en arrière-plan n’est lancé." : "La position est désactivée pour Réel. Les autres moteurs ne peuvent pas donner leur accord à votre place."}</p>
                  {!discoveryEnabled && <button type="button" className="reel-panel__primary" onClick={() => void requestDiscovery()}>Activer la découverte</button>}
                </div>

                <div className="reel-panel__section">
                  <h3>Rayon de proximité</h3>
                  <div className="reel-choice-grid">
                    {RADII.map((value) => (
                      <button key={value} type="button" className={radius === value ? "is-selected" : ""} onClick={() => setRadius(value)}>
                        {value}{radius === value && <Check aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="reel-panel__note">La position est regroupée dans un secteur approximatif d’environ 200 mètres. Le rayon choisi est enregistré, mais le calcul précis des distances et son application au filtrage restent à finaliser. Aucune distance exacte n’est affichée.</p>

                <div className="reel-panel__section">
                  <h3>Durée souhaitée</h3>
                  <div className="reel-choice-grid reel-choice-grid--duration">
                    {DURATIONS.map((value) => (
                      <button key={value} type="button" className={duration === value ? "is-selected" : ""} onClick={() => setDuration(value)}>
                        {value}{duration === value && <Check aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="reel-panel__section">
                  <h3>Ma visibilité</h3>
                  <p className="reel-panel__note">La découverte vous permet d’observer les activités autour de vous. Activer votre présence est un choix séparé : les autres personnes pourront alors vous voir dans votre secteur approximatif, pendant la durée choisie.</p>
                  {!canUseMemberReel ? <p className="reel-panel__note">L’activation de votre présence est actuellement réservée aux membres avec un profil actif. Le mode invité n’est pas encore raccordé à cette fonction.</p> : currentPresence ? (
                    <>
                      <p className="reel-panel__status">Votre présence est active jusqu’à la fin de la durée choisie.</p>
                      <button type="button" className="reel-panel__secondary" disabled={presenceLoading} onClick={() => void stopPresence()}>Arrêter ma présence</button>
                    </>
                  ) : (
                    <>
                      <label className="reel-setting-row reel-setting-row--stacked">
                        <span><strong>Ce que les autres verront</strong><small>Une courte description de votre présence.</small></span>
                        <textarea maxLength={180} value={presenceDescription} onChange={(event) => setPresenceDescription(event.target.value)} rows={2} />
                      </label>
                      <label className="reel-setting-row">
                        <span><strong>Je souhaite être visible</strong><small>Ma position sera indiquée de façon approximative, jamais sous forme de coordonnées GPS exactes.</small></span>
                        <input type="checkbox" checked={presenceConsent} onChange={(event) => setPresenceConsent(event.target.checked)} />
                      </label>
                      <button type="button" className="reel-panel__primary" disabled={presenceLoading || !presenceConsent || !presenceDescription.trim()} onClick={() => void activatePresence()}>
                        {presenceLoading ? "Activation…" : "Activer ma présence"}
                      </button>
                    </>
                  )}
                  {presenceMessage && <p className="reel-panel__note" role="status">{presenceMessage}</p>}
                </div>

                <div className="reel-panel__section">
                  <h3>Ce que je souhaite autoriser</h3>
                  <label className="reel-setting-row">
                    <span><strong>Afficher ma distance</strong><small>Les personnes voient à quelle distance vous êtes.</small></span>
                    <input type="checkbox" checked={preferences.showDistance} onChange={(event) => setPreferences((current) => ({ ...current, showDistance: event.target.checked }))} />
                  </label>
                  <label className="reel-setting-row">
                    <span><strong>Recevoir des bips</strong><small>Les personnes peuvent vous faire signe.</small></span>
                    <input type="checkbox" checked={preferences.allowBips} onChange={(event) => setPreferences((current) => ({ ...current, allowBips: event.target.checked }))} />
                  </label>
                  <label className="reel-setting-row">
                    <span><strong>Voir les personnes disponibles</strong><small>Mettre en avant celles qui sont présentes maintenant.</small></span>
                    <input type="checkbox" checked={preferences.showOnlyAvailable} onChange={(event) => setPreferences((current) => ({ ...current, showOnlyAvailable: event.target.checked }))} />
                  </label>
                </div>
                <p className="reel-panel__note"><MapPin aria-hidden="true" /> Ces choix sont préparés dans l’écran. Leur enregistrement et leur application en temps réel nécessitent encore le raccordement du service de présence.</p>
                <button type="button" className="reel-panel__primary" onClick={() => setPanel(null)}>Terminé</button>
              </>
            )}

            {panel === "global" && (
              <>
                <div className="reel-panel__eyebrow"><Globe aria-hidden="true" /> Découvrir autrement</div>
                <h2 id="reel-panel-title">Propositions globales</h2>
                <div className="reel-panel__empty">
                  <Globe aria-hidden="true" />
                  <strong>Les découvertes générales arrivent ici</strong>
                  <span>Aucune activité proche n’est chargée lorsque vous gardez votre position privée. Les propositions globales seront affichées dès que leur source sera disponible.</span>
                </div>
              </>
            )}

            {panel === "activity" && (
              <>
                <div className="reel-panel__eyebrow"><Bell aria-hidden="true" /> Votre activité</div>
                <h2 id="reel-panel-title">Notifications et rencontres</h2>
                <div className="reel-panel__tabs" role="tablist" aria-label="Activité">
                  <button type="button" role="tab" aria-selected={activityTab === "notifications"} aria-disabled={!activityEnabled} disabled={!activityEnabled} className={activityTab === "notifications" ? "is-active" : ""} onClick={() => setActivityTab("notifications")}>Alertes</button>
                  <button type="button" role="tab" aria-selected={activityTab === "bips"} aria-disabled={!discoveryEnabled} disabled={!discoveryEnabled} className={activityTab === "bips" ? "is-active" : ""} onClick={() => setActivityTab("bips")}>Bips reçus</button>
                  <button type="button" role="tab" aria-selected={activityTab === "connections"} className={activityTab === "connections" ? "is-active" : ""} onClick={() => setActivityTab("connections")}>Rencontres</button>
                </div>
                <div className="reel-panel__empty">
                  {activityTab === "notifications" ? <Bell aria-hidden="true" /> : activityTab === "bips" ? <RadioTower aria-hidden="true" /> : <UsersRound aria-hidden="true" />}
                  <strong>{activityTab === "notifications" ? "Tout est calme pour le moment" : activityTab === "bips" ? "Aucun bip reçu pour le moment" : "Vos relations déjà établies seront accessibles ici dès que leur historique sera connecté"}</strong>
                  <span>{activityTab === "notifications" ? "Les nouvelles activités liées à Réel seront réunies ici." : activityTab === "bips" ? "Quand une personne vous fera signe, vous pourrez la retrouver ici." : "Vous pourrez retrouver ici les rencontres acceptées et toujours disponibles."}</span>
                </div>
                {!activityEnabled && <p className="reel-panel__note">En mode calme, les alertes et les bips sont suspendus. Vos mises en relation déjà établies restent consultables.</p>}
                {activityEnabled && <p className="reel-panel__note">Les événements réels apparaîtront ici dès que le service de rencontres sera connecté.</p>}
              </>
            )}

            {panel === "people" && (
              <>
                <div className="reel-panel__eyebrow"><UsersRound aria-hidden="true" /> À proximité</div>
                <h2 id="reel-panel-title">Toutes les personnes proches</h2>
                {discoveryEnabled && availablePeople.length ? (
                  <div className="reel-people-list">
                    {availablePeople.map((person) => (
                      <button type="button" className="reel-people-list__item" key={person.id} onClick={() => openProfile(person)}>
                        <PersonAvatar person={person} size="small" />
                        <span><strong>{person.name}</strong><small>{person.description || person.category || "Profil à proximité"}</small></span>
                        {person.distanceLabel && <small className="reel-people-list__distance">{person.distanceLabel}</small>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="reel-panel__empty">
                    <UsersRound aria-hidden="true" />
                    <strong>Personne à afficher pour le moment</strong>
                    <span>Les profils disponibles apparaîtront ici au fur et à mesure.</span>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}

      {selectedPerson && (
        <div className="reel-profile-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeProfile();
        }}>
          <section className="reel-profile-sheet" role="dialog" aria-modal="true" aria-labelledby="reel-profile-title">
            <button type="button" className="reel-profile-sheet__close" onClick={closeProfile} aria-label="Fermer le profil"><X aria-hidden="true" /></button>
            {showFullProfile && (
              <button type="button" className="reel-profile-sheet__back" onClick={() => setShowFullProfile(false)}>
                <ArrowLeft aria-hidden="true" /> Retour à l’aperçu
              </button>
            )}
            <PersonAvatar person={selectedPerson} size="me" />
            <h2 id="reel-profile-title">{selectedPerson.name}</h2>
            {selectedPerson.category && <p className="reel-profile-sheet__category">{selectedPerson.category}</p>}
            {selectedPerson.distanceLabel && <p className="reel-profile-sheet__distance">{selectedPerson.distanceLabel}</p>}
            {showFullProfile ? (
              <>
                {selectedPerson.description && <p className="reel-profile-sheet__description">{selectedPerson.description}</p>}
                {(selectedPerson.locationLabel || selectedPerson.distanceLabel) && (
                  <div className="reel-profile-sheet__details">
                    {selectedPerson.locationLabel && <span>{selectedPerson.locationLabel}</span>}
                    {selectedPerson.distanceLabel && <span>{selectedPerson.distanceLabel}</span>}
                  </div>
                )}
                {!selectedPerson.description && !selectedPerson.locationLabel && (
                  <p className="reel-profile-sheet__empty">Cette personne n’a pas encore ajouté d’autres informations à son profil.</p>
                )}
              </>
            ) : (
              <p className="reel-profile-sheet__description">{selectedPerson.description || "Consultez les informations disponibles sur ce profil."}</p>
            )}
            <button type="button" className="reel-profile-sheet__primary" onClick={() => {
              if (showFullProfile) closeProfile();
              else setShowFullProfile(true);
            }}>{showFullProfile ? "Fermer" : "Voir la fiche complète"}</button>
          </section>
        </div>
      )}
    </section>
  );
}
