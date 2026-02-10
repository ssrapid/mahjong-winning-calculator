import * as GameCalc from '../game-calculator/index.js';
import { promise_detailModal } from '../main.js';
import { SEAT_ORDER, seatToJp } from '../seat-utilities/index.js';
import { state } from '../state.js';
import * as SeatMap from '../seat-map/index.js'
import { formatPoints } from './common.js';
import { ordinal } from '../my-utilities/ordinal.js';


let root = document;

const detailState = {
  winner: 'e',
  discarder: 'tsumo',
  displayMode: 'score'
}


/**
 * @param {HTMLDialogElement} modal 
 */
export function initDetailModal(modal) {
  root = modal;
  /**
   * "×"ボタンで閉じる
   * @type {HTMLButtonElement}
   */
  const closeBtn = modal.querySelector('button#closeDetailModal');
  closeBtn.addEventListener('click', () => modal.close());
  // 背景クリックで閉じる
  modal.addEventListener('click', (e) => {
    if(e.target === modal) modal.close();
  });

  initRadio(modal);
}


/**
 * 
 * @param {HTMLDialogElement} modal 
 */
function initRadio(modal) {
  for(const radio of modal.querySelectorAll('input[type="radio"][name="detailWinner"]')) {
    radio.addEventListener('change', () => {
      detailState.winner = radio.value;
      setDetailRadioEnabled();
      renderTable();
    });
  }
  for(const radio of modal.querySelectorAll('input[type="radio"][name="detailDiscarder"]')) {
    radio.addEventListener('change', () => {
      detailState.discarder = radio.value;
      renderTable();
    });
  }
  for(const radio of modal.querySelectorAll('input[type="radio"][name="detailDisplayMode"]')) {
    radio.addEventListener('change', () => {
      detailState.displayMode = radio.value;
      renderTable();
    });
  }

}



// function detailRadioHander() {
//   const winner = root.querySelector(`input[type="radio"][name="detailWinner"]:checked`)?.value;
//   const discarder = root.querySelector(`input[type="radio"][name="detailDiscarder"]:checked`)?.value;
//   const displayMode = root.querySelector(`input[type="radio"][name="detailDisplayMode"]:checked`)?.value;
//   const ryukyoku = winner === GameCalc.AGARI_TYPE.RYUKYOKU;
//   const tsumo = discarder === GameCalc.AGARI_TYPE.TSUMO;
//   for(const radio of root.querySelectorAll(`input[type="radio"][name="detailDiscarder"]`)) {
//     const seat = radio.value;
//     // console.log(`winner:${winner} seat:${seat}`)
//     radio.disabled = ryukyoku || (!tsumo && seat === winner);
//   }

//   if(ryukyoku) {
//     showDetail({ agariType: GameCalc.AGARI_TYPE.RYUKYOKU }, displayMode);
//   } else if(tsumo) {
//     showDetail({ agariType: GameCalc.AGARI_TYPE.TSUMO, winner }, displayMode);
//   } else {
//     showDetail({ agariType: GameCalc.AGARI_TYPE.RON, winner, discarder }, displayMode);
//   }
// }

function setDetailRadioEnabled() {
  for(const radio of root.querySelectorAll(`input[type="radio"][name="detailDiscarder"]`)) {
    const seat = radio.value;
    radio.disabled = (detailState.winner === "ryukyoku") || (seat === detailState.winner);
  }
}


/**
 * 
 * @param {{}} options 
 * @param {*} displayMode 
 */
function setDetailRadios(options, displayMode = undefined) {
  const { agariType } = options;
  if(agariType === GameCalc.AGARI_TYPE.RYUKYOKU) {
    root.querySelector(`input[type="radio"][name="detailWinner"][value="ryukyoku"]`).checked = true;
    detailState.winner = 'ryukyoku';
  } else {
    const { winner, discarder } = options;
    root.querySelector(`input[type="radio"][name="detailWinner"][value="${ winner }"]`).checked = true;
    detailState.winner = winner;
    if(agariType === GameCalc.AGARI_TYPE.TSUMO) {
      root.querySelector(`input[type="radio"][name="detailDiscarder"][value="tsumo"]`).checked = true;
      detailState.discarder = agariType;
    } else {
      root.querySelector(`input[type="radio"][name="detailDiscarder"][value="${ discarder }"]`).checked = true;
      detailState.discarder = discarder;
    }
  }

  if(displayMode) {
    root.querySelector(`input[type="radio"][name="detailDisplayMode"][value="${ displayMode }"]`).checked = true;
    detailState.displayMode = displayMode;
  }
  
  setDetailRadioEnabled();
}





