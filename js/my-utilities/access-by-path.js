/**
 * 
 * @template T
 * @param {T} obj 
 * @param  {...(string|number|symbol)} path 
 * @returns {*}
 */
export function getByPath(obj, ...path) {
  return path.reduce((prev, cur) => prev?.[cur], obj);
}

/**
 * 
 * @template T
 * @template U
 * @param {T} value 
 * @param {U} obj 
 * @param  {...(string|number|symbol)} path 
 * @returns {T}
 */
export function setByPath(value, obj, ...path) {
  path.reduce((prev, cur, i) => {
    if (i === path.length - 1) prev[cur] = value;
    else prev[cur] ??= {};
    return prev[cur];
  }, obj);
  return value;
}
