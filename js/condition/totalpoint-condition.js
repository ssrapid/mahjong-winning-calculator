import { CATEGORY, TYPE as CONDITION_TYPE } from './define.js';
import { Condition } from './condition.js';
import * as SeatMap from '../seat-map/index.js';
import { formatPoints } from '../ui/common.js';

/**
 * トータルポイントで判定する条件
 * @class
 * @extends Condition
 */
export class TotalPointCondition extends Condition {
  /** @readonly */
  static CATEGORY = CATEGORY.TOTAL_POINT;
  

  /**
   * @typedef {typeof TotalPointCondition.TYPE[keyof typeof TotalPointCondition.TYPE]} Type
   */
  /**
   * @enum {string}
   * @readonly
   */
  static TYPE = Object.freeze({
    AT_LEAST: CONDITION_TYPE.TOTAL_POINTS_AT_LEAST,
    AT_MOST: CONDITION_TYPE.TOTAL_POINTS_AT_MOST,
  });

  /**
   * @readonly
   */
  static DEFINE = Object.freeze({
    [TotalPointCondition.TYPE.AT_LEAST]: {
      description: 'トータルポイントが○ポイント以上',
      labelFn: (value) => `トータル${ formatPoints(value, 1, 2, { minus:true }) }Pt以上`,
      /** @type {(point:number, value:number) => boolean} */
      evaluate: (point, value)=> point >= value
    },
    [TotalPointCondition.TYPE.AT_MOST]: {
      description: 'トータルポイントが○ポイント以下',
      labelFn: (value) => `トータル${ formatPoints(value, 1, 2, { minus:true }) }Pt以下`,
      /** @type {(point:number, value:number) => boolean} */
      evaluate: (point, value) => point <= value
    }
  });


  /**
   * 条件タイプの説明文を取得する
   * @param {Type} type 
   * @returns {string}
   */
  static getDescription = type => TotalPointCondition.DEFINE[type].description;

  /**
   * 
   * @param {{
   *   category: typeof TotalPointCondition.CATEGORY,
   *   type: Type,
   *   value: number
   * }} options 
   */
  constructor(options) {
    super(options);
    if (!TotalPointCondition.DEFINE[options.type]) {
      throw new Error(`Unknown type: ${options.type}`);
    }
    this.type = options.type;
    this.value = Number(options.value);
  }

  get label() {
    return TotalPointCondition.DEFINE[this.type].labelFn(this.value);
  }

  /**
   * @override
   * @param {import('../game-calculator/index.js').PlayersMap} playersInfo
   * @param {import('../game-calculator/index.js').PlayerInfo[]} [_outsidePlayers=[]] 
   * @returns {import('./condition.js').EvaluateMap} 
   */
  evaluate(playersInfo, _outsidePlayers) {
    const def = TotalPointCondition.DEFINE[this.type];

    return SeatMap.map(player => ({
      fulfilled: def.evaluate(player.point, this.value)
    }), playersInfo);
  }
}
