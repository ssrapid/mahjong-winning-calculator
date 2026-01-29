import * as SeatMap  from './seat-map/index.js';

export const state = {


  /**
   * プレイヤー情報入力欄の状態
   */
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

  /**
   * リーチのチェックボックスの状態
   */
  riichi: SeatMap.create(false),

  /**
   * 対局情報の入力状態
   */
  tableInfo: {
    /** @type {import('./seat-utilities/index.js').Seat} */
    dealer : 'n',
    finalRound: true,
    kyotaku: 0,
    tsumibo: 0
  },

  /**
   * 設定されているベースルールのID
   * @type {import("./rule/index.js").RuleID} 
   */
  baseRule: null,

  /**
   * ルールオブジェクト
   * @type {import("./rule/index.js").RuleObject}
   */
  rule : null,


  /**
   * 暫定ポイントを表示中かのフラグ
   */
  showTentative : false,


  /**
   * 計算が行われたかのフラグ
   */
  hasCalculated: false

}

window.__state__ = state;
