import { SEAT_ORDER } from '../seat-utilities/index.js';

/**
 * @typedef {import('../seat-utilities').Seat} Seat
 */
/**
 * @typedef {import('./index.js').SeatMap<T>} SeatMap
 */


/**
 * シートマップを席順の配列に変換する。
 * @template T
 * @param {SeatMap<T>} seatMap 変換元のseatMap
 * @returns {[eastValue:T, southValue:T, westValue:T, northValue:T]} 変換後の配列
 */


export function toArray(seatMap) {
  return SEAT_ORDER.map(seat => seatMap[seat]);
}

/**
 * シートマップをentryの配列に変換する。
 * @template T
 * @param {SeatMap<T>} seatMap 変換元のSeatMap
 * @returns {[["e", T], ["s", T], ["w", T], ["n", T]]} 変換後の配列
 */
export function toEntries(seatMap) {
  return SEAT_ORDER.map(seat => [seat, seatMap[seat]]);
}
