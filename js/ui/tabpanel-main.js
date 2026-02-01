/**
 * tabPanel__main.js
 * 
 * main.htmlに対応するスクリプトファイル
 */


import { state } from "../state.js";

import * as SeatMap from '../seat-map/index.js';
import * as Rule from '../rule/index.js';
import * as GameCalc from '../game-calculator/index.js'

import { SEAT_ORDER, seatToJp } from "../seat-utilities/index.js";
import { ordinal, toBoolean } from '../my-utilities/index.js';

import { formatPoints, selectAllOnFocus } from "./common.js";
import { promise_tab2 } from '../main.js';
import { setUpConditionForm } from './add-condition.js';
import { loadTextFile } from './html-loader.js';


/** @type {HTMLElement|Document} */
let rootNode = document;

/**
 * 対局者名の入力ボックス
 * @type {NodeListOf<HTMLInputElement>}
 */
let inputs_name;

/**
 * @type {import("../seat-map/index.js").SeatMap<HTMLInputElement>}
 */
let inputsMap_name;

/**
 * @type  {NodeListOf<HTMLInputElement>}
 */
let inputs_point;

/**
 * @type {import("../seat-map/index.js").SeatMap<HTMLInputElement>}
 */
let inputsMap_point;

/**
 * @type  {NodeListOf<HTMLInputElement>}
 */
let inputs_score;

/**
 * @type {import("../seat-map/index.js").SeatMap<HTMLInputElement>}
 */
let inputsMap_score;

/**
 * @type {NodeListOf<HTMLInputElement>}
 */
let radio_dealer;

/**
 * @type {NodeListOf<HTMLInputElement>}
 */
let inputs_riichi;

/**
 * @type {import("../seat-map/index.js").SeatMap<HTMLInputElement>}
 */
let inputsMap_riichi;

/**
 * @type {NodeListOf<HTMLInputElement>}
 */
let input_kyotaku;

/**
 * @type {NodeListOf<HTMLInputElement>}
 */
let input_tsumibo;




/**
 * 条件の対象になるプレーヤー名の表示Span
 * @type {import('../seat-map').SeatMap<HTMLSpanElement>}
 */
const collectionMapOfTargetName = SeatMap.create(seat => rootNode.getElementsByClassName(`span-targetname-${seat}`));

/**
 * 
 * @param {HTMLElement} root 
 */
export default function activate(root) {
  rootNode = root;
  ensureDom();
  initDom();
  setUpConditionForm();
}

function ensureDom() {
  if(!inputs_name || inputs_name?.length == 0) {
    inputs_name = rootNode.querySelectorAll('.input-name');
    inputsMap_name = nodeListToSeatMap(inputs_name);
  }
  if(!inputs_point || inputs_point?.length == 0) {
    inputs_point = rootNode.querySelectorAll('.input-point');
    inputsMap_point = nodeListToSeatMap(inputs_point);
  }
  if(!inputs_score || inputs_score?.length == 0) {
    inputs_score = rootNode.querySelectorAll('.input-score');
    inputsMap_score = nodeListToSeatMap(inputs_score);
  }
  if(!radio_dealer || radio_dealer?.length == 0) {
    radio_dealer = rootNode.querySelectorAll('.input-dealer');
  }
  if(!inputs_riichi || inputs_riichi?.length == 0) {
    inputs_riichi = rootNode.querySelectorAll('.input-riichi');
    inputsMap_riichi = nodeListToSeatMap(inputs_riichi);
  }
  if(!input_kyotaku) input_kyotaku = rootNode.querySelector('#input_kyotaku');
  if(!input_tsumibo) input_tsumibo = rootNode.querySelector('#input_tsumibo');
}

function initDom() {
  ensureDom();

  for(const input of [...inputs_name, ...inputs_point, ...inputs_score]) {
    const field = input.dataset.field;
    const seat = input.dataset.seat;

    if(field === 'name') {
      input.addEventListener('change', (e) => setName(seat, e.target.value));
    } else if(field === 'point') {
      input.addEventListener('change', (e) => setPoint(seat, Number(e.target.value)));
    } else if(field === 'score') {
      input.addEventListener('change', (e) => setScore(seat, Number(e.target.value)));
    }
    input.addEventListener('focus', selectAllOnFocus);
  }

  // スタート時ポイントのリセットボタン
  rootNode.querySelector('#button_reset_point').addEventListener('click', () => SEAT_ORDER.forEach(seat => setPoint(seat, 0)));
  // 点棒のリセットボタン
  rootNode.querySelector('#button_reset_score').addEventListener('click', () => resetScore());
  // 暫定ポイントの計算ボタン
  rootNode.querySelector('#button_compute_tentative').addEventListener('click', () => computeTentativePoint());

  // 親番設定のラジオボタン
  initDealerRadio();
  // リーチのチェックボックス
  initRiichiCheck();
  // 供託の入力ボックスとその付属ボタン
  initInputKyotaku();
  // 積み棒の入力ボックスとその付属ボタン
  initInputTsumibo();
  // オーラスのチェックボックス
  rootNode.querySelector('#input_finalRound').addEventListener('change', e => state.tableInfo.finalRound = toBoolean(e.target.checked));

}


