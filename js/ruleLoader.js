import { rulePresets } from './rulePresets.js';

/**
 * 
 * @param {string} presetRuleId 
 * @returns {import('./ruleDef.js').RuleObject}
 */
export function getRulePreset(presetRuleId) {
  const preset = rulePresets[presetRuleId]?.rule;
  if (!preset) throw new Error(`Unknown ruleId: ${presetRuleId}`);
  return structuredClone(preset);
}

/**
 * 
 * @returns {{value:string, label:string}[]}
 */
export function getBaseRuleOptions() {
  return Object.entries(rulePresets)
    .filter(([, preset]) => !preset.hidden)
    .sort(([, a], [, b]) => (a.order ?? 999) - (b.order ?? 999))
    .map(([presetRuleId, preset]) => ({ value: presetRuleId, label: preset.rule.name }));
}
