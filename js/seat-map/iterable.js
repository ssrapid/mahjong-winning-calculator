import { create } from './create.js';
import { SEAT_ORDER } from '../seat-utilities/index.js';

/**
 * @template T,U
 * @overload
 * @param {(value:T, seat:import('../seat-utilities').Seat,
 *   seatMap:import('./create.js').SeatMap<T>)=>U} fn
 * @param {import('./create.js').SeatMap<T>} seatMap
 * @returns {import('./create.js').SeatMap<U>}
 */
/**
 * @template T,U
 * @overload
 * @param {(a:T, b:T, seat:import('../seat-utilities').Seat,
 *   mapA:import('./create.js').SeatMap<T>, mapB:import('./create.js').SeatMap<T>)=>U} fn
 * @param {import('./create.js').SeatMap<T>} mapA
 * @param {import('./create.js').SeatMap<T>} mapB
 * @returns {import('./create.js').SeatMap<U>}
 */
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
 * @template T
 * @overload
 * @param {(value:T, seat:import('../seat-utilities').Seat,
 *   seatMap:import('./create.js').SeatMap<T>)=>void} fn
 * @param {import('./create.js').SeatMap<T>} seatMap
 */
/**
 * @template T
 * @overload
 * @param {(a:T, b:T, seat:import('../seat-utilities').Seat,
 *   mapA:import('./create.js').SeatMap<T>, mapB:import('./create.js').SeatMap<T>)=>void} fn
 * @param {import('./create.js').SeatMap<T>} mapA
 * @param {import('./create.js').SeatMap<T>} mapB
 */
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
