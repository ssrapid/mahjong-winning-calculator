/**
 * myUtilities.js
 * 汎用ユーティリティ
 */

export { getByPath } from "./myUtilities/getByPath.js";

export { getRanks } from "./myUtilities/getRanks.js";

export { toNumber } from "./myUtilities/toNumber.js";
export { toBoolean } from "./myUtilities/toBoolean.js";

export { findBooleanRanges, findBooleanRangesWithException } from "./myUtilities/BooleanRange.js";


/**
 * 指定の数値を「10のべき乗の桁」で四捨五入して返す。
 *
 * 例:
 *   digit=0 => base=1 (整数位未満四捨五入)
 *   digit=1 => base=10 (十位未満四捨五入)
 *   digit=2 => base=100 (百位未満四捨五入)
 *
 * @param {number} value - 丸める対象の数値
 * @param {number} [digit=0] - 四捨五入する桁数（例: 0→1, 1→10, 2→100, 3→1000）
 * @returns {number} 丸められた数値
 */
function roundToDigit(value, digit = 0) {
  const base = Math.pow(10, digit);
  return Math.round(value / base) * base;
}


/**
 * 指定した数値を base 単位で四捨五入し、その結果を返す。
 *
 * 例:
 *   roundToBase(127, 10) => 130
 *   roundToBase(1234, 100) => 1200
 *   roundToBase(1667, 1000) => 2000
 *   roundToBase(3.14159, 0.01) => 3.14
 *
 * @param {number} value - 丸めたい値
 * @param {number} [base=1] - 丸め単位（例: 1, 10, 100, 0.01）
 * @returns {number} 丸め後の値
 * @throws {Error} base が 0 の場合
 */
function roundToBase(value, base = 1) {
  if (base === 0) throw new Error('base が 0 です (roundToBase)');
  return Math.round(value / base) * base;
}


/**
 * 被除数を除数で割った商を base 未満切り捨てで求め、
 * dividend = divisor * quotient + mod
 * が成立する商と剰余を返す。
 *
 * @param {number} dividend - 被除数
 * @param {number} divisor - 除数
 * @param {number} [base=1] - 丸め単位（例: 1, 10, 100, 1000）
 * @returns {{ quotient: number, mod: number }} 商と剰余
 */
function divideAndGetMod(dividend, divisor, base = 1) {
  if (divisor === 0) throw new Error('除数が0です');
  const raw = dividend / divisor;
  const quotient = Math.floor(raw / base) * base;
  const mod = dividend - divisor * quotient;
  return { quotient, mod };
}








