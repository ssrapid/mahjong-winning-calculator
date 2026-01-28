import * as SeatMap  from './seat-map/index.js';

export const state = {



  players: SeatMap.create(() => ({
    /** @type {string} */
    name: null,
    /** @type {number} */
    point: 0,
    /** @type {number} */
    score: null,
    /** @type {boolean} */
    riichi: false
  })),

  riichi: SeatMap.create(false),

  tableInfo: {
    /** @type {import('./seat-utilities/index.js').Seat} */
    dealer : 'n',
    finalRound: true,
    kyotaku: 0,
    tsumibo: 0
  },

  /**
   * @type {import("./rulemodule/ruleDef.js").RULE_ID} 
   */
  baseRule: null,

  /**
   * ルールオブジェクト
   * @type {import("./rulemodule/ruleDef.js").RuleObject}
   */
  rule : null

}

window.__state__ = state;
