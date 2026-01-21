const BASE_PATH = location.pathname.replace(/\/[^/]*$/, "");

/**
 * 
 * @param {HTMLElement} root 
 * @param {URL} path 
 * @param  {...(root:Element) => void} applyFns 
 * @returns {HTMLElement}
 */
export async function loadHTML(root, path) {
  if (!root) throw new Error('root element is null');
  path = BASE_PATH + '/' + path.replace(/^\/+/, '');
  console.log('loadHtml', path);

  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`);
  }

  const html = await res.text();
  root.innerHTML = html;
  return root;
}
