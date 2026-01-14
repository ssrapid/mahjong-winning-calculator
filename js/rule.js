// ===== ルールID定義と表示名の対応 =====
const RULE_IDS = {
  M_LEAGUE:           "m_league",
  SAIKOUISEN:         "saikouisen",
  SAIKOUISEN_CLASSIC: "saikouisen_classic",
  NPM:                "npm",
  JPML:               "jpml",
  RMU:                "rmu",
  MYU:                "myu",
  WRC:                "wrc",
  TENHOU:             "tenhou",
  MAHJONGSOUL:        "majongsoul",
  // USER_DEFINED:   "user_defined",
};

const RULE_KEY = {
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
  HEAD_HONOR_POINTS:           "headHonorPoints",                             // 連風牌雀頭の符数(2or4)
  TIE_RANKING_POINT_RULE:      "tieRankingPointRule",                         // 同点時の順位点処理
  KYOTAKU_SETTLEMENT:          "kyotakuSettlement",                           // 終局時の供託処理
  INCREMENT_TSUMIBO:           "incrementTsumibo",                            // 積み棒加算(あり:true/なし:false)
  ALLOW_WEST_ROUND:            "allowWestRound",                              // 西入(あり:true/なし:false)
  MAX_YAKUMAN_LIMIT:           "maxYakumanLimit",                             // 最大役満複合数(一般的に、四暗刻単騎と大四喜をシングル役満とした場合、最大で四倍役満になる)
};

const RULE_KEY_LABELS = {
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
  [RULE_KEY.HEAD_HONOR_POINTS]:           '連風牌雀頭の符数',
  [RULE_KEY.TIE_RANKING_POINT_RULE]:      '同点時の順位点',
  [RULE_KEY.KYOTAKU_SETTLEMENT]:          '終局時の供託処理',
  [RULE_KEY.INCREMENT_TSUMIBO]:           '積み棒の加算',
  [RULE_KEY.ALLOW_WEST_ROUND]:            '西入',
  [RULE_KEY.MAX_YAKUMAN_LIMIT]:           '役満複合の最大数',
};

const RULE_OPTIONS = Object.entries(RULE_KEY_LABELS).map(([value, label]) => ({ value, label }));

// ===== 連荘条件 =====
const RENCHAN_RULE = {
  TENPAI: 'tenpai_renchan',  // テンパイ連荘
  AGARI:  'agari_renchan',   // 和了連荘
  NONE:   'no_renchan',      // 連荘なし
};

const RENCHAN_RULE_LABELS = {
  [RENCHAN_RULE.TENPAI]: 'テンパイ連荘',
  [RENCHAN_RULE.AGARI]:  '和了連荘',
  [RENCHAN_RULE.NONE]:   '連荘なし',
};

const RENCHAN_RULE_OPTIONS = Object.entries(RENCHAN_RULE_LABELS).map(([value, label]) => ({ value, label }));

// ===== 同点時の順位点 =====
const TIE_RANKING_POINT_RULE = {
  SHARED: 'shared',                     // 順位点を分ける
  SEAT_ORDER: 'seat_order',             // 席順で決定
};

const TIE_RANKING_POINT_LABELS = {
  [TIE_RANKING_POINT_RULE.SHARED]:     '順位点を分ける',
  [TIE_RANKING_POINT_RULE.SEAT_ORDER]: '席順で決定',
};

const TIE_RANKING_POINT_OPTIONS = Object.entries(TIE_RANKING_POINT_LABELS).map(([value, label]) => ({ value, label }));

// ===== 終局時供託 =====
const KYOTAKU_SETTLEMENT_TYPE = {
  KEEP:          'keep',            // 供託のまま
  TOP_SHARED:    'top_shared',      // トップ取り、同点時分配
  TOP_ONLY_SEAT: 'top_only_seat',   // トップ取り、同点時上家優先
};

const KYOTAKU_SETTLEMENT_LABELS = {
  [KYOTAKU_SETTLEMENT_TYPE.KEEP]:           '供託のまま',
  [KYOTAKU_SETTLEMENT_TYPE.TOP_SHARED]:     'トップ取り（同点時分配）',
  [KYOTAKU_SETTLEMENT_TYPE.TOP_ONLY_SEAT]:  'トップ取り（同点時上家優先）',
};

// UI用選択肢（label / value）
const KYOTAKU_SETTLEMENT_OPTIONS = Object.entries(KYOTAKU_SETTLEMENT_LABELS).map(([value, label]) => ({ value, label }));

