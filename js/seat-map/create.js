import { SEAT_ORDER } from "../seat-utilities/index.js";


/**
 * @template T
 * @typedef {{e:T,s:T,w:T,n:T}} SeatMap<T>
 */

/**
 * "e", "s", "w", "n"をキーとしたオブジェクトを初期化して返す
 * @template T
 * @overload
 * @param {(seat: import("../seat-utilities").Seat) => T} factory 初期値または初期化関数(seatを引数にとる)。省略した場合はnull
 * @returns {SeatMap<T>} 例: { e: 0, s: 0, w: 0, n: 0 }
 */

/**
 * @template T
 * @overload
 * @param {T} value 初期値または初期化関数(seatを引数にとる)。省略した場合はnull
 * @returns {SeatMap<T>} 例: { e: 0, s: 0, w: 0, n: 0 }
 */


/**
 * 東南西北をキーとしたオブジェクトを初期化して返す
 * @param {T} [initializer] 初期値または初期化関数(seatを引数にとる)。省略した場合はnull
 * @returns {SeatMap<T>} 例: { e: 0, s: 0, w: 0, n: 0 }
 */
export function create(initializer = null) {
  const map = {};
  for (const seat of SEAT_ORDER) {
    map[seat] = (typeof initializer === 'function')
      ? initializer(seat)
      : initializer;
  }
  return map;
}


/**
 * 配列の値を渡して、SeatMapを生成する
 * @template T
 * @param {[eastValue:T, southValue:T, westValue:T, northValue:T]} values [eastValue, southValue, westValue, northValue] の配列
 * @returns {SeatMap<T>} 例: { e: eastValue, s: southValue, w: westValue, n: northValue }
 */
export function fromArray(values) {
  return Object.fromEntries(SEAT_ORDER.map((seat, i) => [seat, values[i] ?? null]));
}


/**
 * 東, 南, 西, 北の順に値を渡して、SeatMapを生成する
 * @template T
 * @param {T} east 東の値
 * @param {T} south 南の値
 * @param {T} west 西の値
 * @param {T} north 北の値
 * @returns {SeatMap<T>} 例: { e: east, s: south, w: west, n: north }
 */
export function fromValues(east, south, west, north) {
  return fromArray([east ?? null, south ?? null, west ?? null, north ?? null]);
}


/**
 * entries から SeatMap を生成する
 * @template T
 * @param {Iterable<[seat:import("../seat-utilities").Seat, value:T]>} entries ["e", 0]などのような[seat, value]形式のIterable
 * @returns {SeatMap<T>} { e: eastValue, s: southValue, w: westValue, n: northValue }形式のオブジェクト
 */
export function fromEntries(entries) {
  const retMap = create();  // 一旦nullで初期化
  for(const [seat, value] of entries) {
    if(seat in retMap) {
      retMap[seat] = value;
    }
  }
  return retMap;

}
