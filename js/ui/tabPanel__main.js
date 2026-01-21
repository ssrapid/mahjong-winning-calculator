/**
 * tabPanel__main.js
 * 
 * main.htmlに対応するスクリプトファイル
 */


/** @type {HTMLElement|Document} */
let rootNode = document;




/**
 * 
 * @param {HTMLElement} root 
 */
export default function activate(root) {
  rootNode = root;
  ensureDom(root);
}

function ensureDom(root) {

}