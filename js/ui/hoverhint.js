/**
 * マウス停止で hintEl を表示する
 * @param {HTMLElement} target 対象DOM
 * @param {HTMLElement} hintEl ヒントのDOM
 * @param {{delay?:number, offset?:number}} options
 * @returns {()=>void} detach関数
 */
export function attachHoverHint(target, hintEl, options = {}) {
  const delay  = options.delay  ?? 500;
  const offset = options.offset ?? 12;

  let timer = null;
  let shown = false;
  let lastX = 0;
  let lastY = 0;

  function onEnter(e) {
    lastX = e.clientX;
    lastY = e.clientY;
    shown = false;

    timer = setTimeout(() => {
      hintEl.style.left = lastX + offset + "px";
      hintEl.style.top  = lastY + offset + "px";
      hintEl.style.opacity = "1";
      shown = true;
    }, delay);
  }

  function onMove(e) {
    const dx = Math.abs(e.clientX - lastX);
    const dy = Math.abs(e.clientY - lastY);

    lastX = e.clientX;
    lastY = e.clientY;

    if (shown && (dx > 2 || dy > 2)) {
      hintEl.style.opacity = "0";
      shown = false;
    }
  }

  function onLeave() {
    clearTimeout(timer);
    timer = null;
    shown = false;
    hintEl.style.opacity = "0";
  }

  function hide() {
  clearTimeout(timer);
  timer = null;
  shown = false;
  hintEl.style.opacity = "0";
}

  target.addEventListener("mouseenter", onEnter);
  target.addEventListener("mousemove", onMove);
  target.addEventListener("mouseleave", onLeave);

  return () => {
    hide();
    target.removeEventListener("mouseenter", onEnter);
    target.removeEventListener("mousemove", onMove);
    target.removeEventListener("mouseleave", onLeave);
  };
}
