import { Plugin } from "@opencode/plugin"
import { loadConfig } from "./_config"

// ── Config ──────────────────────────────────────────────────────────────

export interface ResearchFirstConfig {
  enabled: boolean
  debug: boolean
  codeTaskPatterns: string[]
  marker: string
  reminderText: string
}

const DEFAULT_CONFIG: ResearchFirstConfig = {
  enabled: true,
  debug: false,
  codeTaskPatterns: [
    "fix", "implement", "add", "create", "modify", "change", "update",
    "refactor", "rewrite", "build", "deploy", "install",
  ],
  marker: "Research-first: ",
  reminderText:
    "Before any code change, research official primary documentation online " +
    "and empirically inspect the live state. Guesswork and trial-and-error are banned. " +
    "Record findings in tracking docs (ROADMAP.md, PLAN.md, TODO.md, BUGS.md, HANDOFF.md).",
}

export default Plugin.define({
  id: "helix.research-first",
  async setup(ctx) {
    const config = loadConfig("research-first", DEFAULT_CONFIG, ctx)
    if (!config.enabled) return () => {}

    const codeTaskRegex = new RegExp(`(?:${config.codeTaskPatterns.join("|")})`, "i")

    await ctx.session.hook("prompt", (event) => {
      const e = event as { prompt?: { text?: string }; system?: { type: string; text: string }[] }
      if (!e.prompt?.text) return

      const text = e.prompt.text.toLowerCase()
      if (!codeTaskRegex.test(text)) return

      const sys = e.system
      if (!Array.isArray(sys)) return
      if (sys.some((b) => b.type === "text" && b.text.startsWith(config.marker))) return

      sys.push({
        type: "text",
        text: `${config.marker}${config.reminderText}`,
      })
    })

    return () => {}
  },
})