function initDealerRadio() {
  ensureDom();
  for(const radio of radio_dealer) {
    radio.addEventListener('change', e => state.tableInfo.dealer = e.target.value);
  }
}

function initRiichiCheck() {
  ensureDom();
  for(const input of inputs_riichi) {
    const seat = input.dataset.seat;
    input.addEventListener('change', e => setRiichi(seat, toBoolean(e.target.checked)));
  }
  const resetButton = rootNode.querySelector('#button_reset_riichi');
  resetButton.addEventListener('click', () => SEAT_ORDER.forEach(seat => setRiichi(seat, false)));
}

function initInputKyotaku() {
  ensureDom();
  input_kyotaku.addEventListener('input', e => setKyotaku(Number(e.target.value)));
  input_kyotaku.addEventListener('focus', selectAllOnFocus);
  const incButton = rootNode.querySelector('#button_increment_kyotaku');
  const resetButton = rootNode.querySelector('#button_reset_kyotaku');
  incButton.addEventListener('click', () => incrementKyotaku());
  resetButton.addEventListener('click', () => setKyotaku(0));
}

function initInputTsumibo() {
  ensureDom();
  input_tsumibo.addEventListener('input', e => setTsumibo(Number(e.target.value)));
  input_tsumibo.addEventListener('focus', selectAllOnFocus);
  const incButton = rootNode.querySelector('#button_increment_tsumibo');
  const resetButton = rootNode.querySelector('#button_reset_tsumibo');
  incButton.addEventListener('click', () => incrementTsumibo());
  resetButton.addEventListener('click', () => setTsumibo(0));
}



/**
 * @template {HTMLElement} T
 * @param {NodeListOf<T>} nodeList 
 * @returns {import("../seat-map/index.js").SeatMap<T>}
 */
function nodeListToSeatMap(nodeList){
  return SeatMap.fromEntries([...nodeList].map(node => [node.dataset?.seat, node]));
}



/**
 * 
 * @param {import("../seatUtilities").Seat} seat  seat("e", "s", "w", "n"のいずれか)
 * @param {string} value 新しい値
 * @returns {string} 変更後の値
 */
function setName(seat, value) {
  ensureDom();
  value = String(value);
  inputsMap_name[seat].value = value;
  state.players[seat].name = value;
  // 条件表示セルに名前を表示する
  for(const span of collectionMapOfTargetName[seat]) {
    span.textContent = value ? value : seatToJp(seat)  +'家';
  }
  return value;
}


/**
 * 
 * @param {import("../seatUtilities").Seat} seat  seat("e", "s", "w", "n"のいずれか) 
 * @param {number} value 新しい値
 * @returns {number} 変更後の値
 */
function setPoint(seat, value) {
  ensureDom();
  value = Number(value);
  // 表示上は小数表示として、整数の場合は".0"を付与する
  inputsMap_point[seat].value = Number.isNaN(value) ? '' : Number.isInteger(value) ? value.toFixed(1) : value;
  // ポイントは内部では1000倍して点棒とスケールを合わせ、整数で保持する
  state.players[seat].point = value * 1000;
  // ポイントが変化した場合、Totalが変化するため、再計算
  computeTentativePoint();
  return value;
}


/**
 * 
 * @param {import("../seatUtilities").Seat} seat seat("e", "s", "w", "n"のいずれか)
 * @param {number} value 新しい値
 * @returns {number} 変更後の値
 */
function setScore(seat, value) {
  ensureDom();
  value = Number(value);
  inputsMap_score[seat].value = Number.isNaN(value) ? '' : value;
  state.players[seat].score = value;
  // 1者の点棒が変化すると、暫定ポイントが意味をなさなくなるため、隠す
  if(state.showTentative) {
    hideTentativePoint();
  }
  return value;
}

function setRiichi(seat, value) {
  ensureDom();
  value = toBoolean(value);
  inputsMap_riichi[seat].checked = value;
  state.players[seat].riichi = value;
  state.riichi[seat] = value;
  return value;
}

/**
 * 
 * @param {number} value 
 * @returns {number}
 */
export function setKyotaku(value) {
  ensureDom();
  value = Number(value);
  input_kyotaku.value = Number.isNaN(value) ? '' : value;
  state.tableInfo.kyotaku = value;
  return value;
}

/**
 * 
 * @returns {number}
 */
export function incrementKyotaku() {
  const prev = state.tableInfo.kyotaku;
  return setKyotaku(prev + 1);
}


/**
 * 
 * @param {number} value 
 * @returns {number}
 */
export function setTsumibo(value) {
  ensureDom();
  value = Number(value);
  input_tsumibo.value = Number.isNaN(value) ? '' : value;
  state.tableInfo.tsumibo = value;
  return value;
}

