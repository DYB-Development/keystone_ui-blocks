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

const measured = (width) => typeof width === "number" && width > 0

export const chosenShape = (width, shape) => {
  const declared = { ...WIDE, ...shape }

  return measured(width) && width < (declared.narrow_below ?? NARROW_BELOW) ? narrowed(declared) : widened(declared)
}

const narrowSize = (blockType, columns) => ({
  w: blockType?.narrow_width ?? columns,
  h: blockType?.narrow_height ?? blockType?.height ?? 1
})

const inReadingOrder = (blocks) => [ ...blocks ].sort((one, other) => one.y - other.y || one.x - other.x)

const nextRow = (row, block) => ({ x: 0, y: row.y + row.tallest, tallest: block.h })

const sameRow = (row, block) => ({ x: row.x, y: row.y, tallest: Math.max(row.tallest, block.h) })

const placing = (row, block, columns) => (row.x + block.w <= columns ? sameRow(row, block) : nextRow(row, block))

export const narrowPlaces = (blocks, blockTypes, columns) =>
  inReadingOrder(blocks).reduce((state, block) => {
    const sized = { ...block, ...narrowSize(blockTypes.find((blockType) => blockType.key === block.type), columns) }
    const row = placing(state.row, sized, columns)

    return { placed: [ ...state.placed, { ...sized, x: row.x, y: row.y } ], row: { ...row, x: row.x + sized.w } }
  }, { placed: [], row: { x: 0, y: 0, tallest: 0 } }).placed
