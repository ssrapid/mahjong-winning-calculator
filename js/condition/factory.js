import { TotalPointCondition } from './totalpoint-condition.js';
import { TableRankCondition } from './table-totalrank-condition.js';
import { Condition } from './condition.js';


/**
 * @type {Map<import('./define.js').ConditionCategory, typeof import('./condition.js').Condition>}
 */
export const registry = new Map(
  [TableRankCondition, TotalPointCondition]
  .map(c => [c.CATEGORY, c]));

/**
 * @type {string[]}
 */
export const typeMap = new Map([...registry.values()].flatMap(ctor => Object.values(ctor.TYPE).map(type => [type, ctor])));


/**
 * 
 * @param {import('./condition.js').ConditionOptions} options 
 * @returns {Condition}
 */
export function create(options) {
  const { category, type } = options;
  const ctor = registry.get(category) ?? typeMap.get(type);
  if(!ctor) {
    throw new Error(`Unknown condition type: ${category}`);
  }
  return new ctor(options);

}
