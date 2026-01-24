/**
 * HTMLLoader.js
 */

const BASE_PATH = location.pathname.replace(/\/[^/]*$/, '');

/**
 * 指定パスのHTMLを取得してrootに展開する
 * 
 * @param {HTMLElement} root 
 * @param {string} path 
 * @returns {Promise<HTMLElement>}
 */
export async function insertHTML(root, path) {
  if (!root) throw new Error('root element is null');

  const html = await loadTextFile(path);
  root.innerHTML = html;
  return root;
}

/**
 * 指定パスのテキストファイルを読み込む
 * @param {string} path 
 * @returns {Promise<string>}
 */
export async function loadTextFile(path) {
  path = BASE_PATH + '/' + path.replace(/^\/+/, '');

  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`);
  }

  console.log(`successed load "${path}"`);
  return await res.text();

}
