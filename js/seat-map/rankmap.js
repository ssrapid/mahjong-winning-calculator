import { getRanks } from "../my-utilities/indexs.js";
import { fromArray } from "./create.js";
import { toArray } from "./toArray.js";

/**
 * @typedef {import("../seat-utilities").Seat} Seat
 */
/**
 * @template T
 * @typedef {import("../seat-map").SeatMap<T>} SeatMap
 */


/**
 * seatMap を順位付けするユーティリティ関数。
 *
 * seatMap を配列に変換して getRanks により順位計算を行い、
 * 結果を再び seatMap 構造に戻します。
 * 比較関数は段階的に適用され、前段階で同順位となったグループ内のみで
 * 次の比較が行われます。
 *
 * @template T
 *
 * @callback RankCompare
 * @param {T} a 比較対象の要素A
 * @param {T} b 比較対象の要素B
 * @param {readonly T[]} group 現在比較対象となっている同順位グループ
 * @returns {number} a が上位なら負、b が上位なら正、同順位なら 0
 *
 * @param {SeatMap<T>} map 順位付け対象の seatMap
 *
 * @param {boolean} [allowTies=true]
 *   true の場合、すべての比較関数を適用しても同順位が残った場合は
 *   同順位のまま順位を確定します。
 *   false の場合、最終的に席順で順位を決定します。
 *
 * @param {...RankCompare<T>} compareFns
 *   順位決定に使用する比較関数群。
 *   上から順に適用され、同順位が発生したグループ内のみで次の比較が行われます。
 *
 * @returns {SeatMap<number>}
 *   各席に対応する順位を持つ seatMap を返します。
 */
export function getRankMap(map, allowTies = true, ...compareFns) {
  return fromArray(getRanks(toArray(map), allowTies, ...compareFns));
}
