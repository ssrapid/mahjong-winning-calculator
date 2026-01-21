import { state } from "../main.js";
import { setSelectOptions, selectAllOnFocus } from "./common.js";
import { toBoolean } from "../myUtilities.js";

import { RULE_IDS, RULE_KEY, TIE_SCORE_RULE, TIE_SCORE_RULE_OPTIONS, KYOTAKU_SETTLEMENT_TYPE, KYOTAKU_SETTLEMENT_OPTIONS, RENCHAN_RULE, RENCHAN_RULE_OPTIONS } from "../ruleDef.js";
import { getBaseRuleOptions, getRulePreset } from "../ruleLoader.js";


/** @type {HTMLElement|Document} */
let rootElement = document;

/** ベースルールのセレクトボックス @type {HTMLSelectElement} */
let select_baseRule;

/** @type {HTMLInputElement} */
let input_rule_initialScore;

/** @type {HTMLInputElement} */
let input_rule_returnScore;

/** 順位点の入力ボックス(全て) @type {HTMLCollectionOf<HTMLInputElement>} */
let inputs_rankingPoints_all;

/** 順位点の入力ボックス(共通) @type {HTMLCollectionOf<HTMLInputElement>} */
let inputs_rankingPoints_common;

/** 順位点の入力ボックス(JPML用) @type {HTMLCollectionOf<HTMLInputElement>} */
let inputs_rankingPoints_for_jpml;

/** 浮き人数ラベル @type {HTMLCollectionOf<HTMLSpanElement>} */
let spans_rowindexOfRankingPoints;

/** テンパイ料 @type {HTMLInputElement} */
let input_rule_tenpaiFee;

/** 切り上げ満貫のセレクトボックス @type {HTMLSelectElement} */
let select_rule_roundingMangan;

/** トビ終了のセレクトボックス @type {HTMLSelectElement} */
let select_rule_allowGameEndByNegative;

/** アガリやめのセレクトボックス @type {HTMLSelectElement} */
let select_rule_endOnAWin;

/** テンパイやめのセレクトボックス @type {HTMLSelectElement} */
let select_rule_endOnATenpai;

/** 連荘条件 @type {HTMLSelectElement} */
let select_rule_renchanRule;

// 未実装(実装予定なし)
// /** 連風牌の雀頭(2符or4符) @type {HTMLSelectElement} */
// let select_rule_doubleWindHead;

/** 同点時の順位 @type {HTMLSelectElement} */
let select_rule_tieScoreRule;

/** 終局時の供託 @type {HTMLSelectElement} */
let select_rule_kyotakuSettlement;

/** 積み棒の加算 @type {HTMLSelectElement} */
let select_rule_incrementTsumibo;

/** 西入 @type {HTMLSelectElement} */
let select_rule_allowWestRound;

/** トップ必要点数 @type {HTMLSelectElement} */
let input_rule_minimumTopScore;

/** 最大点数 @type {HTMLSelectElement} */
let select_rule_maxYakumanLimit;


/**
 *
 * @param {HTMLElement} root HTMLの親ノード
 */
export default function activate(root) {
  rootElement = root;
  ensureDom();
  initDom();

  setBaseRule(RULE_IDS.M_LEAGUE);
  expandPresetValues();
}

/**
 * このモジュールの変数の初期化をする。
 */
