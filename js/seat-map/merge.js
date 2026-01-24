import { SEAT_ORDER } from "../seat-utilities/index.js";

import { create } from "./create.js";

/**
 * @typedef {import("../seat-utilities/index.js").Seat} Seat
 */
/**
 * @template T
 * @typedef {import("./index.js").SeatMap<T>} SeatMap
 */



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
 * @param {...SeatMap<object>} maps - 合成する複数の seatMap<Object>
 * @returns {SeatMap<object>} 合成済みの新しい seatMap<Object>
 */
export function merge(...maps) {
  return create(seat => Object.assign({}, ...maps.map(map => map[seat] ?? {}))
  );
}



/**
 * @template T
 * @typedef {{e:T, s:T, w:T, n:T}} SeatMap
 */
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
 * @param {SeatMap<object>} target - マージ先となる seatMap<Object>（破壊される）
 * @param {...SeatMap<object>} maps - マージする複数の seatMap<Object>
 * @returns {SeatMap<object>} マージ後の target を返す
 */
export function mergeInPlace(target, ...maps) {
  for (const seat of SEAT_ORDER) {
    Object.assign(target[seat], ...maps.map(map => map[seat] ?? {}));
  }
  return target;
}

