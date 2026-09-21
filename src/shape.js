const WIDE = { columns: 12, row_height: 60, gap: 10 }

export const chosenShape = (width, shape) => {
  const declared = { ...WIDE, ...shape }

  return { columns: declared.columns, rowHeight: declared.row_height, gap: declared.gap, narrow: false }
}
