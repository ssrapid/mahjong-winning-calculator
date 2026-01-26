
import { SEAT_ORDER } from '../seat-utilities/index.js';



export * from './create.js';
export * from './convert.js';

export * from './wrap.js';
export * from './merge.js';

export * from './match.js';
export * from './reduce.js';
export * from './predicate.js';
export * from './rankmap.js';




export { SEAT_ORDER } from '../seat-utilities/index.js';

/**
 * @typedef {import('../seat-utilities').Seat} Seat
 */

/**
 * @template T
 * @typedef {import('./create.js').SeatMap<T>} SeatMap
 */


/**
 * 
 * @template T
 * @param {SeatMap<T>} seatMap 
 * @throws {Error} 不正なキーが含まれていた場合
 */
export function validate (seatMap) {
  const keys = Object.keys(seatMap);
  const invalidKeys = keys.filter(keys => !SEAT_ORDER.includes(keys));
  if (invalidKeys.length > 0) {
    throw new Error(`players に不正なキーがあります: ${invalidKeys.join(', ')}`);
  }
}





/**
 * mapSeatMap
 * 座席ごとの値に対して関数を適用し、新しい seatMap を返す。
 *
 * @template T,U
 * @param {(...args: [...U[], import("../seat-utilities")Seat, ...SeatMap<U>[]]) => T} fn - 各座席の値に適用する関数（例: (a, b, seat) => ...）
 * @param {...SeatMap<U>} seatMaps - seatMap 形式のオブジェクト群
 * @returns {SeatMap<T>} 新しい seatMap 構造のオブジェクト
 */
export function map(fn, ...seatMaps) {
  const result = create();
  for (const seat of SEAT_ORDER) {
    const args = seatMaps.map(map => map[seat]);
    result[seat] = fn(...args, seat, ...seatMaps);
  }
  return result;
}

/**
 * forEachSeatMap
 * 座席ごとの値に対して関数を適用する。返り値は使わず副作用のみ行う。
 *
 * @template T
 * @param {(...args: [...T[], import("../seat-utilities")Seat, ...SeatMap<T>[]]) => void} fn - 各座席の値に対して実行する関数（例: (a, b, seat) => void）
 * @param {...SeatMap<T>} seatMaps - 同じキーを持つ seatMap 形式のオブジェクト群
 */
export function forEach(fn, ...seatMaps) {
  for (const seat of SEAT_ORDER) {
    const args = seatMaps.map(map => map[seat]);
    fn(...args, seat, ...seatMaps);
  }
}





