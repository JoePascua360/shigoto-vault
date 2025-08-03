/**
 * Function for POSTGRES parameterized queries. Using $ input param syntax.

 * @param rows -  number of parenthesis (eg. 2 = ($1), ($2))
 * @param colsPerRow - number of items **inside** the parenthesis (eg. 2 = ($1, $2))
 * @param startIndex - starting number used by rows param (eg. 5 = ($5, $6...))
 * @returns {string} ($5, $6), ($7, $8)
 * @example
 * const arr: string[] = ['val1', 'val2'];
 * 
 * const inputArg = queryInputArgumentSymbol(arr.length, 2, 5)
 * // console.log(inputArg)
 * = ($5, $6), ($7, $8)
 */
const queryInputArgumentSymbol = (
  rows: number,
  colsPerRow: number,
  startIndex = 1
) => {
  const inputArgSymbolArray: string[] = [];

  for (let i = 0; i < rows; i++) {
    const rowPlaceholders = Array.from(
      { length: colsPerRow },
      (_, j) => `$${startIndex + i * colsPerRow + j}`
    );
    inputArgSymbolArray.push(`(${rowPlaceholders.join(", ")})`);
  }

  return inputArgSymbolArray.join(", ");
};

export { queryInputArgumentSymbol };
