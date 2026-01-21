/**
 * toBoolean
 * 任意の値を安全かつ直感的に真偽値へ変換するユーティリティ関数。
 * 文字列"false"をfalseと扱うなどがBoolean()と異なる。
 *
 * 優先順位:
 * 1. boolean → そのまま返す
 * 2. string  →
 *    - "true"  → true
 *    - "false" → false
 *    - 数値変換できて 0 → false
 *    - 数値変換できて 0以外 → true
 * 3. それ以外 → JS標準の truthy / falsy
 *
 * @param {any} val - 真偽値変換を試みる値。
 * @returns {boolean} 変換結果の真偽値。
 *
 * @example
 * toBoolean(true);      // => true
 * toBoolean("true");    // => true
 * toBoolean(" false "); // => false
 * toBoolean(0);         // => false
 * toBoolean("0");       // => false
 * toBoolean("abc");     // => true
 * toBoolean("");        // => false
 */
export function toBoolean(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    if (s === 'true')  return true;
    if (s === 'false') return false;

    // 数値として解釈できるなら数値優先
    if (s !== "" && !Number.isNaN(Number(s))) {
      return Number(s) !== 0;
    }
  }
  return Boolean(val);  // fallback: JSのtruthy/falsyに準拠
}
