// ===== ルールID定義と表示名の対応 =====


/**
 * @typedef {[number, number, number, number]} RankingPointsArray
 */

/**
 * @typedef {{
 *   0: RankingPointsArray,
 *   1: RankingPointsArray,
 *   2: RankingPointsArray,
 *   3: RankingPointsArray,
 * }} RankingPointsForJPML
 */

/**
 * @typedef {RankingPointsArray | RankingPointsForJPML} RankingPointsDef
 */

/**
 * ルールオブジェクト
 * @typedef {Object} RuleObject
 * @property {string} name
 * @property {RULE_ID} baseRule
 * @property {number} initialScore
 * @property {number} returnScore
 * @property {RankingPointsDef} rankingPoints
 * @property {number} tenpaiFee
 * @property {boolean} roundingMangan
 * @property {boolean} allowGameEndByNegative
 * @property {boolean} endOnAWin
 * @property {boolean} endOnATenpai
 * @property {RENCHAN_RULE_TYPE} renchanRule
 * @property {number} doubleWindHead
 * @property {TIE_SCORE_RULE_TYPE} tieScoreRule
 * @property {KYOTAKU_SETTLEMENT_TYPE_DEF} kyotakuSettlement
 * @property {boolean} incrementTsumibo
 * @property {boolean} allowWestRound
 * @property {number} [minimumTopScore]
 * @property {number} maxYakumanLimit
 */


/**
 * @typedef {typeof RULE_KEY[keyof typeof RULE_KEY]} RuleKeyString
 */

/**
 * @readonly
 * @enum {string}
 */
export const RULE_KEY = {
  NAME:                        "name",                                        // ルール名
  BASE:                        "baseRule",                                    // ベースルール(条件分岐に用いる場合がある)
  INITIAL_SCORE:               "initialScore",                                // 配給原点
  RETURN_SCORE:                "returnScore",                                 // 返し点
  RANKING_POINTS:              "rankingPoints",                               // 順位点配列(例:[50,10,-10,-30],
                                                                              // ただし、JPMLベースの場合は
                                                                              // { 1:[12,-1,-3,-8],
                                                                              //   2:[8, 4, -4, -8],
                                                                              //   3:[8, 3, 1, -12],
                                                                              //   0:[8, 4, -4, -8]}
                                                                              // のような形式)
  TENPAI_FEE:                  "tenpaiFee",                                   // テンパイ料(例:場に3000点)
  ROUNDING_MANGAN:             "roundingMangan",                              // 切り上げ満貫(あり:true/なし:false)
  ALLOW_GAME_END_BY_NEGATIVE:  "allowGameEndByNegative",                      // トビ終了(あり:true/なし:false)
  END_ON_A_WIN:                "endOnAWin",                                   // アガリやめ(あり:true/なし:false)
  END_ON_A_TENPAI:             "endOnATenpai",                                // テンパイやめ(あり:true/なし:false)
  RENCHAN_RULE:                "renchanRule",                                 // 連荘条件
  DOUBLE_WIND_HEAD:            "doubleWindHead",                              // 連風牌雀頭の符数(2or4)
  TIE_SCORE_RULE:              "tieScoreRule",                                // 同点時の順位処理
  KYOTAKU_SETTLEMENT:          "kyotakuSettlement",                           // 終局時の供託処理
  INCREMENT_TSUMIBO:           "incrementTsumibo",                            // 積み棒加算(あり:true/なし:false)
  ALLOW_WEST_ROUND:            "allowWestRound",                              // 西入(あり:true/なし:false)
  MINIMUN_TOP_SCORE:           "minimumTopScore",                             // トップ必要最低点数(西入ありのとき)
  MAX_YAKUMAN_LIMIT:           "maxYakumanLimit",                             // 最大和了点(一般的に、四暗刻単騎と大四喜をシングル役満とした場合、最大で四倍役満になる)
};

/**
 * @readonly
 * @enum {string}
 */
export const RULE_KEY_LABELS = {
  [RULE_KEY.NAME]:                        'ルール名',
  [RULE_KEY.BASE]:                        'ベースルール',
  [RULE_KEY.INITIAL_SCORE]:               '配給原点',
  [RULE_KEY.RETURN_SCORE]:                '返し点',
  [RULE_KEY.RANKING_POINTS]:              '順位点',
  [RULE_KEY.TENPAI_FEE]:                  'テンパイ料',
  [RULE_KEY.ROUNDING_MANGAN]:             '切り上げ満貫',
  [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE]:  'トビ終了',
  [RULE_KEY.END_ON_A_WIN]:                'アガリやめ',
  [RULE_KEY.END_ON_A_TENPAI]:             'テンパイやめ',
  [RULE_KEY.RENCHAN_RULE]:                '連荘条件',
  [RULE_KEY.DOUBLE_WIND_HEAD]:           '連風牌雀頭',
  [RULE_KEY.TIE_SCORE_RULE]:              '同点時の順位',
  [RULE_KEY.KYOTAKU_SETTLEMENT]:          '終局時の供託処理',
  [RULE_KEY.INCREMENT_TSUMIBO]:           '積み棒の加算',
  [RULE_KEY.ALLOW_WEST_ROUND]:            '西入',
  [RULE_KEY.MINIMUN_TOP_SCORE]:           'トップ必要点数',
  [RULE_KEY.MAX_YAKUMAN_LIMIT]:           '最大和了点',
};

