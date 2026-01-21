/**
 * 
 * @param {HTMLElement} root 
 * @param {URL} url 
 * @param  {...(root:Element) => void} applyFns 
 * @returns {HTMLElement}
 */
export async function loadHTML(root, url, ...applyFns) {
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
