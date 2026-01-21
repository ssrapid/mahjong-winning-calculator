import { createSeatMap } from "./seatUtilities.js";

export const state = {

  /**
   * @type {import("./seatMap.js").seatMap<string|null>}
   */
  name: createSeatMap(),


  /**
   * 
   */
  players: createSeatMap(() => ({
    /** @type {string} */
    name: null,
    /** @type {number} */
    point: null,
    /** @type {number} */
    score: null
  })),


  /**
   * @type {import("./ruleDef.js").RULE_ID} 
   */
  baseRule: null,

  /**
   * ルールオブジェクト
   * @type {import("./ruleDef.js").RuleObject}
   */
  rule : null
  
}

window.__state__ = state;
