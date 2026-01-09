// agariTemplates.js

// 定数キー定義
const TEMPLATE = {
  ID                         : 'templateID',              // テンプレートID
  TYPE                       : 'templateType',            // ロンorツモ
  TSUMO_PAYMENT_TO_CHILD     : 'tsumoPaymentToChild',     // ツモ和了時の子から子への支払い
  TSUMO_PAYMENT_TO_DEALER    : 'tsumoPaymentToDealer',    // ツモ和了時の親へ(から)の支払い
  TSUMO_GAIN_AS_CHILD        : 'tsumoGainAsChild',        // 子のツモ和了時の収入
  TSUMO_GAIN_AS_DEALER       : 'tsumoGainAsDealer',       // 親のツモ和了時の収入
  RON_GAIN_AS_CHILD          : 'ronGainAsChild',          // 子のロン和了時の収入および放銃者の支払い
  RON_GAIN_AS_DEALER         : 'ronGainAsDealer',         // 親のロン和了時の収入および放銃者の支払い
  LIMIT_LABEL                : 'limitLabel',              // "満貫"、"跳満"など
  CHECK_HEAD_HONOR_POINTS    : 'checkHeadHonorPoints',    // 連風牌雀頭の符数を要確認
  CHECK_ROUNDING_MANGAN      : 'checkRoundingMangan',     // 切り上げ満貫採用か要確認
  FU_AND_HAN                 : 'fuAndHan',                // 符と翻の組み合わせの配列
  IS_UNAVAILABLE_WHEN_RIICHI : "isUnavailableWhenRiichi", // リーチ時に存在しなくなる和了点(1000点など)
  YAKUMAN_LEVEL              : 'yakumanLevel',            // 役満複合
  DESCRIPTION                : 'description',             // 説明
  TENPAI_GAIN                : 'tenpaiGain',
  NOTEN_LOSS                 : 'notenLoss',
  TENPAI_COUNT               : 'tenpaiCount',
  NOTEN_COUNT                : 'notenCount',
  TENPAI_FLAGS               : 'tenpaiFlags',
};

const AGARI_TYPES = {
  TSUMO:    'tsumo',
  RON:      'ron',
  RYUKYOKU: 'ryukyoku',
};

const MANGAN_OR_MORE = {
  MANGAN           : '満貫',
  HANEMAN          : '跳満',
  BAIMAN           : '倍満',
  SANBAIMAN        : '三倍満',
  YAKUMAN          : '役満',
  MULTIPLE_YAKUMAN : '複合役満',
}

// ===== 座席役割定義（定数オブジェクト形式） =====
const SEAT_ROLES = {
  WINNER_TSUMO:    'winner_tsumo',     // ツモ和了者
  WINNER_RON:      'winner_ron',       // ロン和了者
  DISCARDER:       'discarder',        // 放銃者
  SCORE_PAYER:     'score_payer',      // 被ツモ者
  OBSERVER:        'observer',         // 関与なし（横移動）
  TENPAIER:        'tenpaier',         // テンパイ者（流局時）
  NOTENPAIER:      'notenpaier'        // ノーテン者（流局時）
};




// 対象の相手が1人定まるSeatRoleの対象Role
const TARGET_OF_SEAT_ROLES = {
  [SEAT_ROLES.WINNER_RON]  : SEAT_ROLES.DISCARDER,
  [SEAT_ROLES.DISCARDER]   : SEAT_ROLES.WINNER_RON,
  [SEAT_ROLES.SCORE_PAYER] : SEAT_ROLES.WINNER_TSUMO
}

// ロンに対する放銃者、放銃に対する和了者など対象がいるseatRoleの集まり
const SEAT_ROLES_TARGETABLE = Object.keys(TARGET_OF_SEAT_ROLES);


