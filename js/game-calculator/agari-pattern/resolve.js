import * as SeatMap from '../../seat-map/index.js';
import { AGARI_TYPE } from '../define.js';
import * as Rule from '../../rule/index.js'
import { distributePoints } from '../distribute.js';
import * as SeatUtil from '../../seat-utilities/index.js';

/**
 * 
 * @param {import('./create.js').PatternContext} patternContext 
 * @returns {import('./create.js').PatternContext}
 */
export function resolve(patternContext) {
  patternContext.tsumoAgariPatterns.forEach(resolveTsumoAgariPattern);
  patternContext.ronAgariPatterns.forEach(resolveRonAgariPattern);
  patternContext.ryukyokuPatterns.forEach(resolveRyukyokuPattern);

  return patternContext;
}



/**
 * 
 * @param {import('./create').TsumoAgariPattern} pattern 
 * @returns {import('./create').TsumoAgariPattern}
 */
function resolveTsumoAgariPattern(pattern) {
  if(pattern?.agariType !== AGARI_TYPE.TSUMO) {
    return pattern;
  }

  const {playersInfo: players, tableInfo, ruleObj, template, winner } = pattern;
  const { dealer, kyotaku, tsumibo } = tableInfo;
  const renchanRule = ruleObj[Rule.KEY.RENCHAN_RULE];

  let {  tsumoPaymentToDealer, tsumoPaymentToChild } = template;
  /** 和了者が親であるか */
  const winnerIsDealer = winner === dealer;

  /**
   * "1,300/2,600" "6,000オール" など和了点の表示用文字列
   * 逆襲の戦の場合、倍率を適用する前の元の和了点で表示
   */
  const agariLabel = winnerIsDealer
    ? `${tsumoPaymentToDealer.toLocaleString()}オール`
    : `${tsumoPaymentToChild.toLocaleString()}/${tsumoPaymentToDealer.toLocaleString()}`;


  // 逆襲の戦用の得点倍率
  // 持ち点によって得点倍率が変動する。
  // リーチ棒を出したことによって点数が変動した場合は変動後を参照する。
  // 積み棒に倍率は乗らない
  if(ruleObj[Rule.KEY.BASE] === Rule.IDS.GYAKUSHU) {
    const winnerScore = players[winner].score - (players[winner].riichi ? 1 : 0) * 1000;
    if(winnerScore < 10000) {
      // 9900点以下は4倍
      tsumoPaymentToChild *= 4;
      tsumoPaymentToDealer *= 4;
    } else if(winnerScore < 20000) {
      // 10000点以上19900点以下は3倍
      tsumoPaymentToChild *= 3;
      tsumoPaymentToDealer *= 3;
    } else if(winnerScore < 30000) {
      // 20000点以上29900点以下は2倍
      tsumoPaymentToChild *= 2;
      tsumoPaymentToDealer *= 2;
    } else {
      // 30000点以上は1倍
      // tsumoPaymentToChild *= 1;
      // tsumoPaymentToDealer *= 1;
    }
  }


  // 支払を先に計算する
  SeatMap.forEach((player, seat) => {
    const isDealer = dealer === seat;
    const isWinner = winner === seat;
    if (isWinner) {
      // 和了者は一旦支出0点とする。あとで埋める。
      player.delta = 0;
      return;
    };

    // 和了者または自身が親の場合、親の支払点を適用
    const payment = (winnerIsDealer || isDealer) ? tsumoPaymentToDealer : tsumoPaymentToChild;
    player.delta = - (payment + tsumibo * 100); // 積み棒1本に付き100点追加
    if (player.riichi) player.delta -= 1000;  // リーチしている者はさらに1000点支出
  }, players);

  /**
   * 
   */
  const gain = SeatMap.reduce(players, (acc, {delta}) => acc - delta, 0) + kyotaku * 1000;
  players[winner].delta = gain;

  // 局後の点数情報を付加
  SeatMap.forEach(player => {
    player.prevScore = player.score;
    player.score += player.delta;
  }, players);

  // 連荘フラグの設定
  // 親の和了で、連荘ルールが "アガリ連荘" または "テンパイ連荘" のとき、連荘フラグが立つ
  // (トビやアガリやめによって、連荘がキャンセルされることもある。判定はのちのフェイズ)
  tableInfo.renchanFlag = winnerIsDealer &&
    (renchanRule === Rule.RENCHAN_RULE.AGARI || renchanRule === Rule.RENCHAN_RULE.TENPAI);

  // 和了が発生しているので、供託は0になる。
  tableInfo.prevKyotaku = kyotaku;
  tableInfo.kyotaku = 0;

  return pattern;
}


/**
 * 
 * @param {import('./create').RonAgariPattern} pattern 
 * @returns {import('./create').RonAgariPattern}
 */
