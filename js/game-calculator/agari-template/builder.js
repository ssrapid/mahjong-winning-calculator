import * as Rule from '../../rule/index.js'

import data from "./data.json" with { type: "json" };

export function get() {
  return structuredClone(data);
}
