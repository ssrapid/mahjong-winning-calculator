// seatUtilities.js
// --- 共通関数と定数の整理 ---

/**
 * @typedef {"e"|"s"|"w"|"n"} Seat
 */

/**
 * @typedef {"東"|"南"|"西"|"北"} SeatJp
 */


export const SEAT_ORDER_JP = ['東', '南', '西', '北'];
export const SEAT_ORDER_EN = ['e', 's', 'w', 'n'];
export const SEAT_ORDER_EN_LOWER = SEAT_ORDER_EN.map(s => s.toLowerCase());
export const SEAT_ORDER_EN_UPPER = SEAT_ORDER_EN.map(s => s.toUpperCase());
export const SEAT_ORDER = SEAT_ORDER_EN;
export const SEATS = {
  E: SEAT_ORDER[0],
  S: SEAT_ORDER[1],
  W: SEAT_ORDER[2],
  N: SEAT_ORDER[3],
};

const OBJ_NORMALIZE_SEAT = (() => {
  const ret = {};
  SEAT_ORDER_JP.forEach((jp, index) => { ret[jp] = SEAT_ORDER[index];});
  SEAT_ORDER_EN_LOWER.forEach((en, index) => { ret[en] = SEAT_ORDER[index]; });
  SEAT_ORDER_EN_UPPER.forEach((en, index) => { ret[en] = SEAT_ORDER[index]; });
  return ret;
})();

export function normalizeSeat(seat) {
  const normalize = OBJ_NORMALIZE_SEAT[seat];
  if (!normalize) throw new Error(`${seat}はseatとして適切ではありません。`);
  return normalize;
}

export function seatToIndex(seat) {
  return SEAT_ORDER.indexOf(seat); // 0〜3。見つからない場合は -1
}

export function indexToSeat(index) {
  return SEAT_ORDER[index % 4];
}

export function nextSeat(seat) {
  const i = seatToIndex(seat);
  return i === -1 ? null : SEAT_ORDER[(i + 1) % 4];
}

export function prevSeat(seat) {
  const i = seatToIndex(seat);
  return i === -1 ? null : SEAT_ORDER[(i + 3) % 4];
}

export function seatOrderFrom(baseSeat) {
  const baseIndex = seatToIndex(baseSeat);
  return baseIndex === -1 ? [] : Array.from({ length: 4 }, (_, i) => SEAT_ORDER[(baseIndex + i) % 4]);
}

export function sortSeats(seats) {
  return [...seats].sort((a, b) => seatToIndex(a) - seatToIndex(b));
}

const OBJ_SEAT_TO_EN_LOWER = (() => {
  const result = {};
  for (let i = 0; i < SEAT_ORDER_EN.length; i++) {
    const enLower = SEAT_ORDER_EN[i];          // 'e'
    const enUpper = enLower.toUpperCase();     // 'E'
    const jp = SEAT_ORDER_JP[i];               // '東'
    result[jp] = enLower;
    result[enUpper] = enLower;
    result[enLower] = enLower;
  }
  return result;
})();

const OBJ_SEAT_TO_EN_UPPER = (() => { 
  const result = {};
  for (let i = 0; i < SEAT_ORDER_EN.length; i++) {
    const enLower = SEAT_ORDER_EN[i];          // 'e'
    const enUpper = enLower.toUpperCase();     // 'E'
    const jp = SEAT_ORDER_JP[i];               // '東'
    result[jp] = enUpper;
    result[enLower] = enUpper;
    result[enUpper] = enUpper;
  }
  return result;
})();

const OBJ_SEAT_TO_JP = (() => {
  const result = {};
  for (let i = 0; i < SEAT_ORDER_EN.length; i++) {
    const enLower = SEAT_ORDER_EN[i];          // 'e'
    const enUpper = enLower.toUpperCase();     // 'E'
    const jp = SEAT_ORDER_JP[i];               // '東'
    result[jp] = jp;
    result[enLower] = jp;
    result[enUpper] = jp;
  }
  return result;
})();

export const seatToENLower = seat => OBJ_SEAT_TO_EN_LOWER[seat] ?? '';
export const seatToENUpper = seat => OBJ_SEAT_TO_EN_UPPER[seat] ?? '';
export const seatToJp      = seat => OBJ_SEAT_TO_JP[seat]       ?? '';


export {
  createSeatMap,
  createSeatMapFromArray,
  createSeatMapFromValues,
  validateSeatMap,
  seatMapToArray,
  isSeatMapMatch,
  mapSeatMap,
  forEachSeatMap
} from "./seatMap.js"












/**
 * 複数の seatMap<Object> を合成して新しい seatMap<Object> を返す（非破壊）。
 * 
 * 各 seatMap は以下の形式を前提とする：
 * {
 *   e: { ... },
 *   s: { ... },
 *   w: { ... },
 *   n: { ... },
 * }
 *
 * 同じ seat に対する複数のオブジェクトは Object.assign によりマージされ、
 * 同じキーが存在する場合は後の maps 引数の値で上書きされる。
 *
 * 使用例:
 * const merged = mergeSeatMaps(map1, map2, map3);
 * 
 * @param {...seatMap<Object>} maps - 合成する複数の seatMap<Object>
 * @returns {seatMap<Object>} 合成済みの新しい seatMap<Object>
 */
