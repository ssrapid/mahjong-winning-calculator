import { SEAT_ORDER } from "./seatUtilities.js";


/**
 * SEAT_ORDER: 座席順配列（例: ['e', 's', 'w', 'n']）が必要です。
 * このユーティリティは seatMap ({e:..., s:..., ...}) 構造に対する高階処理を提供します。
 */

/**
 * @template T
 * @typedef {{e:T, s:T, w:T, n:T}} seatMap
 */


/**
 * @template T
 * @overload
 * @param {(seat: string) => T} factory
 * @returns {seatMap<T>}
 */

/**
 * @template U
 * @overload
 * @param {U} value
 * @returns {seatMap<U>}
 */

/**
 * 東南西北をキーとしたオブジェクトを初期化して返す
 * @template V
 * @param {V} initializer 初期値または初期化関数（seatを引数にとる）
 * @returns {V} 例: { e: 0, s: 0, w: 0, n: 0 }
 */
export function createSeatMap(initializer = null) {
  const map = {};
  for (const seat of SEAT_ORDER) {
    map[seat] = (typeof initializer === 'function')
      ? initializer(seat)
      : initializer;
  }
  return map;
}

/**
 * 配列の値を渡して、seatMapを生成する
 * @template T
 * @param {[eastValue:T, southValue:T, westValue:T, northValue:T]} values [eastValue, southValue, westValue, northValue]の配列
 * @returns {seatMap<T>} 例: { e: east, s: south, w:west, n: north }
 */
export function createSeatMapFromArray(values) {
  return Object.fromEntries(SEAT_ORDER.map((seat, i) => [seat, values[i] ?? null]));
}

/**
 * 東, 南, 西, 北の順に値を渡して、座席マップを生成する
 * @template T
 * @param {T} east 東の値
 * @param {T} south 南の値
 * @param {T} west 西の値
 * @param {T} north 北の値
 * @returns {seatMap<T>} 例: { e: east, s: south, w: west, n: north }
 */
export function createSeatMapFromValues(east, south, west, north) {
  return createSeatMapFromArray([east ?? null, south ?? null, west ?? null, north ?? null]);
}


/**
 * 
 * @template T
 * @param {seatMap<T>} seatMap 
 */
export function validateSeatMap (seatMap) {
  const keys = Object.keys(seatMap);
  const invalidKeys = keys.filter(keys => !SEAT_ORDER.includes(keys));
  if (invalidKeys.length > 0) {
    throw new Error(`players に不正なキーがあります: ${invalidKeys.join(', ')}`);
  }
}


/**
 * シートマップを席順の配列に変換する。
 * @template T
 * @param {seatMap<T>} seatMap 変換元のseatMap
 * @returns {[eastValue:T, southValue:T, westValue:T, northValue:T]} 変換後の配列
 */
export function seatMapToArray (seatMap) {
  return SEAT_ORDER.map(seat => seatMap[seat]);
}

/**
 * 2つの seatMapオブジェクトの各席の値が一致するかを比較するユーティリティ関数。
 *
 * デフォルトでは各席の値が厳密一致（===）するかを判定する。
 * comparator 関数を渡すことでカスタム比較も可能。
 *
 * @template T
 * @param {seatMap<T>} mapA - 比較対象の1つ目の seatMap。
 * @param {seatMap<T>} mapB - 比較対象の2つ目の seatMap。
 * @param {(a: T, b: T) => boolean} [comparator=(a, b) => a === b] - 各席の値を比較するためのオプションの比較関数。
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
export function isSeatMapMatch(mapA, mapB, comparator = (a, b) => a === b) {
  return SEAT_ORDER.every(seat => comparator(mapA[seat], mapB[seat]));
}


/**
 * mapSeatMap
 * 座席ごとの値に対して関数を適用し、新しい seatMap を返す。
 *
 * @template T
 * @param {(...args: [...any[], import("./seatUtilities.js").Seat]) => T} fn - 各座席の値に適用する関数（例: (a, b, seat) => ...）
 * @param {...seatMap<any>} maps - seatMap 形式のオブジェクト群
 * @returns {seatMap<T>} 新しい seatMap 構造のオブジェクト
 */
export function mapSeatMap(fn, ...maps) {
  const result = createSeatMap();
  for (const seat of SEAT_ORDER) {
    const args = maps.map(m => m[seat]);
    result[seat] = fn(...args, seat);
  }
  return result;
}

/**
 * forEachSeatMap
 * 座席ごとの値に対して関数を適用する。返り値は使わず副作用のみ行う。
 *
 * @param {(...args: [...any[], import("./seatUtilities.js").Seat]) => void} fn - 各座席の値に対して実行する関数（例: (a, b, seat) => void）
 * @param {...seatMap<any>} maps - 同じキーを持つ seatMap 形式のオブジェクト群
 */
export function forEachSeatMap(fn, ...maps) {
  for (const seat of SEAT_ORDER) {
    const args = maps.map(m => m[seat]);
    fn(...args, seat);
  }
}