function stateToOptions() {
  const winner = detailState.winner;
  const discarder = detailState.discarder;
  const displayMode = detailState.displayMode;
  const agariType = 
    winner === GameCalc.AGARI_TYPE.RYUKYOKU ? GameCalc.AGARI_TYPE.RYUKYOKU :
    discarder === GameCalc.AGARI_TYPE.TSUMO ? GameCalc.AGARI_TYPE.TSUMO : GameCalc.AGARI_TYPE.RON;
  if(winner === GameCalc.AGARI_TYPE.RYUKYOKU) {
    return { agariType };
  } else if(discarder === GameCalc.AGARI_TYPE.TSUMO) {
    return { agariType, winner };
  } else {
    return { agariType, winner, discarder };
  }

}


function renderTable() {
  const tbody = root.querySelector('tbody#detailTableBody');
  tbody.innerHTML = ''; // リセット

  const keyObj = stateToOptions();
  const displayMode = detailState.displayMode;

  // 名前
  SeatMap.forEach((player, seat) => {
    const cell = root.querySelector(`.detail-name[data-seat="${ seat }"]`);
    cell.textContent = player.name ?? seatToJp(seat) + '家';
  }, state.players);


  // 現在のポイント、点棒をセット
  const tentatives = [
    { className: 'detail-start-point', fn: player => formatPoints(player.startPoint / 1000, 1, 2, { minus:true }) },
    { className: 'detail-now-score', fn: player => formatPoints(player.score, 0, undefined, { minus:true }) }];
  for(const setting of tentatives) {
    SeatMap.forEach((player, seat) => {
      const cell = root.querySelector(`.${ setting.className }[data-seat="${ seat }"]`);
      cell.innerHTML = setting.fn(player);
    }, state.lastInput.playersInfo);
  }

  /**
   * 表示する和了のグループ
   */
  const group = state.result?.summaryGroup?.get(keyObj);
  if(!group) {
    const columns = 7;
    tbody.innerHTML = `<tr><td colspan="${ columns }">該当データがありません。</td></tr>`;
    return;
  }

  // パターンを展開
  for(const pattern of group.patterns) {
    const tr = document.createElement('tr');
    const winner = pattern?.winner ? (state.players[pattern.winner].name ?? seatToJp(pattern.winner) + '家') : '';
    const discarder = pattern?.discarder ? (state.players[pattern.discarder].name ?? seatToJp(pattern.discarder) + '家') : ''
    const agariLabel = function() {
      const agariLabel = pattern?.agariLabel ?? '';
      if(keyObj.agariType === GameCalc.AGARI_TYPE.RYUKYOKU) {
        return SEAT_ORDER.reduce((acc, seat) => 
          acc.replace(seat, state.players[seat].name ?? seatToJp(seat) + '家'), agariLabel)
      } else {
        return agariLabel;
      }
    }();

    for(const text of [ winner, discarder, agariLabel ]) {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    }
    
    SeatMap.forEach((player, seat) => {
      const td = document.createElement('td');
      try {
        td.textContent = displayFn[displayMode](player);
      } catch (e) {
        td.textContent = 'error';
      }
      td.classList.add('player-data', `player-data-${seat}`);
      td.classList.toggle(
        'fulfilled',
        player.conditions.get(state.selectedCondition).fulfilled
      );
      
      tr.appendChild(td);
    }, pattern.playersInfo);

    tbody.appendChild(tr);
  }

}

const displayFn = Object.freeze({
  totalPoint: player => formatPoints(player?.point / 1000, 1, 2, { minus:true }) ?? '',
  // totalRank: player => ordinal(player?.rank) ?? '',
  // tableRank: player => ordinal(player?.tableRank) ?? '',
  gamePoint: player => formatPoints(player?.gamePoint / 1000, 1, 2, { minus:true }) ?? '',
  gameRank : player => ordinal(player.gameRank) ?? '',
  score: player => formatPoints(player?.score, 0, 0, { minus: true}) ?? ''
});


/**
 * 
 * @param {{}} options 
 */
export async function showDetail(options, displayMode = 'score') {
  const modal = await promise_detailModal;
  setDetailRadios(options, displayMode);
  renderTable();
  modal.showModal();
}


/**
 * 
 * @param {HTMLTableElement} mainTable 
 */
export function attachDetailEvent(mainTable) {
  mainTable.addEventListener('click', e => {
    /** @type {HTMLDivElement} */
    const div = e.target.closest('td > div.condition-result');
    
    if (!div) return;

    const td = div.closest('td.td-result');
    if (!td) return;

    const agariType = td.dataset?.agariType;
    const seat = td.dataset?.seat;
    const winner = td.dataset?.winner;
    const discarder = td.dataset?.discarder;
    const stateTenpai = td.dataset?.stateTenpai;
    const obj = { agariType, seat, winner, discarder, stateTenpai };
    showDetail(obj);
  });
}
