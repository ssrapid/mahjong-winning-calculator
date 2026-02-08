import * as SeatMap  from './seat-map/index.js';

export const state = {


  /**
   * プレイヤー情報入力欄の状態
   */
  players: SeatMap.create(() => ({
    /** @type {string} */
    name: null,
    /** @type {number} */
    startPoint: 0,
    /** @type {number} */
    score: null,
    /** @type {boolean} */
    riichi: false
  })),

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
   * 入力の条件(CardをキーにしたMapで保持)
   * @type {Map<HTMLDivElement, import('./condition').Condition>}
   */
  conditions: new Map(),

  /**
   * 選択中の条件
   * @type {import('./condition').Condition?}
   */
  selectedCondition: null,

  /**
   * 点棒合計チェック済み
   * @type {boolean}
   */
  scoreSumChecked: false,

  /**
   * 暫定ポイントを表示中かのフラグ
   */
  showTentative : false,


  /**
   * 計算が行われたかのフラグ
   */
  hasCalculated: false,


  /**
   * 最後に計算したときの入力
   */
  lastInput: null,


  /**
   * 計算結果
   * @type {import('./game-calculator/agari-pattern').PatternContext}
   */
  result: null

}

window.__state__ = state;
