
/**
 * toNumber
 * 任意の値を安全に数値化するユーティリティ関数。
 *
 * 引数 `val` を `Number()` によって数値変換し、変換結果が NaN であった場合は
 * 代わりに `init` を変換して再試行する。
 * `init` も変換できない場合は最終的に 0 を返す。
 *
 * @param {any} val - 数値変換を試みる値。
 * @param {any} [init=0] - `val` が変換できなかった場合に代わりに変換を試みる初期値。
 * @returns {number} 変換成功した数値。変換できなかった場合は 0。
 *
 * @example
 * toNumber("123");         // => 123
 * toNumber("abc", "456");  // => 456
 * toNumber("abc", "def");  // => 0
 */
export function toNumber(val, init = 0) {
  const n = Number(val);
  return isNaN(n) ? toNumber(init, 0) : n;
}