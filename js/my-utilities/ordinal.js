/**
 * Ordinal.js
 * 
 */



/**
 * 
 * @param {number} n 
 * @returns {string}
 */
function getOrdinalSuffix(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * 与えられた数値に"th", "st", "nd", "rd"を後ろにつけて、助数詞の文字列に変換する
 * @param {number} n 変換元の数値
 * @returns {string} 変換された文字列
 */
export function ordinal(n) {
  return n + getOrdinalSuffix(n);
}
