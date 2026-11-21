export const DURATIONS = ["30 min", "1 h", "2 h", "3 h", "6 h", "12 h", "24 h"];

export const RADII = ["10 m", "25 m", "50 m", "100 m", "1 km"];

export const RADII_CONFIG: Record<string, { contextKey: string }> = {
  "10 m": { contextKey: "reel.settings.radius.10" },
  "25 m": { contextKey: "reel.settings.radius.25" },
  "50 m": { contextKey: "reel.settings.radius.50" },
  "100 m": { contextKey: "reel.settings.radius.100" },
  "1 km": { contextKey: "reel.settings.radius.1000" },
};

export const DURATIONS_CONFIG: Record<string, { badgeKey: string; color: string }> = {
  "30 min": { badgeKey: "reel.settings.duration.30", color: "#22c55e" },
  "1 h": { badgeKey: "reel.settings.duration.60", color: "#22c55e" },
  "2 h": { badgeKey: "reel.settings.duration.120", color: "#38bdf8" },
  "3 h": { badgeKey: "reel.settings.duration.180", color: "#38bdf8" },
  "6 h": { badgeKey: "reel.settings.duration.360", color: "#eab308" },
  "12 h": { badgeKey: "reel.settings.duration.720", color: "#f97316" },
  "24 h": { badgeKey: "reel.settings.duration.1440", color: "#ef4444" },
};
