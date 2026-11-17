import type { MessageKey } from "@/lib/i18n/messages";

type TranslateMessage = (key: MessageKey) => string;
type MessageVariables = Readonly<Record<string, string | number | null | undefined>>;

/**
 * Resolves a localized catalog entry and safely replaces its simple variables.
 * Missing values become empty strings so raw placeholders are never shown.
 */
export function formatCommunicationMessage(
  translate: TranslateMessage,
  key: MessageKey,
  variables: MessageVariables = {},
): string {
  return translate(key)
    .replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (_match, name: string) => {
      const value = variables[name];
      return value === null || value === undefined ? "" : String(value).trim();
    })
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,;:])\s*([.!?])/g, "$2")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
