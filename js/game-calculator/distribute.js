import * as SeatUtil from '../seat-utilities/index.js'
import * as SeatMap from '../seat-map/index.js'
import { getQuotientAndRemainder } from '../my-utilities/index.js';

/**
 * Mリーグルールで、供託や順位点を同点者で分配する場合、
 * 端数を上家（座席順が早い者）が多く取るように分ける。
 *
 * @param {number} sum - 分配する合計点（供託・順位点など）
 * @param {import('../seat-utilities').Seat[]} seats - 分配対象の座席 ('e','s','w','n'など)
 * @returns {import('../seat-map').SeatMap<number>} seatMap形式で分配結果を返す
 */
export function distributePointsAmongPlayers(sum, seats) {
  sum = Number(sum);
  if(Number.isNaN(sum)) throw new Error(`sumがNaNです。`)
  seats = [...new Set(seats.filter(seat => SeatUtil.SEAT_ORDER.includes(seat)))];

  // 分配人数
  const n = seats.length;
  if (n === 0 || typeof sum !== 'number') { return SeatMap.create(); }
  if (n === 1) {
    return SeatMap.create(seat => seats.includes(seat) ? sum : null);
  }

  const result = SeatMap.create();

  const sortedSeats = SeatUtil.sortSeats(seats); // 座席順にソート

  // 1000点単位で分ける。余りはremainder
  const { quotient, remainder } = getQuotientAndRemainder(sum, n, 1000);

  /**
   * 余りを分配する重み
   */
  const weights = generateWeights(n);

  sortedSeats.forEach((seat, i) => {
    result[seat] = quotient + remainder * weights[i] / 1000;
  });

  return result;

  /**
   * 要素の合計が1000になる配列で返る
   * @param {number} n 
   * @returns {number[]}
   */
  function generateWeights(n) {
    n = Number(n);
    switch (n) {
      case 0: return [];
      case 1: return [1000];
      case 2: return [500, 500];
      case 3: return [400, 300, 300];
      case 4: return [300, 300, 200, 200];
    }
    const weights = Array(n).fill(0);
    for (let i = 0; i < 10; i++) {
      weights[i % n] += 100;
    }
    return weights;
  }

}
