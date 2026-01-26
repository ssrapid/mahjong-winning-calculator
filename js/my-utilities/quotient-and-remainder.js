/**
 * 被除数を除数で割った商を base 未満切り捨てで求め、以下を満たす商と剰余を返す。
 * * dividend = divisor * quotient + reminder
 * * reminder >= 0
 *
 * @param {number} dividend - 被除数
 * @param {number} divisor - 除数
 * @param {number} [base=1] - 丸め単位（例: 1, 10, 100, 1000）
 * @returns {{ quotient: number, remainder: number }} base単位で切り捨てた商と剰余
 */
export function getQuotientAndRemainder(dividend, divisor, base = 1) {
  dividend = Number(dividend);
  divisor = Number(divisor);
  base = Number(base);

  if (divisor === 0) throw new Error('除数が0です');
  if (Number.isNaN(dividend)) throw new Error('被除数がNaNです。');
  if (Number.isNaN(divisor)) throw new Error('除数がNaNです。');
  if (base <= 0 || Number.isNaN(base)) {
    throw new Error('base は正の数である必要があります');
  }



  // とりあえず割る。
  const raw = dividend / divisor;
  // base未満を切り捨てる。
  let quotient = Math.floor(raw / base) * base;
  // 剰余を求める。
  let remainder = dividend - divisor * quotient;


  const EPS = 1e-10;
  if (Math.abs(remainder) <= EPS) {
    // 剰余が微小で浮動小数誤差の範囲とみなした場合、剰余を0とする
    remainder = 0;
  } else if (remainder < 0) {
    // 剰余が負になった場合、商を調整して再度剰余を求める
    const step = Math.sign(divisor) * base;
    quotient -= step;
    remainder = dividend - divisor * quotient;
    if(Math.abs(remainder) <= EPS) remainder = 0;
  }


  return { quotient, remainder };
}
