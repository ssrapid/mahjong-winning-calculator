/**
 * 
 */

import * as Condition from "../condition/index.js";
import { state } from "../state.js";
import { setSelectOptions } from "./common.js";
import { attachHoverHint } from "./hoverhint.js";


/**
 * 条件追加モーダル
 * @type {HTMLDialogElement}
 */
let modal;


/**
 * 条件入力フォーム
 * @type {HTMLFormElement}
 */
let form;


/**
 * 条件コンテナ
 * @type {HTMLDivElement}
 */
let conditionContainer;


/**
 * コンテナに置く条件カードのテンプレート
 * @type {HTMLTemplateElement}
 */
let template_conditionCard;


function ensureDom() {
  // モーダル
  if(!modal) modal = document.getElementById('conditionModal');
  // フォーム
  if(!form) form = document.getElementById('form-condition');
  if(!conditionContainer) conditionContainer = document.getElementById("conditionContainer");
  if(!template_conditionCard) template_conditionCard = document.getElementById("template-conditionCard");
}



export function setUpConditionForm(){
  ensureDom();
  // モーダル表示ボタン
  document.getElementById('button-addCondition').addEventListener('click', () => showAddConditionModall(null));

  // キャンセルボタン
  form.querySelector('button[value="cancel"]').addEventListener('click', () => modal.close());

  // submitイベント
  form.addEventListener('submit', submitHandler);

  initTypeSelect();
  


}


function initTypeSelect() {
  ensureDom();
  const select = form.querySelector('select[name="type"]');
  const classes = [...Condition.registry.values()];
  for(const conditionClass of classes) {
    for(const type of Object.values(conditionClass.TYPE)) {
      const description = conditionClass.getDescription(type);
      const option = document.createElement('option');
      option.value = type;
      option.textContent = description;
      select.appendChild(option);
    }
  }

  setSelectOptions(select, classes);

}


/**
 * 現在編集中のDOM
 * @type {HTMLDivElement}
 */
let nowEditing = null;


/**
 * 
 * @param {{card:HTMLDivElement, conditionObj:object}} [card=null]
 */
function showAddConditionModall(card = null) {
  form.reset();
  nowEditing = card;
  if(nowEditing) {
    // フォームの値セット


  }

  modal.showModal();
}




/**
 * submitイベントで起動する関数
 * @param {Event} e 
 */
function submitHandler(e) {
  e.preventDefault();

  const formData = new FormData(form);
  // console.log(formData);
  // console.log(...formData.entries());
  // 
  if(!nowEditing) {
    nowEditing = createCard();
  }
  // createCard(formData);
  editCard(nowEditing, formData);
  modal.close();
}

function updateEmptyState() {
  console.log(conditionContainer.children.length);
  conditionContainer.classList.toggle(
    'is-empty',
    !state.conditions.size
  );
}




function createCard() {
  const flag = template_conditionCard.content.cloneNode(true);
  /**
   * カードのdivコンテナ。state.conditionsのキーになる。
   * @type {HTMLDivElement}
   */
  const card = flag.firstElementChild;

  // const conditionObj = {};

  // /**
  //  * マウスオーバーヒント
  //  * @type {HTMLDivElement}
  //  */
  // const hint = document.getElementById("mouseHintForCard");

  // const detachHint = attachHoverHint(card, hint, { delay: 400 });

  card.addEventListener('click', e => {
    if(e.target.closest('.condition-card-delete-btn')) {
      // 削除ボタン
      console.log('delete');
      state.conditions.delete(card);
      card.remove();
      updateEmptyState();
      // detachHint();
    } else if (e.target.closest('.condition-card-edit-btn')) {
      // 編集ボタン
      console.log('edit');
      showAddConditionModall(card);
    } else {
      // カード選択
      console.log('card');
      selectCard(card);
    }
  });

  conditionContainer.appendChild(flag);
  return card;

}

/**
 * 
 * @param {FormData} formData 
 * @returns 
 */
function formToCondition(formData) {
  return Condition.create(Object.fromEntries(formData.entries()));
}

/**
 * 
 * @param {FormData} formData 
 */
function editCard(card, formData) {
  console.log(...formData.entries());
  const type = formData.get('type');
  const value = formData.get('value');
  const obj = Object.fromEntries(formData.entries());
  console.log(obj);
  const condition = formToCondition(formData);
  console.log(condition);

  /**
   * @type {HTMLDivElement}
   */
  const label = card.querySelector('.condition-card-label');
  label.textContent = condition.label; // 仮の表示。
  state.conditions.set(card, condition);
  updateEmptyState();
}

/**
 * 
 * @param {HTMLDivElement} card 
 */
function selectCard(card) {
  for(const everycard of state.conditions.keys()) {
    everycard.classList.remove('selected');
  }
  card.classList.add('selected');
  state.selectedCondition = state.conditions.get(card);
}

function addCondition(condition) {
  const card = createCard();
  state.conditions.set(card, condition);
}
