import * as SeatUtil from '../../seat-utilities/index.js';
import * as SeatMap from '../../seat-map/index.js'
import * as AgariTemplate from '../agari-template/index.js';
import * as Rule from '../../rule/index.js'
import { AGARI_TYPE } from '../define.js';
import { SummaryGroup } from './summarygroup.js';


/**
 * @typedef {object} Pattern
 * @property {import('../define.js').AgariType} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {import('../define.js').PlayersMap} playersInfo 対局者情報
 * @property {TableInfo} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @property {string} [agariLabel] 和了点の表示用文字列
 */
/**
 * @typedef {object} RyukyokuPattern
 * @property {typeof import('../define.js').AGARI_TYPE.RYUKYOKU} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {import('../define.js').PlayersMap} playersInfo 対局者情報
 * @property {TableInfo} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @property {import('../../seat-utilities/index.js').Seat[]} tenpai テンパイ者(配列)
 * @property {string} [agariLabel] 和了点の表示用文字列
 */
/**
 * @typedef {object} AgariPattern
 * @property {typeof import('../define.js').AGARI_TYPE.TSUMO|typeof import('../define.js').AGARI_TYPE.RON} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {import('../define.js').PlayersMap} playersInfo 対局者情報
 * @property {TableInfo} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @property {import('../agari-template/index.js').AgariTemplate} template 和了テンプレート
 * @property {import('../../seat-utilities/index.js').Seat} winner 和了者
 * @property {import('../../seat-utilities/index.js').Seat} [discarder] 放銃者
 * @property {string} [agariLabel] 和了点の表示用文字列
 */
/**
 * @typedef {object} TsumoAgariPattern
 * @property {typeof import('../define.js').AGARI_TYPE.TSUMO} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {import('../define.js').PlayersMap} playersInfo 対局者情報
 * @property {TableInfo} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @property {import('../agari-template/index.js').TsumoAgariTemplate} template 和了テンプレート
 * @property {import('../../seat-utilities/index.js').Seat} winner 和了者
 * @property {string} [agariLabel] 和了点の表示用文字列
 */
/**
 * @typedef {object} RonAgariPattern
 * @property {typeof import('../define.js').AGARI_TYPE.RON} agariType 和了タイプ
 * @property {boolean} available 実現可能性
 * @property {import('../define.js').PlayersMap} playersInfo 対局者情報
 * @property {TableInfo} tableInfo 対局情報
 * @property {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @property {import('../agari-template/index.js').RonAgariTemplate} template 和了テンプレート
 * @property {import('../../seat-utilities/index.js').Seat} winner 和了者
 * @property {import('../../seat-utilities/index.js').Seat} discarder 放銃者
 * @property {string} [agariLabel] 和了点の表示用文字列
 */
/**
 * @typedef {object} PatternContext
 * @property {string} state
 * @property {Pattern[]} allPatterns
 * @property {TsumoAgariPattern[]} tsumoAgariPatterns
 * @property {RonAgariPattern[]} ronAgariPatterns
 * @property {RyukyokuPattern[]} ryukyokuPatterns
 * @property {SummaryGroup} summaryGroup
 */
/**
 * @param {import('../../seat-map').SeatMap<PlayerInfo>} playersInfo
 * @param {TableInfo} tableInfo
 * @param {import('../../rule/index.js').RuleObject} ruleObj
 * @returns {PatternContext}
 */
