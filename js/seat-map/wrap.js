import { create } from './create.js';


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
 * @param {import('./create.js').SeatMap<T>} seatMap - SeatMap 形式のオブジェクト（{ 東: any, 南: any, 西: any, 北: any }）
 * @param {K} keyName - ラップ時に使用するキー名（例: 'score'）
 * @returns {import('./create.js').SeatMap<{ [P in K]: T }>} 新しい SeatMap<Object> （{ 東: { [keyName]: value }, ... }）
 */
export function wrapValueAsObject(seatMap, keyName) {
  return create(seat => ({ [keyName]: seatMap[seat] }));
}


/**
 * unwrapSeatMapValueFromObject
 *
 * SeatMap の各座席に紐づくオブジェクトから指定キーの値を抽出し、
 * SeatMap<プリミティブ型> に変換して返す（非破壊）。
 *
 * @example
 * const scoreMap = unwrapSeatMapValueFromObject(wrappedMap, 'score');
 *
 * @template T
 * @template {string} K
 * @param {import('./create.js').SeatMap<{ [P in K]: T }>} map - SeatMap<object> 形式のオブジェクト（{ 東: { [key]: value }, 南: ..., ... }）
 * @param {K} keyName - 抽出するキー名（例: 'score'）
 * @returns {import('./create.js').SeatMap<T>} SeatMap<プリミティブ型>（{ 東: value, 南: value, ... }）
 */
export function unwrapValueFromObject(map, keyName) {
  return create(seat => map[seat]?.[keyName] ?? null);
}

