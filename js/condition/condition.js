import { registry } from './factory.js';


/**
 * @typedef {object} ConditionOptions
 * @property {import('./define.js').ConditionCategory} category
 * @property {*} [value]
 * @property {*} [target]
 * @property {import('./define.js').TieBreakerType} [tieBreaker]
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
   * このメソッドは、必ず子クラスでオーバーライドして使います。
   * オーバーライドせずに実行された場合、エラーになります。
   * @param {import('../game-calculator').GameInfo} gameInfo 
   * @param {import('../game-calculator').PlayerInfo[]} [outsidePlayers=[]] 
   * @returns {import('../game-calculator').GameInfo}
   */
  evaluate(gameInfo, outsidePlayers=[]) {
    throw new Error("evaluate() must be implemented");
  }

}