function ensureDom(){
  if(!select_baseRule)
    select_baseRule = rootElement.querySelector('#select_baseRule');

  if(!input_rule_initialScore)
    input_rule_initialScore = rootElement.querySelector('#input_rule_initialScore');

  if(!input_rule_returnScore)
    input_rule_returnScore = rootElement.querySelector('#input_rule_returnScore');

  if(!inputs_rankingPoints_all || inputs_rankingPoints_all?.length === 0)
    inputs_rankingPoints_all = rootElement.querySelectorAll('.input-ranking-point');

  if(!inputs_rankingPoints_common || inputs_rankingPoints_common?.length === 0)
    inputs_rankingPoints_common = rootElement.querySelectorAll('.input-ranking-point-for-common');

  if(!inputs_rankingPoints_for_jpml || inputs_rankingPoints_for_jpml?.length === 0)
    inputs_rankingPoints_for_jpml = rootElement.querySelectorAll('.input-ranking-point-for-jpml');

  if (!spans_rowindexOfRankingPoints || spans_rowindexOfRankingPoints?.length === 0)
    spans_rowindexOfRankingPoints = rootElement.querySelectorAll('.ranking-rowlabel');

  if(!input_rule_tenpaiFee)
    input_rule_tenpaiFee = rootElement.querySelector('#input_rule_tenpaiFee');

  if(!select_rule_roundingMangan)
    select_rule_roundingMangan = rootElement.querySelector('#select_rule_roundingMangan');

  if(!select_rule_allowGameEndByNegative)
    select_rule_allowGameEndByNegative = rootElement.querySelector('#select_rule_allowGameEndByNegative');

  if(!select_rule_endOnAWin)
    select_rule_endOnAWin = rootElement.querySelector('#select_rule_endOnAWin');

  if(!select_rule_endOnATenpai)
    select_rule_endOnATenpai = rootElement.querySelector('#select_rule_endOnATenpai');

  if(!select_rule_allowWestRound)
    select_rule_allowWestRound = rootElement.querySelector('#select_rule_allowWestRound');

  if(!input_rule_minimumTopScore)
    input_rule_minimumTopScore = rootElement.querySelector('#input_rule_minimumTopScore');

  if(!select_rule_tieScoreRule)
    select_rule_tieScoreRule = rootElement.querySelector('#select_rule_tieScoreRule');

  if(!select_rule_kyotakuSettlement)
    select_rule_kyotakuSettlement = rootElement.querySelector('#select_rule_kyotakuSettlement');

  if(!select_rule_renchanRule)
    select_rule_renchanRule = rootElement.querySelector('#select_rule_renchanRule');

  if(!select_rule_incrementTsumibo)
    select_rule_incrementTsumibo = rootElement.querySelector('#select_rule_incrementTsumibo');

  if(!select_rule_maxYakumanLimit)
    select_rule_maxYakumanLimit = rootElement.querySelector('#select_rule_maxYakumanLimit');
}


function initDom() {
  initBaseRule();
  input_rule_initialScore.addEventListener('input', e => setInitialScore(Number(e.target.value)));
  input_rule_returnScore.addEventListener('input', e => setReturnScore(Number(e.target.value)));
  initInputOfRankingPoints();
  input_rule_tenpaiFee.addEventListener('input', (e) => setTenpaiFee(Number(e.target.value)));
  select_rule_roundingMangan.addEventListener('change', (e) => setRoundingMangan(toBoolean(e.target.value)));
  select_rule_allowGameEndByNegative.addEventListener('change', (e) => setAllowGameEndByNegative(toBoolean(e.target.value)));
  select_rule_endOnAWin.addEventListener('change', (e) => setEndOnAWin(toBoolean(e.target.value)));
  select_rule_endOnATenpai.addEventListener('change', (e) => setEndOnATenpai(toBoolean(e.target.value)));

  select_rule_allowWestRound.addEventListener('change', (e) => setAllowWestRound(toBoolean(e.target.value)));
  input_rule_minimumTopScore.addEventListener('input', (e) => setMinimumTopScore(Number(e.target.value)));
  initSelectOfTieScoreRule();
  initSelectOfKyotakuSettlement();
  initSelectOfRenchanRule();
  select_rule_incrementTsumibo.addEventListener('change', (e) => setIncrementTsumibo(toBoolean(e.target.value)));
  select_rule_maxYakumanLimit.addEventListener('change', (e) => setMaxYakumanLimit(Number(e.target.value)));

  addFocusEvent();

}


/**
 * ベースルールのセレクトボックスの初期化
 */
function initBaseRule () {
  ensureDom();

  setSelectOptions(select_baseRule, getBaseRuleOptions());
  select_baseRule.addEventListener('change', e => setBaseRule(e.target.value));
}



