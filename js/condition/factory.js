import { TotalPointCondition } from './totalpoint-condition.js';
import { TableTotalRankCondition } from './table-totalrank-condition.js';


/**
 * @type {Map<import('./define.js').ConditionCategory, typeof import('./condition.js').Condition>}
 */
export const registry = new Map(
  [TotalPointCondition, TableTotalRankCondition]
  .map(c => [c.CATEGORY, c]));




/**
 * 
 * @param {import('./condition.js').ConditionOptions} options 
 * @returns 
 */
export function create(options) {
  const { category } = options;
  const ctor = registry.get(category);
  if(!ctor) {
    throw new Error(`Unknown condition type: ${category}`);
  }
  return new ctor(options);

}







