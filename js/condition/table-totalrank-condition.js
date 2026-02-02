import { CATEGORY, TYPE as CONDITION_TYPE , TIE_BREAKER_TYPE} from './define.js';
import { Condition } from './condition.js';
import * as SeatMap from '../seat-map/index.js';


export class TableRankCondition extends Condition {
  static CATEGORY = CATEGORY.TABLE_RANK;

  /**
   * @typedef {typeof TableRankCondition.TYPE[keyof typeof TableRankCondition.TYPE]} Type
   */
  /**
   * @readonly
   * @enum {string}
   */
  static TYPE = Object.freeze({
    /** トータルが卓内○位 */
    IS: CONDITION_TYPE.TABLE_TOTAL_RANK_IS,
    /** トータルが卓内○位以内 */
    AT_MOST: CONDITION_TYPE.TABLE_TOTAL_RANK_AT_MOST,
    /** トータルが卓内○位以下 */
    AT_LEAST: CONDITION_TYPE.TABLE_TOTAL_RANK_AT_LEAST,
  });

  /**
   * @readonly
   */
  static DEFINE = Object.freeze({
    [TableRankCondition.TYPE.IS]: {
      description: 'トータルが卓内○位',
      labelFn: (value) => `卓内${value}位`,
      evaluate: (rank, value) => rank === value
    },
    [TableRankCondition.TYPE.AT_MOST]: {
      description: 'トータルが卓内○位以内',
      labelFn: (value) => `卓内${value}位以内`,
      evaluate: (rank, value) => rank <= value
    },
    [TableRankCondition.TYPE.AT_LEAST]: {
      description: 'トータルが卓内○位以下',
      labelFn: (value) => `卓内${value}位以下`,
      evaluate: (rank, value) => rank >= value
    },
  });


  /**
   * 
   * @param {Type} type 
   * @returns {string}
   */
  static getDescription = (type) => TableRankCondition.DEFINE[type].description;

  /**
   * 
   * @param {{
   *   category: typeof TableRankCondition.CATEGORY,
   *   type: Type,
   *   value: number,
   *   tieBreaker: import('./define.js').TieBreakerType
   * }} options 
   */
  constructor(options) {
    super(options);
    if (!TableRankCondition.DEFINE[options.type]) {
      throw new Error(`Unknown type: ${options.type}`);
    }
    this.type = options.type;
    this.value = Number(options.value);
    this.tieBreaker = options.tieBreaker; 
  }

  get label() {
    return TableRankCondition.DEFINE[this.type].labelFn(this.value);
  }

  /**
   * @override
   * @param {import('../game-calculator/index.js').PlayersMap} playersInfo 
   * @param {import('../game-calculator/index.js').PlayerInfo[]} [_outsidePlayers=[]] 
   * @returns {import('../game-calculator/index.js').GameInfo} 引数に与えたGameInfo
   */
  evaluate(playersInfo, _outsidePlayers) {
    const def = TableRankCondition.DEFINE[this.type];
    const tableRank = SeatMap.getRankMap(playersInfo, false,
      (a, b) => b.point - a.point,
      this.tieBreaker === TIE_BREAKER_TYPE.TIE_BREAKER_RANK ?
        (a, b) => (a.tieBreakRank ?? Infinity) - (b.tieBreakRank ?? Infinity) :
        this.tieBreaker === TIE_BREAKER_TYPE.PREPOINT_CHASER ?
        (a, b) => (a.startPoint ?? a.point ?? -Infinity) - (b.startPoint ?? b.point ?? -Infinity) :
        /* this.tieBreaker === TIE_BREAKER_TYPE.PREPOINT_LEADER ? */
        /* "先行有利" が既定値 */
        (a, b) => (b.startPoint ?? b.point ?? -Infinity) - (a.startPoint ?? a.point ?? -Infinity)
    );
    SeatMap.forEach((player, tableRank) => {
      // 配列が未定義の場合、新しい配列を用意
      if(!player.conditions) player.conditions = [];
      player.conditions.push({
        condition: this,
        rank: tableRank,
        fulfilled: def.evaluate(tableRank, this.value)
      });
    }, playersInfo, tableRank);

    return playersInfo;
  }
}