// ===== プリセットルール =====
const RULE_PRESETS = {
  [RULE_IDS.M_LEAGUE]: {
    [RULE_KEY.NAME]                       : 'Mリーグルール',
    [RULE_KEY.BASE]                       : RULE_IDS.M_LEAGUE,                      // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 25000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 30000,                                  // 返し点
    [RULE_KEY.RANKING_POINTS]             : [50, 10, -10, -30],                     // 順位点配列
    [RULE_KEY.TENPAI_FEE]                 : 3000,                                   // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : true,                                   // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : false,                                  // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : false,                                  // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : false,                                  // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.TENPAI,                    // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 2,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SHARED,          // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.TOP_SHARED,     // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : true,                                   // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : false,                                  // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 4,                                      // 役満複合の最大数
  },
  [RULE_IDS.JPML]: {
    [RULE_KEY.NAME]                       : '連盟公式ルール',
    [RULE_KEY.BASE]                       : RULE_IDS.JPML,                          // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 30000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 30000,                                  // 返し点
    // 連盟公式ルールの順位点は浮きの人数で異なる
    [RULE_KEY.RANKING_POINTS]             : {  
                                            1: [12, -1, -3,  -8],                   // 1人浮き
                                            2: [ 8,  4, -4,  -8],                   // 2人浮き
                                            3: [ 8,  3,  1, -12],                   // 3人浮き
                                            0: [ 8,  4, -4,  -8]},                  // 4人沈み
    [RULE_KEY.TENPAI_FEE]                 : 3000,                                   // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : false,                                  // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : false,                                  // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : false,                                  // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : false,                                  // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.TENPAI,                    // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 2,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SHARED,          // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.KEEP,           // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : true,                                   // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : false,                                  // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 4,                                      // 役満複合の最大数
  },
  [RULE_IDS.NPM]: {
    [RULE_KEY.NAME]                       : '協会ルール',
    [RULE_KEY.BASE]                       : RULE_IDS.NPM,                           // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 25000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 30000,                                  // 返し点
    [RULE_KEY.RANKING_POINTS]             : [50, 10, -10, -30],                     // 順位点配列
    [RULE_KEY.TENPAI_FEE]                 : 3000,                                   // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : true,                                   // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : false,                                  // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : false,                                  // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : false,                                  // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.TENPAI,                    // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 2,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SHARED,          // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.KEEP,           // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : true,                                   // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : false,                                  // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 4,                                      // 役満複合の最大数
  },
  [RULE_IDS.SAIKOUISEN]: {
    [RULE_KEY.NAME]                       : '最高位戦ルール',
    [RULE_KEY.BASE]                       : RULE_IDS.SAIKOUISEN,                    // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 30000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 30000,                                  // 返し点
    [RULE_KEY.RANKING_POINTS]             : [30, 10, -10, -30],                     // 順位点配列
    [RULE_KEY.TENPAI_FEE]                 : 3000,                                   // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : true,                                   // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : false,                                  // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : false,                                  // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : false,                                  // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.TENPAI,                    // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 2,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SHARED,          // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.KEEP,           // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : true,                                   // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : false,                                  // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 4,                                      // 役満複合の最大数
  },
  [RULE_IDS.SAIKOUISEN_CLASSIC]: {
    [RULE_KEY.NAME]                       : '最高位戦Classicルール',
    [RULE_KEY.BASE]                       : RULE_IDS.SAIKOUISEN_CLASSIC,            // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 30000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 30000,                                  // 返し点
    [RULE_KEY.RANKING_POINTS]             : [12, 4, -4, -12],                       // 順位点配列
    [RULE_KEY.TENPAI_FEE]                 : 0,                                      // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : false,                                  // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : false,                                  // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : false,                                  // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : false,                                  // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.AGARI,                     // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 2,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SHARED,          // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.KEEP,           // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : true,                                   // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : false,                                  // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 4,                                      // 役満複合の最大数
  },
  [RULE_IDS.RMU]: {
    [RULE_KEY.NAME]                       : 'RMUルール(A)',
    [RULE_KEY.BASE]                       : RULE_IDS.RMU,                           // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 30000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 30000,                                  // 返し点
    [RULE_KEY.RANKING_POINTS]             : [15, 5, -5, -15],                       // 順位点配列
    [RULE_KEY.TENPAI_FEE]                 : 3000,                                   // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : true,                                   // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : false,                                  // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : false,                                  // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : false,                                  // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.TENPAI,                    // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 2,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SHARED,          // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.KEEP,           // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : true,                                   // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : false,                                  // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 4,                                      // 役満複合の最大数
  },
  [RULE_IDS.MYU]: {
    [RULE_KEY.NAME]                       : 'ミュー（μ）リーグルール',
    [RULE_KEY.BASE]                       : RULE_IDS.MYU,                           // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 30000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 30000,                                  // 返し点
    [RULE_KEY.RANKING_POINTS]             : [12, 4, -4, -12],                       // 順位点配列
    [RULE_KEY.TENPAI_FEE]                 : 0,                                      // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : false,                                  // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : false,                                  // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : false,                                  // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : false,                                  // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.TENPAI,                    // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 2,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SHARED,          // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.KEEP,           // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : false,                                  // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : false,                                  // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 4,                                      // 役満複合の最大数
  },
  [RULE_IDS.WRC]: {
    [RULE_KEY.NAME]                       : 'WRCルール',
    [RULE_KEY.BASE]                       : RULE_IDS.WRC,                           // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 30000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 30000,                                  // 返し点
    [RULE_KEY.RANKING_POINTS]             : [15, 5, -5, -15],                       // 順位点配列
    [RULE_KEY.TENPAI_FEE]                 : 3000,                                   // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : true,                                   // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : false,                                  // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : false,                                  // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : false,                                  // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.TENPAI,                    // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 2,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SHARED,          // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.KEEP,           // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : true,                                   // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : false,                                  // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 4,                                      // 役満複合の最大数
  },
  [RULE_IDS.TENHOU]: {
    [RULE_KEY.NAME]                       : '天鳳ルール',
    [RULE_KEY.BASE]                       : RULE_IDS.TENHOU,                        // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 25000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 30000,                                  // 返し点
    [RULE_KEY.RANKING_POINTS]             : [40, 10, -10, -20],                     // 順位点配列
    [RULE_KEY.TENPAI_FEE]                 : 3000,                                   // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : false,                                  // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : true,                                   // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : true,                                   // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : true,                                   // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.TENPAI,                    // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 4,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SEAT_ORDER,      // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.TOP_ONLY_SEAT,  // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : true,                                   // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : true,                                   // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 4,                                      // 役満複合の最大数
  },
  [RULE_IDS.MAHJONGSOUL]: {
    [RULE_KEY.NAME]                       : '雀魂ルール',
    [RULE_KEY.BASE]                       : RULE_IDS.MAHJONGSOUL,                   // ベースルール
    [RULE_KEY.INITIAL_SCORE]              : 25000,                                  // 配給原点
    [RULE_KEY.RETURN_SCORE]               : 25000,                                  // 返し点
    [RULE_KEY.RANKING_POINTS]             : [15, 5, -5, -15],                       // 順位点配列
    [RULE_KEY.TENPAI_FEE]                 : 3000,                                   // テンパイ料
    [RULE_KEY.ROUNDING_MANGAN]            : false,                                  // 切り上げ満貫
    [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : true,                                   // トビ終了
    [RULE_KEY.END_ON_A_WIN]               : true,                                   // アガリやめ
    [RULE_KEY.END_ON_A_TENPAI]            : true,                                   // テンパイやめ
    [RULE_KEY.RENCHAN_RULE]               : RENCHAN_RULE.TENPAI,                    // 連荘条件
    [RULE_KEY.HEAD_HONOR_POINTS]          : 4,                                      // 連風牌雀頭の符数
    [RULE_KEY.TIE_RANKING_POINT_RULE]     : TIE_RANKING_POINT_RULE.SEAT_ORDER,      // 同点時の順位決定
    [RULE_KEY.KYOTAKU_SETTLEMENT]         : KYOTAKU_SETTLEMENT_TYPE.TOP_ONLY_SEAT,  // 終局時の供託処理
    [RULE_KEY.INCREMENT_TSUMIBO]          : true,                                   // 積み棒の加算
    [RULE_KEY.ALLOW_WEST_ROUND]           : true,                                   // 西入
    [RULE_KEY.MAX_YAKUMAN_LIMIT]          : 6,                                      // 役満複合の最大数
  },
  // [RULE_IDS.USER_DEFINED]: {
  //   [RULE_KEY.NAME]                       : 'ユーザー定義',
  //   [RULE_KEY.BASE]                       : null,                      // ベースルール
  //   [RULE_KEY.INITIAL_SCORE]              : null,                      // 配給原点
  //   [RULE_KEY.RETURN_SCORE]               : null,                      // 返し点
  //   [RULE_KEY.RANKING_POINTS]             : null,                      // 順位点配列
  //   [RULE_KEY.TENPAI_FEE]                 : null,                      // テンパイ料
  //   [RULE_KEY.ROUNDING_MANGAN]            : null,                      // 切り上げ満貫
  //   [RULE_KEY.ALLOW_GAME_END_BY_NEGATIVE] : null,                      // トビ終了
  //   [RULE_KEY.END_ON_A_WIN]               : null,                      // アガリやめ
  //   [RULE_KEY.END_ON_A_TENPAI]            : null,                      // テンパイやめ
  //   [RULE_KEY.RENCHAN_RULE]               : null,                      // 連荘条件
  //   [RULE_KEY.HEAD_HONOR_POINTS]          : null,                      // 連風牌雀頭の符数
  //   [RULE_KEY.TIE_RANKING_POINT_RULE]     : null,                      // 同点時の順位決定
  //   [RULE_KEY.KYOTAKU_SETTLEMENT]         : null,                      // 終局時の供託処理
  //   [RULE_KEY.BONUS_STICK_BEHAVIOR]       : null,                      // 積み棒の加算
  //   [RULE_KEY.ALLOW_WEST_ROUND]           : null,                      // 西入
  //   [RULE_KEY.MAX_YAKUMAN_LIMIT]          : null,                      // 役満複合の最大数
  // }
};

// ===== UI用セレクトオプション =====
const RULE_LABELS = Object.fromEntries(
  Object.entries(RULE_PRESETS).map(([ruleId, config]) => [ruleId, config[RULE_KEY.NAME]])
);


