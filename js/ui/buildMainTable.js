import { state } from "../state.js";
import { SEAT_ORDER, SEATS, seatToJp } from "../seat-utilities/index.js";
import { selectAllOnFocus, updateState } from './common.js'

/**
 * 
 * @param {...(tr:HTMLTableRowElement)=>void} applyFns 
 * @returns {HTMLTableRowElement}
 */
function makeTr(...applyFns) {
  const tr = document.createElement('tr');
  applyFns.forEach(fn => fn(tr));
  return tr;
}

/**
 * 
 * @param {string} tagName 
 * @param {
 *   classList?: string[],
 * } [options={}]
 * @param  {...(el:HTMLElement)=>void} applyFns 
 * @returns {HTMLElement}
 */
function makeElement(tagName, ...applyFns) {
  const element = document.createElement(tagName);
  applyFns.forEach(fn => fn(element));
  return element;
}

/**
 * 
 * @param {{
 *   type?: string,
 *   id?: string,
 *   classList?: string[],
 *   properties?: [property: string, value: string][],
 *   attributes?: [qualifiedName:string, value: string][],
 *   eventListeners?: {
 *     type: string,
 *     listener: EventListenerOrEventListenerObject,
 *     options?: boolean | AddEventListenerOptions
 *   }[],
 *   label?: string,
 *   beforeLabel?: string,
 *   afterLabel?: string,
 *   labelPosition?: 'before'|'after'}} [options={}] 
 * @returns {HTMLInputElement|HTMLLabelElement}
 */
function makeInput(options={}) {
  const input = document.createElement('input');
  if (options?.type) { input.type = options?.type };
  if (options?.id) { input.id = `input_${options?.id}`};
  if (Array.isArray(options?.classList)) {
    input.classList.add(...(options?.classList.map(className => `input-${className}`)))
  }

  // property
  options?.properties?.forEach(([property, value]) => {
    input[property] = value;
  });

  // attribute
  options?.attributes?.forEach(([qualifiedName, value]) => {
    input.setAttribute(qualifiedName, value);
  });

  // eventListener
  options?.eventListeners?.forEach(({type, listener, options}) => {
    input.addEventListener(type, listener, options);
  });

  if(options?.label) {
    // ラベル付きのinput
    const label = document.createElement('label');
    // const textNode = document.createTextNode(options.label);
    if(options?.labelPosition === 'before') {
      label.append(options?.label, input);
    } else {
      label.append(input, options?.label);
    }
    return label;
  } else if(options?.beforeLabel || options?.afterLabel) {
    const label = document.createElement('label');
    label.append(...[options?.beforeLabel, input, options?.afterLabel].filter(v => v != null));
    return label;
  } else {
    // ラベルなしのinput
    return input;
  }
}

function makeButton(options, ...applyFns) {
  const button = document.createElement('button');
}



/**
 * 
 * @param {HTMLTableRowElement} rowElement セルを追加する行
 * @param {"th"|"td"} [celltype="td"]
 * @param  {...(cell:HTMLTableCellElement)=>void} applyFns セルに適用する関数群
 * @returns {HTMLTableCellElement} 新しく生成されたセル
 */
function appendNewTableCellElement(rowElement, celltype = 'td', ...applyFns) {
  const cell = document.createElement(celltype);
  applyFns.forEach(fn => fn(cell));
  return rowElement.appendChild(cell);
}

/**
 * 
 * @param {HTMLElement} root 親ノード
 * @param  {...HTMLElement} elements 子ノード
 * @returns {HTMLElement} rootそのもの
 */
function appendElements(root, ...elements){
  elements.forEach(el => root.appendChild(el));
  return root;
}


/**
 * 
 * @param {*} root 
 */
