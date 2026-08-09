import type { DummyRule, OxlintConfig } from "oxlint";

export type EffectRuleMap = Readonly<Record<`effect/${string}`, DummyRule>>;

export declare const effectPlugin: {
  readonly name: "effect";
  readonly specifier: "@zaniluca/effect-rules";
};

export declare const recommendedRules: EffectRuleMap;
export declare const strictRules: EffectRuleMap;
export declare const boundaryRules: EffectRuleMap;

export declare const recommendedConfig: OxlintConfig;
export declare const strictConfig: OxlintConfig;
