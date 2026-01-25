/**
 * main.js
 */


import { insertHTML } from "./ui/html-loader.js";
import { setupCalculateButton } from "./ui/calculateButton.js";
import { resetScore } from "./ui/tabpanel-main.js";

import tabPanel_main from "./ui/tabpanel-main.js";
import tabPanel_rule from "./ui/tabpanel-rule.js";

// import * as SeatUtilities from './seat-utilities/index.js'
import { getTsumoAgariTemplates, getRonAgariTemplates } from "./game-calculator/agari-template/builder.js";
import * as Rule from './rule/index.js'

// import { state } from "./state.js"

/**
 * @type {Promise<HTMLElement>}
 */
export const promise_tab1 = insertHTML(
  document.getElementById("tab__panel-main"),
  "tabpanels/main.html"
).then(async panel => {
  const root = panel.querySelector("#main-table-root");
  await insertHTML(root, "tabpanels/mainTable.html");
  tabPanel_main(root);
  return panel;
});

export const promise_tab2 = insertHTML(
  document.getElementById("tab__panel-rule"),
  "tabpanels/rule.html"
).then (panel => {
  tabPanel_rule(panel);
  return panel;
});





function main() {



  // 計算ボタンの有効化は各タブを読み込んだ後に実行する
  Promise.all([promise_tab1, promise_tab2]).then(() => {
    resetScore();
    setupCalculateButton();
    console.log(getTsumoAgariTemplates(Rule.getRulePreset(Rule.RULE_IDS.JPML)));
    console.log(getRonAgariTemplates(Rule.getRulePreset(Rule.RULE_IDS.JPML)));
  })

}

main();