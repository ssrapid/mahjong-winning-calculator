
/**
 * @typedef {typeof TYPE[keyof typeof TYPE]} ConditionType
 */

/**
 * @enum {string}
 * @readonly
 */
export const TYPE = Object.freeze({
  // トータル順位（全体＝卓外含む）
  /** トータル順位が全体○位 */
  OVERALL_RANK_IS       : 'OVERALL_TOTAL_RANK_IS',
  /** トータル順位が全体○位以下 */
  OVERALL_RANK_AT_MOST  : 'OVERALL_TOTAL_RANK_AT_MOST',
  /** トータル順位が全体○位以上 */
  OVERALL_RANK_AT_LEAST : 'OVERALL_TOTAL_RANK_AT_LEAST',

  // 
  /** トータル順位が卓内○位 */
  TABLE_TOTAL_RANK_IS       : 'TABLE_TOTAL_RANK_IS',
  /** トータル順位が卓内○位以内 */
  TABLE_TOTAL_RANK_AT_MOST  : 'TABLE_TOTAL_RANK_AT_MOST',
  /** トータル順位が卓内○位以上 */
  TABLE_TOTAL_RANK_AT_LEAST : 'TABLE_TOTAL_RANK_AT_LEAST',

  // トータルポイント条件
  /** トータルポイントが○ポイント以上 */
  TOTAL_POINTS_AT_LEAST : 'TOTAL_POINTS_AT_LEAST',
  /** トータルポイントが○ポイント以下 */
  TOTAL_POINTS_AT_MOST  : 'TOTAL_POINTS_AT_MOST',

  // 半荘順位（その対局のみの順位）
  /** この半荘が○位 */
  THISGAME_RANK_IS       : 'THISGAME_RANK_IS',
  /** この半荘が○位以内 */
  THISGAME_RANK_AT_MOST  : 'THISGAME_RANK_AT_MOST',
  /** この半荘が○位以上 */
  THISGAME_RANK_AT_LEAST : 'THISGAME_RANK_AT_LEAST',

  // 半荘ポイント（この半荘のポイント）
  /** 今半荘で○ポイント以上稼ぐ */
  THISGAME_POINTS_AT_LEAST : 'THISGAME_POINTS_AT_LEAST',
  /** 今半荘で○ポイント以下 */
  THISGAME_POINTS_AT_MOST  : 'THISGAME_POINTS_AT_MOST',

  // 半荘スコア（この半荘の点数、点棒ベース）
  /** 今半荘で○点以上稼ぐ */
  THISGAME_SCORE_AT_LEAST  : 'THISGAME_SCORE_AT_LEAST',
  /** 今半荘で○点以下 */
  THISGAME_SCORE_AT_MOST   : 'THISGAME_SCORE_AT_MOST',

  // 特定プレイヤーとの順位比較
  /** 指定プレイヤーより上位 */
  TOTAL_RANK_HIGHER_THAN  : 'TOTAL_RANK_HIGHER_THAN',
  /** 指定プレイヤーより下位 */
  TOTAL_RANK_LOWER_THAN   : 'TOTAL_RANK_LOWER_THAN'
});

/**
 * @typedef {typeof CATEGORY[keyof typeof CATEGORY]} ConditionCategory
 */
/**
 * 条件のカテゴリ
 * @enum {string}
 * @readonly
 */
export const CATEGORY = Object.freeze({
  OVERALL_TOTAL_RANK: 'OVERALL_RANK',
  TABLE_RANK: 'TABLE_RANK',
  TOTAL_POINT: 'TOTAL_POINTS',
  THISGAME_RANK: 'THISGAME_RANK',
  THISGAME_POINT: 'THISGAME_POINT',
  THISGAME_RANK: 'THISGAME_RANK',
});


/**
 * 順位決定の際、同ポイントになった場合の順位決定方法
 * @typedef {typeof TIE_BREAKER_TYPE[keyof typeof TIE_BREAKER_TYPE]} TieBreakerType
 */

/**
 * 同ポイント時の順位決定方法
 * @enum {string}
 * @readonly
 */
export const TIE_BREAKER_TYPE = Object.freeze({

  /**
   * 対局前のポイントが上位だった方が高順位(先行有利)
   */
  PREPOINT_LEADER: 'prePointLeader',

  /**
   * 対局前のポイントが下位だった方が高順位(追いつき有利)
   */
  PREPOINT_CHASER: 'prePointChaser',

  /**
   * あらかじめ決められた優先順位(期首順位、予選通過順位など)によって、順位を決定する
   */
  TIE_BREAKER_RANK: 'tieBreakerRank'

});
