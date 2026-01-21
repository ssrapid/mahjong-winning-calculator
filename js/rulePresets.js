import { RULE_KEY } from "./ruleDef.js"

/**
 * @typedef {Object} presetRule
 * @property {number} order
 * @property {boolean} hidden
 * @property {import("./ruleDef.js").RuleObject} rule
 */

/**
 * @type {Record<string, presetRule>}
 */
export const rulePresets = {

  "m_league": {
    "order"                   : 10,
    "hidden"                  : false,
    "rule": {
      "name"                    : "Mリーグルール",
      "baseRule"                : "m_league",
      "initialScore"            : 25000,
      "returnScore"             : 30000,
      "rankingPoints"           : [50, 10, -10, -30],
      "tenpaiFee"               : 3000,
      "roundingMangan"          : true,
      "allowGameEndByNegative"  : false,
      "endOnAWin"               : false,
      "endOnATenpai"            : false,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 2,
      "tieScoreRule"            : "shared",
      "kyotakuSettlement"       : "top_shared",
      "incrementTsumibo"        : true,
      "allowWestRound"          : false,
      "maxYakumanLimit"         : 4
    }
  },

  "jpml": {
    "order"                   : 20,
    "hidden"                  : false,
    "rule": {
      "name"                    : "連盟公式ルール",
      "baseRule"                : "jpml",
      "initialScore"            : 30000,
      "returnScore"             : 30000,
      "rankingPoints"           :  {
                                    "1": [12, -1, -3,  -8],
                                    "2": [ 8,  4, -4,  -8],
                                    "3": [ 8,  3,  1, -12],
                                    "0": [ 8,  4, -4,  -8]
                                  },
      "tenpaiFee"               : 3000,
      "roundingMangan"          : false,
      "allowGameEndByNegative"  : false,
      "endOnAWin"               : false,
      "endOnATenpai"            : false,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 2,
      "tieScoreRule"            : "shared",
      "kyotakuSettlement"       : "keep",
      "incrementTsumibo"        : true,
      "allowWestRound"          : false,
      "maxYakumanLimit"         : 4
    }
  },

  "npm": {
    "order"                   : 30,
    "hidden"                  : false,
    "rule": {
      "name"                    : "協会ルール",
      "baseRule"                : "npm",
      "initialScore"            : 25000,
      "returnScore"             : 30000,
      "rankingPoints"           : [50, 10, -10, -30],
      "tenpaiFee"               : 3000,
      "roundingMangan"          : true,
      "allowGameEndByNegative"  : false,
      "endOnAWin"               : false,
      "endOnATenpai"            : false,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 2,
      "tieScoreRule"            : "shared",
      "kyotakuSettlement"       : "keep",
      "incrementTsumibo"        : true,
      "allowWestRound"          : false,
      "maxYakumanLimit"         : 4
    }
  },

  "saikouisen": {
    "order"                   : 40,
    "hidden"                  : false,
    "rule": {
      "name"                    : "最高位戦ルール",
      "baseRule"                : "saikouisen",
      "initialScore"            : 30000,
      "returnScore"             : 30000,
      "rankingPoints"           : [30, 10, -10, -30],
      "tenpaiFee"               : 3000,
      "roundingMangan"          : true,
      "allowGameEndByNegative"  : false,
      "endOnAWin"               : false,
      "endOnATenpai"            : false,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 2,
      "tieScoreRule"            : "shared",
      "kyotakuSettlement"       : "keep",
      "incrementTsumibo"        : true,
      "allowWestRound"          : false,
      "maxYakumanLimit"         : 4
    }
  },

  "saikouisen_classic": {
    "order"                   : 41,
    "hidden"                  : false,
    "rule": {
      "name"                    : "最高位戦Classicルール",
      "baseRule"                : "saikouisen_classic",
      "initialScore"            : 30000,
      "returnScore"             : 30000,
      "rankingPoints"           : [12, 4, -4, -12],
      "tenpaiFee"               : 0,
      "roundingMangan"          : false,
      "allowGameEndByNegative"  : false,
      "endOnAWin"               : false,
      "endOnATenpai"            : false,
      "renchanRule"             : "agari_renchan",
      "doubleWindHead"          : 2,
      "tieScoreRule"            : "shared",
      "kyotakuSettlement"       : "keep",
      "incrementTsumibo"        : true,
      "allowWestRound"          : false,
      "maxYakumanLimit"         : 4
    }
  },

  "rmu": {
    "order"                   : 50,
    "hidden"                  : false,
    "rule": {
      "name"                    : "RMUルール",
      "baseRule"                : "rmu",
      "initialScore"            : 30000,
      "returnScore"             : 30000,
      "rankingPoints"           : [15, 5, -5, -15],
      "tenpaiFee"               : 3000,
      "roundingMangan"          : true,
      "allowGameEndByNegative"  : false,
      "endOnAWin"               : false,
      "endOnATenpai"            : false,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 2,
      "tieScoreRule"            : "shared",
      "kyotakuSettlement"       : "keep",
      "incrementTsumibo"        : true,
      "allowWestRound"          : false,
      "maxYakumanLimit"         : 4
    }
  },

  "myu": {
    "order"                   : 60,
    "hidden"                  : false,
    "rule": {
      "name"                    : "ミュー(μ)リーグルール",
      "baseRule"                : "myu",
      "initialScore"            : 30000,
      "returnScore"             : 30000,
      "rankingPoints"           : [12, 4, -4, -12],
      "tenpaiFee"               : 0,
      "roundingMangan"          : false,
      "allowGameEndByNegative"  : false,
      "endOnAWin"               : false,
      "endOnATenpai"            : false,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 2,
      "tieScoreRule"            : "shared",
      "kyotakuSettlement"       : "keep",
      "incrementTsumibo"        : false,
      "allowWestRound"          : false,
      "maxYakumanLimit"         : 4
    }
  },

  "wrc": {
    "order"                   : 80,
    "hidden"                  : false,
    "rule": {
      "name"                    : "WRCルール",
      "baseRule"                : "wrc",
      "initialScore"            : 30000,
      "returnScore"             : 30000,
      "rankingPoints"           : [15, 5, -5, -15],
      "tenpaiFee"               : 3000,
      "roundingMangan"          : true,
      "allowGameEndByNegative"  : false,
      "endOnAWin"               : false,
      "endOnATenpai"            : false,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 2,
      "tieScoreRule"            : "shared",
      "kyotakuSettlement"       : "keep",
      "incrementTsumibo"        : true,
      "allowWestRound"          : false,
      "maxYakumanLimit"         : 4
    }
  },

  "tenhou": {
    "order"                   : 110,
    "hidden"                  : false,
    "rule": {
      "name"                    : "天鳳ルール",
      "baseRule"                : "tenhou",
      "initialScore"            : 25000,
      "returnScore"             : 30000,
      "rankingPoints"           : [40, 10, -10, -20],
      "tenpaiFee"               : 3000,
      "roundingMangan"          : false,
      "allowGameEndByNegative"  : true,
      "endOnAWin"               : true,
      "endOnATenpai"            : true,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 4,
      "tieScoreRule"            : "seat_order",
      "kyotakuSettlement"       : "top_only_seat",
      "incrementTsumibo"        : true,
      "allowWestRound"          : true,
      "minimumTopScore"         : 30000,
      "maxYakumanLimit"         : 4
    }
  },

  "mahjongsoul": {
    "order"                   : 120,
    "hidden"                  : false,
    "rule": {
      "name"                    : "雀魂ルール",
      "baseRule"                : "mahjongsoul",
      "initialScore"            : 25000,
      "returnScore"             : 25000,
      "rankingPoints"           : [15, 5, -5, -15],
      "tenpaiFee"               : 3000,
      "roundingMangan"          : false,
      "allowGameEndByNegative"  : true,
      "endOnAWin"               : true,
      "endOnATenpai"            : true,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 4,
      "tieScoreRule"            : "seat_order",
      "kyotakuSettlement"       : "top_only_seat",
      "incrementTsumibo"        : true,
      "allowWestRound"          : true,
      "minimumTopScore"         : 30000,
      "maxYakumanLimit"         : 6
    }
  },

  "mahjongsoul_gyakushu": {
    "order"                   : 121,
    "hidden"                  : true,
    "rule": {
      "name"                    : "雀魂 逆襲の戦",
      "baseRule"                : "mahjongsoul_gyakushu",
      "initialScore"            : 25000,
      "returnScore"             : 25000,
      "rankingPoints"           : [15, 5, -5, -15],
      "tenpaiFee"               : 3000,
      "roundingMangan"          : false,
      "allowGameEndByNegative"  : true,
      "endOnAWin"               : true,
      "endOnATenpai"            : true,
      "renchanRule"             : "tenpai_renchan",
      "doubleWindHead"          : 4,
      "tieScoreRule"            : "seat_order",
      "kyotakuSettlement"       : "top_only_seat",
      "incrementTsumibo"        : true,
      "allowWestRound"          : true,
      "minimumTopScore"         : 30000,
      "maxYakumanLimit"         : 6
    }
  }

}