import * as SeatUtilities from '../seat-utilities/index.js'
import * as SeatMap from '../seat-map/index.js'
import * as Rule from '../rule/index.js'
import * as MyUtilities from '../my-utilities/index.js'
import { distributePointsAmongPlayers } from './distribute.js';




/**
 * @overload
 * @param {import('../seat-map').SeatMap<number>} scoreMap 点棒状況を持つ SeatMap ({e: 25000, s: 30000,...} など)
 * @param {import('../rule').RuleObject} rule ルール設定オブジェクト
 * @param {{wrap?:false|undefined, rankingMap?:any}} [option]
 * @returns {import('../seat-map').SeatMap<number>}
 */
/**
 * @overload
 * @param {import('../seat-map').SeatMap<number>} scoreMap 点棒状況を持つ SeatMap ({e: 25000, s: 30000,...} など)
 * @param {import('../rule').RuleObject} rule ルール設定オブジェクト
 * @param {{wrap:true, rankingMap?:boolean}} option
 * @returns {import('../seat-map').SeatMap<{rankingPont:number}&object>}
 */
/**
 * 
 * @param {import('../seat-map').SeatMap<number>} scoreMap 点棒状況を持つ SeatMap ({e: 25000, s: 30000,...} など)
 * @param {import('../rule').RuleObject} rule ルール設定オブジェクト
 * @param {{wrap?:boolean, rankingMap?:boolean}} [option]
 * @returns {import('../seat-map').SeatMap<number>|import('../seat-map').SeatMap<{rankingPoint:number}&object>}
 */
export function getRankingPointMap(scoreMap, rule, option={}) {
  const baseRule = rule[Rule.KEY.BASE];
  const allowTies = rule[Rule.KEY.TIE_SCORE_RULE] === Rule.TIE_SCORE_RULE.SHARED;
  const rankingMap = SeatMap.getRankMap(scoreMap, allowTies);

  /** @type {number[]} */
  let rankingPointsArray;

  if(baseRule === Rule.IDS.JPML) {
    const floatingCount = SeatMap.count(scoreMap, score => score >= rule[Rule.KEY.RETURN_SCORE]);
    rankingPointsArray = [...rule[Rule.KEY.RANKING_POINTS][floatingCount]];
  } else {
    rankingPointsArray = [...rule[Rule.KEY.RANKING_POINTS]];
  }

  /** @type {import('../seat-map').SeatMap<number>} */
  const rankPointMap = SeatMap.create(); // 一旦各席をnullで初期化

  for(let i = 1; i <= 4; i++) {
    const tieRanker = SeatMap.count(rankingMap, rank => rank === i);

    // 上の順位で同点が発生し、当順位に該当者がいない場合はcontinue
    if(tieRanker === 0) continue;

    const tieRankerSeat = SeatMap.filter(rankingMap, rank => rank === i);

    // 上位から tieRanker 人分の順位点を消費する。
    // 定義はポイントスケールになっているので、1000倍して点棒とスケールを合わせる
    const sum = rankingPointsArray.splice(0, tieRanker).reduce((acc, val) => acc + val, 0) * 1000;
    if(tieRanker === 1) {
      // 同点者がいない単独順位の場合
      rankPointMap[tieRankerSeat[0]] = sum;
    } else {
      // 同点者が複数いる場合
      if(baseRule === Rule.IDS.M_LEAGUE) {
        // Mリーグルールでは、3者同点の場合の処理が明記されているので、個別実装する。
        const map = distributePointsAmongPlayers(sum, tieRankerSeat);
        tieRankerSeat.forEach(seat => rankPointMap[seat] = map[seat]);
      } else {
        // 協会ルールでは、3者同点の場合の順位点は50/3=16.67と処理されるとのことなので、単純割り算して10点単位に丸める。
        // その他のルールでは、割り切れないことがないので処理が不明である。
        // カスタムでベースルールで規定されていない事態になった場合はこの節の処理とする。
        const per = MyUtilities.roundToBase(sum / tieRanker, 10);
        tieRankerSeat.forEach(seat => rankPointMap[seat] = per);
      }
    }
  }

  if(option?.wrap) {
    // ラップオプションが付加されていた場合
    const wrappedMap = SeatMap.wrapValueAsObject(rankPointMap, 'rankingPoint');
    if(option?.rankingMap) {
      // 順位情報も付与する場合
      SeatMap.forEach((wrapObj, rank) => wrapObj.rank = rank, wrappedMap, rankingMap);
    }
    return wrappedMap;
  }

  return rankPointMap;
}