function getTsumoAgariTemplates2 (rule){
  const plainTsumoAgariTemplates = [
    {
      [TEMPLATE.ID]                         : 'tsumo_0305',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 300,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 500,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 1100,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 1500,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 30, han: 1 }],
      [TEMPLATE.IS_UNAVAILABLE_WHEN_RIICHI] : true, // リーチ+ツモで2翻あるので、リーチでこの点数にはならない(リーチツモは500/1000以上)
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_0407',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 400,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 700,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 1500,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 2100,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 20, han: 2 }, { fu: 40, han: 1 }],
      [TEMPLATE.IS_UNAVAILABLE_WHEN_RIICHI] : true, // リーチ+ツモで30符以上の2翻、または、リーチ+ツモ+平和で20符3翻あるので、リーチでこの点数にはならない
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_0408',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 400,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 800,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 1600,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 2400,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 50, han: 1 }],  // 25符2翻ツモはない(ツモ+七対子で3翻から)
      [TEMPLATE.IS_UNAVAILABLE_WHEN_RIICHI] : true, // リーチ+ツモで2翻あるので、リーチでこの点数にはならない
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_0510',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 500,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 1000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 2000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 3000,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 30, han: 2 }, { fu: 60, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_0612',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 600,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 1200,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 2400,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 3600,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 70, han: 1 }],
      [TEMPLATE.IS_UNAVAILABLE_WHEN_RIICHI] : true, // リーチ+ツモで2翻あるので、リーチでこの点数にはならない
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_0713',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 700,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 1300,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 2700,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 3900,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 20, han: 3 }, { fu: 40, han: 2 }, { fu: 80, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                      : 'tsumo_0815',
      [TEMPLATE.TYPE]                    : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]  : 800,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER] : 1500,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]     : 3100,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]    : 4500,
      [TEMPLATE.YAKUMAN_LEVEL]           : 0,
      [TEMPLATE.FU_AND_HAN]      : [{ fu: 90, han: 1 }],
      [TEMPLATE.IS_UNAVAILABLE_WHEN_RIICHI] : true, // リーチ+ツモで2翻あるので、リーチでこの点数にはならない
      [TEMPLATE.DESCRIPTION]             : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_0816',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 800,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 1600,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 3200,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 4800,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 25, han: 3 }, { fu: 50, han: 2 }, { fu: 100, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    // {
    //   [TEMPLATE.ID]                         : 'tsumo_0918',
    //   [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
    //   [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 900,
    //   [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 1800,
    //   [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 3600,
    //   [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 5400, // 点数表は5300点
    //   [TEMPLATE.YAKUMAN_LEVEL]              : 0,
    //   [TEMPLATE.POINTS_AND_DOUBLES]         : [{ fu: 110, han: 1 }],
    //   [TEMPLATE.IS_UNAVAILABLE_WHEN_RIICHI] : true, // リーチ+ツモで2翻あるので、リーチでこの点数にはならない
    //   [TEMPLATE.DESCRIPTION]                : '110符1翻ツモは存在しない',
    // },
    {
      [TEMPLATE.ID]                         : 'tsumo_1020',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 1000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 2000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 4000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 6000,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 30, han: 3 }, { fu: 60, han: 2 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_1223',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 1200,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 2300,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 4700,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 6900,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 70, han: 2 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_1326',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 1300,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 2600,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 5200,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 7800,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 20, han: 4 }, { fu: 40, han: 3 }, { fu: 80, han: 2 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_1529',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 1500,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 2900,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 5900,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 8700,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 90, han: 2 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_1632',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 1600,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 3200,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 6400,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 9600,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 25, han: 4 }, { fu: 50, han: 3 }, { fu: 100, han: 2 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_1836',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 1800,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 3600,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 7200,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 10800,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 110, han: 2 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_2039',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 2000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 3900,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 7900,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 11700,
      [TEMPLATE.CHECK_ROUNDING_MANGAN]      : true,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 30, han: 4 }, { fu: 60, han: 3 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '切り上げ満貫採用時は存在しない',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_slum',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 2000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 4000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 8000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 12000,
      [TEMPLATE.LIMIT_LABEL]                : '満貫',
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_oh_slum',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 3000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 6000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 12000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 18000,
      [TEMPLATE.LIMIT_LABEL]                : '跳満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_d_slum',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 4000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 8000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 16000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 24000,
      [TEMPLATE.LIMIT_LABEL]                : '倍満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_t_slum',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 6000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 12000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 24000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 36000,
      [TEMPLATE.LIMIT_LABEL]                : '三倍満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_1yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 8000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 16000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 32000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 48000,
      [TEMPLATE.LIMIT_LABEL]                : '役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 1,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_2yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 16000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 32000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 64000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 96000,
      [TEMPLATE.LIMIT_LABEL]                : '2倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 2,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_3yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 24000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 48000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 96000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 144000,
      [TEMPLATE.LIMIT_LABEL]                : '3倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 3,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_4yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 32000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 64000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 128000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 192000,
      [TEMPLATE.LIMIT_LABEL]                : '4倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 4,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_5yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 40000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 80000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 160000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 240000,
      [TEMPLATE.LIMIT_LABEL]                : '5倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 5,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'tsumo_6yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.TSUMO,
      [TEMPLATE.TSUMO_PAYMENT_TO_CHILD]     : 48000,
      [TEMPLATE.TSUMO_PAYMENT_TO_DEALER]    : 96000,
      [TEMPLATE.TSUMO_GAIN_AS_CHILD]        : 192000,
      [TEMPLATE.TSUMO_GAIN_AS_DEALER]       : 288000,
      [TEMPLATE.LIMIT_LABEL]                : '6倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 6,
      [TEMPLATE.DESCRIPTION]                : '',
    },
  ];
  
  const filterdTsumoAgariTemplates = [];
  const roundingMangan = rule?.[RULE_KEY.ROUNDING_MANGAN] ??
    (console.log('切り上げ満貫ルールが設定されていません。'), false);
  const maxYakumanLimit = rule?.[RULE_KEY.MAX_YAKUMAN_LIMIT] ??
    (console.log('役満の最大複合数が設定されていません。今回は6としてパターンを生成します。'), 6);
  for (let template of plainTsumoAgariTemplates) {
    if (template?.[TEMPLATE.CHECK_ROUNDING_MANGAN] && roundingMangan) {
      // 切り上げ満貫採用時は30符4翻、60符3翻をスキップ
      continue;
    }
    if ((template?.[TEMPLATE.YAKUMAN_LEVEL] ?? 0) > maxYakumanLimit) {
      // 役満の最大複合数を超える場合はスキップ
      continue;
    }
    filterdTsumoAgariTemplates.push(template);
  }
  return filterdTsumoAgariTemplates;
}

