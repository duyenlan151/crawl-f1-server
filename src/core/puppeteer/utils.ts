export function getWinnerFromColumn(columns: NodeListOf<HTMLTableCellElement>, columnIndex = 1): string | null {
  const td = columns[columnIndex];
  if (td) {
    const spans = td.querySelectorAll('span');
    if (spans.length >= 2) {
      return `${spans[0].textContent} ${spans[1].textContent}`.trim();
    }
    return td.textContent!.trim();
  }
  return null;
}