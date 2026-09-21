const WIDE = { columns: 12, row_height: 60, gap: 10 }
const NARROW_BELOW = 640

const narrowed = (declared) => ({
  columns: declared.narrow_columns ?? declared.columns,
  rowHeight: declared.narrow_row_height ?? declared.row_height,
  gap: declared.narrow_gap ?? declared.gap,
  narrow: true
})

const widened = (declared) => ({
  columns: declared.columns,
  rowHeight: declared.row_height,
  gap: declared.gap,
  narrow: false
})

export const chosenShape = (width, shape) => {
  const declared = { ...WIDE, ...shape }

  return width < (declared.narrow_below ?? NARROW_BELOW) ? narrowed(declared) : widened(declared)
}

const narrowSize = (blockType, columns) => ({
  w: blockType?.narrow_width ?? columns,
  h: blockType?.narrow_height ?? blockType?.height ?? 1
})

export const narrowPlaces = (blocks, blockTypes, columns) =>
  blocks.map((block) => ({
    ...block,
    ...narrowSize(blockTypes.find((blockType) => blockType.key === block.type), columns)
  }))
