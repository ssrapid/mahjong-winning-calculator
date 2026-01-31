/**
 * 
 */

import { state } from "../state.js";
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

}




/**
 * 現在編集中のDOM
 * @type {{card:HTMLDivElement, conditionObj:object}|null}
 */
let nowEditing = null;


/**
 * 
 * @param {{card:HTMLDivElement, conditionObj:object}} [condObj=null]
 */
function showAddConditionModall(condObj=null) {
  form.reset();
  nowEditing = condObj;
  if(nowEditing) {

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
  console.log(...formData.entries());
  // 
  if(!nowEditing) {
    nowEditing = createCard();
  }
  // createCard(formData);
  editCard(nowEditing.card, nowEditing.conditionObj, formData);
  modal.close();
}

function updateEmptyState() {
  console.log(conditionContainer.children.length);
  conditionContainer.classList.toggle(
    'is-empty',
    !conditionContainer.children.length
  );
}




/**
 * 
 * @param {FormData} formData 
 */
function createCard(formData) {
  const flag = template_conditionCard.content.cloneNode(true);
  const card = flag.firstElementChild;

  const conditionObj = {};

  /**
   * マウスオーバーヒント
   * @type {HTMLDivElement}
   */
  const hint = document.getElementById("mouseHintForCard");

  const detachHint = attachHoverHint(card, hint, { delay: 400 });

  card.addEventListener('click', e => {
    if(e.target.closest('.condition-card-delete-btn')) {
      // 削除ボタン
      console.log('delete');
      card.remove();
      updateEmptyState();
      detachHint();
    } else if (e.target.closest('.condition-card-edit-btn')) {
      // 編集ボタン
      console.log('edit');
      showAddConditionModall({ card, conditionObj });
    } else {
      // カード選択
      console.log('card');
      state.selectedCondition = conditionObj;
    }
  });





  state.conditions.push(conditionObj);
  conditionContainer.appendChild(flag);
  updateEmptyState();
  return {card, conditionObj};

}


/**
 * 
 * @param {FormData} formData 
 */
function editCard(card, conditionObj, formData) {
  /**
   * @type {HTMLDivElement}
   */
  const label = card.querySelector('.condition-card-label');
  label.textContent = 'トータル2位以上'; // 仮の表示。

}