export function create(playersInfo, tableInfo, ruleObj) {

  /** @type {(TsumoAgariPattern|RonAgariPattern|RyukyokuPattern)[]} */
  const allPatterns = [];
  const tsumoAgariPatterns = [];
  const ronAgariPatterns = [];
  const ryukyokuPatterns = [];
  const summaryGroup = new SummaryGroup();

  // ツモ和了のパターン生成
  const tsumoTemplates = AgariTemplate.getTsumoAgariTemplates(ruleObj);
  for(const winner of SeatUtil.SEAT_ORDER) {
    const agariType = AGARI_TYPE.TSUMO;
    for(const template of tsumoTemplates) {
      /** リーチの和了には成立しない点数が存在する */
      const available = !(playersInfo[winner]?.riichi && template[AgariTemplate.Key.IS_UNAVAILABLE_WHEN_RIICHI]);
      /** @type {TsumoAgariPattern} */
      const pattern = {
        agariType,
        template,
        winner,
        available,
        playersInfo: structuredClone(playersInfo),
        tableInfo: structuredClone(tableInfo),
        ruleObj,  // ルールオブジェクトはコピーしない
      };
      allPatterns.push(pattern);
      tsumoAgariPatterns.push(pattern);
      summaryGroup.push({ agariType, winner }, pattern);
    }
  }

  // ロン和了のパターン生成
  const ronAgariTemplate = AgariTemplate.getRonAgariTemplates(ruleObj);
  for(const winner of SeatUtil.SEAT_ORDER) {
    for(const discarder of SeatUtil.SEAT_ORDER) {
      if(winner === discarder) {
        // 和了者と放銃者が同じにはならないのでcontinue
        continue;
      }
      const agariType = AGARI_TYPE.RON;

      for(const template of ronAgariTemplate) {
        // リーチの和了には成立しない点数が存在する
        const available = !(playersInfo[winner]?.riichi && template[AgariTemplate.Key.IS_UNAVAILABLE_WHEN_RIICHI]);
        /** @type {RonAgariPattern} */
        const pattern = {
          agariType,
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
        summaryGroup.push({ agariType, winner, discarder }, pattern);
      }
    }
  }

  // 流局パターン
  const renchanRule = ruleObj[Rule.KEY.RENCHAN_RULE];
  const tenpaiFee = ruleObj[Rule.KEY.TENPAI_FEE];
  /**
   * @type {{tenpai:import('../../seat-utilities/index.js').Seat[], available:boolean}}
   */
  const tenpaiPatterns = (()=>{
    if(tenpaiFee === 0) {
      // テンパイ料が0のルールの場合

      // テンパイ連荘以外のルールでテンパイ料が0に設定されている場合、
      // 誰がテンパイかという情報が意味をなさないため、全員ノーテン扱いの1パターンのみ生成する。
      // テンパイ料がなく、テンパイ連荘のルールのとき、
      // 親がテンパイか否かのみが必要な情報であるため、その2通りのパターンのみを生成する。
      /**
       * @type {{tenpai:import('../../seat-utilities/index.js').Seat[], available:boolean}}
       */
      const tenpaiPattern = [{tenpai: [], available: true}];
      if(renchanRule === Rule.RENCHAN_RULE.TENPAI) tenpaiPattern.push({tenpai: [dealer], available: true});
      return tenpaiPattern;
    }

    /**
     * テンパイ連荘のルール または テンパイ料が0でないルールの時は、16通りのパターンを用意。
     */
    const flagMaps = Array
      .from({ length: 16 }, (_, i) => SeatMap.create(seat => Boolean((i >>> SeatUtil.seatToIndex(seat)) & 1)))
      .map(tenpaiMap => {
        const tenpai = SeatMap.filter(tenpaiMap, v => v);
        /** 
         * 各者が "テンパイしている" または "リーチしていない" ことが実現可能条件。
         * ただし、アガリ放棄の裁定を受けた場合には、 "リーチかつノーテン扱い" という状況が発生するので、厳密には全パターン起こりうる。
         */
        const available = SeatMap.every(SeatMap.map((tenpai, {riichi}) => tenpai | !riichi, tenpaiMap, playersInfo));
        return { tenpai, available };
      });
    return flagMaps;
  })();


  for(const { tenpai, available } of tenpaiPatterns) {
    const agariType = AGARI_TYPE.RYUKYOKU;
    /**
     * @type {RyukyokuPattern}
     */
    const pattern = {
      agariType,
      tenpai,
      available,
      playersInfo: structuredClone(playersInfo),
      tableInfo: structuredClone(tableInfo),
      ruleObj // ルールオブジェクトはコピーしない
    }
    // コピーしたplayersInfoにテンパイ情報を付加
    // SeatMap.forEach((playerObj, tenpai) => playerObj.tenpai = tenpai, pattern.playersInfo, tenpaiMap);
    allPatterns.push(pattern);
    ryukyokuPatterns.push(pattern);
    if(tenpaiFee === 0) {
      // テンパイ料が0のルールでは簡易モード
      summaryGroup.push({ agariType }, pattern);
    } else {
      for(const seat of SeatUtil.SEAT_ORDER) {
        const isTenpai = tenpai.includes(seat);
        summaryGroup.push({ agariType, focus:seat, tenpai: isTenpai }, pattern);
      }
    }
  }


  const returnObj = {
    state: 'ready',
    allPatterns,
    tsumoAgariPatterns,
    ronAgariPatterns,
    ryukyokuPatterns,
    summaryGroup
  };
  return returnObj;

}
