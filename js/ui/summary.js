import * as GameCalc from "../game-calculator/index.js";
import { state } from "../state.js";
import { expandTable, reflectName } from "./tabpanel-main.js";

/** @type {HTMLCollectionOf<HTMLTableCellElement>} */
const td_result = document.getElementsByClassName('td-result');

/** @type {HTMLCollectionOf<HTMLTableCellElement>} */
const td_tsumo = document.getElementsByClassName('td-result-tsumo');

/** @type {HTMLCollectionOf<HTMLTableCellElement>} */
const td_ron   = document.getElementsByClassName('td-result-ron');

/** @type {HTMLCollectionOf<HTMLTableCellElement>} */
const td_tenpai = document.getElementsByClassName('td-result-tenpai');

/** @type {HTMLCollectionOf<HTMLTableCellElement>} */
const td_noten = document.getElementsByClassName('td-result-noten');

/**
 * テンパイ料がないルール用の流局条件表示セル
 * @type {HTMLCollectionOf<HTMLTableCellElement>}
 */
const td_ryukyoku = document.getElementsByClassName('td-result-ryukyoku');



export function showSummary() {
  expandTable();
  reflectName();

  if(state.hasCalculated && state.selectedCondition) {
    showTsumoSummary();
    showRonSummary();
    showRyukyokuSummary();
  }
}


function showTsumoSummary() {
  const condition = state.selectedCondition;
  const agariType = GameCalc.AGARI_TYPE.TSUMO;
  for(const td of td_tsumo) {
    const seat = td.dataset.seat;
    const winner = td.dataset.winner;

    const summary = state.result.summaryGroup.getSummary({agariType,winner}, condition, seat);

    if(summary == null) {
      td.innerHTML = '計算エラー';
      td.classList.remove('fulfilled');
      continue;
    }

    const { text: summarytext, fulfilled } = summary;
    
    td.innerHTML = '<div class="condition-result">'
      + (fulfilled ? agariSummaryToHTML(summarytext): (summarytext ?? "-"))
      + '</div>';
    td.classList.toggle('fulfilled', fulfilled);
  }
}


function showRonSummary() {
  const condition = state.selectedCondition;
  const agariType = GameCalc.AGARI_TYPE.RON;
  for(const td of td_ron) {
    const seat = td.dataset.seat;
    const winner = td.dataset.winner;
    const discarder = td.dataset.discarder;

    const summary = state.result.summaryGroup.getSummary({agariType, winner, discarder}, condition, seat);

    if(summary == null) {
      td.innerHTML = '計算エラー';
      td.classList.remove('fulfilled');
      continue;
    }

    const { text: summarytext, fulfilled } = summary;

    td.innerHTML = '<div class="condition-result">'
      + (fulfilled ? agariSummaryToHTML(summarytext): (summarytext ?? '-'))
      + '</div>';
    td.classList.toggle('fulfilled', fulfilled);
  }
}


function showRyukyokuSummary() {
  const condition = state.selectedCondition;
  const agariType = GameCalc.AGARI_TYPE.RYUKYOKU;
  for(const td of td_ryukyoku) {
    const seat = td.dataset.seat;
    const tenpaiState = td.dataset.stateTenpai;

    const summaryGroup = state.result.summaryGroup;

    const summary = tenpaiState === "undefined" ?
      summaryGroup.getSummary({agariType}, condition, seat) :
      summaryGroup.getSummary({agariType, focus: seat, tenpai: tenpaiState === "tenpai"}, condition, seat);

    if(summary == null) {
      td.innerHTML = '計算エラー';
      td.classList.remove('fulfilled');
      continue;
    }

    const { text: summarytext, fulfilled } = summary;

    td.innerHTML = '<div class="condition-result">'+ summarytext + '</div>';
    td.classList.toggle('fulfilled', fulfilled);
  }
}


/**
 * 
 * @param {string} text 
 * @returns {string}
 */
function agariSummaryToHTML(text) {
  return text
    // 改行＋論理語
    .replace(/(または|および)/g, '<br><span class="result-logic">$1</span><br>')
    // value（ツモ対応）
    .replace(
      /(\d{1,3}(?:,\d{3})*(?:\/\d{1,3}(?:,\d{3})*)*(?:オール)?)/g,
      '<span class="result-value">$1</span>'
    )
    // 以上・以下・のみ
    .replace(/(以上|以下|のみ)/g, '<span class="result-op">$1</span>')
    // 不可は別枠
    .replace(/(不可)/g, '<span class="result-ng">$1</span>');
}
