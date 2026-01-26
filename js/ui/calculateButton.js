import { loadTextFile } from "./html-loader.js";
import { promise_tab1 } from "../main.js";
import { expandTable, showTentativePoint, zeroSumScoreCheck } from "./tabpanel-main.js";



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
  console.log('計算');
  zeroSumScoreCheck();
  expandTable();
  showTentativePoint();

}