/**
 * 
 */
function getRonAgariTemplates2 (rule) {
  const plainRonAgariTemplates = [
    {
      [TEMPLATE.ID]                         : 'ron_1015',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 1000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 1500,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 30, han: 1 }],
      [TEMPLATE.IS_UNAVAILABLE_WHEN_RIICHI] : true, // リーチのみは40符以上、リーチ+平和は2翻あるので、リーチで30符1翻はない
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_1320',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 1300,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 2000,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 40, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_1624',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 1600,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 2400,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 25, han: 2 }, { fu: 50, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_2029',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 2000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 2900,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 30, han: 2 }, { fu: 60, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_2334',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 2300,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 3400,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 70, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_2639',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 2600,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 3900,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 40, han: 2 }, { fu: 80, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_2944',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 2900,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 4400,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 90, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_3248',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 3200,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 4800,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 25, han: 3 }, { fu: 50, han: 2 }, { fu: 100, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_3653',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 3600,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 5300,
      [TEMPLATE.CHECK_HEAD_HONOR_POINTS]    : true,
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 110, han: 1 }],
      [TEMPLATE.DESCRIPTION]                : '110符1翻ロンは連風牌の雀頭が4符の場合のみ',
    },
    {
      [TEMPLATE.ID]                         : 'ron_3958',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 3900,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 5800,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 30, han: 3 }, { fu: 60, han: 2 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_4568',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 4500,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 6800,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 70, han: 2 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_5277',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 5200,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 7700,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 40, han: 3 }, { fu: 80, han: 2 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_5887',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 5800,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 8700,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 90, han: 2 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_6496',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 6400,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 9600,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 25, han: 4 }, { fu: 50, han: 3 }, { fu: 100, han: 2}],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_71a6',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 7100,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 10600,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 110, han: 2 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_77b6',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 7700,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 11600,
      [TEMPLATE.CHECK_ROUNDING_MANGAN]      : true,
      [TEMPLATE.FU_AND_HAN]                 : [{ fu: 30, han: 4 }, { fu: 60, han: 3 }],
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '切り上げ満貫採用時は存在しない',
    },
    {
      [TEMPLATE.ID]                         : 'ron_mangan',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 8000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 12000,
      [TEMPLATE.LIMIT_LABEL]                : '満貫',
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_haneman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 12000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 18000,
      [TEMPLATE.LIMIT_LABEL]                : '跳満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_baiman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 16000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 24000,
      [TEMPLATE.LIMIT_LABEL]                : '倍満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_sanbaiman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 24000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 36000,
      [TEMPLATE.LIMIT_LABEL]                : '三倍満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 0,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_1yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 32000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 48000,
      [TEMPLATE.LIMIT_LABEL]                : '役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 1,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_2yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 64000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 96000,
      [TEMPLATE.LIMIT_LABEL]                : '2倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 2,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_3yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 96000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 144000,
      [TEMPLATE.LIMIT_LABEL]                : '3倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 3,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_4yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 128000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 192000,
      [TEMPLATE.LIMIT_LABEL]                : '4倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 4,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_5yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 160000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 240000,
      [TEMPLATE.LIMIT_LABEL]                : '5倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 5,
      [TEMPLATE.DESCRIPTION]                : '',
    },
    {
      [TEMPLATE.ID]                         : 'ron_6yakuman',
      [TEMPLATE.TYPE]                       : AGARI_TYPES.RON,
      [TEMPLATE.RON_GAIN_AS_CHILD]          : 192000,
      [TEMPLATE.RON_GAIN_AS_DEALER]         : 288000,
      [TEMPLATE.LIMIT_LABEL]                : '6倍役満',
      [TEMPLATE.YAKUMAN_LEVEL]              : 6,
      [TEMPLATE.DESCRIPTION]                : '',
    }
  ];
  const filteredRonAgariTemplates = [];
  const headHonorPoints = rule?.[RULE_KEY.HEAD_HONOR_POINTS] ??
    (console.log('連風牌雀頭の符数が設定されていません。'), 4);
  const roundingMangan  = rule?.[RULE_KEY.ROUNDING_MANGAN] ?? false;
  const maxYakumanLimit = rule?.[RULE_KEY.MAX_YAKUMAN_LIMIT] ?? 6;
  for (let template of plainRonAgariTemplates) {
    if (template?.[TEMPLATE.CHECK_HEAD_HONOR_POINTS] && headHonorPoints !== 4) {
      // 連風牌の雀頭が4符でない場合、110符1翻をスキップ
      continue;
    }
    if (template?.[TEMPLATE.CHECK_ROUNDING_MANGAN] && roundingMangan) {
      // 切り上げ満貫採用時は30符4翻、60符3翻をスキップ
      continue;
    }
    if ((template?.[TEMPLATE.YAKUMAN_LEVEL] ?? 0) > maxYakumanLimit) {
      // 役満の最大複合数を超える場合はスキップ
      continue;
    }
    filteredRonAgariTemplates.push(template);
  }
  return filteredRonAgariTemplates;
}



