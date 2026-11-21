import { useEffect, useRef, useState, type TouchEvent } from "react";
import { RadioTower, X } from "lucide-react";
import type { Person } from "@/domains/presence/model/useReelProximityController";
import { PersonAvatar } from "./ReelRadarIdentity";
import { useI18n } from "@/lib/i18n/useI18n";
import { haptic } from "@/platform/device/haptics";

export function ReelProfileSheet({
  person,
  isPresenceActive,
  onClose,
  onSendBip,
}: {
  person: Person | null;
  isPresenceActive: boolean;
  onClose: () => void;
  onSendBip: () => void;
}) {
  const { t } = useI18n();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!person) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        haptic.tap();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [person, onClose]);

  if (!person) return null;

  const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
    if (e.touches.length === 0) return;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent<HTMLElement>) => {
    if (touchStartY.current === null || e.touches.length === 0) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setDragOffset(delta);
    else setDragOffset(0);
  };

  const handleTouchEnd = () => {
    const shouldClose = dragOffset > 90;
    setIsDragging(false);
    touchStartY.current = null;
    if (shouldClose) {
      haptic.tap();
      onClose();
    }
    setDragOffset(0);
  };

  const handleSendBip = () => {
    haptic.pulse();
    onSendBip();
  };

  const handleClose = () => {
    haptic.tap();
    onClose();
  };

  return (
    <div
      className="reel-profile-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        className={`reel-profile-sheet ${isDragging ? "is-dragging" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reel-profile-title"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? "none" : "transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <div className="reel-profile-sheet__handle" aria-hidden="true" />
        <button
          type="button"
          className="reel-profile-sheet__close"
          onClick={handleClose}
          aria-label={t("reel.ui.closeProfile")}
        >
          <X aria-hidden="true" />
        </button>
        <PersonAvatar person={person} size="me" />
        <h2 id="reel-profile-title">{person.name}</h2>
        {person.category && <p className="reel-profile-sheet__category">{person.category}</p>}
        {person.distanceLabel && (
          <p className="reel-profile-sheet__distance">{person.distanceLabel}</p>
        )}
        {person.description ? (
          <p className="reel-profile-sheet__description">{person.description}</p>
        ) : (
          <p className="reel-profile-sheet__empty">{t("reel.ui.noExtraProfile")}</p>
        )}
        {person.locationLabel && (
          <div className="reel-profile-sheet__details">
            <span>{person.locationLabel}</span>
          </div>
        )}
        {isPresenceActive && (
          <button type="button" className="reel-profile-sheet__primary" onClick={handleSendBip}>
            <RadioTower aria-hidden="true" /> {t("reel.ui.makeSign")}
          </button>
        )}
      </section>
    </div>
  );
}
