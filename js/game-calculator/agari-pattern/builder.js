import * as SeatUtil from '../../seat-utilities/index.js';
import * as AgariTemplate from '../agari-template/index.js';

/**
 * @typedef {object} Pattern
 */
/**
 * @typedef {object} AgariPattern
 * @property {import('../agari-template/index.js').AgariTemplate} template
 * @property {import('../../seat-utilities/index.js').Seat} winner
 * @property {import('../../seat-utilities/index.js').Seat} [discarder]
 * @property {boolean} available
 * @property {PlayerInfo} playersInfo
 * @property {TableInfo} tableInfo
 * @property {import('../../rule/index.js').RuleObject} ruleObj
 */
/**
 * @typedef {AgariPattern&{
 *   template:import('../agari-template/index.js').TsumoAgariTemplate}} TsumoAgariPattern
 */
/**
 * @typedef {AgariPattern&{
 *  template:import('../agari-template/index.js').RonAgariTemplate,
 *  discarder:import('../../seat-utilities/index.js').Seat}} RonAgariPattern
 */
/**
 * @typedef {object} PlayerInfo
 * @property {string} name
 * @property {number} score
 * @property {number} point
 * @property {boolean} riichi
 */
/**
 * @typedef {object} TableInfo
 * @property {import('../../seat-utilities').Seat} dealer
 * @property {number} kyotaku
 * @property {number} tsumibo
 * @property {boolean} finalRound
 */
/**
 * @param {import('../../seat-map').SeatMap<PlayerInfo>} playersInfo 
 * @param {TableInfo} tableInfo 
 * @param {import('../../rule/index.js').RuleObject} ruleObj 
 */
function build(playersInfo, tableInfo, ruleObj) {
  /** @type {(TsumoAgariPattern|RonAgariPattern)[]} */
  const allPatterns = [];
  
  const tsumoTemplates = AgariTemplate.getTsumoAgariTemplates(ruleObj);
  for(const template of tsumoTemplates) {
    for(const winner of SeatUtil.SEAT_ORDER) {
      // リーチの和了には成立しない点数が存在する
      const available = !(playersInfo[winner]?.riichi && template[AgariTemplate.Key.IS_UNAVAILABLE_WHEN_RIICHI]);
      /** @typedef {typeof pattern} TsumoAgariPattern */
      const pattern = {
        template,
        winner,
        available,
        playersInfo: structuredClone(playersInfo),
        tableInfo: structuredClone(tableInfo),
        ruleObj,  // ルールオブジェクトはコピーしない
      };
      allPatterns.push(pattern);
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
        const pattern = {
          template,
          winner,
          discarder,  // ロンのみ存在するプロパティ
          available,
          playersInfo: structuredClone(playersInfo),
          tableInfo: structuredClone(tableInfo),
          ruleObj,  // ルールオブジェクトはコピーしない
        }
        allPatterns.push(pattern);
      }
    }
  }
}