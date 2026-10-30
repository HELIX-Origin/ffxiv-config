import { Plugin } from "@opencode/plugin"
import { loadConfig } from "./_config"

// ── Config ──────────────────────────────────────────────────────────────

export interface EssentialsConfig {
  enabled: boolean
  debug: boolean
  contextThreshold: number
  secretPatterns: string[]
  marker: string
  reminderText: string
}

const DEFAULT_CONFIG: EssentialsConfig = {
  enabled: true,
  debug: false,
  contextThreshold: 50_000,
  secretPatterns: [
    "(?:api[_-]?key|token|secret|password|passwd|pwd)\\s*[:=]\\s*[\"']?[\\w\\-\\.]{8,}[\"']?",
    "sk-[a-zA-Z0-9]{20,}",
    "ghp_[a-zA-Z0-9]{36,}",
    "gho_[a-zA-Z0-9]{36,}",
  ],
  marker: "Essentials: ",
  reminderText:
    "Follow AGENTS.md and .opencode/instructions/* strictly. " +
    "Use targeted searches over full-file dumps. Record findings in tracking docs. " +
    "Never guess — research official docs first. Preserve LF line endings. " +
    "Do not run builds/tests for doc-only changes.",
}

const MARKER_FALLBACK = "Essentials: "

function redactSecrets(text: string, patterns: string[]): string {
  let result = text
  for (const pattern of patterns) {
    try {
      const regex = new RegExp(pattern, "gi")
      result = result.replace(regex, (match) => {
        const key = match.split(/[:=]/)[0]
        return `${key}: [REDACTED]`
      })
    } catch {
      // invalid regex, skip
    }
  }
  return result
}

export default Plugin.define({
  id: "helix.essentials",
  async setup(ctx) {
    const config = loadConfig("essentials", DEFAULT_CONFIG, ctx)
    if (!config.enabled) return () => {}

    const marker = config.marker || MARKER_FALLBACK

    // Redact secrets from user prompts before admission
    await ctx.session.hook("prompt", (event) => {
      const e = event as { prompt?: { text?: string; files?: unknown[] } }
      if (e.prompt?.text) {
        e.prompt.text = redactSecrets(e.prompt.text, config.secretPatterns)
      }
    })

    // Append essential-instructions reminder to system prompt when context grows
    await ctx.session.hook("context", (event) => {
      const e = event as { system?: { type: string; text: string }[]; messages?: unknown }
      if (!Array.isArray(e.system)) return
      if (e.system.some((b) => b.type === "text" && b.text.startsWith(marker))) return

      const chars = JSON.stringify(e.messages ?? "").length
      if (chars < config.contextThreshold) return

      e.system.push({
        type: "text",
        text: `${marker}${config.reminderText}`,
      })
    })

    return () => {}
  },
})