/**
 * ベースルール選択用の <select> 要素に値をセットし、実際に設定された値を返す。
 * DOM取得は初回呼び出し時に行い、以降はキャッシュされる。
 *
 * @param {string} ruleId - 設定するベースルールID（option.value）
 * @returns {string} 実際に <select> に設定された値
 */
export function setBaseRule(ruleId){
  ensureDom();

  select_baseRule.value = ruleId;
  const curValue = select_baseRule.value;
  state.baseRule = curValue;

  // '1人浮き'などのラベルをグレーアウトさせる/グレーアウトから復帰する
  for(const el of spans_rowindexOfRankingPoints) {
    if (curValue === RULE_IDS.JPML) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  }

  //
  for (const input of inputs_rankingPoints_for_jpml) {
    input.disabled = curValue !== RULE_IDS.JPML;
  }

  expandPresetValues();

  return curValue;
};


function initInputOfRankingPoints() {

  for(const input of inputs_rankingPoints_common) {
    // 共通ボックス用
    function factoryForCommon(ranking, floatingCount) {
      ranking = Number(ranking);
      floatingCount = Number(floatingCount);
      /**
       * @param {Event} e
       */
      function listener(e){
        const value = Number(e.target.value);
        if(state.baseRule === RULE_IDS.JPML) {
          state.rule[RULE_KEY.RANKING_POINTS][floatingCount][ranking-1] = value;
        } else {
          state.rule[RULE_KEY.RANKING_POINTS][ranking-1] = value;
        }
      };
      return listener;
    }

    const input_data_rank = input.dataset.ranking;
    const input_data_floatingCount = input.dataset.floatingCount;
    input.addEventListener('input', factoryForCommon(Number(input_data_rank), Number(input_data_floatingCount)));
  }
  for (const input of inputs_rankingPoints_for_jpml) {
    // JPML向けボックス用
    function factoryForJpml(ranking, floatingCount) {
      ranking = Number(ranking);
      floatingCount = Number(floatingCount);
      /**
       * @param {Event} e
       */
      function listener(e){
        const value = Number(e.target.value);
        if(state.baseRule === RULE_IDS.JPML) {
          state.rule[RULE_KEY.RANKING_POINTS][floatingCount][ranking-1] = value;
        }
      };
      return listener;
    }

    const input_data_rank = input.dataset.ranking;
    const input_data_floatingCount = input.dataset.floatingCount;
    input.addEventListener('input', factoryForJpml(Number(input_data_rank), Number(input_data_floatingCount)));
  }
}


/**
 * 配給原点を変更する。stateも同時に変化する。
 * @param {number} value 新しい値
 * @returns {number} 変更後の値
 */
export function setInitialScore(value) {
  ensureDom();
  value = Number(value);
  input_rule_initialScore.value = Number.isNaN(value) ? '' : value;
  state.rule[RULE_KEY.INITIAL_SCORE] = value;
  return value;
}

/**
 * 返し点を変更する。stateも同時に変化する。
 * @param {number} value 新しい値
 * @returns {number} 変更後の値
 */
export function setReturnScore(value) {
  ensureDom();
  value = Number(value);
  input_rule_returnScore.value = Number.isNaN(value) ? '' : value;
  state.rule[RULE_KEY.RETURN_SCORE] = value;
  return input_rule_returnScore.value;
}

/**
 *
 * @param {import("../ruleDef.js").RankingPointsDef} rankingPoints
 */
export function setRankingPoints(rankingPoints) {
  ensureDom();

  state.rule[RULE_KEY.RANKING_POINTS] = rankingPoints;

  if(Array.isArray(rankingPoints)) {
    // RankingPointsArrayの場合
    for(const input of inputs_rankingPoints_common) {
      const ranking = Number(input.dataset.ranking);
      const value = rankingPoints[ranking - 1];
      input.value = value;
    }
    for(const input of inputs_rankingPoints_for_jpml) {
      input.value = "";
    }
  } else if(typeof rankingPoints === 'object') {
    // RankingPointsForJPMLの場合
    for(const input of inputs_rankingPoints_all) {
      const floatingCount = Number(input.dataset.floatingCount);
      const ranking = Number(input.dataset.ranking);
      const value = rankingPoints[floatingCount][ranking - 1];
      input.value = value;
    }
  } else {
    throw new Error(`rankingPointsの型が不正です。`);
  }
}