/**
 * 
 * @returns {number} 変更後の値
 */
export function incrementTsumibo() {
  const prev = state.tableInfo.tsumibo;
  return setTsumibo(prev + 1);
}


/**
 * 
 * @returns {number} 新しい点棒の値
 */
export async function resetScore() {
  ensureDom();
  return promise_tab2.then(() => {
    /** @type {number} */
    const value = state.rule[Rule.KEY.INITIAL_SCORE];
    SEAT_ORDER.forEach(seat => {
      setScore(seat, value);
    });
    return value;
  });
}


/**
 * 
 */
export function expandTable() {
  rootNode.querySelector('#tbody_tentative').classList.remove('hide');
  rootNode.querySelector('#tbody_result').classList.remove('hide');
}


const td_tentative_game = rootNode.getElementsByClassName('td-tentative-game-point');
const td_tentative_total = rootNode.getElementsByClassName('td-tentative-total-point');

/**
 * 入力値から、暫定のポイントを計算して表示する。
 */
export function computeTentativePoint() {
  /** @type {import('../seat-map').SeatMap<number>} */
  const scoreMap = SeatMap.unwrapValueFromObject(state.players, 'score');
  const ranking = GameCalc.getRankingPointMap(scoreMap, state.rule, { wrap: true, rankingMap: true });
  const pointMap = SeatMap.create(seat => {
    const gamePoint = scoreMap[seat] - state.rule[Rule.KEY.RETURN_SCORE] + ranking[seat].rankingPoint;
    /** @type {number} */
    const gameRank = ranking[seat].rank;
    const totalPoint = state.players[seat].point + gamePoint;
    return { gamePoint, gameRank, totalPoint };
  });


  for(const td of td_tentative_game) {
    // GamePointとRank

    /** @type {import("../seat-utilities/index.js").Seat} */
    const seat = td.dataset.seat;
    /**
     * 暫定ゲームポイントセルへ適用するテンプレートを取得
     * @type {HTMLTemplateElement} */
    const template = rootNode.querySelector('#template-tentative-game-point');
    const node = template.content.cloneNode(true);

    // 1"st", 2"nd", 3"rd", 4"th"をつける
    node.querySelector('.rank').textContent = ordinal(pointMap[seat].gameRank);
    // 表示する際に内部の点棒スケールから1000で割り、フォーマットを整える
    node.querySelector('.point').textContent = formatPoints(pointMap[seat].gamePoint / 1000, 1, 2);

    td.textContent = "";
    td.appendChild(node);
  }

  for(const td of td_tentative_total) {
    // TotalPoint
    /** セルに相当する席
     * @type {import("../seat-utilities/index.js").Seat}
     * */
    const seat = td.dataset.seat;
    /**
     * 暫定トータルセルへ適用するテンプレートを取得
     * @type {HTMLTemplateElement} 
     */
    const template = rootNode.querySelector('#template-tentative-total-point');
    const node = template.content.cloneNode(true);

    // 表示する際に内部の点棒スケールから1000で割り、フォーマットを整える
    node.querySelector('.point').textContent = formatPoints(pointMap[seat].totalPoint / 1000, 1, 2);

    td.textContent = "";
    td.appendChild(node);
  }

  return state.showTentative = true;
}

export function hideTentativePoint() {
  for(const td of [...td_tentative_game, ...td_tentative_total]) {
    td.textContent = "(計算前)";
  }
  return state.showTentative = false;
}



export function zeroSumScoreCheck() {
  try {
    const checkResult = helperForZeroSumScoreCheck();
    // 点棒を短縮表記した場合に、100倍または1000倍した値をセットし直す
    SEAT_ORDER.forEach(seat => setScore(seat, state.players[seat].score * checkResult));
  } catch (e) {
    if(e instanceof ZeroSumScoreError) {
      confirm('あ');
    } else {
      // 予期しないエラー
      throw e;
    }
  }
}

function helperForZeroSumScoreCheck() {
  // 23400 | 234 | 23.4 いずれの書き方にも対応するため、
  const expected = state.rule[Rule.KEY.INITIAL_SCORE] * 4;
  const multipliers = [1, 100, 1000];
  const errors = [];
  for(const multiplier of multipliers) {
    // 点棒の合計+供託*1000 = 配給原点*4
    const sum = SeatMap.reduce(state.players, (acc, obj) => acc + obj.score, 0) * multiplier + state.tableInfo.kyotaku * 1000;
    if(sum === expected) return multiplier;
    errors.push({ multiplier, sum, expected, error: Math.abs(expected - sum) });
  }


  // 1倍, 100倍, 1000倍いずれも合計が合わなかったとき
  const minimum = errors.reduce((a, b) => a.error < b.error ? a : b);

  
  throw new ZeroSumScoreError('点棒合計が一致しません。', {
    errors, initialScore: state.rule[Rule.KEY.INITIAL_SCORE]
  });

}

class ZeroSumScoreError extends Error {
  constructor(message, option) {
    super(message);
    this.option = option;
  }
}
