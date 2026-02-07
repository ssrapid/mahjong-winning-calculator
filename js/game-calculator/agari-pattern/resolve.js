import * as SeatMap from '../../seat-map/index.js';
import { AGARI_TYPE } from '../define.js';
import * as Rule from '../../rule/index.js'
import { distributePoints } from '../distribute.js';
import * as SeatUtil from '../../seat-utilities/index.js';
import { getRankingPointMap } from '../rankingpoints.js';

/**
 * 
 * @param {import('./create.js').PatternContext} patternContext 
 * @returns {import('./create.js').PatternContext}
 */
export function resolve(patternContext) {
  // 連荘フラグの確認までは、タイプごとに処理
  patternContext.tsumoAgariPatterns.forEach(computeDeltaForTsumo);
  patternContext.ronAgariPatterns.forEach(computeDeltaForRon);
  patternContext.ryukyokuPatterns.forEach(computeDeltaForRyukyoku);

  patternContext.allPatterns.forEach(applyDelta);

  patternContext.state = 'resolved';
  return patternContext;
}



/**
 * ツモ和了のパターンに対して、点棒変化を計算する
 * @param {import('./create').TsumoAgariPattern} pattern 
 * @returns {import('./create').TsumoAgariPattern}
 */
function computeDeltaForTsumo(pattern) {
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
  pattern.agariLabel = winnerIsDealer
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
 * ロン和了のパターンに対して、点棒変化を計算する
 * @param {import('./create').RonAgariPattern} pattern 
 * @returns {import('./create').RonAgariPattern}
 */
function computeDeltaForRon(pattern) {
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
  pattern.agariLabel = ronGain.toLocaleString();


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
 * 流局のパターンに対して、点棒変動を計算する
 * @param {import('./create').RyukyokuPattern} pattern 
 * @returns {import('./create').RyukyokuPattern}
 */
function computeDeltaForRyukyoku (pattern) {
  if(pattern?.agariType !== AGARI_TYPE.RYUKYOKU) {
    return pattern;
  }

  const {playersInfo, tableInfo, ruleObj, tenpai: tenpaiSeats } = pattern;
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
        pattern.agariLabel = `流局(${tenpaiSeats.map(seat => playersInfo[seat].name || (SeatUtil.seatToJp(seat) + '家')).join(', ')}テンパイ)`
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
      if(player.riichi) player.delta -= 1000; // リーチ者は1000点支出
    }, playersInfo);
  } else {
    const tenpaiFeeMap = distributePoints(defTenpaiFee, tenpaiSeats);
    const notenPaymentMap = distributePoints(defTenpaiFee, notenSeats);
    SeatMap.forEach((player, tenpaiFee, notenPayment, seat) => {
      const delta = tenpaiFee ?? -notenPayment ?? 0;
      player.delta = delta;
      if(player.riichi) player.delta -= 1000;  // リーチ者は1000点支出
    }, playersInfo, tenpaiFeeMap, notenPaymentMap)
  }


  // 連荘フラグの設定
  // 流局時は、連荘ルールが "テンパイ連荘" かつ 親のテンパイ で、連荘フラグが立つ
  // (トビやアガリやめによって、連荘がキャンセルされることもある。判定はのちのフェイズ)
  tableInfo.renchanFlag = renchanRule === Rule.RENCHAN_RULE.TENPAI && tenpaiSeats.includes(dealer);
  // tableInfo.renchanFlag = winnerIsDealer &&
  //   (renchanRule === Rule.RENCHAN_RULE.AGARI || renchanRule === Rule.RENCHAN_RULE.TENPAI);

  // 流局時は供託は据え置き
  const riichiCount = SeatMap.count(playersInfo, player => player.riichi);
  tableInfo.prevKyotaku = kyotaku;
  tableInfo.kyotaku += riichiCount;

  return pattern;

}




/**
 * 計算された点棒変化を適用し、局後の点棒を求める。
 * @param {import('./create.js').Pattern} pattern 
 */
function applyDelta(pattern) {
  // 各タイプごとにdeltaまで計算済み
  //
  const { playersInfo, tableInfo, ruleObj } = pattern;

  // 局後の点数情報を付加
  SeatMap.forEach(player => {
    player.prevScore = player.score;
    player.score = player.score + player.delta;
  }, playersInfo);

  /**
   * 順位と順位点が含まれたオブジェクトを持つシートマップ
   * @type {import('../../seat-map').SeatMap<{rankingPoint:number, gameRank:number}>} 
   */
  const rankMap = getRankingPointMap(SeatMap.unwrapValueFromObject(playersInfo, 'score'), ruleObj, {wrap: true, rankingMap: true, keyOfRank:'gameRank'});
  // playersシートマップにマージする
  SeatMap.mergeInPlace(playersInfo, rankMap);

  // 終局判定と終局処理
  // checkGameEnd関数は、副作用で pattern.tableInfo に gameEnd フラグをセットし、その値を返す。
  if(checkGameEnd(pattern)) {
    // 残供託の処理をする。これをもって、deltaとscoreが確定。
    finalizeGame(pattern);
  }


  // point, gamePoint を付与する。
  SeatMap.forEach(player => {
    const gamePoint = (player.score - ruleObj[Rule.KEY.RETURN_SCORE] + player.rankingPoint);
    player.gamePoint = gamePoint;
    player.point = player.startPoint + gamePoint;
  }, playersInfo);

}





