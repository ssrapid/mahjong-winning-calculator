import * as Rule from '../../rule/index.js'
import * as AgariTemplate from './index.js'

import plainTsumoAgariTemplates from './tsumo.json' with { type: 'json' };
import plainRonAgariTemplates from './ron.json' with { type: 'json' };


/**
 * ツモ和了時の点数などを定義した雛型を提供します。
 * @param {import('../../rule').RuleObject} ruleObj 切り上げ満貫のありなしなどを設定したルールオブジェクトが必要です。
 * @returns {import('./index.js').TsumoAgariTemplate}
 */
export function getTsumoAgariTemplates(ruleObj) {
  return getAgariTemplate(ruleObj, 'tsumo');
}


/**
 * ロン和了時の点数などを定義した雛型を提供します。
 * @param {import('../../rule/index.js').RuleObject} ruleObj 切り上げ満貫のありなしなどを設定したルールオブジェクトが必要です。
 * @returns {import('./index.js').RonAgariTemplate}
 */
export function getRonAgariTemplates(ruleObj) {
  return getAgariTemplate(ruleObj, 'ron');
}


/**
 * @overload
 * @param {import('../../rule/index.js').RuleObject} ruleObj 切り上げ満貫のありなしなどを設定したルールオブジェクトが必要です。
 * @param {"tsumo"} type ロンまたはツモ
 * @returns {import('./index.js').TsumoAgariTemplate[]}
 */
/**
 * @overload
 * @param {import('../../rule/index.js').RuleObject} ruleObj 切り上げ満貫のありなしなどを設定したルールオブジェクトが必要です。
 * @param {"ron"} type ロンまたはツモ
 * @returns {import('./index.js').RonAgariTemplate[]}
 */
/**
 * 
 * @param {import('../../rule/index.js').RuleObject} ruleObj 切り上げ満貫のありなしなどを設定したルールオブジェクトが必要です。 
 * @param {"tsumo"|"ron"} type ロンまたはツモ
 * @returns {AgariTemplate[]}
 */
function getAgariTemplate(ruleObj, type) {
  /** @type {AgariTemplate[]} */
  const retArray = [];

  let plainTemplates;
  switch (type) {
    case 'tsumo':
      plainTemplates = plainTsumoAgariTemplates;
      break;
    case 'ron':
      plainTemplates = plainRonAgariTemplates;
      break;
    default:
    throw new Error(`和了種別が間違っています(${type})。`);
  }

  if(!plainTemplates) {
    throw new Error(`${type === 'tsumo' ? 'ツモ' : 'ロン'}和了のJSONファイルが存在しません。`);
  }


  for(const template of plainTemplates) {
    const fuAndHanArray = template[AgariTemplate.Key.FU_AND_HAN];

    if(!fuAndHanArray) {
      // arrayがundefinedの場合、満貫以上の和了

      const maxYakumanLimit = ruleObj[Rule.RULE_KEY.MAX_YAKUMAN_LIMIT];
      const yakumanLevel = template[AgariTemplate.Key.YAKUMAN_LEVEL];

      // 最大点数を超える場合はスキップ
      if(yakumanLevel > maxYakumanLimit) {
        continue;
      }
    } else {
      // 満貫未満の場合

      if(ruleObj[Rule.RULE_KEY.ROUNDING_MANGAN]) {
        // 切り上げ満貫ありの場合
        // 30符4飜または60符3飜はスキップ(切り上げ満貫となり、この点数が存在しない)
        if(fuAndHanArray.find(({fu, han}) => (fu === 30 && han === 4) || (fu === 60 && han === 3))) {
          continue;
        }

        if(
          ruleObj[Rule.RULE_KEY.DOUBLE_WIND_HEAD] !== 4 && type === 'ron' && 
          fuAndHanArray.find(({fu, han}) => fu === 110 && han === 1)
        ) {
          // 連風牌の雀頭が4ではないとき、110符1飜のロン和了はスキップ
          // (ツモの110符1飜は存在しないので、最初からテンプレートに入っていない)
          continue
        }
      }
    }

    // チェックが通ったテンプレートをクローンにして配列に追加(元のimportしたそのものは返さない)
    retArray.push(structuredClone(template));
  }

  return retArray;

}
