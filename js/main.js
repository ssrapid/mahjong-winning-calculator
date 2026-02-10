/**
 * main.js
 */


import { insertHTML, loadTextFile } from "./ui/html-loader.js";
import { setupCalculateButton } from "./ui/calculate-button.js";
import { resetScore } from "./ui/tabpanel-main.js";

import tabPanel_main from "./ui/tabpanel-main.js";
import tabPanel_rule from "./ui/tabpanel-rule.js";

// import * as SeatUtilities from './seat-utilities/index.js'
import { getTsumoAgariTemplates, getRonAgariTemplates } from "./game-calculator/agari-template/builder.js";
import * as Rule from './rule/index.js'
import { initDetailModal } from "./ui/detail.js";

// import { state } from "./state.js"

/**
 * @type {Promise<HTMLElement>}
 */
export const promise_tab1 = insertHTML(
  document.getElementById("tab__panel-main"),
  "tabpanels/main.html"
).then(async panel => {
  const root = panel.querySelector("#main-table-root");
  // await insertHTML(root, "tabpanels/mainTable.html");
  tabPanel_main(panel);
  return panel;
});

export const promise_tab2 = insertHTML(
  document.getElementById("tab__panel-rule"),
  "tabpanels/rule.html"
).then (panel => {
  tabPanel_rule(panel);
  return panel;
});

export const promise_tab3 = insertHTML(
  document.getElementById("tab__panel-advanced"),
  "tabpanels/advanced.html"
)


export const promise_detailModal = loadTextFile(
  "detail.html"
).then (html => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const dialog = doc.querySelector('dialog');

  document.body.appendChild(dialog);
  initDetailModal(dialog);
  return dialog;
});



function main() {



  // 計算ボタンの有効化は各タブを読み込んだ後に実行する
  Promise.all([promise_tab1, promise_tab2]).then(() => {
    resetScore();
    setupCalculateButton();

  }).catch(err => {
    console.error("Promise.all failed:", err);
  });

}

main();