export const RULE_OPTIONS = Object.entries(RULE_KEY_LABELS).map(([value, label]) => ({ value, label }));

/**
 * @typedef {typeof RULE_IDS[keyof typeof RULE_IDS]} RULE_ID
 */
/**
 * ベースルールとなるルールの識別子
 * @readonly
 * @enum {string}
 */
export const RULE_IDS = {
  M_LEAGUE:           "m_league",
  SAIKOUISEN:         "saikouisen",
  SAIKOUISEN_CLASSIC: "saikouisen_classic",
  NPM:                "npm",
  JPML:               "jpml",
  RMU:                "rmu",
  MYU:                "myu",
  WRC:                "wrc",
  TENHOU:             "tenhou",
  MAHJONGSOUL:        "mahjongsoul",
  GYAKUSHU:           "mahjongsoul_gyakushu"
};


/**
 * @typedef {typeof RENCHAN_RULE[keyof typeof RENCHAN_RULE]} RENCHAN_RULE_TYPE
 */

/**
 * 連荘条件
 * @readonly
 * @enum {string}
 */
export const RENCHAN_RULE = {
  TENPAI: 'tenpai_renchan',  // テンパイ連荘
  AGARI:  'agari_renchan',   // 和了連荘
  NONE:   'no_renchan',      // 連荘なし
};


const RENCHAN_RULE_LABELS = {
  [RENCHAN_RULE.TENPAI]: 'テンパイ連荘',
  [RENCHAN_RULE.AGARI]:  '和了連荘',
  [RENCHAN_RULE.NONE]:   '連荘なし',
};

/**
 * @typedef {typeof RENCHAN_RULE_LABELS[keyof typeof RENCHAN_RULE_LABELS]} RENCHAN_RULE_LABELS
 */

export const RENCHAN_RULE_OPTIONS = Object.entries(RENCHAN_RULE_LABELS).map(([value, label]) => ({ value, label }));


/**
 * @typedef {typeof TIE_SCORE_RULE[keyof typeof TIE_SCORE_RULE]} TIE_SCORE_RULE_TYPE
 */

/**
 * 同点時の順位決定方法
 * @readonly
 * @enum {string}
 */
export const TIE_SCORE_RULE = {
  SHARED: 'shared',                     // 順位点を分ける
  SEAT_ORDER: 'seat_order',             // 席順で決定
};


/**
 * 同点時の順位決定方法の説明
 * @readonly
 * @enum {string}
 */
const TIE_SCORE_RULE_LABELS = {
  [TIE_SCORE_RULE.SHARED]:     '同順位として順位点を分ける',
  [TIE_SCORE_RULE.SEAT_ORDER]: '席順で順位を決定',
};

/**
 * @readonly
 */
export const TIE_SCORE_RULE_OPTIONS = Object.entries(TIE_SCORE_RULE_LABELS).map(([value, label]) => ({ value, label }));


/**
 * @typedef {typeof KYOTAKU_SETTLEMENT_TYPE[keyof typeof KYOTAKU_SETTLEMENT_TYPE]} KYOTAKU_SETTLEMENT_TYPE_DEF
 */

/**
 * 終局時供託
 * @readonly
 * @enum {string}
 */
export const KYOTAKU_SETTLEMENT_TYPE = {
  KEEP:          'keep',            // 供託のまま
  TOP_SHARED:    'top_shared',      // トップ取り、同点時分配
  TOP_ONLY_SEAT: 'top_only_seat',   // トップ取り、同点時上家優先
};

/**
 * 終局時供託のラベル
 * @readonly
 * @enum {string}
 */
const KYOTAKU_SETTLEMENT_LABELS = {
  [KYOTAKU_SETTLEMENT_TYPE.KEEP]:           '供託のまま',
  [KYOTAKU_SETTLEMENT_TYPE.TOP_SHARED]:     'トップ取り（同点時分配）',
  [KYOTAKU_SETTLEMENT_TYPE.TOP_ONLY_SEAT]:  'トップ取り（同点時上家優先）',
};

// UI用選択肢（label / value）
export const KYOTAKU_SETTLEMENT_OPTIONS = Object.entries(KYOTAKU_SETTLEMENT_LABELS).map(([value, label]) => ({ value, label }));

