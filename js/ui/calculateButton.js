import { loadTextFile } from "./html-loader.js";
import { promise_tab1 } from "../main.js";
import { expandTable, computeTentativePoint, zeroSumScoreCheck } from "./tabpanel-main.js";
import * as GameCalculator from '../game-calculator/index.js'
import { state } from '../state.js';
import * as SeatMap from '../seat-map/index.js'

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
function calculateButtonHandler() {
  zeroSumScoreCheck();
  expandTable();
  computeTentativePoint();
  const players = structuredClone(state.players);
  SeatMap.forEach((obj, riichi) => obj.riichi = riichi, players, state.riichi);
  console.log(GameCalculator.AgariPattern.build(players, state.tableInfo, state.rule));
  

}

