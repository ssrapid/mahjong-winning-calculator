import { loadHTML } from "./ui/htmlLoader.js";
import { buildMainTable } from "./ui/buildMainTable.js";
import { setupCalculateButton } from "./ui/calculateButton.js";
import tabPanel_main from "./ui/tabPanel__main.js";
import tabPanel_rule from "./ui/tabPanel__rule.js";

export { state } from "./state.js"



function main() {
  const promise_tab1 = loadHTML(
    document.getElementById("tab__panel-main"),
    "tabpanels/main.html"
  ).then (panel => {
    const root = panel.querySelector("#main-table-root");
    // buildMainTable(root);
    loadHTML(root, "tabpanels/mainTable.html");
    return {panel, root};
  }).then (({panel, root}) => {
    tabPanel_main(root);
    return panel;
  });

  const promise_tab2 = loadHTML(
    document.getElementById("tab__panel-rule"),
    "tabpanels/rule.html"
  ).then (panel => {
    tabPanel_rule(panel);
    return panel;
  });

  // 計算ボタンの有効化は各タブを読み込んだ後に実行する
  Promise.all([promise_tab1, promise_tab2]).then(() => {
    setupCalculateButton();
  })

}

main();