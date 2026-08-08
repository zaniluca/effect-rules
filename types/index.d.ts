export interface EffectRule {
  readonly meta?: Readonly<Record<string, unknown>>;
  create(context: unknown): Readonly<Record<string, (node: unknown) => void>>;
}

export interface EffectRulesPlugin {
  readonly meta: {
    readonly name: "@zaniluca/effect-rules";
  };
  readonly rules: Readonly<Record<string, EffectRule>>;
}

declare const plugin: EffectRulesPlugin;

export default plugin;
