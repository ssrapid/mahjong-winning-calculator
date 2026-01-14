'use strict'; /* 厳格にエラーをチェック */

{ /* ローカルスコープ */

  // DOM取得
  const tabMenus = document.querySelectorAll('.tab__menu-item');

  // イベント付加
  tabMenus.forEach((tabMenu) => {
    tabMenu.addEventListener('click', tabSwitch);
  })

  // イベントの処理
  function tabSwitch(e) {

    // クリックされた要素のデータ属性を取得
    const tabTargetData = e.currentTarget.dataset.tab;

    // クリックされた要素の親要素と、その子要素を取得
    const tabList = e.currentTarget.closest('.tab__menu');
    const tabItems = tabList.querySelectorAll('.tab__menu-item');

    // クリックされた要素の親要素の兄弟要素の子要素を取得
    const tabPanelItems = tabList.
    nextElementSibling.querySelectorAll('.tab__panel-box');

    // クリックされたtabの同階層のmenuとpanelのクラスを削除
    tabItems.forEach((tabItem) => {
      tabItem.classList.remove('is-active');
    })
    tabPanelItems.forEach((tabPanelItem) => {
      tabPanelItem.classList.remove('is-show');
    })

    // クリックされたmenu要素にis-activeクラスを付加
    e.currentTarget.classList.add('is-active');

    // クリックしたmenuのデータ属性と等しい値を持つパネルにis-showクラスを付加
    tabPanelItems.forEach((tabPanelItem) => {
      if (tabPanelItem.dataset.panel ===  tabTargetData) {
        tabPanelItem.classList.add('is-show');
      }
    })
  }

}

/**
 * 
 * @param {HTMLElement} root 
 * @param {URL} url 
 * @param  {...(Element:element) => void} applyFns 
 * @returns {HTMLElement}
 */
async function loadHTML(root, url, ...applyFns) {
  if (!root) throw new Error('root element is null');

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status}`);
  }

  const html = await res.text();
  root.innerHTML = html;
  applyFns?.forEach(fn => fn(root));
  return root;
}