function resolveRonAgariPattern(pattern) {
  if(pattern?.agariType !== AGARI_TYPE.RON) {
    return pattern;
  }

  const {playersInfo: players, tableInfo, ruleObj, template, winner, discarder } = pattern;
  const { dealer, kyotaku, tsumibo } = tableInfo;
  const renchanRule = ruleObj[Rule.KEY.RENCHAN_RULE];

  const { ronGainAsChild, ronGainAsDealer } = template;
  /** 和了者が親であるか */
  const winnerIsDealer = winner === dealer;
  let ronGain = winnerIsDealer ? ronGainAsDealer : ronGainAsChild;

  /**
   * "5,200" "12,000" など和了点の表示用文字列
   * 逆襲の戦の場合、倍率を適用する前の元の和了点で表示
   */
  const agariLabel = ronGain.toLocaleString();


  // 逆襲の戦用の得点倍率
  // 持ち点によって得点倍率が変動する。
  // リーチ棒を出したことによって点数が変動した場合は変動後を参照する。
  // 積み棒に倍率は乗らない
  if(ruleObj[Rule.KEY.BASE] === Rule.IDS.GYAKUSHU) {
    const winnerScore = players[winner].score - (players[winner].riichi ? 1 : 0) * 1000;
    if(winnerScore < 10000) {
      // 9900点以下は4倍
      ronGain *= 4;
    } else if(winnerScore < 20000) {
      // 10000点以上19900点以下は3倍
      ronGain *= 3;
    } else if(winnerScore < 30000) {
      // 20000点以上29900点以下は2倍
      ronGain *= 2;
    } else {
      // 30000点以上は1倍
      // ronGain *= 1;
    }
  }


  // 支払を先に計算する
  SeatMap.forEach((player, seat) => {
    const isWinner = winner === seat;
    const isDiscarder = discarder === seat;
    if (isWinner) {
      // 和了者は一旦支出0点とする。あとで埋める。
      player.delta = 0;
      return;
    };

    // 和了者または自身が親の場合、親の支払点を適用
    const payment = (isDiscarder ? ronGain : 0);
    player.delta = - (payment + tsumibo * 300); // 積み棒1本に付き300点追加
    if (player.riichi) player.delta -= 1000;  // リーチしている者はさらに1000点支出
  }, players);


  // 和了者の加点を計算
  const gain = SeatMap.reduce(players, (acc, {delta}) => acc - delta, 0) + kyotaku * 1000;
  players[winner].delta = gain;

  // 局後の点数情報を付加
  SeatMap.forEach(player => {
    player.prevScore = player.score;
    player.score += player.delta;
  }, players);

  // 連荘フラグの設定
  // 親の和了で、連荘ルールが "アガリ連荘" または "テンパイ連荘" のとき、連荘フラグが立つ
  // (トビやアガリやめによって、連荘がキャンセルされることもある。判定はのちのフェイズ)
  tableInfo.renchanFlag = winnerIsDealer &&
    (renchanRule === Rule.RENCHAN_RULE.AGARI || renchanRule === Rule.RENCHAN_RULE.TENPAI);

  // 和了が発生しているので、供託は0になる。
  tableInfo.prevKyotaku = kyotaku;
  tableInfo.kyotaku = 0;

  return pattern;

}



/**
 * 
 * @param {import('./create').RyukyokuPattern} pattern 
 * @returns {import('./create').RyukyokuPattern}
 */
function resolveRyukyokuPattern (pattern) {
  if(pattern?.agariType !== AGARI_TYPE.RYUKYOKU) {
    return pattern;
  }

  const {playersInfo: players, tableInfo, ruleObj, tenpai:tenpaiSeats } = pattern;
  const notenSeats = SeatUtil.SEAT_ORDER.filter(seat => !tenpaiSeats.includes(seat));

  const { dealer, kyotaku } = tableInfo;
  const renchanRule = ruleObj[Rule.KEY.RENCHAN_RULE];
  const defTenpaiFee = ruleObj[Rule.KEY.TENPAI_FEE];

  const tenpaiCount = tenpaiSeats.length;
  const notenCount = notenSeats.length;

  // 全員テンパイまたは全員ノーテンまたはテンパイ料がないルール
  if(tenpaiCount === 0 || notenCount === 0 || defTenpaiFee === 0) {
    if(defTenpaiFee === 0) {
      if (renchanRule === Rule.RENCHAN_RULE.TENPAI) {
        pattern.agariLabel = `流局(${tenpaiSeats.map(seat => players[seat].name).join(', ')}テンパイ)`
      } else {
        pattern.agariLabel = '流局';
      }
    } else if(tenpaiCount === 0) {
      pattern.agariLabel = '流局(全員ノーテン)';
    } else if (notenCount === 0) {
      pattern.agariLabel = '流局(全員テンパイ)';
    }
    SeatMap.forEach(player => {
      player.delta = 0;
      if(player.riichi) delta -= 1000;
    }, players);
  } else {
    const tenpaiFeeMap = distributePoints(defTenpaiFee, tenpaiSeats);
    const notenPaymentMap = distributePoints(defTenpaiFee, notenSeats);
    SeatMap.forEach((player, tenpaiFee, notenPayment, seat) => {
      const delta = tenpaiFee ?? notenPayment ?? 0;
      players.delta = delta;
      if(player.riichi) delta -= 1000;  // リーチ者は1000点支出
    }, players, tenpaiFeeMap, notenPaymentMap)
  }

  // 局後の点数情報を付加
  SeatMap.forEach(player => {
    player.prevScore = player.score;
    player.score += player.delta;
  }, players);

  // 連荘フラグの設定
  // 親のテンパイで、連荘ルールが "テンパイ連荘" のとき、連荘フラグが立つ
  // (トビやアガリやめによって、連荘がキャンセルされることもある。判定はのちのフェイズ)
  tableInfo.renchanFlag = renchanRule === Rule.RENCHAN_RULE.TENPAI && tenpaiSeats.includes(dealer);
  // tableInfo.renchanFlag = winnerIsDealer &&
  //   (renchanRule === Rule.RENCHAN_RULE.AGARI || renchanRule === Rule.RENCHAN_RULE.TENPAI);

  // 流局時は供託は据え置き
  const riichiCount = SeatMap.count(players, player => player.riichi);
  tableInfo.prevKyotaku = kyotaku;
  tableInfo.kyotaku += riichiCount;

  return pattern;

}
