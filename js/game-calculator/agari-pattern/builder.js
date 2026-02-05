import * as SeatUtil from '../../seat-utilities/index.js'
import * as SeatMap from '../../seat-map/index.js';
import { create } from './create.js';
import { resolve } from './resolve.js';
import { evaluate } from './evaluate.js';
import * as Condition from '../../condition/index.js';


/**
 * 
 * @param {import('../define.js').PlayersMap>} playersInfo
 * 対局者情報(SeatMap形式)
 * @param {import('./create.js').TableInfo} tableInfo 対局情報
 * @param {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @param {import('../../condition/index.js').Condition[]} [conditions=[]] 
 * @returns 
 */
export function build(playersInfo, tableInfo, ruleObj, conditions=[]) {
  const patternCollection = create(playersInfo, tableInfo, ruleObj);
  resolve(patternCollection);
  evaluate(patternCollection, conditions);
  return patternCollection;
}
