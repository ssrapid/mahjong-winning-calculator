// seatUtilities.js
// --- 共通関数と定数の整理 ---

const SEAT_ORDER_JP = ['東', '南', '西', '北'];
const SEAT_ORDER_EN = ['e', 's', 'w', 'n'];
const SEAT_ORDER_EN_LOWER = SEAT_ORDER_EN.map(s => s.toLowerCase());
const SEAT_ORDER_EN_UPPER = SEAT_ORDER_EN.map(s => s.toUpperCase());
const SEAT_ORDER = SEAT_ORDER_EN;
const SEATS = {
  E: SEAT_ORDER[0],
  S: SEAT_ORDER[1],
  W: SEAT_ORDER[2],
  N: SEAT_ORDER[3],
};

const OBJ_NORMALIZE_SEAT = (() => {
  const ret = {};
  SEAT_ORDER_JP.forEach((jp, index) => { ret[jp] = SEAT_ORDER[index];});
  SEAT_ORDER_EN_LOWER.forEach((en, index) => { ret[en] = SEAT_ORDER[index];});
  SEAT_ORDER_EN_UPPER.forEach((en, index) => { ret[en] = SEAT_ORDER[index];});
  return ret;
})();

function normalizeSeat(seat) {
  const normalize = OBJ_NORMALIZE_SEAT[seat];
  if (!normalize) throw new Error(`${seat}はseatとして適切ではありません。`);
  return normalize;
}

function seatToIndex(seat) {
  return SEAT_ORDER.indexOf(seat); // 0〜3。見つからない場合は -1
}

function indexToSeat(index) {
  return SEAT_ORDER[index % 4];
}

function nextSeat(seat) {
  const i = seatToIndex(seat);
  return i === -1 ? null : SEAT_ORDER[(i + 1) % 4];
}

function prevSeat(seat) {
  const i = seatToIndex(seat);
  return i === -1 ? null : SEAT_ORDER[(i + 3) % 4];
}

function seatOrderFrom(baseSeat) {
  const baseIndex = seatToIndex(baseSeat);
  return baseIndex === -1 ? [] : Array.from({ length: 4 }, (_, i) => SEAT_ORDER[(baseIndex + i) % 4]);
}

function sortSeats(seats) {
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

const seatToENLower = seat => OBJ_SEAT_TO_EN_LOWER[seat] ?? '';
const seatToENUpper = seat => OBJ_SEAT_TO_EN_UPPER[seat] ?? '';
const seatToJp      = seat => OBJ_SEAT_TO_JP[seat]       ?? '';



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
function createSeatMap(initializer = null) {
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
 * @param {T[]} values [eastValue, southValue, westValue, northValue]の配列
 * @returns {seatMap<T>} 例: { e: east, s: south, w:west, n: north }
 */
function createSeatMapFromArray(values) {
  return Object.fromEntries(SEAT_ORDER.map((seat, i) => [seat, values[i] ?? null]));
}

/**
 * 東南西北の順に値を渡して、座席マップを生成する
 * @template T
 * @param {T} east 東の値
 * @param {T} south 南の値
 * @param {T} west 西の値
 * @param {T} north 北の値
 * @returns {seatMap<T>} 例: { e: east, s: south, w: west, n: north }
 */
function createSeatMapFromValues(east = null, south = null, west = null, north = null) {
  return createSeatMapFromArray([east, south, west, north]);
}



function validateSeatMap (seatMap) {
  const keys = Object.keys(seatMap);
  const invalidKeys = keys.filter(keys => !SEAT_ORDER.includes(keys));
  if (invalidKeys.length > 0) {
    throw new Error(`players に不正なキーがあります: ${invalidKeys.join(', ')}`);
  }
}

function seatMapToArray (seatMap) {
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
function isSeatMapMatch(mapA, mapB, comparator = (a, b) => a === b) {
  return SEAT_ORDER.every(seat => comparator(mapA[seat], mapB[seat]));
}


/**
 * mapSeatMap
 * 座席ごとの値に対して関数を適用し、新しい seatMap を返す。
 *
 * @template T
 * @param {(...any)=>T} fn - 各座席の値に適用する関数（例: (a, b, seat) => ...）
 * @param {...seatMap<any>} maps - 同じキーを持つ seatMap 形式のオブジェクト群
 * @returns {seatMap<T>} 新しい seatMap 構造のオブジェクト
 */
function mapSeatMap(fn, ...maps) {
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
 * @param {Function} fn - 各座席の値に対して実行する関数（例: (a, b, seat) => void）
 * @param {...seatMap} maps - 同じキーを持つ seatMap 形式のオブジェクト群
 */
function forEachSeatMap(fn, ...maps) {
  for (const seat of SEAT_ORDER) {
    const args = maps.map(m => m[seat]);
    fn(...args, seat);
  }
}


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
function mergeSeatMaps(...maps) {
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
function mergeSeatMapsInPlace(target, ...maps) {
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
 * @param {seatMap<any>} map - SeatMap 形式のオブジェクト（{ 東: any, 南: any, 西: any, 北: any }）
 * @param {string} keyName - ラップ時に使用するキー名（例: 'score'）
 * @returns {seatMap<Object>} 新しい SeatMap<Object> （{ 東: { [keyName]: value }, ... }）
 */
function wrapSeatMapValueAsObject(map, keyName) {
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
function unwrapSeatMapValueFromObject(map, keyName) {
  return createSeatMap(seat => map[seat]?.[keyName]);
}


/**
 * SeatMapの各席に対してpredicateを適用し、trueを返したseatだけを配列で返す。
 *
 * @param {seatMap<any>} seatMap - 各席をキーに値を持つSeatMapオブジェクト
 * @param {Function} [predicate] - 各席の値に対して適用する関数（デフォルトはv => v）
 * @returns {string[]} 条件を満たすseatの配列
 */
function filterSeatMap(seatMap, predicate = v => v) {
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
function countSeatMap(map, predicate = v => Boolean(v)) {
  return SEAT_ORDER.reduce((count, seat) => predicate(map[seat], seat) ? count + 1 : count, 0);
}
