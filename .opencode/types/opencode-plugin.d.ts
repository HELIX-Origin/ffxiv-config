/**
 * Local type shim for the OpenCode V2 plugin runtime module.
 *
 * `@opencode/plugin` is supplied by the OpenCode runtime when it loads a plugin, so it is not a
 * resolvable package for an editor: this repository ships no Node manifest and never installs a
 * copy of the runtime. Without this declaration TypeScript reports "cannot find module" plus
 * implicit-`any` parameters for `ctx` and `editor`.
 *
 * The signatures below mirror only the surface the plugins in this directory use, following
 * <https://opencode.ai/v2/docs/build/plugins>. Keep them in sync with the documented API, and
 * delete this file if the runtime package ever becomes a real local dependency.
 */
declare module "@opencode/plugin" {
  export interface Registration {
    dispose(): Promise<void>
  }

  export interface ProviderInfo {
    readonly id: string
    name: string
  }

  export interface ModelInfo {
    readonly providerID: string
    readonly id: string
    name: string
    enabled: boolean
  }

  export interface ProviderRecord {
    readonly provider: ProviderInfo
    readonly models: ReadonlyMap<string, ModelInfo>
  }

  export interface ProviderEditor {
    list(): readonly ProviderRecord[]
    get(providerID: string): ProviderRecord | undefined
    add(input: unknown): void
    update(providerID: string, update: (provider: ProviderInfo) => void): void
    remove(providerID: string): void
  }

  export interface ModelEditor {
    list(providerID?: string): readonly ModelInfo[]
    get(providerID: string, modelID: string): ModelInfo | undefined
    update(providerID: string, modelID: string, update: (model: ModelInfo) => void): void
    remove(providerID: string, modelID: string): void
    readonly default: {
      get(): { providerID: string; modelID: string } | undefined
      set(providerID: string, modelID: string): void
    }
  }

  export interface SessionContext {
    /**
     * `event` is deliberately loose. Each plugin declares its own precise payload shape (for
     * example `HookEvent` in `context-budget.ts`), and the runtime may add fields at any time.
     */
    hook(
      name: "context" | "compaction" | "generate" | "title" | "prompt",
      callback: (event: any) => void | Promise<void>,
      options?: { providerID?: string },
    ): Promise<Registration>
    compact(input: { sessionID: string; delivery?: "steer" | "queue" }): Promise<{ id: string }>
  }

  export interface PluginContext {
    readonly options: Record<string, unknown>
    readonly provider: {
      transform(callback: (editor: ProviderEditor) => void): Promise<Registration>
      reload(): Promise<void>
    }
    readonly model: {
      transform(callback: (editor: ModelEditor) => void): Promise<Registration>
      reload(): Promise<void>
    }
    readonly session: SessionContext
  }

  export interface PluginDefinition {
    id: string
    setup(ctx: PluginContext): void | (() => void) | Promise<void | (() => void)>
  }

  export const Plugin: {
    define(definition: PluginDefinition): PluginDefinition
  }
}