export function setTenpaiFee(value) {
  ensureDom();
  value = Number(value);
  input_rule_tenpaiFee.value = Number.isNaN(value) ? '' : value;
  state.rule[RULE_KEY.TENPAI_FEE] = value;
  return value;
}

export function setRoundingMangan(value) {
  ensureDom();
  value = toBoolean(value);
  select_rule_roundingMangan.value = value;
  state.rule[RULE_KEY.ROUNDING_MANGAN] = value;
  return value;
}

export function setAllowGameEndByNegative(value) {
  ensureDom();
  value = toBoolean(value);
  select_rule_allowGameEndByNegative.value = value;
  state.rule[RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] = value;
  return value;
}

export function setEndOnAWin(value) {
  ensureDom();
  value = toBoolean(value);
  select_rule_endOnAWin.value = value;
  state.rule[RULE_KEY.END_ON_A_WIN] = value;
  return value;
}

export function setEndOnATenpai(value) {
  ensureDom();
  value = toBoolean(value);
  select_rule_endOnATenpai.value = toBoolean(value);
  state.rule[RULE_KEY.END_ON_A_TENPAI] = value;
  return value;
}

/**
 *
 * @param {boolean} value
 * @returns {boolean}
 */
function setAllowWestRound(value) {
  ensureDom();
  value = toBoolean(value);
  select_rule_allowWestRound.value = value;
  state.rule[RULE_KEY.ALLOW_WEST_ROUND] = value;
  activateInputOfMinimumTopScore();
  return value;
}

/**
 * stateによってトップ必要点数入力ボックスの入力可否を切り替える
 */
function activateInputOfMinimumTopScore() {
  ensureDom();
  input_rule_minimumTopScore.disabled = !state.rule[RULE_KEY.ALLOW_WEST_ROUND];
}

function setMinimumTopScore(value) {
  ensureDom();
  value = Number(value);
  input_rule_minimumTopScore.value = Number.isNaN(value) ? '' : value;
  state.rule[RULE_KEY.MINIMUN_TOP_SCORE] = value;
  return value;
}

function setTieScoreRule(value) {
  ensureDom();
  if(Object.values(TIE_SCORE_RULE).includes(value)) {
    select_rule_tieScoreRule.value = value;
    state.rule[RULE_KEY.TIE_SCORE_RULE] = value;
  } else {
    // 誤った値を与えたときは、警告を発して現在の値を返す。
    console.warn(`"${value}" is not included in TIE_SCORE_RULE.`);
    return state.rule[RULE_KEY.TIE_SCORE_RULE];
  }

  // 同点時の順位を席順で決定する場合、終局時供託の同点トップ者山分けを選択不可
  // 該当ノードを探索
  const option_top_shared = select_rule_kyotakuSettlement.querySelector(`option[value="${KYOTAKU_SETTLEMENT_TYPE.TOP_SHARED}"]`);
  if(value === TIE_SCORE_RULE.SEAT_ORDER) {
    // disabledを指定
    option_top_shared.disabled = true;
    // すでに選択されている場合は、上家取りに変更
    if(state.rule[RULE_KEY.KYOTAKU_SETTLEMENT] === KYOTAKU_SETTLEMENT_TYPE.TOP_SHARED) {
      setKyotakuSettlement(KYOTAKU_SETTLEMENT_TYPE.TOP_ONLY_SEAT);
    }
  } else {
    // disabledを解除
    option_top_shared.disabled = false;
  }

  return value;
}

function setKyotakuSettlement(value) {
  ensureDom();
  if(Object.values(KYOTAKU_SETTLEMENT_TYPE).includes(value)) {
    select_rule_kyotakuSettlement.value = value;
    state.rule[RULE_KEY.KYOTAKU_SETTLEMENT] = value;
  } else {
    // 誤った値を与えたときは、警告を発して現在の値を返す。
    console.warn(`"${value}" is not included in KYOTAKU_SETTLEMENT_TYPE.`);
    return state.rule[RULE_KEY.KYOTAKU_SETTLEMENT];
  }
  return value;
}

