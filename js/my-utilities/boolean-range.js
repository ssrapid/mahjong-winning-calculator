/**
 * ブール配列から target の連続範囲を抽出（例: true の連続ブロック）
 *
 * @param {boolean[]} array - boolean 配列
 * @param {boolean} [target=true] - true または false（デフォルト: true）
 * @returns {{ start: number, end: number }[]} 範囲配列
 */
export function findBooleanRanges(array, target = true) {
  const ranges = [];
  let start = null;

  for (let i = 0; i < array.length; i++) {
    const match = array[i] === target;

    if (match && start === null) {
      start = i;
    } else if (!match && start !== null) {
      ranges.push({ start, end: i - 1 });
      start = null;
    }
  }

  if (start !== null) {
    ranges.push({ start, end: array.length - 1 });
  }

  return ranges;
}


/**
 * findBooleanRanges を元に、間に1つだけ例外がある範囲を except 指定でマージ
 *
 * @param {boolean[]} array - boolean 配列
 * @param {boolean} [target=true] - true または false（デフォルト: true）
 * @returns {{ start: number, end: number, except: number? }[]} 範囲配列 
 */
export function findBooleanRangesWithException(array, target = true) {
  const ranges = findBooleanRanges(array, target);

  if (ranges.length <= 1) return ranges;

  const merged = [];
  let i = 0;

  while (i < ranges.length) {
    const current = ranges[i];
    const next = ranges[i + 1];

    // 範囲間に1つだけ非target値がある場合、except付きで統合
    if (next && current.end + 2 === next.start) {
      const exceptIndex = current.end + 1;
      if (array[exceptIndex] !== target) {
        merged.push({
          start: current.start,
          end: next.end,
          except: exceptIndex
        });
        i += 2;
        continue;
      }
    }

    merged.push(current);
    i += 1;
  }

  return merged;
}
