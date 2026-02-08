import { loadTextFile } from "./html-loader.js";
import { promise_tab1 } from "../main.js";
import { expandTable, computeTentativePoint, scoreSumCheck, reflectName } from "./tabpanel-main.js";
import * as GameCalculator from '../game-calculator/index.js'
import { state } from '../state.js';
import * as SeatMap from '../seat-map/index.js'
import { showSummary } from "./summary.js";

/**
 * 計算ボタンを有効化する関数
 */
export function setupCalculateButton() {
  const button = document.getElementById('button_calculate');
  button.addEventListener('click', calculateButtonHandler);
}

function calculateButtonHandler() {
  scoreSumCheck();
  computeTentativePoint();
  calculateCondition();
}


/**
 * 計算ボタンの押下時に呼び出す関数
 */
export function calculateCondition() {
  const playersInfo = structuredClone(state.players);
  const tableInfo = structuredClone(state.tableInfo);
  const ruleObj = structuredClone(state.rule);
  const conditions = Array.from(state.conditions.values());
  state.lastInput = { players: playersInfo, tableInfo, ruleObj, conditions };

  const result = GameCalculator.AgariPattern.build(
    playersInfo,
    tableInfo,
    ruleObj,
    conditions
  );

  // 計算結果をstateに保持
  state.result = result;
  // 計算済みフラグを立てる
  state.hasCalculated = true;

  expandTable();
  reflectName();
  showSummary();

  console.log(result);
  

}

