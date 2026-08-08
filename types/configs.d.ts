import type { DummyRule, ExternalPluginEntry, OxlintConfig } from "oxlint";

export type EffectRuleMap = Readonly<Record<`effect/${string}`, DummyRule>>;

export declare const effectPlugin: ExternalPluginEntry & {
  readonly name: "effect";
  readonly specifier: "@zaniluca/effect-rules";
};

export declare const recommendedRules: EffectRuleMap;
export declare const strictRules: EffectRuleMap;
export declare const boundaryRules: EffectRuleMap;

export declare const recommendedConfig: OxlintConfig & {
  readonly jsPlugins: [typeof effectPlugin];
  readonly rules: typeof recommendedRules;
};

export declare const strictConfig: OxlintConfig & {
  readonly jsPlugins: [typeof effectPlugin];
  readonly rules: typeof strictRules;
};
