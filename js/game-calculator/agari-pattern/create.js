import * as SeatUtil from '../../seat-utilities/index.js';
import * as SeatMap from '../../seat-map/index.js'
import * as AgariTemplate from '../agari-template/index.js';
import { AGARI_TYPE } from '../define.js';


/**
 * @typedef {object} Pattern
 * @property {import('../define.js').AgariType} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {import('../../seat-map').SeatMap<PlayerInfoMinimum>} playersInfo 対局者情報
 * @property {TableInfoMinimum} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 */
/**
 * @typedef {object} RyukyokuPattern
 * @property {typeof import('../define.js').AGARI_TYPE.RYUKYOKU} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {PlayerInfoMinimum&{tenpai:boolean}} playersInfo 対局者情報
 * @property {TableInfoMinimum} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @property {import('../../seat-utilities/index.js').Seat[]} tenpai テンパイ者(配列)
 * @property {import('../../seat-utilities/index.js').Seat[]} noten ノーテン者(配列)
 */
/**
 * @typedef {object} AgariPattern
 * @property {typeof import('../define.js').AGARI_TYPE.TSUMO|typeof import('../define.js').AGARI_TYPE.RON} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {PlayerInfoMinimum} playersInfo 対局者情報
 * @property {TableInfoMinimum} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @property {import('../agari-template/index.js').AgariTemplate} template 和了テンプレート
 * @property {import('../../seat-utilities/index.js').Seat} winner 和了者
 * @property {import('../../seat-utilities/index.js').Seat} [discarder] 放銃者
 */
/**
 * @typedef {object} TsumoAgariPattern
 * @property {typeof import('../define.js').AGARI_TYPE.TSUMO} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {PlayerInfoMinimum} playersInfo 対局者情報
 * @property {TableInfoMinimum} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @property {import('../agari-template/index.js').TsumoAgariTemplate} template 和了テンプレート
 * @property {import('../../seat-utilities/index.js').Seat} winner 和了者
 */
/**
 * @typedef {object} RonAgariPattern
 * @property {typeof import('../define.js').AGARI_TYPE.RON} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {PlayerInfoMinimum} playersInfo 対局者情報
 * @property {TableInfoMinimum} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @property {import('../agari-template/index.js').RonAgariTemplate} template 和了テンプレート
 * @property {import('../../seat-utilities/index.js').Seat} winner 和了者
 * @property {import('../../seat-utilities/index.js').Seat} [discarder] 放銃者
 */
/**
 * @typedef {object} PlayerInfoMinimum
 * @property {string} name
 * @property {number} score
 * @property {number} point
 * @property {boolean} riichi
 */
/**
 * @typedef {object} TableInfoMinimum
 * @property {import('../../seat-utilities').Seat} dealer
 * @property {number} kyotaku
 * @property {number} tsumibo
 * @property {boolean} finalRound
 */
/**
 * @typedef {{
 *   state: string,
 *   allPatterns: Pattern[],
 *   tsumoAgariPatterns: TsumoAgariPattern[],
 *   ronAgariPatterns: RonAgariPattern[],
 *   ryukyokuPatterns : RyukyokuPattern[]
 * }} PatternContext
 */
/**
 * @param {import('../../seat-map').SeatMap<PlayerInfoMinimum>} playersInfo 
 * @param {TableInfoMinimum} tableInfo 
 * @param {import('../../rule/index.js').RuleObject} ruleObj 
 * @returns {PatternContext}
 */
export function create(playersInfo, tableInfo, ruleObj) {
  console.log('playersInfo', playersInfo);
  /** @type {(TsumoAgariPattern|RonAgariPattern|RyukyokuPattern)[]} */
  const allPatterns = [];
  const tsumoAgariPatterns = [];
  const ronAgariPatterns = [];
  const ryukyokuPatterns = [];

  const tsumoTemplates = AgariTemplate.getTsumoAgariTemplates(ruleObj);
  for(const template of tsumoTemplates) {
    for(const winner of SeatUtil.SEAT_ORDER) {
      // リーチの和了には成立しない点数が存在する
      const available = !(playersInfo[winner]?.riichi && template[AgariTemplate.Key.IS_UNAVAILABLE_WHEN_RIICHI]);
      /** @type {TsumoAgariPattern} */
      const pattern = {
        agariType: AGARI_TYPE.TSUMO,
        template,
        winner,
        available,
        playersInfo: structuredClone(playersInfo),
        tableInfo: structuredClone(tableInfo),
        ruleObj,  // ルールオブジェクトはコピーしない
      };
      allPatterns.push(pattern);
      tsumoAgariPatterns.push(pattern);
    }
  }

  const ronAgariTemplate = AgariTemplate.getRonAgariTemplates(ruleObj);
  for(const template of ronAgariTemplate) {
    for(const winner of SeatUtil.SEAT_ORDER) {
      for(const discarder of SeatUtil.SEAT_ORDER) {
        if(winner === discarder) {
          // 和了者と放銃者が同じにはならないのでcontinue
          continue;
        }
        // リーチの和了には成立しない点数が存在する
        const available = !(playersInfo[winner]?.riichi && template[AgariTemplate.Key.IS_UNAVAILABLE_WHEN_RIICHI]);
        /** @type {RonAgariPattern} */
        const pattern = {
          agariType: AGARI_TYPE.RON,
          template,
          winner,
          discarder,  // ロンのみ存在するプロパティ
          available,
          playersInfo: structuredClone(playersInfo),
          tableInfo: structuredClone(tableInfo),
          ruleObj // ルールオブジェクトはコピーしない
        }
        allPatterns.push(pattern);
        ronAgariPatterns.push(pattern);
      }
    }
  }

  // 流局パターン
  const flagMaps = Array.from({ length: 16 }, (_, i) => SeatMap.create(seat => Boolean((i >>> SeatUtil.seatToIndex(seat)) & 1)));
  for(const tenpaiMap of flagMaps) {
    const tenpai = SeatMap.filter(tenpaiMap, v => v);
    const noten = SeatMap.filter(tenpaiMap, v => !v);
    // 全者が テンパイしている または リーチしていない ことが実現可能条件
    const available = SeatMap.every(SeatMap.map((tenpai, {riichi}) => tenpai | !riichi, tenpaiMap, playersInfo));
    /**
     * @type {RyukyokuPattern}
     */
    const pattern = {
      agariType: AGARI_TYPE.RYUKYOKU,
      tenpai,
      noten,
      available,
      playersInfo: structuredClone(playersInfo),
      tableInfo: structuredClone(tableInfo),
      ruleObj // ルールオブジェクトはコピーしない
    }
    // コピーしたplayersInfoにテンパイ情報を付加
    console.log( pattern.playersInfo, tenpaiMap);
    SeatMap.forEach((playerObj, tenpai) => playerObj.tenpai = tenpai, pattern.playersInfo, tenpaiMap);
    allPatterns.push(pattern);
    ryukyokuPatterns.push(pattern);
  }

  const returnObj = {
    state: 'ready',
    allPatterns,
    tsumoPatterns: tsumoAgariPatterns,
    ronPatterns: ronAgariPatterns,
    ryukyokuPatterns
  };
  return returnObj;

}
