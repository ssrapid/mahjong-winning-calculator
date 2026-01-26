/**
 * @template T
 * @callback CompareFn 要素の順序を決定する関数。
 * @param {T} a 比較する第一要素。 undefined になることはありません。
 * @param {T} b 比較する第二要素。 undefined になることはありません。
 * @param {readonly T[]} group 比較中の全要素が含まれた配列です。比較対象を参照する必要がある場合に使用します。
 * @returns {number}
 */

/**
 * getRanks
 * 配列内の各要素に順位（rank）を付与して返すユーティリティ関数。
 *
 * ソート基準は任意の `compareFn` で指定でき、
 * 同値の場合のタイ（同順位）許容有無も `allowTies` で制御可能。
 *
 * - デフォルトでは数値の降順（大きいものが1位）で順位を付与する。
 * - 同値が存在する場合、`allowTies=true` なら同順位、`allowTies=false` なら順位は連番となる。
 * - 戻り値は元の `values` と同じ長さの配列で、各インデックスに対応する順位が入る。
 *
 * @template T
 * @param {T[]} values - 順位付け対象の配列。
 * @param {boolean} [allowTies=true]
 * 同値を同順位とするかどうかのフラグ。同順位を許可しない(false)場合、配列の先頭に近い方から1,2,...となる。
 * @param {...CompareFn<T>} [compareFns]
 * ソート時に使う比較関数。省略時は、
 * (a, b) => b - a
 * という単純降順を指定。
 *   負の値：aがbより小さい、0：同値、正の値：aがbより大きい。
 * 負の値は、a が b より高順位であることを示します。
 * 正の値は、a が b より高順位であることを示します。
 * 0 または NaN は、a と b が同順位とみなされることを示します。
 * 負の値：aがbより小さい、0：同値、正の値：aがbより大きい。
 * 
 * @returns {number[]} 元配列と同じ長さで、各要素の順位（1始まり）が格納された配列。
 *
 * @example
 * getRanks([100, 200, 150]); // => [3, 1, 2]
 * getRanks([100, 200, 200], undefined, true); // => [3, 1, 1]
 * getRanks([100, 200, 200], undefined, false); // => [3, 1, 2]
 * getRanks(["apple", "banana", "apple"], (a, b) => a.localeCompare(b), true); // => [1, 3, 1]
 */
export function getRanks(values, allowTies = true, ...compareFns) {

  // allowTiesの位置に第一比較関数を記述してしまった場合の対処
  if (typeof allowTies === 'function') {
    console.warn('getRanks: allowTies に compareFn が渡されています。');
    console.trace();
    compareFns.unshift(allowTies);
    allowTies = true;
  }

  // compareFns未指定の場合、単純な降順を指定
  if (!compareFns.length) {
    compareFns = [(a, b) => b - a];
  }


  const indexed = values.map((value, index) => ({ value, index }));


  let groups = [indexed];

  for (const compare of compareFns) {
    const nextGroups = [];

    for (const group of groups) {
      if (group.length <= 1) {
        nextGroups.push(group);
        continue;
      }

      const baseArray = group.map(e => e.value);

      const sorted = [...group].sort((a, b) =>
        compare(a.value, b.value, baseArray) || a.index - b.index
      );

      let bucket = [sorted[0]];

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];

        if (compare(prev.value, curr.value, baseArray) === 0) {
          bucket.push(curr);
        } else {
          nextGroups.push(bucket);
          bucket = [curr];
        }
      }

      nextGroups.push(bucket);
    }

    

    groups = nextGroups;
  }

  // ---- 最終 tie break ----
  if (!allowTies) {
    groups = groups.flatMap(group =>
      group.length <= 1
        ? [group]
        : [...group].sort((a, b) => a.index - b.index).map(e => [e])
    );
  }

  // ---- rank付け ----
  const ranks = new Array(values.length);
  let rank = 1;

  for (const group of groups) {
    for (const item of group) {
      ranks[item.index] = rank;
    }
    rank += group.length;
  }

  return ranks;

}