/**
 * 
 * @param {import('./create.js').Pattern} pattern 
 * @returns {import('./create.js').Pattern}
 */
function finalizeGame(pattern) {
  const { playersInfo, tableInfo, ruleObj } = pattern;
  const { kyotaku } = tableInfo;

  if (tableInfo?.gameEnd !== true)
    return pattern;

  // 供託が残っていない場合は残処理なし
  if (kyotaku === 0) return pattern;

  const kyotakuSettlement = ruleObj[Rule.KEY.KYOTAKU_SETTLEMENT];

  // 残供託を据え置きのルールは残処理なし
  if(kyotakuSettlement === Rule.KYOTAKU_SETTLEMENT_TYPE.KEEP)
    return pattern;

  /**
   * トップ者の席
   */
  let topSeats = SeatMap.filter(playersInfo, player => player.gameRank === 1);
  if(kyotakuSettlement == Rule.KYOTAKU_SETTLEMENT_TYPE.TOP_ONLY_SEAT) {
    // 上家取りの場合
    topSeats = [SeatUtil.sortSeats(topSeats)[0]];
  }

  /**
   * 
   */
  const distributeMap = (() => {
    if(ruleObj[Rule.KEY.BASE] === Rule.IDS.M_LEAGUE) {
      return distributePoints(kyotaku * 1000, topSeats);
    } else {
      const per = Math.round(kyotaku * 1000 / topSeats.length);
      return SeatMap.create(seat => topSeats.includes(seat) ? per : 0);
    }
  })();

  // deltaとscoreを補正する
  SeatMap.forEach((player, distribute) => {
    player.delta += (distribute ?? 0);
    player.score += (distribute ?? 0);
  }, playersInfo, distributeMap);
  // 分配したので、供託はなくなる。
  tableInfo.kyotaku = 0;

  return pattern;
}



/**
 * 
 * @param {import('./create.js').Pattern} pattern 
 * @returns {boolean} 対局終了フラグ
 */
function checkGameEnd(pattern) {
  const { playersInfo, tableInfo, ruleObj, renchanFlag, agariType } = pattern;

  if(ruleObj[Rule.KEY.ALLOW_GAME_END_BY_NEGATIVE] === true 
    && SeatMap.some(playersInfo, player => player.afterScore < 0)){
    // トビありのルールでトビがいれば対局終了。
    // 連荘はキャンセル。
    tableInfo.renchanFlag = false;
    return tableInfo.gameEnd = true;
  }
  if(!pattern.tableInfo.finalRound) {
    // オーラスでなければ対局続行
    return tableInfo.gameEnd = false;
  }


  // 以下はオーラスが前提

  const allowWestRound = ruleObj[Rule.KEY.ALLOW_WEST_ROUND];

  /**
   * 西入ありルールの場合は設定されたトップ必要点数を参照。
   * そうでなければ、マイナス無限大とする。
   */
  const minimumTopScore = allowWestRound ? ruleObj[Rule.KEY.MINIMUN_TOP_SCORE] : -Infinity;

  if(renchanFlag) {
    const { dealer } = tableInfo;

    // 親がトップであることが、アガリやめ、テンパイやめの必要条件
    if (playersInfo[dealer].gameRank === 1) {
      if(agariType === AGARI_TYPE.RYUKYOKU && ruleObj[Rule.KEY.END_ON_A_TENPAI]) {
        // 流局時、テンパイやめ判定
        const endOnATenpai = ruleObj[Rule.KEY.END_ON_A_TENPAI];
        if(endOnATenpai && playersInfo[dealer].score >= minimumTopScore) {
          // テンパイやめ:あり のルールで、トップだった親の点棒がトップ必要点数を超えていた場合、
          // 連荘をキャンセルして対局終了。
          pattern.tableInfo.renchanFlag = false;
          return tableInfo.gameEnd = true;
        }
      } else {
        // ツモまたはロン和了時、アガリやめ判定
        const endOnAWin = ruleObj[Rule.KEY.END_ON_A_WIN];
        if(endOnAWin && playersInfo[dealer].score >= minimumTopScore) {
          // アガリやめ:あり のルールで、トップだった親の点棒がトップ必要点数を超えていた場合、
          // 連荘をキャンセルして対局終了。
          pattern.tableInfo.renchanFlag = false;
          return tableInfo.gameEnd = true;
        }
      }
    }
    // アガリやめ、テンパイやめにならない連荘時
    return tableInfo.gameEnd = false;
  }

  // 以下は連荘できなかった場合が前提。
  // トップ必要点数に達している者がいれば対局終了、いなければ続行。
  return tableInfo.gameEnd = SeatMap.some(playersInfo, player => player.score >= minimumTopScore);

}