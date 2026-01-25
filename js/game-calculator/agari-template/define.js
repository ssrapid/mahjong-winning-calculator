const Key = {
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
  TENPAI_GAIN                : 'tenpaiGain',              // テンパイ料
  NOTEN_LOSS                 : 'notenLoss',               // ノーテン罰符
  TENPAI_COUNT               : 'tenpaiCount',             // テンパイ人数
  NOTEN_COUNT                : 'notenCount',              // ノーテン人数
  TENPAI_FLAGS               : 'tenpaiFlags',             // テンパイフラグ
};

const AgariType = {
  TSUMO:    'tsumo',    // ツモ
  RON:      'ron',      // ロン
  RYUKYOKU: 'ryukyoku', // 流局
};