export function buildMainTable(root) {
  const table = document.createElement('table');
  table.id = 'mainTable'
  table.classList.add('main-table');
  // const makeCell = (seat) => {

  // }

  // head
  // const thead = document.createElement('thead');
  const thead = makeElement('thead', thead => {
    thead.id = 'mainTable_tbody';
    const mainTableDef = [
      {
        key: 'name',
        rowLabel: '対局者名',
        cellType: 'th',
        type:'text',
        properties: [['type', 'text'], ['placeholder', seat=>`${seatToJp(seat)}家`]],
        attributes: [['data-field', 'name'], ['data-seat', seat=>seat]],
        eventListeners: [{type: 'focus', listener: selectAllOnFocus}, {type: 'input', listener: updateState}]
      },
      {
        key: 'point',
        rowLabel: '開始前ポイント',
        cellType: 'td',
        type:'number',
        properties: [['value', '0.0'], ['step', '0.1']],
        attributes: [['data-field', 'point'], ['data-seat', seat=>seat]],
        eventListeners: [{type: 'focus', listener: selectAllOnFocus}]
      },
      {
        key: 'score',
        rowLabel: '持ち点',
        cellType: 'td',
        type:'number',
        properties: [['value', '25000'], ['step', '100']],
        attributes: [['data-field', 'score'], ['data-seat', seat=>seat]],
        eventListeners: [{type: 'focus', listener: selectAllOnFocus}]
      },
      {
        key: 'dealer',
        rowLabel: '親番',
        cellType: 'td',
        type:'radio',
        properties: [['name', 'radio_dealer'], ['value', seat=>seat], ['checked', seat=>seat===SEATS.N]],
        attributes: [['data-field', 'dealer'], ['data-seat', seat=>seat]],
        label:'親番'
      },
      // { key: 'riichi', rowLabel: 'リーチ', cellType: 'td', property:[['type', 'checkbox']], label: 'リーチ' },
    ];

    mainTableDef.forEach(defObject => {
      thead.appendChild(makeElement('tr', tr => {
        tr.id = `tr_input_${defObject.key}`;  // 後付けで6列目を追加するので、id付与
        tr.appendChild(makeElement('th', th => { th.textContent = defObject.rowLabel }));
        SEAT_ORDER.forEach(seat => {
          tr.appendChild(makeElement(defObject.cellType, cell => {
            cell.colSpan = 2;
            const input = makeInput({
              type: defObject.type,
              id: `${defObject.key}_${seat}`,
              classList: [defObject.key, `player_${seat}`],
              properties: defObject.properties?.map((
                [property, value]) => [property, typeof value === 'function' ? value(seat) : value]),
              attributes: defObject.attributes?.map((
                [qualifiedName, value]) => [qualifiedName, typeof value === 'function' ? value(seat) : value]),
              label: defObject.label,
              eventListeners: defObject.eventListeners
            });
            
            cell.appendChild(input);
          }));
        });
      }));
    });
    

  });

  thead.append(
    appendElements(document.createElement('tr'),
      makeElement('th', th => { th.textContent = '供託・積み棒'; }),
      makeElement('td', td => {
        td.colSpan = 8;
        const div = document.createElement('div');
        div.classList.add('tr-kyotaku-tsumibo');
        div.append(
          makeElement('div', div => {
            div.append(
              makeInput({
                type: 'checkbox',
                id: 'finalRound',
                label:'オーラス',
                properties: [['checked', true]]
              })
            );
          }),
          makeElement('div', div => {
            const input = makeInput({
              type: 'number',
              id: 'tsumibo',
              properties: [['value', '0']],
              eventListeners: [{type: 'focus', listener: selectAllOnFocus}]
            });
            const inputLabel = makeElement('label', label => label.append('積み棒:', input));
            div.append(
              inputLabel,
              makeElement('button', button => {
                button.id = 'button_increment_tsumibo';
                button.type = 'button';
                button.append('+1');
                button.addEventListener('click', e => { input.value = Number(input.value) + 1; });
              }),
              makeElement('button', button => {
                button.id = 'button_reset_tsumibo';
                button.type = 'button';
                button.append('Reset');
                button.addEventListener('click', e => { input.value = 0; });
              })
            );
          }),
          makeElement('div', div => {
            const input = makeInput({
              type: 'number',
              id: 'kyotaku',
              properties: [['value', '0']],
              eventListeners: [{ type: 'focus', listener: selectAllOnFocus }]
            });
            const inputLabel = makeElement('label', label => label.append('供託:', input));
            div.append(inputLabel,
            makeElement('button', button => {
              button.id = 'button_increment_kyotaku';
              button.type = 'button';
              button.append('+1');
              button.addEventListener('click', e => { input.value = Number(input.value) + 1; });
            }),
            makeElement('button', button => {
              button.id = 'button_reset_kyotaku';
              button.type = 'button';
              button.append('Reset');
              button.addEventListener('click', e => { input.value = 0; });
            }));
          })
        );
        td.appendChild(div);
      })
    ),

    appendElements(document.createElement('tr'),
      makeElement('th', th => { th.textContent = 'リーチ'; }),
      ...SEAT_ORDER.map(seat => {
        const cell = document.createElement('td');
        cell.colSpan = 2;
        const input = makeInput({
          type: 'checkbox',
          id: `riichi_${seat}`,
          classList: ['riichi', `player_${seat}`],
          attributes: [['data-field', 'riichi'], ['data-seat', seat]],
          label:'リーチ'
        });
        cell.appendChild(input);
        return cell;
    }))
  );

  table.appendChild(thead);




  root.appendChild(table);

}

function addEventListeners() {

}