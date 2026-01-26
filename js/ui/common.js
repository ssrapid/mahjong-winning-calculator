import { state } from '../state.js'
import * as SeatMap from '../seat-map/index.js';


/**
 * 
 * @param {HTMLSelectElement} selectElement 
 * @param {{value:string, label:string}[]} entries 
 */
export function setSelectOptions(selectElement, entries) {
  entries.forEach(({value, label}) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    selectElement.appendChild(option);
  });
  return selectElement;
}

/**
 * 
 * @param {Event} e 
 */
export function selectAllOnFocus(e){
  e.target.select();
}


/**
 * 点数をカンマ区切り・▲付きでフォーマット
 * @param {number} pt - ポイント（整数 or 小数）
 * @param {number} [minDigits=0] - 小数点以下の最低桁数（デフォルト0）
 * @param {number} [maxDigits] - 小数点以下の最大桁数（デフォルトminDigits）
 * @param {{minus?:boolean, plus?:boolean, pm0?:boolean}} [options={}] 
 * 符号オプション
 * * minus : trueの場合、負数に-記号がつく。falseまたは未定義の場合、▲表記となる。
 * * plus : trueの場合、正数に+記号がつく。
 * * pm0 : trueの場合、0に±記号がつく
 * @returns {string}
 */
export function formatPoints(pt, minDigits = 0, maxDigits, options = {}) {
  if (maxDigits === undefined) {
    maxDigits = minDigits;
  } else if (maxDigits < minDigits) {
    maxDigits = minDigits;
  }

  const absPt = Math.abs(pt);
  const formatted = absPt.toLocaleString(undefined, {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  });
  return  pt < 0 && options.minus ? `-${formatted}` :
          pt < 0                  ? `▲${formatted}` :
          pt > 0 && options.plus  ? `+${formatted}` :
          pt === 0 && options.pm0 ? `±${formatted}` : formatted;
}

