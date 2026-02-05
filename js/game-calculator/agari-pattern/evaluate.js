import * as Condition from '../../condition/index.js';
import * as SeatMap from '../../seat-map/index.js'

/**
 * 
 * @param {import("./create").PatternContext} patternContext 
 * @param {Condition.Condition[]} conditions 
 * @param {import('../define.js').PlayerInfo[]} [outsidePlayers=[]]
 * @returns {import('./create').PatternContext}
 */
export function evaluate(patternContext, conditions=[], outsidePlayers=[]) {
  for(const pattern of patternContext.allPatterns) {
    const { playersInfo } = pattern;

    const conditionEntries = conditions.map(condition => [condition, condition.evaluate(playersInfo, outsidePlayers)]);
    SeatMap.forEach((player, seat) => {
      player.conditions = new Map(conditionEntries.map(([condition, evaluateMap]) => [condition, evaluateMap[seat]]));
    }, playersInfo);
  }
  patternContext.summaryGroup.summarize(conditions);
  return patternContext;
}
