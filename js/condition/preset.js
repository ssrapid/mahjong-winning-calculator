const CONDITION_PRESETS = {
  'overall-top-1': {
    label: 'トータル全体1位',
    description: '卓外者を含む全体でトータルポイント1位になる',
    conditions: [
      { type: CONDITION_TYPE.OVERALL_TOTAL_RANK_IS, value: 1 }
    ]
  },
  'overall-top-2': {
    label: 'トータル全体2位以内',
    description: '卓外者を含む全体でトータルポイント2位以内になる',
    conditions: [
      { type: CONDITION_TYPE.OVERALL_TOTAL_RANK_AT_MOST, value: 2 }
    ]
  },
  'overall-top-3': {
    label: 'トータル全体3位以内',
    description: '卓外者を含む全体でトータルポイント3位以内になる',
    conditions: [
      { type: CONDITION_TYPE.OVERALL_TOTAL_RANK_AT_MOST, value: 3 }
    ]
  },
  'overall-top-4': {
    label: 'トータル全体4位以内',
    description: '卓外者を含む全体でトータルポイント4位以内になる',
    conditions: [
      { type: CONDITION_TYPE.OVERALL_TOTAL_RANK_AT_MOST, value: 4 }
    ]
  },
  'overall-top-5': {
    label: 'トータル全体5位以内',
    description: '卓外者を含む全体でトータルポイント5位以内になる',
    conditions: [
      { type: CONDITION_TYPE.OVERALL_TOTAL_RANK_AT_MOST, value: 5 }
    ]
  },
  'table-top-1': {
    label: 'トータル卓内1位',
    description: 'トータルポイントで卓内1位になる',
    conditions: [
      { type: CONDITION_TYPE.TABLE_TOTAL_RANK_IS, value: 1 }
    ]
  },
  'table-top-2': {
    label: 'トータル卓内2位以内',
    description: 'トータルポイントで卓内2位以内になる',
    conditions: [
      { type: CONDITION_TYPE.TABLE_TOTAL_RANK_AT_MOST, value: 2 }
    ]
  },
  'hanchan-point-50+': {
    label: '半荘ポイント50P以上',
    description: 'この半荘で50ポイント以上稼ぐ(順位点含む)',
    conditions: [
      { type: CONDITION_TYPE.HANCHAN_POINTS_AT_LEAST, value: 50 }
    ]
  },
  'hanchan-point-100+': {
    label: '半荘ポイント100P以上',
    description: 'この半荘で100ポイント以上稼ぐ(順位点含む)',
    conditions: [
      { type: CONDITION_TYPE.HANCHAN_POINTS_AT_LEAST, value: 100 }
    ]
  },
  'raw-score-100k': {
    label: '点棒10万点超え',
    description: 'この半荘終了時に点棒が10万点以上ある',
    conditions: [
      { type: CONDITION_TYPE.HANCHAN_SCORE_AT_LEAST, value: 100000 }
    ]
  },
  'hanchan-top': {
    label: '半荘トップ',
    description: 'この半荘で1位になる',
    conditions: [
      { type: CONDITION_TYPE.HANCHAN_RANK_IS, value: 1 }
    ]
  },
  'hanchan-top-2': {
    label: '連対(1位または2位)',
    description: 'この半荘で1位または2位になる',
    conditions: [
      { type: CONDITION_TYPE.HANCHAN_RANK_AT_MOST, value: 2 }
    ]
  },
  'avoid-last': {
    label: 'ラス回避(4位を回避)',
    description: 'この半荘で4位にならない(1〜3位)',
    conditions: [
      { type: CONDITION_TYPE.HANCHAN_RANK_AT_MOST, value: 3 }
    ]
  },
  'hanchan-point-nonnegative': {
    label: '半荘ポイント0P以上',
    description: 'この半荘でプラスポイントを獲得する',
    conditions: [
      { type: CONDITION_TYPE.HANCHAN_POINTS_AT_LEAST, value: 0 }
    ]
  },
  'total-positive': {
    label: 'トータルポイントプラス',
    description: 'シリーズトータルでプラスを維持する',
    conditions: [
      { type: CONDITION_TYPE.TOTAL_POINTS_AT_LEAST, value: 0 }
    ]
  },
};
