/**
 * myUtilities.js
 * 汎用ユーティリティ
 */

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
function toNumber(val, init = 0) {
  const n = Number(val);
  return isNaN(n) ? toNumber(init, 0) : n;
}

/**
 * toBoolean
 * 任意の値を安全かつ直感的に真偽値へ変換するユーティリティ関数。
 *
 * 以下の優先順位で変換を行う：
 * 1. 引数が `boolean` 型の場合はそのまま返す。
 * 2. 引数が文字列の場合：
 *    - "true"（大文字小文字・前後空白無視） → true
 *    - "false", "0"（大文字小文字・前後空白無視） → false
 * 3. 上記以外は JavaScript 標準の truthy/falsy 判定で変換。
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
function toBoolean(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const lowered = val.trim().toLowerCase();
    if (lowered === 'true')  return true;
    if (lowered === 'false') return false;
    if (lowered === '0')     return false;
  }
  return Boolean(val);  // fallback: JSのtruthy/falsyに準拠
}


function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepCopy);

  const copied = {};
  for (const key in obj) {
    copied[key] = deepCopy(obj[key]);
  }
  return copied;
}



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


/**
 * ブール配列から target の連続範囲を抽出（例: true の連続ブロック）
 *
 * @param {boolean[]} array - boolean 配列
 * @param {boolean} [target=true] - true または false（デフォルト: true）
 * @returns {{ start: number, end: number }[]} 範囲配列
 */
function findBooleanRanges(array, target = true) {
  const ranges = [];
  let start = null;

  for (let i = 0; i < array.length; i++) {
    const match = array[i] === target;

    if (match && start === null) {
      start = i;
    } else if (!match && start !== null) {
      ranges.push({ start, end: i - 1 });
      start = null;
    }
  }

  if (start !== null) {
    ranges.push({ start, end: array.length - 1 });
  }

  return ranges;
}


/**
 * findBooleanRanges を元に、間に1つだけ例外がある範囲を except 指定でマージ
 *
 * @param {boolean[]} array - boolean 配列
 * @param {boolean} [target=true] - true または false（デフォルト: true）
 * @returns {{ start: number, end: number, except: number? }[]} 範囲配列 
 */
function findBooleanRangesWithException(array, target = true) {
  const ranges = findBooleanRanges(array, target);

  if (ranges.length <= 1) return ranges;

  const merged = [];
  let i = 0;

  while (i < ranges.length) {
    const current = ranges[i];
    const next = ranges[i + 1];

    // 範囲間に1つだけ非target値がある場合、except付きで統合
    if (next && current.end + 2 === next.start) {
      const exceptIndex = current.end + 1;
      if (array[exceptIndex] !== target) {
        merged.push({
          start: current.start,
          end: next.end,
          except: exceptIndex
        });
        i += 2;
        continue;
      }
    }

    merged.push(current);
    i += 1;
  }

  return merged;
}






/**
 * getRanks
 * 配列内の各要素に順位（rank）を付与して返すユーティリティ関数。
 *
 * ソート基準は任意の `compareFn` で指定でき、
 * 同値の場合のタイ（同順位）許容有無も `allowTies` で制御可能。
 *
 * - デフォルトでは数値の降順（大きいものが1位）で順位を付与する。
 * - 同値が存在する場合、`allowTies=true` なら同順位、`allowTies=false` なら順位は連番となる。
 * - 戻り値は元の `values` と同じ長さの配列で、各インデックスに対応する順位が入る。
 *
 * @param {any[]} values - 順位付け対象の配列。
 * @param {function(a: any, b: any): number} [compareFn = (a, b) => b - a] - ソート時に使う比較関数。
 *   負の値：aがbより小さい、0：同値、正の値：aがbより大きい。
 * @param {boolean} [allowTies=true] - 同値を同順位とするかどうかのフラグ。同順位を許可しない(false)場合、配列の先頭に近い方から1,2,...となる。
 * @returns {number[]} 元配列と同じ長さで、各要素の順位（1始まり）が格納された配列。
 *
 * @example
 * getRanks([100, 200, 150]); // => [3, 1, 2]
 * getRanks([100, 200, 200], undefined, true); // => [3, 1, 1]
 * getRanks([100, 200, 200], undefined, false); // => [3, 1, 2]
 * getRanks(["apple", "banana", "apple"], (a, b) => a.localeCompare(b), true); // => [1, 2, 1]
 */
function getRanks(values, compareFn = (a, b) => b - a, allowTies = true) {
  const indexed = values.map((value, index) => ({ value, index }));

  // ソート（indexが tie-breaker になるので順序が安定）
  indexed.sort((a, b) => {
    const cmp = compareFn(a.value, b.value);
    return cmp !== 0 ? cmp : a.index - b.index;
  });

  const ranks = new Array(values.length);
  let rank = 1;

  for (let i = 0; i < indexed.length; i++) {
    if (i > 0) {
      const prev = indexed[i - 1];
      const curr = indexed[i];

      const isDifferent = compareFn(curr.value, prev.value) !== 0;

      if (allowTies) {
        if (isDifferent) {
          rank = i + 1;
        }
      } else {
        rank = i + 1;
      }
    }
    ranks[indexed[i].index] = rank;
  }

  return ranks;
}

