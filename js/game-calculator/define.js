import { Condition } from '../condition/index.js';

/**
 * @typedef {typeof AGARI_TYPE[keyof typeof AGARI_TYPE]} AgariType
 */
export const AGARI_TYPE = Object.freeze({
  TSUMO:    'tsumo',
  RON:      'ron',
  RYUKYOKU: 'ryukyoku'
});


/**
 * @typedef {object} PlayerInfo
 *  卓外・卓内含むプレーヤー
 * @property {string} name 競技者名
 * @property {number} [tieBreakRank] 同点時に参照する順位(前年度順位、期首順位、予選通過順位など)
 * @property {number} point ポイント
 */
/**
 * @typedef {object} OnTablePlayerInfo 卓内プレーヤー
 * @property {string} name 対局者名(表示名)
 * @property {number} [tieBreakRank] 同点時に参照する順位(前年度順位、期首順位、予選通過順位など)
 * @property {number} score 点棒
 * @property {number} startPoint ゲーム前ポイント
 * @property {number} [point] ポイント
 * @property {boolean} riichi リーチしているかどうか
 * @property {number} [delta] この局の点棒変化
 * @property {number} [gamePoint] この半荘のポイント
 * @property {number} [rank] この半荘の順位
 * @property {number} [rankingPoint] この半荘の順位点
 * @property {Map<Condition, import('../condition/condition.js').EvaluateObject>} [conditions] 条件の達成可否情報
 */
/**
 * @typedef {object} TableInfo 対局情報
 * @property {import('../seat-utilities').Seat} dealer 親番(席で指定)
 * @property {number} kyotaku 供託の本数
 * @property {number} prevKyotaku 前の供託本数
 * @property {number} tsumibo 積み棒の本数
 * @property {boolean} finalRound この局がオーラスであるか
 * @property {boolean} [renchanFlag] 次局連荘となるかのフラグ
 * @property {boolean} [gameEnd] この局をもって対局終了かを表すフラグ
 */
/**
 * @typedef {import('../seat-map').SeatMap<OnTablePlayerInfo>} PlayersMap
 */
/**
 * @typedef {object} GameInfo
 * @property {PlayersMap} playersInfo
 * @property {TableInfo} tableInfo
 * @property {import('../rule/index.js').RuleObject}
 */
