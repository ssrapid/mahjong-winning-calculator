import { SEAT_ORDER } from "../seat-utilities/index.js";


/**
 * @template T
 * @callback Comparator
 * @param {T} a
 * @param {T} b
 * @returns {boolean}
 */
/**
 * 2つの seatMapオブジェクトの各席の値が一致するかを比較するユーティリティ関数。
 *
 * デフォルトでは各席の値が厳密一致（===）するかを判定する。
 * comparator 関数を渡すことでカスタム比較も可能。
 *
 * @template T
 * @param {import("./create.js").SeatMap<T>} mapA - 比較対象の1つ目の seatMap。
 * @param {import("./create.js").SeatMap<T>} mapB - 比較対象の2つ目の seatMap。
 * @param {Comparator<T>} [comparator=(a, b) => a === b] - 各席の値を比較するためのオプションの比較関数。
 * @returns {boolean} すべての席で比較が true となれば true、1つでも false であれば false。
 *
 * @example
 * const mapA = { e: 1, s: 2, w: 3, n: 4 };
 * const mapB = { e: 1, s: 2, w: 3, n: 4 };
 * isSeatMapMatch(mapA, mapB); // => true
 *
 * const mapC = { e: 1, s: 0, w: 3, n: 4 };
 * isSeatMapMatch(mapA, mapC); // => false
 *
 * // カスタム比較関数を使う例:
 * const comparator = (a, b) => Math.abs(a - b) <= 1;
 * isSeatMapMatch(mapA, mapC, comparator); // => true
 */

export function match(mapA, mapB, comparator = (a, b) => a === b) {
  return SEAT_ORDER.every(seat => comparator(mapA[seat], mapB[seat]));
}
