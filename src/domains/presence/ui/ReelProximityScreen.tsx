import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { requestReelLocation } from "@/domains/presence/api/reel-location.client";
import {
  closeReelConnection,
  commandReelBip,
  listReelBips,
  listReelConnections,
  sendReelBip,
  sendReelBipToGuest,
  commandReelGuestBipMember,
  listReelGuestBipsForMember,
  listReelGuestConnectionsForMember,
  closeReelGuestConnectionForMember,
  type ReelBip,
  type ReelConnection,
  type ReelGuestBip,
  type ReelGuestConnection,
} from "@/domains/presence/api/reel-presence.client";
import { supabase } from "@/integrations/supabase/client";
import { resolveReelZone } from "@/domains/presence/api/reel-zone.functions";
import {
  discoverReelGuestNearby,
  endReelGuestPresence,
  getMyReelGuestPresence,
  startReelGuestPresence,
  sendReelGuestBip,
  listMyReelGuestBips,
  commandMyReelGuestBip,
  listMyReelGuestConnections,
  closeMyReelGuestConnection,
} from "@/domains/presence/api/reel-guest-session.functions";
import {
  endReelPresence,
  getMyActiveReelPresence,
  listReelNearbyPresence,
  listReelNearbyGuestPresence,
  startReelPresence,
  type ReelPresence,
} from "@/domains/presence/api/reel-presence.client";
import { useAccessMode } from "@/domains/access-mode";
import { evaluateReelAccess } from "@/domains/presence/policy/reel-access-policy";
import {
  ArrowLeft,
  Bell,
  Bluetooth,
  Check,
  ChevronDown,
  CircleUserRound,
  Globe,
  History,
  MapPin,
  RadioTower,
  Settings2,
  SlidersHorizontal,
  UsersRound,
  X,
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
  actorKind?: "member" | "guest";
  avatarKey?: string | null;
}

type Panel = "settings" | "activity" | "people" | "global" | null;
type ActivityTab = "notifications" | "bips" | "connections";

const MAX_RING_PEOPLE = 9;
const DURATIONS = ["30 min", "1 h", "2 h", "3 h", "6 h", "12 h", "24 h"];
const RADII = ["10 m", "25 m", "50 m", "100 m", "1 km"];