function getRyukyokuTemplates2 (rule) {
  const ryukyokuTemplates = [];
  for (let i = 0; i < 16; i++) {
    const tenpaiFlags = createSeatMap(seat => Boolean(i & (1 << SEAT_ORDER.indexOf(seat))));
    const templateID = `ryukyoku_${i}`
    const tenpaiCount = ((i & 0b0001) + ((i >> 1) & 0b0001) + ((i >> 2) & 0b0001) + ((i >> 3) & 0b0001));
    const notenCount = 4 - tenpaiCount;

    const [tenpaiGain, notenLoss] = (() => {
      const tenpaiFee = rule?.[RULE_KEY.TENPAI_FEE] ?? 0;
      if (tenpaiFee === 0 || tenpaiCount === 0 || notenCount === 0) { return [0, 0]; }
      return [tenpaiFee / tenpaiCount, tenpaiFee / notenCount];
    })();

    ryukyokuTemplates.push({
      [TEMPLATE.ID]           : templateID,
      [TEMPLATE.TYPE]         : AGARI_TYPES.RYUKYOKU,
      [TEMPLATE.TENPAI_FLAGS] : tenpaiFlags,
      [TEMPLATE.TENPAI_COUNT] : tenpaiCount,
      [TEMPLATE.NOTEN_COUNT]  : notenCount,
      [TEMPLATE.TENPAI_GAIN]  : tenpaiGain,
      [TEMPLATE.NOTEN_LOSS]   : notenLoss,
    });
  }
  return ryukyokuTemplates;
}


function templatesTest() {
  console.log(getRonAgariTemplates2(RULE_PRESETS[RULE_IDS.M_LEAGUE]));
}