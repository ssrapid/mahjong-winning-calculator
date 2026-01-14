
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
 *   classList?: string[]
 *   properties?: [property: string, value: string][],
 *   attributes?: [qualifiedName:string, value: string][],
 *   label?: string,
 *   labelPosition?: 'before'|'after'}} options 
 * @returns 
 */
function makeInput(options) {
  const input = document.createElement('input');
  if (options?.type) { input.type = options?.type };
  if (options?.id) { input.id = `input_${options?.id}`};
  if (Array.isArray(options?.classList)) {
    input.classList.add(...(options?.classList.map(className => `input-${className}`)))
  }

  // property
  options?.properties?.forEach(([property, value]) => {
    input[property] = (typeof value === 'function' ? value(seat) : value);
  });

  // attribute
  options?.attributes?.forEach(([qualifiedName, value]) => {
    input.setAttribute(qualifiedName, typeof value === 'function' ? value(seat) : value);
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
  } else {
    // ラベルなしのinput
    return input;
  }
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
function buildMainTable(root) {
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
      { key: 'name', rowLabel: '対局者名',cellType: 'th', property: [['type', 'text'], ['placeholder', seat=>`${seatToJp(seat)}家`]]},
      { key: 'point', rowLabel: '開始前ポイント', cellType: 'td', property: [['type', 'number'], ['value', '0.0'], ['step', '0.1']] },
      { key: 'score', rowLabel: '持ち点', cellType: 'td', property: [['type', 'number'], ['value', '25000'], ['step', 100]] },
      { key: 'dealer', rowLabel: '親番', cellType: 'td', property: [['type', 'radio'], ['name', 'radio_dealer'], ['value', seat=>seat], ['checked', seat=>seat===SEATS.N]], label:'親番'},
      // { key: 'riichi', rowLabel: 'リーチ', cellType: 'td', property:[['type', 'checkbox']], label: 'リーチ' },
    ];

    mainTableDef.forEach(defObject => {
      thead.appendChild(makeElement('tr', tr => {
        tr.appendChild(makeElement('th', th => { th.textContent = defObject.rowLabel }));
        SEAT_ORDER.forEach(seat => {
          tr.appendChild(makeElement(defObject.cellType, cell => {
            cell.colSpan = 2;
            const input = document.createElement('input');
            input.id = `input_${defObject.key}_${seat}`;
            input.classList.add(`input-${defObject.key}`);
            defObject.property?.forEach(([property, value]) => {
                input[property] = (typeof value === 'function' ? value(seat) : value);
            });
            defObject.attribute?.forEach(([qualifiedName, value]) => {
              input.setAttribute(qualifiedName, typeof value === 'function' ? value(seat) : value);
            });
            if(defObject.label) {
              const label = document.createElement('label');
              const textNode = document.createTextNode(defObject.label);
              label.appendChild(input);
              label.appendChild(textNode);
              cell.appendChild(label);
            } else {
              cell.appendChild(input);
            }
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
        td.append(
          makeInput({type: 'checkbox', id: 'finalRound', label:'オーラス'}),
          makeInput({type: 'number', id: 'tsumobo', properties: [['value', '0']], label:'積み棒: ', labelPosition: 'before'}),
          makeInput({type: 'number', id: 'kyotaku', properties: [['value', '0']], label:'供託: ', labelPosition: 'before'})
        );
        // appendElements(td, makeInput({type: 'number', id: 'kyotaku', label:'積み棒: ', labelPosition: 'before'}));
      })
    ),
    appendElements(document.createElement('tr'),
      makeElement('th', th => { th.textContent = 'リーチ'; }),
      ...SEAT_ORDER.map(seat => {
        const cell = document.createElement('td');
        cell.colSpan = 2;
        const input = makeInput({type: 'checkbox', id: `riichi_${seat}`, classList: ['riichi', seat], label:'リーチ'})
        cell.appendChild(input);
        return cell;
    }))
  );

  table.appendChild(thead);




  root.appendChild(table);

}

// window.addEventListener('DOMContentLoaded', () => {
//   const table_root = document.getElementById('main-table-root');
//   buildMainTable(table_root);
// });
