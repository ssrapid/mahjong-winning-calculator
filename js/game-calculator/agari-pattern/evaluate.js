import * as Condition from '../../condition/index.js';

/**
 * 
 * @param {import("./create").PatternContext} patternContext 
 * @param {Condition.Condition[]} conditions 
 */
export function evaluate(patternContext, conditions=[]) {
  for(const pattern of patternContext.allPatterns) {
    const {playersInfo} = pattern;
    for(const condition of conditions) {
      condition.evaluate(playersInfo);
    }
  }
}
