import { SEAT_ORDER } from '../seat-utilities/index.js';


/**
 * @template T
 * @callback SeatMapPredicate
 * @param {T} value
 * @param {import('../seat-utilities/index.js').Seat} seat
 * @param {import('./create.js').SeatMap<T>} seatMap
 * @returns {boolean}
 */

/**
 * seatMap の全要素に対して predicate を実行し、すべて true なら true を返す。
 *
 * @template T
 * @param {import('./create.js').SeatMap<T>} seatMap - 各席をキーに値を持つSeatMapオブジェクト
 * @param {SeatMapPredicate<T>} [predicate] - 各席の値に対して適用する関数(デフォルトはv => Boolean(v))
 * @returns {boolean}
 */
export function every(seatMap, predicate = v => Boolean(v)) {
  return SEAT_ORDER.every(seat => predicate(seatMap[seat], seat, seatMap));
}



/**
 * seatMap の全要素に対して predicate を実行し、すべて true なら true を返す。
 *
 * @template T
 * @param {import('./create.js').SeatMap<T>} seatMap
 * @param {SeatMapPredicate<T>} [predicate]
 * @returns {boolean}
 */
export function some(seatMap, predicate = v => Boolean(v)) {
  return SEAT_ORDER.some(seat => predicate(seatMap[seat], seat, seatMap));
}



/**
 * SeatMapの各席に対してpredicateを適用し、trueを返したseatだけを配列で返す。
 *
 * @template T
 * @param {import('./create.js').SeatMap<T>} seatMap - 各席をキーに値を持つSeatMapオブジェクト
 * @param {SeatMapPredicate<T>} [predicate] - 各席の値に対して適用する関数（デフォルトはv => Boolean(v)）
 * @returns {Seat[]} 条件を満たすseatの配列
 */
export function filter(seatMap, predicate = v => Boolean(v)) {
  return SEAT_ORDER.filter(seat => predicate(seatMap[seat], seat, seatMap));
}



/**
 * seatMap 風オブジェクトの各席の値に対して predicate 関数を適用し、
 * true を返す要素の数をカウントする汎用ユーティリティ。
 *
 * @template T
 * @param {import('./create.js').SeatMap<T>} seatMap - カウント対象の seatMap。
 * @param {SeatMapPredicate<T>} [predicate] - 判定関数、省略時は v => Boolean(v)。
 * @returns {number} predicate が true を返した席の数。
 *
 * @example
 * const riichiMap = { e: true, s: false, w: true, n: false };
 * countSeatMap(riichiMap); // => 2
 *
 * const scoreMap = { e: 25000, s: 26000, w: 24000, n: 25000 };
 * countSeatMap(scoreMap, v => v >= 25000); // => 3
 */
export function count(seatMap, predicate = v => Boolean(v)) {
  return SEAT_ORDER.reduce((count, seat) => predicate(seatMap[seat], seat, seatMap) ? count + 1 : count, 0);
}

