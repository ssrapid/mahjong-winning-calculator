import { registry } from './factory.js';


/**
 * @typedef {object} ConditionOptions
 * @property {import('./define.js').ConditionCategory} category
 * @property {*} [value]
 * @property {*} [target]
 * @property {import('./define.js').TieBreakerType} [tieBreaker]
 */

/**
 * 条件評価の結果を含むオブジェクト。メタデータとしてこのほかにもプロパティを持つことがある。
 * @typedef {object} EvaluateObject
 * @property {boolean} fulfilled
 */
/**
 * @typedef {import('../seat-map').SeatMap<EvaluateObject>} EvaluateMap
 */

export class Condition {
  /** @readonly */
  static CATEGORY = 'NoTypeCondition';
  static description = 'description';

  /**
   * @typedef {typeof Condition.Type[keyof typeof Condition.Type]} Type
   */
  static Type = Object.freeze({});

  /**
   * @param {ConditionOptions} _options
   */
  constructor(_options) {}

  /**
   * 条件カードに表示するラベルを取得します。
   * @returns {string}
   */
  get label() { return 'label'; }

  /**
   * 条件タイプの説明文を取得する
   * @param {Type} _type 
   * @returns {string}
   */
  static getDescription = (_type) => '';

  /**
   * プレーヤーが条件を満たしているかを評価する。
   * 
   * @param {import('../game-calculator').PlayersMap} _playersInfo 
   * @param {import('../game-calculator').PlayerInfo[]} [_outsidePlayers=[]] 
   * @returns {EvaluateMap}
   */
  evaluate(_playersInfo, _outsidePlayers=[]) {
    throw new Error("evaluate() must be implemented");
  }

}
