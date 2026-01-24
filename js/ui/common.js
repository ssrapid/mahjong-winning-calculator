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
 * input / select / checkbox 等の変更イベントから state を更新する共通ハンドラ。
 * 
 * 対象要素の data 属性に基づいて state の対応フィールドへ値を反映する。
 * 
 * 使用する data 属性:
 * - data-field : state のキー名
 * - data-seat  : seatMap 用のキー（存在する場合は state[field][seat] に代入）
 * 
 * 値は要素の type に応じて正規化される。
 * - checkbox → boolean
 * - number   → number
 * - その他   → string
 * 
 * @param {Event} e - input/change イベントオブジェクト
 * 
 * @example
 * <input data-field="score" data-seat="e" type="number">
 * 
 * @example
 * element.addEventListener("input", updateState);
 */
export function updateState(e) {
  const el = e.target;
  console.log(e.target.value);
  if(!el?.dataset?.field) {
    // data-fieldが存在しない場合
    return;
  }

  const field = el.dataset.field;
  const seat  = el.dataset.seat;

  const value = castValue(el);

  if(seat) {
    // data-seatが存在する場合
    if(typeof state[field] !== 'object') {
      // stateの対応フィールドにobjectが存在しない場合
      console.warn(`state.${field}にobjectが存在しないか、object型以外の値が存在します。`);
      state[field] = SeatMap.create();
    }
    state[field][seat] = value;
  } else {
    // data-seatが存在しない場合
    state[field] = value;
  }
}

function castValue(el) {
  const t = el.dataset.valueType;

  if (t === "number") {
    return Number(el.value);
  }

  if (t === "boolean") {
    if (el.type === "checkbox") return el.checked;
    return el.value === "true";
  }

  if (el.type === "checkbox") {
    return el.checked;
  }

  if (el.type === "number") {
    return Number(el.value);
  }

  return el.value;
}

