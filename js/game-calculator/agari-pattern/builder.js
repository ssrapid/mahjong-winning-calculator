import { create } from "./create.js";
import { resolve } from "./resolve.js";

export function build(playersInfo, tableInfo, ruleObj) {
  const patternCollection = create(playersInfo, tableInfo, ruleObj);
  resolve(patternCollection);

  return patternCollection;
}
