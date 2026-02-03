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
 * @returns {{ start: number, end: number, except?: number[] }[]} 範囲配列 
 */
export function findBooleanRangesWithExceptions(array, target = true, options={}) {
  const ranges = findBooleanRanges(array, target);

  // rangeが複数存在しなければ、そのままreturn
  if (ranges.length <= 1) return ranges;

  /** 何マスまで穴を許容するか */
  const maxGap = options.maxGap ?? 2;
  /** except 最大数 */
  const maxExcept = options.maxExcept ?? 2;

  const merged = [];

  /**
   * 
   */
  let current = {
    start: ranges[0].start,
    end: ranges[0].end,
    except: []
  }

  for (let i = 1; i < ranges.length; i++) {
    const next = ranges[i];

    const gapStart = current.end + 1;
    const gapEnd = next.start -1;
    const gapSize = gapEnd - gapStart + 1;

    if (gapSize <= maxGap && current.except.length + gapSize <= maxExcept) {
      // 現在の範囲と次の範囲の間隔が条件を満たしている場合にマージ
      for (let j = gapStart; j <= gapEnd; j++) {
        // 間の index を except に追加
        if (array[j] !== target) current.except.push(j);
      }
      // 末尾を次の範囲の末尾に変更
      current.end = next.end;
    } else {
      // exceptが空であれば消去
      if (!current.except.length) delete current.except;
      // 完成配列に追加
      merged.push(current);

      // 処理中の範囲を初期化
      current = {
        start: next.start,
        end: next.end,
        except: []
      };
    }
  }
    
  // 最後に残った範囲を追加
  if (!current.except.length) delete current.except;
  merged.push(current);

  return merged;
}
