import { loadTextFile } from "./html-loader.js";
import { promise_tab1 } from "../main.js";
import { expandTable, computeTentativePoint, zeroSumScoreCheck } from "./tabpanel-main.js";
import * as GameCalculator from '../game-calculator/index.js'
import { state } from '../state.js';
import * as SeatMap from '../seat-map/index.js'
import * as Condition from '../condition/index.js'
import { showSummary } from "./showsummary.js";

/**
 * 計算ボタンを有効化する関数
 */
export function setupCalculateButton() {
  const button = document.getElementById('button_calculate');
  button.addEventListener('click', calculateButtonHandler);
}


/**
 * 計算ボタンの押下時に呼び出す関数
 */
export function calculateButtonHandler() {
  zeroSumScoreCheck();
  expandTable();
  computeTentativePoint();
  const playersInfo = structuredClone(state.players);
  const tableInfo = structuredClone(state.tableInfo);
  const ruleObj = structuredClone(state.rule);
  const conditions = Array.from(state.conditions.values());

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

  showSummary();

  console.log(result);
  

}