export function mergeSeatMaps(...maps) {
  return createSeatMap(seat =>
    Object.assign({}, ...maps.map(map => map[seat] ?? {}))
  );
}


/**
 * 複数の seatMap<Object> を第一引数の seatMap<Object> に破壊的にマージする。
 *
 * 各 seatMap は以下の形式を前提とする：
 * {
 *   e: { ... },
 *   s: { ... },
 *   w: { ... },
 *   n: { ... },
 * }
 *
 * 同じ seat に対する複数のオブジェクトは Object.assign によりマージされ、
 * 同じキーが存在する場合は後の maps 引数の値で上書きされる。
 *
 * 使用例:
 * mergeSeatMapsInPlace(targetMap, map1, map2);
 *
 * @param {seatMap<Object>} target - マージ先となる seatMap<Object>（破壊される）
 * @param {...seatMap<Object>} maps - マージする複数の seatMap<Object>
 * @returns {seatMap<Object>} マージ後の target を返す
 */
export function mergeSeatMapsInPlace(target, ...maps) {
  for (const seat of SEAT_ORDER) {
    Object.assign(target[seat], ...maps.map(map => map[seat] ?? {}));
  }
  return target;
}


/**
 * wrapSeatMapValueAsObject
 * 
 * SeatMap の各座席に紐づくプリミティブ値を `{ [keyName]: value }` の形にラップし、
 * 新しい SeatMap<Object> を生成して返す（非破壊）。
 *
 * すでにオブジェクトである場合でも強制的に `{ [keyName]: value }` に包むため、
 * 必要に応じて事前の型チェックを呼び出し側で行うこと。
 *
 * 使用例:
 * const wrapped = wrapSeatMapValueAsObject(scoreMap, 'score');
 * 
 * @template T
 * @template {string} K
 * @param {seatMap<T>} map - SeatMap 形式のオブジェクト（{ 東: any, 南: any, 西: any, 北: any }）
 * @param {K} keyName - ラップ時に使用するキー名（例: 'score'）
 * @returns {seatMap<{ [P in K]: T }>} 新しい SeatMap<Object> （{ 東: { [keyName]: value }, ... }）
 */
export function wrapSeatMapValueAsObject(map, keyName) {
  return createSeatMap(seat => ({ [keyName]: map[seat] }));
}


/**
 * unwrapSeatMapValueFromObject
 * 
 * SeatMap の各座席に紐づくオブジェクトから指定キーの値を抽出し、
 * SeatMap<プリミティブ型> に変換して返す（非破壊）。
 *
 * 使用例:
 * const scoreMap = unwrapSeatMapValueFromObject(wrappedMap, 'score');
 * 
 * @param {seatMap<Object>} map - seatMap<Object> 形式のオブジェクト（{ 東: { [key]: value }, 南: ..., ... }）
 * @param {string} keyName - 抽出するキー名（例: 'score'）
 * @returns {seatMap<any>} SeatMap<プリミティブ型>（{ 東: value, 南: value, ... }）
 */
export function unwrapSeatMapValueFromObject(map, keyName) {
  return createSeatMap(seat => map[seat]?.[keyName]);
}


/**
 * SeatMapの各席に対してpredicateを適用し、trueを返したseatだけを配列で返す。
 *
 * @template T
 * @param {seatMap<T>} seatMap - 各席をキーに値を持つSeatMapオブジェクト
 * @param {(T)=>boolean} [predicate] - 各席の値に対して適用する関数（デフォルトはv => v）
 * @returns {("e"|"s"|"w"|"n")[]} 条件を満たすseatの配列
 */
export function filterSeatMap(seatMap, predicate = v => v) {
  return SEAT_ORDER.filter(seat => predicate(seatMap[seat]));
}


/**
 * seatMap 風オブジェクトの各席の値に対して predicate 関数を適用し、
 * true を返す要素の数をカウントする汎用ユーティリティ。
 *
 * @template T
 * @param {seatMap<T>} map - カウント対象の seatMap。
 * @param {(value: T, seat: string) => boolean} [predicate] - 判定関数、省略時は v => Boolean(v)。
 * @returns {number} predicate が true を返した席の数。
 *
 * @example
 * const riichiMap = { e: true, s: false, w: true, n: false };
 * countSeatMap(riichiMap); // => 2
 *
 * const scoreMap = { e: 25000, s: 26000, w: 24000, n: 25000 };
 * countSeatMap(scoreMap, v => v >= 25000); // => 3
 */
export function countSeatMap(map, predicate = v => Boolean(v)) {
  return SEAT_ORDER.reduce((count, seat) => predicate(map[seat], seat) ? count + 1 : count, 0);
}

import { getRanks } from "./myUtilities.js";



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
 * @param {seatMap<T>} map 順位付け対象の seatMap
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
 * @returns {seatMap<number>}
 *   各席に対応する順位を持つ seatMap を返します。
 */
export function rankMap(map, allowTies = true, ...compareFns) {
  return createSeatMapFromArray(getRanks(seatMapToArray(map), allowTies, ...compareFns));
}
