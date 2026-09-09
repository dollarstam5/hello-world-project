import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const askSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
  locale: z.enum(["fr", "en"]).default("fr"),
  route: z.string().max(200).optional(),
});

const SYSTEM_FR = `Tu es l'assistant de l'application « Écosystème ».
Tu es chaleureux, direct et utile. Tu parles comme un humain, jamais comme une machine.
Règles : réponses courtes (2 à 5 phrases), pas de jargon technique, pas de listes interminables.
L'application permet de partager des flash (annonces courtes), d'explorer un radar de personnes
et de talents autour de soi, de gérer son espace personnel et son identité, et fonctionne même
sans connexion. Si tu ne sais pas, dis-le simplement et propose une piste.`;

const SYSTEM_EN = `You are the assistant of the "Écosystème" app.
You are warm, direct and useful. You speak like a human, never like a machine.
Rules: short answers (2 to 5 sentences), no technical jargon, no endless lists.
The app lets people post flashes (short announcements), explore a radar of nearby people and
talents, manage their personal space and identity, and it works offline too.
If you don't know, say so plainly and offer a next step.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator(askSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, reason: "unavailable" as const };

    const system = data.locale === "en" ? SYSTEM_EN : SYSTEM_FR;
    const context = data.route ? `\nCurrent screen: ${data.route}` : "";

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "system", content: system + context }, ...data.messages],
        }),
      });

      if (response.status === 429) return { ok: false as const, reason: "rate-limited" as const };
      if (response.status === 402) return { ok: false as const, reason: "credits" as const };
      if (!response.ok) return { ok: false as const, reason: "error" as const };

      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = payload.choices?.[0]?.message?.content?.trim();
      if (!content) return { ok: false as const, reason: "error" as const };
      return { ok: true as const, content };
    } catch {
      return { ok: false as const, reason: "error" as const };
    }
  });
