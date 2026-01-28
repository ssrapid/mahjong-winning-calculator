import * as SeatUtil from '../../seat-utilities/index.js'
import * as SeatMap from '../../seat-map/index.js';
import { create } from './create.js';
import { resolve } from './resolve.js';


/**
 * 
 * @param {import('../../seat-map/index.js').SeatMap<import('./create.js').PlayerInfo>} playersInfo
 * 対局者情報(SeatMap形式)
 * @param {import('./create.js').TableInfo} tableInfo 対局情報
 * @param {import('../../rule/index.js').RuleObject} ruleObj ルールオブジェクト
 * @returns 
 */
export function build(playersInfo, tableInfo, ruleObj) {
  // リーチパターン16通りを生成
  const riichiMaps = Array.from({ length: 16 }, (_, i) =>
    SeatMap.create(seat => Boolean((i >>> SeatUtil.seatToIndex(seat)) & 1)));

  const patternCollections = riichiMaps.map(riichiMap => {
    // playersInfoはここで一部書き換えるので、この時点でクローン化
    const players = structuredClone(playersInfo);
    SeatMap.forEach((player, riichi) => player.riichi = riichi, players, riichiMap);
    const patternCollection = create(playersInfo, tableInfo, ruleObj);
    resolve(patternCollection);
    return {riichiMap, patternCollection};
  });

  return patternCollections;
}
