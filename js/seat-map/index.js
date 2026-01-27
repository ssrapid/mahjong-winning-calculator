
import { SEAT_ORDER } from '../seat-utilities/index.js';



export * from './create.js';
export * from './convert.js';

export * from './wrap.js';
export * from './merge.js';

export * from './match.js';

export * from './iterable.js';
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









