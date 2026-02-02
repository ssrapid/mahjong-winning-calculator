import { CATEGORY, TIE_BREAKER_TYPE } from './define.js';
import { Condition } from './factory.js'; // 仮
import * as SeatMap from '../seat-map/index.js';


export class TableTotalRankCondition extends Condition {
  static CATEGORY = CATEGORY.TABLE_TOTAL_RANK;

  /**
   * @typedef {typeof TableTotalRankCondition.TYPE[keyof typeof TableTotalRankCondition.TYPE]} Type
   */
  /**
   * @readonly
   * @enum {string}
   */
  static TYPE = Object.freeze({
    /** トータルが卓内○位 */
    IS: 'Is',
    /** トータルが卓内○位以上 */
    AT_LEAST: 'AtLeast',
    /** トータルが卓内○位以下 */
    AT_MOST: 'AtMost'
  });

  /**
   * @readonly
   */
  static DEFINE = Object.freeze({
    [TableTotalRankCondition.TYPE.IS]: {
      description: 'トータルが卓内○位',
      labelFn: (value) => `卓内${value}位`,
      evaluate: (rank, value) => rank === value
    },
    [TableTotalRankCondition.TYPE.AT_LEAST]: {
      description: 'トータルが卓内○位以上',
      labelFn: (value) => `卓内${value}位以上`,
      evaluate: (rank, value) => rank >= value

    },
    [TableTotalRankCondition.TYPE.AT_MOST]: {
      description: 'トータルが卓内○位以下',
      labelFn: (value) => `卓内${value}位以下`,
      evaluate: (rank, value) => rank <= value
    }
  });


  /**
   * 
   * @param {Type} type 
   * @returns {string}
   */
  static getDescription = (type) => TableTotalRankCondition.DEFINE[type].description;

  /**
   * 
   * @param {{
   *   category: typeof TableTotalRankCondition.CATEGORY,
   *   type: Type,
   *   value: number,
   *   tieBreaker: import('./define.js').TieBreakerType
   * }} options 
   */
  constructor(options) {
    super(options);
    if (!TableTotalRankCondition.DEFINE[options.type]) {
      throw new Error(`Unknown type: ${options.type}`);
    }
    this.type = options.type;
    this.value = Number(options.value);
    this.tieBreaker = options.tieBreaker; 
  }

  get label() {
    return TableTotalRankCondition.DEFINE[this.type].labelFn(this.value);
  }

  /**
   * @override
   * @param {import('../game-calculator/index.js').GameInfo} gameInfo 
   * @param {import('../game-calculator/index.js').PlayerInfo[]} [_outsidePlayers=[]] 
   * @returns {import('../game-calculator/index.js').GameInfo} 引数に与えたGameInfo
   */
  evaluate(gameInfo, _outsidePlayers) {
    const playersInfo = gameInfo.playersInfo;
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
    SeatMap.forEach(player => {
      // 配列が未定義の場合、新しい配列を用意
      if(!player.conditions) player.conditions = [];
      player.conditions.push({ condition: this, fulfilled: player.point >= this.value });
    }, playersInfo);

    return gameInfo;
  }
}
