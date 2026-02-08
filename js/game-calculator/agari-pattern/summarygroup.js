/**
 * @typedef {object} SummaryGroupKey
 * @property {import('../define.js').AgariType} agariType
 * @property {import('../../seat-utilities/index.js').Seat} [winner]
 * @property {import('../../seat-utilities/index.js').Seat} [discarder]
 * @property {import('../../seat-utilities/index.js').Seat} [focus]
 * @property {boolean} tenpai
 */

import { AGARI_TYPE } from '../define.js';
import * as SeatMap from '../../seat-map/index.js';
import * as MyUtilities from '../../my-utilities/index.js';

/**
 * 
 * @param {SummaryGroupKey} options 
 * @returns {string}
 */
function convertToKey(options) {
  const { agariType } = options;
  switch(agariType) {
    case AGARI_TYPE.TSUMO:
    case AGARI_TYPE.RON:
      // ツモに放銃者はいないが、undefinedで文字列化する
      return `AgariType:${agariType},Winner:${options.winner},Discarder:${options.discarder}`;
    case AGARI_TYPE.RYUKYOKU:
      if(options.focus) {
        return `AgariType:${agariType},"${options.focus}":${
          options.tenpai === true ? 'tenpai' :
          options.tenpai === false ? 'noten' : options.tenpai}`;
      }
      return `AgariType:${agariType}`;
    default:
      throw new Error(`Unknown AgariType: ${ agariType }.`);
  }
}

/**
 * @typedef {object} GroupObject
 * @property {import('../define.js').AgariType} agariType
 * @property {import('../../seat-utilities/index.js').Seat} [winner]
 * @property {import('../../seat-utilities/index.js').Seat} [discarder]
 * @property {import('./create.js').Pattern[]} patterns
 * @property {boolean} summarized
 * @property {Map<import('../../condition').Condition, import('../../seat-map/index.js').SeatMap<string>>} [summary]
 */
export class SummaryGroup {
  constructor(){
    /** @type {Map<string, GroupObject>} */
    this.groups = new Map();
  }

  /**
   * @param {SummaryGroupKey} keyObj 
   * @param {...import('./create.js').Pattern} patterns 
   */
  push(keyObj, ...patterns) {
    const keyString = convertToKey(keyObj);
    
    let g = this.groups.get(keyString);
    if(!g) {
      g = Object.assign({}, keyObj, { patterns:[], summarized: false, summary: undefined });
      this.groups.set(keyString, g);
    }
    return g.patterns.push(...patterns);
  }

  get(keyObj) {
    return this.groups.get(convertToKey(keyObj));
  }


  /**
   * 
   * @param {import('../../condition/index.js').Condition[]} conditions
   * パターンのevaluateに使ったConditionオブジェクトの配列
   */
  summarize(conditions) {
    this.groups.forEach(group => {
      const { agariType, winner, discarder, patterns } = group;

      group.summary = new Map(conditions.map(condition => {
        const summaryMap = buildSummaryMap(group, condition);
        return [condition, summaryMap];
      }));

      group.summarized = true;
    });

  }

  /**
   * 
   * @param {SummaryGroupKey} keyObj 
   * @param {import('../../condition').Condition} condition 
   * @param {import('../../seat-utilities').Seat} seat 
   * @returns {{ text: string, fulfilled: boolean }|undefined}
   */
  getSummary(keyObj, condition, seat) {
    const group = this.get(keyObj);
    const summaryMap = group.summary.get(condition);
    if(!summaryMap) return undefined;
    return summaryMap[seat];
  }

}



/**
 * 
 * @param {GroupObject} group 
 * @param {import('../../condition').Condition} condition 
 * @returns 
 */
function buildSummaryMap(group, condition) {
  const { agariType, winner, discarder, patterns } = group;

  return SeatMap.create(seat => {
    const flags = patterns.map(pattern => 
      pattern.playersInfo[seat].conditions.get(condition)?.fulfilled);
    /** @type {boolean} */
    const fulfilled = flags.some(v => v === true);
    const allTrue = flags.every(v => v === true);
    const allFalse = flags.every(v => v === false);

    if(agariType === AGARI_TYPE.RYUKYOKU) {
      // 流局
      return buildRyukyokuSummary(group, condition, seat);
    }

    // 和了
    if(allTrue) {
      if(seat === winner) {
        // 和了条件に該当
        return { text: `${patterns[0].agariLabel}以上`, fulfilled};
      }
      // 和了以外(放銃、被ツモ、横移動)
      return { text: '○', fulfilled };
    } else if(allFalse) {
      if(seat === discarder) {
        // 放銃条件に該当
        return { text: '放銃不可', fulfilled };
      }
      // 放銃以外(和了、被ツモ、横移動)
      return { text: '×', fulfilled };
    }

    /**
     * 放銃条件などで、「○○不可」のように出す場合、この値をfalseにして使う。
     * 今のところ、放銃してもよい点数を表示することとする
     */
    const target = true;
    // const target = seat !== discarder;

    const booleanRanges = MyUtilities.findBooleanRangesWithExceptions(flags, target, { maxGap:2, maxExcept:3 });

    /**
     * booleanRangeを "○○以上○○以下(除く○○)" のフォーマットで文字列化する。
     * @type {string[]}
     */
    const parts = booleanRanges.map((range, _, array) => {
      const { start, end, except } = range;
      if(start === end) {
        // 連続しない範囲の場合
        return patterns[start].agariLabel + (array.length === 1  ? 'のみ' : '');
      }
      /** "○○以上" */
      const from = ((target === false || seat !== winner) && start === 0) ? '' : patterns[start].agariLabel + '以上';
      /** "○○以下"  */
      const to = end === flags.length - 1 ? '' : patterns[end].agariLabel + '以下';
      /** "(除く○○)" */
      const skip = except == null ? '' :
        `(除く${ except.map(i => patterns[i].agariLabel).join(', ') })`;
      return from + to + skip;
    });

    if(target) {
      // 可条件の場合、"または" で繋げる。
      return { text: parts.join('または'), fulfilled };
    } else {
      // 不可条件の場合、"および" で繋げて、末尾に"不可"をつける。
      return { text: parts.join('および') + '不可', fulfilled };
    }
    
  });
}



/**
 * 
 * @param {GroupObject} group 
 * @param {import('../../condition').Condition} condition 
 * @param {import('../../seat-utilities').Seat} seat 
 * @returns 
 */
function buildRyukyokuSummary(group, condition, seat) {
  const { patterns } = group;
  /** @type {boolean[]} */
  const flags = patterns.map(pattern => 
    pattern.playersInfo[seat].conditions.get(condition)?.fulfilled);
  const fulfilled = flags.some(v => v === true);
  const allTrue = flags.every(v => v === true);
  const allFalse = flags.every(v => v === false);

  if (allTrue)  return { text: '○', fulfilled };
  if (allFalse) return { text: '×', fulfilled };
  return { text: '△', fulfilled };
}

/**
 * 
 * @param {GroupObject} group 
 * @param {import('../../condition').Condition} condition 
 * @param {import('../../seat-utilities').Seat} seat 
 * @returns 
 */
function buildAgariSummary(group, condition, seat) {

}