function PersonAvatar({
  person,
  size = "person",
}: {
  person: Person;
  size?: "person" | "small" | "me";
}) {
  return (
    <span
      className={`reel-avatar reel-avatar--${size} ${person.avatarKey ? `reel-avatar--${person.avatarKey}` : ""}`}
      aria-label={person.name}
    >
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
        <span className="reel-avatar__initials" aria-hidden="true">
          {person.initials}
        </span>
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
  const [discoveryAccess, setDiscoveryAccess] = useState<
    "prompt" | "requesting" | "granted" | "ignored" | "denied"
  >("prompt");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [guestSessionLoading, setGuestSessionLoading] = useState(false);
  const [guestSessionMessage, setGuestSessionMessage] = useState<string | null>(null);
  const [discoveredPeople, setDiscoveredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [activityTab, setActivityTab] = useState<ActivityTab>("notifications");
  const [radius, setRadius] = useState("100 m");
  const [duration, setDuration] = useState("2 h");
  const [loadedPresence, setLoadedPresence] = useState<{
    memberId: string;
    presence: ReelPresence | null;
  } | null>(null);
  const [presenceConsent, setPresenceConsent] = useState(false);
  const [guestPresenceConsent, setGuestPresenceConsent] = useState(false);
  const [guestDisplayName, setGuestDisplayName] = useState("");
  const [guestAreaLabel, setGuestAreaLabel] = useState("À proximité");
  const [guestAvatarKey, setGuestAvatarKey] = useState("avatar-blue");
  const [guestPresence, setGuestPresence] = useState<{
    id: string;
    display_name: string;
    avatar_key: string;
    area_label: string;
    description: string;
    radius_m: number;
    started_at: string;
    expires_at: string;
  } | null>(null);
  const [presenceDescription, setPresenceDescription] = useState(
    "Disponible pour échanger autour de moi",
  );
  const [presenceLoading, setPresenceLoading] = useState(false);
  const [presenceMessage, setPresenceMessage] = useState<string | null>(null);
  const [receivedBips, setReceivedBips] = useState<ReelBip[]>([]);
  const [receivedGuestBips, setReceivedGuestBips] = useState<ReelGuestBip[]>([]);
  const [bipsLoading, setBipsLoading] = useState(false);
  const [bipsMessage, setBipsMessage] = useState<string | null>(null);
  const [connections, setConnections] = useState<ReelConnection[]>([]);
  const [guestConnections, setGuestConnections] = useState<ReelGuestConnection[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [connectionsMessage, setConnectionsMessage] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    showDistance: true,
    allowBips: true,
    showOnlyAvailable: true,
  });

  const currentPresence =
    access.mode === "member" &&
    access.memberProfileState === "active" &&
    loadedPresence?.memberId === access.memberId
      ? loadedPresence.presence
      : null;
  const canUseMemberReel =
    access.mode === "member" && access.memberProfileState === "active" && !access.loading;

  useEffect(() => {
    if (access.loading || access.mode !== "guest") {
      if (access.mode !== "guest") setGuestPresence(null);
      return;
    }
    let cancelled = false;
    setDuration("1 h");
    void getMyReelGuestPresence()
      .then((presence) => {
        if (cancelled) return;
        setGuestPresence(presence);
        if (presence) {
          setGuestDisplayName(presence.display_name);
          setGuestAreaLabel(presence.area_label);
          setGuestAvatarKey(presence.avatar_key);
          setPresenceDescription(presence.description);
          const radiusLabel = presence.radius_m === 1000 ? "1 km" : `${presence.radius_m} m`;
          setRadius(radiusLabel);
          const remainingMinutes = Math.max(
            0,
            Math.round((Date.parse(presence.expires_at) - Date.now()) / 60_000),
          );
          const durationLabel =
            remainingMinutes <= 30
              ? "30 min"
              : remainingMinutes <= 60
                ? "1 h"
                : remainingMinutes <= 120
                  ? "2 h"
                  : remainingMinutes <= 180
                    ? "3 h"
                    : remainingMinutes <= 360
                      ? "6 h"
                      : remainingMinutes <= 720
                        ? "12 h"
                        : "24 h";
          setDuration(durationLabel);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setPresenceMessage(
            error instanceof Error
              ? error.message
              : "Votre présence invitée n’a pas pu être retrouvée.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [access.loading, access.mode, access.guest?.sessionId]);

  useEffect(() => {
    let cancelled = false;
    const memberId = access.memberId;
    if (
      access.mode !== "member" ||
      access.memberProfileState !== "active" ||
      access.loading ||
      !memberId
    )
      return;
    void getMyActiveReelPresence()
      .then((presence) => {
        if (!cancelled) setLoadedPresence({ memberId, presence });
      })
      .catch(() => {
        if (!cancelled) setPresenceMessage("Votre présence actuelle n’a pas pu être vérifiée.");
      });
    return () => {
      cancelled = true;
    };
  }, [access.mode, access.memberProfileState, access.loading, access.memberId]);

  const refreshBips = useCallback(async () => {
    if (access.loading) return;
    if (access.mode === "guest") {
      setBipsLoading(true);
      try {
        const rows = await listMyReelGuestBips();
        setReceivedGuestBips(
          rows.filter(
            (bip: ReelGuestBip) =>
              bip.is_recipient && bip.status === "pending",
          ),
        );
        setReceivedBips([]);
        setBipsMessage(null);
      } catch (error) {
        setBipsMessage(error instanceof Error ? error.message : "Vos bips n’ont pas pu être chargés.");
      } finally {
        setBipsLoading(false);
      }
      return;
    }
    if (!canUseMemberReel || !access.memberId) return;
    setBipsLoading(true);
    try {
      const [rows, crossModeRows] = await Promise.all([
        listReelBips(),
        listReelGuestBipsForMember(),
      ]);
      setReceivedBips(
        rows.filter((bip) => bip.recipient_id === access.memberId && bip.status === "pending"),
      );
      setReceivedGuestBips(
        crossModeRows.filter(
          (bip) => bip.is_recipient && bip.status === "pending",
        ),
      );
      setBipsMessage(null);
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : "Vos bips n’ont pas pu être chargés.");
    } finally {
      setBipsLoading(false);
    }
  }, [access.loading, access.mode, access.memberId, access.guest?.sessionId, canUseMemberReel]);

  useEffect(() => {
    if (panel !== "activity" || activityTab !== "bips" || (!canUseMemberReel && access.mode !== "guest")) return;
    void refreshBips();
    if (access.mode === "guest") return;
    const channel = supabase
      .channel(`reel-bips-${access.memberId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "reel_bips" }, () => {
        void refreshBips();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "reel_connections" }, () => {
        void refreshBips();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [panel, activityTab, refreshBips, access.memberId, canUseMemberReel, access.mode]);

  const refreshConnections = useCallback(async () => {
    if (access.loading) return;
    setConnectionsLoading(true);
    try {
      if (access.mode === "guest") {
        const rows = await listMyReelGuestConnections();
        setConnections([]);
        setGuestConnections(rows);
        setConnectionsMessage(null);
        return;
      }
      if (!canUseMemberReel || !access.memberId) return;
      const [rows, crossModeRows] = await Promise.all([
        listReelConnections(),
        listReelGuestConnectionsForMember(),
      ]);
      setConnections(rows);
      setGuestConnections(crossModeRows);
      setConnectionsMessage(null);
    } catch (error) {
      setConnectionsMessage(
        error instanceof Error ? error.message : "Votre historique n’a pas pu être chargé.",
      );
    } finally {
      setConnectionsLoading(false);
    }
  }, [access.loading, access.mode, canUseMemberReel, access.memberId]);

  useEffect(() => {
    if (panel !== "activity" || activityTab !== "connections" || (!canUseMemberReel && access.mode !== "guest")) return;
    void refreshConnections();
    const channel = supabase
      .channel(`reel-connections-${access.memberId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "reel_connections" }, () => {
        void refreshConnections();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [panel, activityTab, refreshConnections, access.memberId, canUseMemberReel, access.mode]);

  const endConnection = async (connection: ReelConnection) => {
    if (connection.status !== "active") return;
    if (!window.confirm("Mettre fin à cette mise en relation ? Elle sera fermée pour vous deux."))
      return;
    try {
      await closeReelConnection(connection.connection_id);
      await refreshConnections();
      setConnectionsMessage("Cette mise en relation est maintenant terminée.");
    } catch (error) {
      setConnectionsMessage(
        error instanceof Error ? error.message : "La mise en relation n’a pas pu être fermée.",
      );
    }
  };

  const sendBipToSelectedPerson = async () => {
    if (!selectedPerson) return;
    try {
      const requestId = globalThis.crypto?.randomUUID?.();
      if (!requestId) throw new Error("Votre appareil ne permet pas de sécuriser cette demande.");
      if (access.mode === "guest") {
        if (!guestPresence) throw new Error("Publiez d’abord votre présence pour faire signe.");
        await sendReelGuestBip({
          data: {
            recipientActorKind: selectedPerson.actorKind === "guest" ? "guest" : "member",
            recipientPresenceId: selectedPerson.id,
            clientRequestId: requestId,
          },
        });
      } else if (canUseMemberReel && currentPresence) {
        if (selectedPerson.actorKind === "guest") {
          await sendReelBipToGuest(selectedPerson.id, requestId);
        } else {
          await sendReelBip(selectedPerson.id, requestId);
        }
      } else {
        throw new Error("Publiez votre présence avant de faire signe.");
      }
      setBipsMessage("Votre signe a bien été envoyé.");
      setSelectedPerson(null);
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : "Votre signe n’a pas pu être envoyé.");
    }
  };

  const resolveReceivedBip = async (bip: ReelBip, action: "accept" | "decline") => {
    try {
      await commandReelBip(bip.id, action);
      await refreshBips();
      setBipsMessage(
        action === "accept" ? "La mise en relation est établie." : "Le bip a été refusé.",
      );
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : "Cette action n’a pas pu aboutir.");
    }
  };

  const resolveGuestBip = async (bip: ReelGuestBip, action: "accept" | "decline") => {
    try {
      if (access.mode === "guest") {
        await commandMyReelGuestBip({ data: { bipId: bip.id, action } });
      } else {
        await commandReelGuestBipMember(bip.id, action);
      }
      await refreshBips();
      setBipsMessage(action === "accept" ? "La mise en relation est établie." : "Le bip a été refusé.");
    } catch (error) {
      setBipsMessage(error instanceof Error ? error.message : "Cette action n’a pas pu aboutir.");
    }
  };

  const endGuestConnection = async (connection: ReelGuestConnection) => {
    if (connection.status !== "active") return;
    if (!window.confirm("Mettre fin à cette mise en relation ? Elle sera fermée pour vous deux.")) return;
    try {
      if (access.mode === "guest") {
        await closeMyReelGuestConnection({ data: { connectionId: connection.connection_id } });
      } else {
        await closeReelGuestConnectionForMember(connection.connection_id);
      }
      await refreshConnections();
      setConnectionsMessage("Cette mise en relation est maintenant terminée.");
    } catch (error) {
      setConnectionsMessage(error instanceof Error ? error.message : "La mise en relation n’a pas pu être fermée.");
    }
  };

  const activatePresence = async () => {
    const decision = evaluateReelAccess(
      {
        access,
        presenceConsent: true,
        consents: ["reel_presence"],
        online: typeof navigator === "undefined" ? false : navigator.onLine,
      },
      "start_presence",
    );
    if (decision.status !== "server_check" || !presenceConsent) {
      setPresenceMessage(
        !presenceConsent
          ? "Confirmez d’abord que vous acceptez d’être visible dans votre secteur approximatif."
          : decision.message,
      );
      return;
    }

    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const fix = await requestReelLocation();
      const zone = await resolveReelZone({
        data: {
          latitude: fix.latitude,
          longitude: fix.longitude,
          purpose: "presence",
          consent: true,
        },
      });
      if (!zone.grantId)
        throw new Error("Votre autorisation de présence n’a pas pu être préparée. Réessayez.");
      const radiusMeters = radius === "1 km" ? 1000 : Number.parseInt(radius, 10);
      const durationMinutes: Record<string, number> = {
        "30 min": 30,
        "1 h": 60,
        "2 h": 120,
        "3 h": 180,
        "6 h": 360,
        "12 h": 720,
        "24 h": 1440,
      };
      const presence = await startReelPresence({
        zoneGrantId: zone.grantId,
        areaLabel: zone.areaLabel,
        description: presenceDescription,
        radiusMeters: radiusMeters as 10 | 25 | 50 | 100 | 1000,
        durationMinutes: durationMinutes[duration] as 30 | 60 | 120 | 180 | 360 | 720 | 1440,
        consent: true,
      });
      if (access.memberId) setLoadedPresence({ memberId: access.memberId, presence });
      setPresenceMessage("Votre présence est maintenant visible dans votre secteur approximatif.");
    } catch (error) {
      setPresenceMessage(
        error instanceof Error ? error.message : "Votre présence n’a pas pu être activée.",
      );
    } finally {
      setPresenceLoading(false);
    }
  };

  const activateGuestPresence = async () => {
    if (access.mode !== "guest" || !guestPresenceConsent) {
      setPresenceMessage("Confirmez d’abord que vous acceptez de rendre votre présence visible.");
      return;
    }
    const displayName = guestDisplayName.trim();
    const areaLabel = guestAreaLabel.trim();
    const description = presenceDescription.trim();
    if (!displayName || !areaLabel || !description) {
      setPresenceMessage("Ajoutez un prénom, un secteur et une courte description.");
      return;
    }
    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const fix = await requestReelLocation();
      const radiusMeters = radius === "1 km" ? 1000 : Number.parseInt(radius, 10);
      const durationMinutes: Record<string, number> = {
        "30 min": 30,
        "1 h": 60,
        "2 h": 120,
        "3 h": 180,
        "6 h": 360,
        "12 h": 720,
        "24 h": 1440,
      };
      const result = await startReelGuestPresence({
        data: {
          displayName,
          avatarKey: guestAvatarKey,
          areaLabel,
          description,
          radiusM: radiusMeters as 10 | 25 | 50 | 100 | 1000,
          latitude: fix.latitude,
          longitude: fix.longitude,
          durationMinutes: Math.min(durationMinutes[duration], 60) as 30 | 60,
          consent: true,
        },
      });
      const nextPresence = await getMyReelGuestPresence();
      if (!nextPresence || nextPresence.id !== result.presenceId) {
        throw new Error("Votre présence n’a pas pu être confirmée. Réessayez.");
      }
      setGuestPresence(nextPresence);
      setGuestPresenceConsent(false);
      setPresenceMessage("Votre présence est maintenant visible autour de vous.");
      if (discoveryAccess !== "granted") {
        setPanel(null);
        await requestDiscovery();
      }
    } catch (error) {
      setPresenceMessage(
        error instanceof Error ? error.message : "Votre présence n’a pas pu être activée.",
      );
    } finally {
      setPresenceLoading(false);
    }
  };

  const stopGuestPresence = async () => {
    if (!guestPresence) return;
    setPresenceLoading(true);
    setPresenceMessage(null);
    try {
      const result = await endReelGuestPresence({
        data: { presenceId: guestPresence.id },
      });
      if (!result.ended) throw new Error("Cette présence n’est déjà plus active.");
      setGuestPresence(null);
      setPresenceMessage("Votre présence n’est plus visible.");
    } catch (error) {
      setPresenceMessage(
        error instanceof Error ? error.message : "Votre présence n’a pas pu être arrêtée.",
      );
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
      if (access.memberId)
        setLoadedPresence({
          memberId: access.memberId,
          presence: ended.status === "active" ? ended : null,
        });
      setPresenceMessage("Votre présence n’est plus visible.");
    } catch (error) {
      setPresenceMessage(
        error instanceof Error ? error.message : "Votre présence n’a pas pu être arrêtée.",
      );
    } finally {
      setPresenceLoading(false);
    }
  };

  const beginGuestSession = async () => {
    setGuestSessionLoading(true);
    setGuestSessionMessage(null);
    try {
      await access.startGuestSession();
      setGuestSessionMessage(
        "Votre accès invité est prêt. Vous pourrez maintenant découvrir les présences autour de vous.",
      );
    } catch (error) {
      setGuestSessionMessage(
        error instanceof Error ? error.message : "Votre accès invité n’a pas pu être ouvert.",
      );
    } finally {
      setGuestSessionLoading(false);
    }
  };

  const requestDiscovery = async () => {
    if (access.loading) return;
    setDiscoveryAccess("requesting");
    setLocationMessage(null);
    try {
      const fix = await requestReelLocation();
      if (access.mode === "guest") {
        const rows = await discoverReelGuestNearby({
          data: { latitude: fix.latitude, longitude: fix.longitude },
        });
        setDiscoveredPeople(
          rows.map((person, index) => ({
            id: person.presence_id,
            name: person.display_name || "Profil Vitalis",
            avatarUrl: null,
            avatarKey: person.avatar_key,
            initials: (person.display_name || "V")
              .trim()
              .split(/\\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? "")
              .join(""),
            angle: (index * 137.5) % 360,
            description: person.description,
            locationLabel: person.area_label,
            actorKind: person.actor_kind,
          })),
        );
      } else {
        const decision = evaluateReelAccess(
          {
            access,
            discoveryConsent: true,
            online: typeof navigator === "undefined" ? false : navigator.onLine,
          },
          "discover_presence",
        );
        if (decision.status !== "server_check") throw new Error(decision.message);
        const zone = await resolveReelZone({
          data: {
            latitude: fix.latitude,
            longitude: fix.longitude,
            purpose: "discover",
            consent: true,
          },
        });
        const [members, guests] = await Promise.all([
          listReelNearbyPresence(),
          listReelNearbyGuestPresence(),
        ]);
        const memberCards = members.map((person, index) => ({
          id: person.presence_id,
          name: person.display_name || "Profil Vitalis",
          avatarUrl: null,
          initials: (person.display_name || "V")
            .trim()
            .split(/\\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join(""),
          angle: (index * 137.5) % 360,
          description: person.description,
          locationLabel: person.area_label || zone.areaLabel,
          actorKind: "member" as const,
        }));
        const guestCards = guests.map((person, index) => ({
          id: person.presence_id,
          name: person.display_name || "Invité",
          avatarUrl: null,
          avatarKey: person.avatar_key,
          initials: (person.display_name || "I")
            .trim()
            .split(/\\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join(""),
          angle: ((members.length + index) * 137.5) % 360,
          description: person.description,
          locationLabel: person.area_label || zone.areaLabel,
          actorKind: "guest" as const,
        }));
        setDiscoveredPeople([...memberCards, ...guestCards]);
      }
      setDiscoveryAccess("granted");
    } catch (error) {
      setDiscoveryAccess("denied");
      setLocationMessage(
        error instanceof Error
          ? error.message
          : "La découverte à proximité n’est pas disponible pour le moment.",
      );
    }
  };
  const ignoreLocation = () => {
    setDiscoveryAccess("ignored");
    setDiscoveredPeople([]);
    setLocationMessage(null);
  };
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
          aria-label={
            activityEnabled
              ? "Notifications, bips et mises en relation"
              : "Les notifications Réel sont en pause sans autorisation de proximité"
          }
          title={activityEnabled ? "Activité" : "Notifications en pause"}
        >
          <Bell aria-hidden="true" />
        </button>
      </header>

      {!discoveryEnabled && (
        <section
          className={`reel-location-card reel-location-card--${discoveryAccess}`}
          aria-label="Accès à la position"
        >
          <div className="reel-location-card__icon">
            <MapPin aria-hidden="true" />
          </div>
          <div className="reel-location-card__copy">
            <strong>
              {discoveryAccess === "prompt" && !canUseMemberReel
                ? access.mode === "guest"
                  ? "Vous découvrez Réel en invité"
                  : "Découvrez Réel sans créer de compte"
                : discoveryAccess === "prompt"
                  ? "Envie de découvrir ce qui se passe près de vous ?"
                  : discoveryAccess === "requesting"
                    ? "Nous vérifions votre position…"
                    : discoveryAccess === "denied"
                      ? "Votre position reste privée"
                      : "Vous découvrez Réel à votre rythme"}
            </strong>
            <p>
              {discoveryAccess === "prompt" && !canUseMemberReel
                ? access.mode === "guest"
                  ? "Votre session est temporaire. Vous pouvez découvrir les présences autour de vous sans créer de compte."
                  : "Commencez avec une session temporaire. Elle ne crée pas de compte ni de profil permanent."
                : discoveryAccess === "prompt"
                  ? "Autorisez Réel à utiliser votre position pour observer les personnes et les activités autour de vous. Votre choix reste libre."
                  : discoveryAccess === "requesting"
                    ? "Cela ne prend que quelques instants."
                    : locationMessage ||
                      "Vous pouvez parcourir Réel sans localisation. Les découvertes proches, les bips et les réactions resteront en pause."}
            </p>
            <div className="reel-location-card__actions">
              {(canUseMemberReel || access.mode === "guest") &&
                (discoveryAccess === "prompt" ||
                  discoveryAccess === "ignored" ||
                  discoveryAccess === "denied") && (
                  <button
                    type="button"
                    className="reel-location-card__primary"
                    onClick={() => void requestDiscovery()}
                  >
                    {discoveryAccess === "prompt"
                      ? "Voir les personnes autour de moi"
                      : "Réessayer"}
                  </button>
                )}
              {access.mode === "visitor" && (
                <button
                  type="button"
                  className="reel-location-card__primary"
                  disabled={guestSessionLoading}
                  onClick={() => void beginGuestSession()}
                >
                  {guestSessionLoading ? "Ouverture de votre accès…" : "Continuer en invité"}
                </button>
              )}
              {guestSessionMessage && <p role="status">{guestSessionMessage}</p>}
              {discoveryAccess === "prompt" && (
                <button
                  type="button"
                  className="reel-location-card__secondary"
                  onClick={ignoreLocation}
                >
                  Pas maintenant
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <div
        className={`reel-proximity__radar${discoveryEnabled ? "" : " reel-proximity__radar--calm"}`}
      >
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
          {!discoveryEnabled
            ? "La découverte à proximité est en pause"
            : availablePeople.length === 0
              ? "Aucune présence réelle ne se trouve dans votre rayon pour le moment"
              : `${availablePeople.length} personne${availablePeople.length > 1 ? "s" : ""} à proximité`}
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
            <span>
              <strong>Propositions globales</strong>
              <small>Découvrir sans partager votre position</small>
            </span>
            <ChevronDown aria-hidden="true" />
          </button>
          <button type="button" onClick={() => openActivity("connections")}>
            <History aria-hidden="true" />
            <span>
              <strong>Mon activité passée</strong>
              <small>Retrouver les informations déjà disponibles</small>
            </span>
            <ChevronDown aria-hidden="true" />
          </button>
        </div>
      )}

      {panel && (
        <div
          className="reel-panel-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPanel(null);
          }}
        >
          <section
            className="reel-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-panel-title"
          >
            <button
              type="button"
              className="reel-panel__close"
              onClick={() => setPanel(null)}
              aria-label="Fermer"
            >
              <X aria-hidden="true" />
            </button>

            {panel === "settings" && (
              <>
                <div className="reel-panel__eyebrow">
                  <Settings2 aria-hidden="true" /> Personnalisation
                </div>
                <h2 id="reel-panel-title">Ma présence et mes préférences</h2>
                <p className="reel-panel__intro">
                  Choisissez comment vous souhaitez rencontrer les personnes autour de vous.
                </p>

                <div className="reel-panel__section">
                  <h3>Découverte à proximité</h3>
                  <p className="reel-panel__note">
                    {discoveryEnabled
                      ? "La découverte est active pour cette visite. Elle vous permet d’observer les activités autour de vous, sans publier votre propre présence."
                      : "Vous pouvez activer la découverte pour observer les activités autour de vous. Cela ne rend pas votre propre présence visible."}
                  </p>
                  {!discoveryEnabled && (
                    <button
                      type="button"
                      className="reel-panel__primary"
                      onClick={() => void requestDiscovery()}
                    >
                      Activer la découverte
                    </button>
                  )}
                </div>

                <div className="reel-panel__section">
                  <h3>Rayon de proximité</h3>
                  <div className="reel-choice-grid">
                    {RADII.map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={radius === value ? "is-selected" : ""}
                        onClick={() => setRadius(value)}
                      >
                        {value}
                        {radius === value && <Check aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="reel-panel__note">
                  Le rayon choisi est appliqué côté serveur en mètres. Les positions précises
                  restent privées et temporaires ; aucune distance exacte n’est affichée. La
                  précision dépend aussi du GPS de votre appareil.
                </p>
                {currentPresence && (
                  <p className="reel-panel__note">
                    Votre présence est déjà active : les changements de rayon ou de durée
                    s’appliqueront à la prochaine activation, pas à celle-ci.
                  </p>
                )}

                <div className="reel-panel__section">
                  <h3>Durée souhaitée</h3>
                  {access.mode === "guest" && (
                    <p className="reel-panel__note">
                      Votre accès invité dure au maximum une heure. Votre présence s’arrêtera
                      automatiquement avec votre session.
                    </p>
                  )}
                  <div className="reel-choice-grid reel-choice-grid--duration">
                    {DURATIONS.filter(
                      (value) => access.mode !== "guest" || value === "30 min" || value === "1 h",
                    ).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={duration === value ? "is-selected" : ""}
                        onClick={() => setDuration(value)}
                      >
                        {value}
                        {duration === value && <Check aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="reel-panel__section">
                  <h3>Ma visibilité</h3>
                  <p className="reel-panel__note">
                    La découverte vous permet d’observer les activités autour de vous. Activer votre
                    présence est un choix séparé : les autres personnes pourront alors vous voir
                    dans votre secteur approximatif, pendant la durée choisie.
                  </p>
                  {access.mode === "guest" ? (
                    guestPresence ? (
                      <>
                        <p className="reel-panel__status">
                          Votre présence est visible sous le nom {guestPresence.display_name}, dans
                          le secteur « {guestPresence.area_label} », jusqu’à la fin de votre session
                          invitée.
                        </p>
                        <button
                          type="button"
                          className="reel-panel__secondary"
                          disabled={presenceLoading}
                          onClick={() => void stopGuestPresence()}
                        >
                          Arrêter ma présence
                        </button>
                      </>
                    ) : (
                      <>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>Le prénom à afficher</strong>
                            <small>Un prénom ou un nom court, sans créer de compte.</small>
                          </span>
                          <input
                            type="text"
                            autoComplete="nickname"
                            maxLength={40}
                            value={guestDisplayName}
                            onChange={(event) => setGuestDisplayName(event.target.value)}
                            placeholder="Ex. Awa"
                          />
                        </label>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>Mon secteur</strong>
                            <small>Un repère général, jamais votre adresse exacte.</small>
                          </span>
                          <input
                            type="text"
                            maxLength={80}
                            value={guestAreaLabel}
                            onChange={(event) => setGuestAreaLabel(event.target.value)}
                            placeholder="Ex. Bonamoussadi"
                          />
                        </label>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>Mon avatar</strong>
                            <small>Choisissez une couleur pour vous reconnaître.</small>
                          </span>
                          <select
                            value={guestAvatarKey}
                            onChange={(event) => setGuestAvatarKey(event.target.value)}
                          >
                            <option value="avatar-blue">Bleu</option>
                            <option value="avatar-violet">Violet</option>
                            <option value="avatar-green">Vert</option>
                            <option value="avatar-orange">Orange</option>
                          </select>
                        </label>
                        <label className="reel-setting-row reel-setting-row--stacked">
                          <span>
                            <strong>Ce que les autres verront</strong>
                            <small>Une phrase courte pour expliquer votre présence.</small>
                          </span>
                          <textarea
                            maxLength={180}
                            value={presenceDescription}
                            onChange={(event) => setPresenceDescription(event.target.value)}
                            rows={2}
                          />
                        </label>
                        <label className="reel-setting-row">
                          <span>
                            <strong>Je souhaite être visible</strong>
                            <small>
                              Ma position précise reste privée. Seule ma présence dans le rayon
                              choisi sera proposée aux personnes proches.
                            </small>
                          </span>
                          <input
                            type="checkbox"
                            checked={guestPresenceConsent}
                            onChange={(event) => setGuestPresenceConsent(event.target.checked)}
                          />
                        </label>
                        <button
                          type="button"
                          className="reel-panel__primary"
                          disabled={
                            presenceLoading ||
                            !guestPresenceConsent ||
                            !guestDisplayName.trim() ||
                            !guestAreaLabel.trim() ||
                            !presenceDescription.trim()
                          }
                          onClick={() => void activateGuestPresence()}
                        >
                          {presenceLoading ? "Activation…" : "Rendre ma présence visible"}
                        </button>
                      </>
                    )
                  ) : !canUseMemberReel ? (
                    <p className="reel-panel__note">
                      Pour publier votre présence, commencez par ouvrir une session invitée ou
                      utilisez votre compte Vitalis.
                    </p>
                  ) : currentPresence ? (
                    <>
                      <p className="reel-panel__status">
                        Votre présence est active jusqu’à la fin de la durée choisie.
                      </p>
                      <button
                        type="button"
                        className="reel-panel__secondary"
                        disabled={presenceLoading}
                        onClick={() => void stopPresence()}
                      >
                        Arrêter ma présence
                      </button>
                    </>
                  ) : (
                    <>
                      <label className="reel-setting-row reel-setting-row--stacked">
                        <span>
                          <strong>Ce que les autres verront</strong>
                          <small>Une courte description de votre présence.</small>
                        </span>
                        <textarea
                          maxLength={180}
                          value={presenceDescription}
                          onChange={(event) => setPresenceDescription(event.target.value)}
                          rows={2}
                        />
                      </label>
                      <label className="reel-setting-row">
                        <span>
                          <strong>Je souhaite être visible</strong>
                          <small>
                            Ma position sera indiquée de façon approximative, jamais sous forme de
                            coordonnées GPS exactes.
                          </small>
                        </span>
                        <input
                          type="checkbox"
                          checked={presenceConsent}
                          onChange={(event) => setPresenceConsent(event.target.checked)}
                        />
                      </label>
                      <button
                        type="button"
                        className="reel-panel__primary"
                        disabled={
                          presenceLoading || !presenceConsent || !presenceDescription.trim()
                        }
                        onClick={() => void activatePresence()}
                      >
                        {presenceLoading ? "Activation…" : "Activer ma présence"}
                      </button>
                    </>
                  )}
                  {presenceMessage && (
                    <p className="reel-panel__note" role="status">
                      {presenceMessage}
                    </p>
                  )}
                </div>

                <div className="reel-panel__section">
                  <h3>Ce que je souhaite autoriser</h3>
                  <label className="reel-setting-row">
                    <span>
                      <strong>Afficher ma distance</strong>
                      <small>Les personnes voient à quelle distance vous êtes.</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.showDistance}
                      onChange={(event) =>
                        setPreferences((current) => ({
                          ...current,
                          showDistance: event.target.checked,
                        }))
                      }
                    />
                  </label>
                  <label className="reel-setting-row">
                    <span>
                      <strong>Recevoir des bips</strong>
                      <small>Les personnes peuvent vous faire signe.</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.allowBips}
                      onChange={(event) =>
                        setPreferences((current) => ({
                          ...current,
                          allowBips: event.target.checked,
                        }))
                      }
                    />
                  </label>
                  <label className="reel-setting-row">
                    <span>
                      <strong>Voir les personnes disponibles</strong>
                      <small>Mettre en avant celles qui sont présentes maintenant.</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.showOnlyAvailable}
                      onChange={(event) =>
                        setPreferences((current) => ({
                          ...current,
                          showOnlyAvailable: event.target.checked,
                        }))
                      }
                    />
                  </label>
                </div>
                <p className="reel-panel__note">
                  <MapPin aria-hidden="true" /> Ces préférences d’affichage restent locales pour le
                  moment. Elles ne modifient pas encore les règles de visibilité enregistrées sur le
                  serveur.
                </p>
                <button
                  type="button"
                  className="reel-panel__primary"
                  onClick={() => setPanel(null)}
                >
                  Terminé
                </button>
              </>
            )}

            {panel === "global" && (
              <>
                <div className="reel-panel__eyebrow">
                  <Globe aria-hidden="true" /> Découvrir autrement
                </div>
                <h2 id="reel-panel-title">Propositions globales</h2>
                <div className="reel-panel__empty">
                  <Globe aria-hidden="true" />
                  <strong>Les découvertes générales arrivent ici</strong>
                  <span>
                    Aucune activité proche n’est chargée lorsque vous gardez votre position privée.
                    Les propositions globales seront affichées dès que leur source sera disponible.
                  </span>
                </div>
              </>
            )}

            {panel === "activity" && (
              <>
                <div className="reel-panel__eyebrow">
                  <Bell aria-hidden="true" /> Votre activité
                </div>
                <h2 id="reel-panel-title">Notifications et rencontres</h2>
                <div className="reel-panel__tabs" role="tablist" aria-label="Activité">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activityTab === "notifications"}
                    aria-disabled={!activityEnabled}
                    disabled={!activityEnabled}
                    className={activityTab === "notifications" ? "is-active" : ""}
                    onClick={() => setActivityTab("notifications")}
                  >
                    Alertes
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activityTab === "bips"}
                    aria-disabled={!currentPresence && !guestPresence}
                    disabled={!currentPresence && !guestPresence}
                    className={activityTab === "bips" ? "is-active" : ""}
                    onClick={() => setActivityTab("bips")}
                  >
                    Bips reçus
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activityTab === "connections"}
                    className={activityTab === "connections" ? "is-active" : ""}
                    onClick={() => setActivityTab("connections")}
                  >
                    Rencontres
                  </button>
                </div>
                {activityTab === "bips" ? (
                  <div className="reel-people-list" aria-live="polite">
                    {bipsLoading && <p className="reel-panel__note">Chargement de vos bips…</p>}
                    {!canUseMemberReel && access.mode !== "guest" && (
                      <p className="reel-panel__note">
                        Publiez votre présence pour recevoir les signes des personnes proches.
                      </p>
                    )}
                    {(canUseMemberReel || access.mode === "guest") &&
                      !bipsLoading && receivedBips.length === 0 && receivedGuestBips.length === 0 && (
                      <div className="reel-panel__empty">
                        <RadioTower aria-hidden="true" />
                        <strong>Aucun bip reçu pour le moment</strong>
                        <span>Les signes reçus pendant votre présence apparaîtront ici.</span>
                      </div>
                    )}
                    {receivedBips.map((bip) => (
                      <div className="reel-people-list__item" key={bip.id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>Une personne vous a fait signe</strong>
                          <small>Vous pouvez accepter ou refuser cette mise en relation.</small>
                        </span>
                        <button
                          type="button"
                          onClick={() => void resolveReceivedBip(bip, "accept")}
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          onClick={() => void resolveReceivedBip(bip, "decline")}
                        >
                          Refuser
                        </button>
                      </div>
                    ))}
                    {receivedGuestBips.map((bip) => (
                      <div className="reel-people-list__item" key={bip.id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>Une personne vous a fait signe</strong>
                          <small>Vous pouvez accepter ou refuser cette mise en relation.</small>
                        </span>
                        <button type="button" onClick={() => void resolveGuestBip(bip, "accept")}>
                          Accepter
                        </button>
                        <button type="button" onClick={() => void resolveGuestBip(bip, "decline")}>
                          Refuser
                        </button>
                      </div>
                    ))}
                    {bipsMessage && (
                      <p className="reel-panel__note" role="status">
                        {bipsMessage}
                      </p>
                    )}
                  </div>
                ) : activityTab === "connections" ? (
                  <div className="reel-people-list" aria-live="polite">
                    {connectionsLoading && (
                      <p className="reel-panel__note">Chargement de vos rencontres…</p>
                    )}
                    {!canUseMemberReel && (
                      <p className="reel-panel__note">
                        Connectez-vous à votre compte Vitalis pour retrouver vos mises en relation.
                      </p>
                    )}
                    {canUseMemberReel && !connectionsLoading && connections.length === 0 && (
                      <div className="reel-panel__empty">
                        <UsersRound aria-hidden="true" />
                        <strong>Vous n’avez pas encore de mise en relation</strong>
                        <span>Les personnes qui acceptent votre signe apparaîtront ici.</span>
                      </div>
                    )}
                    {connections.map((connection) => (
                      <div className="reel-people-list__item" key={connection.connection_id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>{connection.partner_display_name}</strong>
                          <small>
                            {connection.status === "active"
                              ? "Mise en relation active"
                              : "Mise en relation terminée"}
                          </small>
                        </span>
                        {connection.status === "active" && (
                          <button type="button" onClick={() => void endConnection(connection)}>
                            Terminer
                          </button>
                        )}
                      </div>
                    ))}
                    {guestConnections.map((connection) => (
                      <div className="reel-people-list__item" key={connection.connection_id}>
                        <span className="reel-avatar reel-avatar--small">
                          <CircleUserRound aria-hidden="true" />
                        </span>
                        <span>
                          <strong>{connection.partner_display_name || "Mise en relation temporaire"}</strong>
                          <small>
                            {connection.status === "active"
                              ? "Votre rencontre est active pendant la session invitée."
                              : "Cette mise en relation est terminée."}
                          </small>
                        </span>
                        {connection.status === "active" && (
                          <button type="button" onClick={() => void endGuestConnection(connection)}>
                            Terminer
                          </button>
                        )}
                      </div>
                    ))}
                    {connectionsMessage && (
                      <p className="reel-panel__note" role="status">
                        {connectionsMessage}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="reel-panel__empty">
                    <Bell aria-hidden="true" />
                    <strong>Tout est calme pour le moment</strong>
                    <span>
                      Les notifications liées à Réel apparaîtront ici lorsqu’un événement réel sera
                      disponible.
                    </span>
                  </div>
                )}
                {!activityEnabled && activityTab === "notifications" && (
                  <p className="reel-panel__note">
                    En mode calme, les alertes sont suspendues. Vos mises en relation restent
                    consultables.
                  </p>
                )}
              </>
            )}

            {panel === "people" && (
              <>
                <div className="reel-panel__eyebrow">
                  <UsersRound aria-hidden="true" /> À proximité
                </div>
                <h2 id="reel-panel-title">Toutes les personnes proches</h2>
                {discoveryEnabled && availablePeople.length ? (
                  <div className="reel-people-list">
                    {availablePeople.map((person) => (
                      <button
                        type="button"
                        className="reel-people-list__item"
                        key={person.id}
                        onClick={() => openProfile(person)}
                      >
                        <PersonAvatar person={person} size="small" />
                        <span>
                          <strong>{person.name}</strong>
                          <small>
                            {person.description || person.category || "Profil à proximité"}
                          </small>
                        </span>
                        {person.distanceLabel && (
                          <small className="reel-people-list__distance">
                            {person.distanceLabel}
                          </small>
                        )}
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
        <div
          className="reel-profile-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeProfile();
          }}
        >
          <section
            className="reel-profile-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reel-profile-title"
          >
            <button
              type="button"
              className="reel-profile-sheet__close"
              onClick={closeProfile}
              aria-label="Fermer le profil"
            >
              <X aria-hidden="true" />
            </button>
            {showFullProfile && (
              <button
                type="button"
                className="reel-profile-sheet__back"
                onClick={() => setShowFullProfile(false)}
              >
                <ArrowLeft aria-hidden="true" /> Retour à l’aperçu
              </button>
            )}
            <PersonAvatar person={selectedPerson} size="me" />
            <h2 id="reel-profile-title">{selectedPerson.name}</h2>
            {selectedPerson.category && (
              <p className="reel-profile-sheet__category">{selectedPerson.category}</p>
            )}
            {selectedPerson.distanceLabel && (
              <p className="reel-profile-sheet__distance">{selectedPerson.distanceLabel}</p>
            )}
            {showFullProfile ? (
              <>
                {selectedPerson.description && (
                  <p className="reel-profile-sheet__description">{selectedPerson.description}</p>
                )}
                {(selectedPerson.locationLabel || selectedPerson.distanceLabel) && (
                  <div className="reel-profile-sheet__details">
                    {selectedPerson.locationLabel && <span>{selectedPerson.locationLabel}</span>}
                    {selectedPerson.distanceLabel && <span>{selectedPerson.distanceLabel}</span>}
                  </div>
                )}
                {!selectedPerson.description && !selectedPerson.locationLabel && (
                  <p className="reel-profile-sheet__empty">
                    Cette personne n’a pas encore ajouté d’autres informations à son profil.
                  </p>
                )}
              </>
            ) : (
              <p className="reel-profile-sheet__description">
                {selectedPerson.description ||
                  "Consultez les informations disponibles sur ce profil."}
              </p>
            )}
            {currentPresence && selectedPerson.actorKind !== "guest" && !showFullProfile && (
              <button
                type="button"
                className="reel-profile-sheet__primary"
                onClick={() => void sendBipToSelectedPerson()}
              >
                <RadioTower aria-hidden="true" /> Faire signe
              </button>
            )}
            <button
              type="button"
              className="reel-profile-sheet__primary"
              onClick={() => {
                if (showFullProfile) closeProfile();
                else setShowFullProfile(true);
              }}
            >
              {showFullProfile ? "Fermer" : "Voir la fiche complète"}
            </button>
          </section>
        </div>
      )}
    </section>
  );
}
