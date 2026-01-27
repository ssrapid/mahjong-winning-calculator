import { create } from "./create.js";

export function build(playersInfo, tableInfo, ruleObj) {
  const patternCollection = create(playersInfo, tableInfo, ruleObj);


  return patternCollection;
}
