import { useState, type CSSProperties } from "react";
import { requestReelLocation } from "@/domains/presence/api/reel-location.client";
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

interface ReelProximityScreenProps {
  people: Person[];
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

export function ReelProximityScreen({ people }: ReelProximityScreenProps) {
  const [locationAccess, setLocationAccess] = useState<"prompt" | "requesting" | "granted" | "ignored" | "denied">("prompt");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [activityTab, setActivityTab] = useState<ActivityTab>("notifications");
  const [radius, setRadius] = useState("100 m");
  const [duration, setDuration] = useState("2 h");
  const [preferences, setPreferences] = useState({
    showDistance: true,
    allowBips: true,
    showOnlyAvailable: true,
  });

  const requestLocation = async () => {
    setLocationAccess("requesting");
    setLocationMessage(null);
    try {
      // A one-shot location read starts only after this explicit Réel action.
      // Coordinates are not persisted or sent to the server in this tranche.
      await requestReelLocation();
      setLocationAccess("granted");
    } catch (error) {
      setLocationAccess("denied");
      setLocationMessage(error instanceof Error ? error.message : "La position n’est pas disponible pour le moment.");
    }
  };
  const ignoreLocation = () => {
    setLocationAccess("ignored");
    setLocationMessage(null);
  };
  const locationEnabled = locationAccess === "granted";
  const availablePeople = locationEnabled ? people : [];

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
          aria-label="Notifications, bips et mises en relation"
          title="Activité"
        >
          <Bell aria-hidden="true" />
        </button>
      </header>

      {!locationEnabled && (
        <section className={`reel-location-card reel-location-card--${locationAccess}`} aria-label="Accès à la position">
          <div className="reel-location-card__icon"><MapPin aria-hidden="true" /></div>
          <div className="reel-location-card__copy">
            <strong>{locationAccess === "prompt" ? "Envie de découvrir ce qui se passe près de vous ?" : locationAccess === "requesting" ? "Nous vérifions votre position…" : locationAccess === "denied" ? "Votre position reste privée" : "Vous découvrez Réel à votre rythme"}</strong>
            <p>{locationAccess === "prompt" ? "Autorisez Réel à utiliser votre position pour découvrir les personnes et les activités autour de vous. Votre choix reste libre." : locationAccess === "requesting" ? "Cela ne prend que quelques instants." : locationMessage || "Vous pouvez parcourir Réel sans localisation. Les découvertes proches, les bips et les réactions resteront en pause."}</p>
            <div className="reel-location-card__actions">
              {(locationAccess === "prompt" || locationAccess === "ignored" || locationAccess === "denied") && <button type="button" className="reel-location-card__primary" onClick={() => void requestLocation()}>{locationAccess === "prompt" ? "Activer ma position" : "Réessayer"}</button>}
              {locationAccess === "prompt" && <button type="button" className="reel-location-card__secondary" onClick={ignoreLocation}>Pas maintenant</button>}
            </div>
          </div>
        </section>
      )}

      <div className={`reel-proximity__radar${locationEnabled ? "" : " reel-proximity__radar--calm"}`}>
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
          {!locationEnabled ? "La découverte à proximité est en pause" : availablePeople.length === 0 ? "Aucune personne à afficher pour le moment" : `${availablePeople.length} personne${availablePeople.length > 1 ? "s" : ""} à proximité`}
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
            onClick={() => setPanel("settings")}
            aria-label="Bluetooth — prévu en version 3"
            title="Bluetooth — prévu en version 3"
          >
            <Bluetooth aria-hidden="true" />
          </button>
        </div>
        {locationEnabled && availablePeople.length > 3 && (
          <button type="button" className="reel-nearby__all" onClick={() => setPanel("people")}>
            Voir toutes les personnes
            <ChevronDown aria-hidden="true" />
          </button>
        )}
      </div>

      {!locationEnabled && locationAccess !== "prompt" && locationAccess !== "requesting" && (
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
                  <p className="reel-panel__note">{locationEnabled ? "Réel peut utiliser votre position après votre accord. Aucun suivi en arrière-plan n’est lancé." : "La position est désactivée pour Réel. Les autres moteurs ne peuvent pas donner leur accord à votre place."}</p>
                  {!locationEnabled && <button type="button" className="reel-panel__primary" onClick={() => void requestLocation()}>Activer ma position</button>}
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
                  <button type="button" role="tab" aria-selected={activityTab === "notifications"} aria-disabled={!locationEnabled} disabled={!locationEnabled} className={activityTab === "notifications" ? "is-active" : ""} onClick={() => setActivityTab("notifications")}>Alertes</button>
                  <button type="button" role="tab" aria-selected={activityTab === "bips"} aria-disabled={!locationEnabled} disabled={!locationEnabled} className={activityTab === "bips" ? "is-active" : ""} onClick={() => setActivityTab("bips")}>Bips reçus</button>
                  <button type="button" role="tab" aria-selected={activityTab === "connections"} className={activityTab === "connections" ? "is-active" : ""} onClick={() => setActivityTab("connections")}>Rencontres</button>
                </div>
                <div className="reel-panel__empty">
                  {activityTab === "notifications" ? <Bell aria-hidden="true" /> : activityTab === "bips" ? <RadioTower aria-hidden="true" /> : <UsersRound aria-hidden="true" />}
                  <strong>{activityTab === "notifications" ? "Tout est calme pour le moment" : activityTab === "bips" ? "Aucun bip reçu pour le moment" : "Vos relations déjà établies seront accessibles ici dès que leur historique sera connecté"}</strong>
                  <span>{activityTab === "notifications" ? "Les nouvelles activités liées à Réel seront réunies ici." : activityTab === "bips" ? "Quand une personne vous fera signe, vous pourrez la retrouver ici." : "Vous pourrez retrouver ici les rencontres acceptées et toujours disponibles."}</span>
                </div>
                {!locationEnabled && <p className="reel-panel__note">En mode calme, les alertes et les bips sont suspendus. Vos mises en relation déjà établies restent consultables.</p>}
                {locationEnabled && <p className="reel-panel__note">Les événements réels apparaîtront ici dès que le service de rencontres sera connecté.</p>}
              </>
            )}

            {panel === "people" && (
              <>
                <div className="reel-panel__eyebrow"><UsersRound aria-hidden="true" /> À proximité</div>
                <h2 id="reel-panel-title">Toutes les personnes proches</h2>
                {locationEnabled && availablePeople.length ? (
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
