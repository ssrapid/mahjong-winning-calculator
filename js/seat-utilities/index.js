// seatUtilities.js
// --- 共通関数と定数の整理 ---

/**
 * @typedef {"e"|"s"|"w"|"n"} Seat
 */

/**
 * @typedef {typeof SEAT_ORDER_JP[number]} SeatJp
 */



/**
 * @type {["東","南","西","北"]}
 */
export const SEAT_ORDER_JP = ['東', '南', '西', '北'];


/**
 * @typedef {typeof SEAT_ORDER_EN_LOWER[number]} SeatLower
 */
/**
 * @type {["e","s","w","n"]}
 */
export const SEAT_ORDER_EN_LOWER = ['e', 's', 'w', 'n'];

/**
 * @typedef {typeof SEAT_ORDER_EN_UPPER[number]} SeatUpper
 */
/**
 * @readonly
 * @type {["E","S","W","N"]}
 */
export const SEAT_ORDER_EN_UPPER = ["E", "S", "W", "N"];


/**
 * @typedef {typeof SEAT_ORDER_EN[number]} SeatEn
 */

export const SEAT_ORDER_EN = SEAT_ORDER_EN_LOWER;

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


/**
 * 下家の席を取得する
 * @param {Seat} seat 席(日本語でも英語でも可)
 * @returns {Seat|null} 下家の席。引数が座席でなかった場合、nullを返す
 */
export function nextSeat(seat) {
  const i = seatToIndex(seat);
  return i === -1 ? null : SEAT_ORDER[(i + 1) % 4];
}

/**
 * 対面の席を取得する
 * @param {Seat} seat 席(日本語でも英語でも可)
 * @returns {Seat|null} 対面の席。引数が座席でなかった場合、nullを返す
 */
export function acrossSeat(seat) {
  const i = seatToIndex(seat);
  return i === -1 ? null : SEAT_ORDER[(i + 2) % 4];
}

/**
 * 上家の席を取得する
 * @param {Seat} seat 席(日本語でも英語でも可)
 * @returns {Seat|null} 上家の席。引数が座席でなかった場合、nullを返す
 */
export function prevSeat(seat) {
  const i = seatToIndex(seat);
  return i === -1 ? null : SEAT_ORDER[(i + 3) % 4];
}




export function seatOrderFrom(baseSeat) {
  const baseIndex = seatToIndex(baseSeat);
  return baseIndex === -1 ? [] : Array.from({ length: 4 }, (_, i) => SEAT_ORDER[(baseIndex + i) % 4]);
}

/**
 * 
 * @param {Seat[]} seats 
 * @returns {Seat[]}
 */
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












