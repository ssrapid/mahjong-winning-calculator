import { RULE_IDS, RULE_KEY } from "./define.js";
import * as SeatMap from "../seat-map/index.js";

/**
 * @typedef {import("./").RuleObject} RuleObject
 */

/**
 * @param {RuleObject} ruleObj
 * @param {SeatMap<number>} scoreMap
 * @param {number} [kyotaku=0] 供託本数。省略した場合0本。
 * @param {number} [numberOfPlayers=4] プレーヤー人数。省略した場合4人。
 */
export function zeroSumCheckForScore(ruleObj, scoreMap, kyotaku = 0, numberOfPlayers = 4) {
  const sumDef = ruleObj[RULE_KEY.INITIAL_SCORE] * numberOfPlayers;
  return sumDef - (SeatMap.reduce(scoreMap, (acc, value) => acc + value, 0) + kyotaku * 1000);
}

/**
 *
 * @param {RuleObject} ruleObj ルールオブジェクト
 * @returns {number} 正常であれば0。
 * @throws {ZeroSumError} 順位点総計が0になっていないときにZeroSumErrorをスロー。
 */
export function zeroSumCheckForRankingPoints(ruleObj) {
  if (ruleObj[RULE_KEY.BASE] === RULE_IDS.JPML) {
    const floating = [1, 2, 3, 0];
    const checks = floating.map(floatingCount => ({
      floatingCount,
      sum: zeroSumCheckHelper(
        ruleObj[RULE_KEY.INITIAL_SCORE],
        ruleObj[RULE_KEY.RETURN_SCORE],
        ruleObj[RULE_KEY.RANKING_POINTS][floatingCount]
      )
    }));

    if (checks.every(e => e.sum === 0)) return 0;

    const errors = checks.filter(e => e.sum !== 0);

    // エラーメッセージを生成
    const message = errors
      .map(e => `${e.floatingCount === 0 ? '4人沈み' : e.floatingCount + '人浮き'}: ${e.sum > 0 ? '+' + e.sum : e.sum}`)
      .join(", ");

    throw new ZeroSumError(
      `順位点総計が0になっていません (${message})`,
      {
        type: "JPML",
        details: errors,
        checks,
        rule: ruleObj,
      }
    );
  } else {
    const sum = zeroSumCheckHelper(
      ruleObj[RULE_KEY.INITIAL_SCORE],
      ruleObj[RULE_KEY.RETURN_SCORE],
      ruleObj[RULE_KEY.RANKING_POINTS]);
    if (sum === 0) {
      return 0;
    }
    throw new ZeroSumError(
      `順位点総計が${sum > 0 ? '+' + sum : sum}ずれています。`,
      {
        type: "Common",
        sum,
        rule: ruleObj,
      }
    );
  }
}

/**
 *
 * @param {number} initialScore 配給原点
 * @param {number} returnScore 返し点
 * @param {import("./define.js").RankingPointsArray} RankingPointsArray 順位点配列
 * @returns {number} 順位点総計。0であれば正常。
 */
function zeroSumCheckHelper(initialScore, returnScore, RankingPointsArray) {
  return ((initialScore - returnScore) * 4 + RankingPointsArray.reduce((acc, v) => acc + v, 0) * 1000) / 1000;
}
export class ZeroSumError extends Error {
  /**
   * @param {string} message
   * @param {object} info
   */
  constructor(message, info) {
    super(message);
    this.name = "ZeroSumError";
    this.info = info;
  }
}

