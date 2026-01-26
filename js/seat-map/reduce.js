import { toEntries } from './convert.js';

/**
 * @template T, R
 * @callback SeatMapReducer
 * @param {R} accumulator
 * 前回の SeatMapReducer の呼び出し結果の値です。
 * 初回の呼び出しでは initialValue が指定されていた場合はその値、
 * そうでない場合は seatMap[SEAT_ORDER[0]] の値です。
 * @param {T} currentValue
 * 現在の要素の値です。初回の呼び出しでは initialValue が指定された場合は
 *  seatMap[SEAT_ORDER[0]] の値であり、そうでない場合は seatMap[SEAT_ORDER[1]] の値です。
 * @param {import('../seat-utilities').Seat} currentSeat
 * currentValue のSeatです。
 * 初回の呼び出しでは、 initialValue が指定された場合は SEAT_ORDER[0]、そうでない場合は SEAT_ORDER[1] です。
 * @param {import('./index.js').SeatMap<T>} seatMap
 * reduce() に与えたSeatMapです。
 * @returns {R}
 */

/**
 * seatMap を1つの値に集約する。
 * reduce() は SeatMap のそれぞれの要素に対して、ユーザーが提供した reducer を呼び出します。
 * その際、直前の要素の計算結果の返値を渡します。
 * SeatMapのすべての要素に対して reducer を実行した最終結果は、単一の値となります。
 *
 * @template T, R
 * @overload
 *
 * @param {import('./index.js').SeatMap<T>} seatMap
 * 計算対象のSeatMap
 *
 * @param {SeatMapReducer<T, R>} reducer
 * SeatMapの各要素に対して実行される関数です。その返値は、次に reducer を呼び出す際の accumulator 引数の値になります。
 * 最後の呼び出しでは、返値は reduce() の返値となります。
 *
 * @param {R} initialValue
 * コールバックが最初に呼び出された時に accumulator が初期化される値です。
 * initialValue が指定された場合、callbackFn は起家の値を currentValue として実行を開始します。
 * もし initialValue が指定されなかった場合、accumulator は起家の値に初期化され、
 * reducer は2番目の席の値を currentValue として実行を開始します。
 *
 * @returns {R}
 * SeatMap全体にわたって reducer を実行した結果の値です。
 */


/**
 * seatMap を1つの値に集約する。
 * reduce() は SeatMap のそれぞれの要素に対して、ユーザーが提供した reducer を呼び出します。
 * その際、直前の要素の計算結果の返値を渡します。
 * SeatMapのすべての要素に対して reducer を実行した最終結果は、単一の値となります。
 *
 * @template U
 * @overload
 *
 * @param {import('./index.js').SeatMap<U>} seatMap
 * 計算対象のSeatMap
 *
 * @param {SeatMapReducer<U, U>} reducer
 * SeatMapの各要素に対して実行される関数です。その返値は、次に reducer を呼び出す際の accumulator 引数の値になります。
 * 最後の呼び出しでは、返値は reduce() の返値となります。
 *
 * @returns {U}
 * SeatMap全体にわたって reducer を実行した結果の値です。
 */

/**
 * seatMap を1つの値に集約する。
 *
 * @template T, R
 * @param {import('./index.js').SeatMap<T>} seatMap
 * @param {SeatMapReducer<T, R>} reducer
 * @param {...R} rest
 * @returns {R}
 */
export function reduce(seatMap, reducer, ...rest) {
  const entries = toEntries(seatMap);

  if (rest.length === 0) {
    entries.shift();
    const [, firstValue] = entries.shift();
    const init = firstValue;
    return entries.reduce((acc, [seat, value]) => reducer(acc, value, seat, seatMap), init);
  } else {
    const init = rest[0];
    return entries.reduce((acc, [seat, value]) => reducer(acc, value, seat, seatMap), init);
  }
}



/**
 * SeatMap<number>の各席の値を合計する。
 *
 * @param {import('./index.js').SeatMap<number>} seatMap 計算対象のSeatMap
 * @returns {number} 各席の値の合計
 */
export function sum(seatMap) {
  return reduce(seatMap, (acc, value) => acc + value);
}