function initSelectOfTieScoreRule() {
  ensureDom();
  setSelectOptions(select_rule_tieScoreRule, TIE_SCORE_RULE_OPTIONS);
  select_rule_tieScoreRule.addEventListener('change', (e) => setTieScoreRule(e.target.value));
}

function initSelectOfKyotakuSettlement() {
  ensureDom();
  setSelectOptions(select_rule_kyotakuSettlement, KYOTAKU_SETTLEMENT_OPTIONS);
  select_rule_kyotakuSettlement.addEventListener('change', (e) => setKyotakuSettlement(e.target.value));
}

function initSelectOfRenchanRule(){
  ensureDom();
  setSelectOptions(select_rule_renchanRule, RENCHAN_RULE_OPTIONS);
  select_rule_renchanRule.addEventListener('change', (e) => setRenchanRule(e.target.value));
}


/**
 *
 * @param {import("../ruleDef.js").RENCHAN_RULE_TYPE} value
 * @returns {import("../ruleDef.js").RENCHAN_RULE_TYPE}
 */
export function setRenchanRule(value) {
  ensureDom();
  if(Object.values(RENCHAN_RULE).includes(value)) {
    select_rule_renchanRule.value = value;
    state.rule[RULE_KEY.RENCHAN_RULE] = value;
  } else {
    console.warn(`"${value}" is not included in RENCHAN_RULE.`);
    return state.rule[RULE_KEY.RENCHAN_RULE];
  }
  return value;
}

/**
 *
 * @param {boolean} value
 * @returns {boolean}
 */
export function setIncrementTsumibo(value) {
  ensureDom();
  value = toBoolean(value);
  select_rule_incrementTsumibo.value = value;
  state.rule[RULE_KEY.INCREMENT_TSUMIBO] = value;
  return value;
}



/**
 *
 * @param {number} value
 * @returns {number} 変更後の値
 */
export function setMaxYakumanLimit(value) {
  ensureDom();
  value = Number(value);
  select_rule_maxYakumanLimit.value = Number.isNaN(value) ? '' : value;
  state.rule[RULE_KEY.MAX_YAKUMAN_LIMIT] = value;
  return value;
}

function expandPresetValues() {
  ensureDom();

  const selectValue = select_baseRule.value;
  const preset = getRulePreset(selectValue);
  state.rule = structuredClone(preset);

  setInitialScore(preset[RULE_KEY.INITIAL_SCORE]);
  setReturnScore(preset[RULE_KEY.RETURN_SCORE]);
  setRankingPoints(preset[RULE_KEY.RANKING_POINTS]);
  setTenpaiFee(preset[RULE_KEY.TENPAI_FEE]);
  setRoundingMangan(preset[RULE_KEY.ROUNDING_MANGAN]);
  setAllowGameEndByNegative(preset[RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE]);
  setEndOnAWin(preset[RULE_KEY.END_ON_A_WIN]);
  setEndOnATenpai(preset[RULE_KEY.END_ON_A_TENPAI]);
  setAllowWestRound(preset[RULE_KEY.ALLOW_WEST_ROUND]);
  setMinimumTopScore(preset[RULE_KEY.MINIMUN_TOP_SCORE]);
  setTieScoreRule(preset[RULE_KEY.TIE_SCORE_RULE]);
  setKyotakuSettlement(preset[RULE_KEY.KYOTAKU_SETTLEMENT]);
  setRenchanRule(preset[RULE_KEY.RENCHAN_RULE]);
  setIncrementTsumibo(preset[RULE_KEY.INCREMENT_TSUMIBO]);
  setMaxYakumanLimit(preset[RULE_KEY.MAX_YAKUMAN_LIMIT]);
};


/**
 *
 */
function addFocusEvent() {
  ensureDom();

  for(const input of [input_rule_initialScore, input_rule_returnScore, ...inputs_rankingPoints_all, input_rule_tenpaiFee, input_rule_minimumTopScore]) {
    input.addEventListener('focus', selectAllOnFocus);
  }
}
