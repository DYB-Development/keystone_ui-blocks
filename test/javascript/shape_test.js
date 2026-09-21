import { test } from "node:test"
import assert from "node:assert/strict"
import { chosenShape, narrowPlaces } from "../../src/shape.js"

const SHAPE = {
  columns: 12, row_height: 60, gap: 10,
  narrow_columns: 4, narrow_row_height: 80, narrow_gap: 6, narrow_below: 640
}

test("a grid measured at the width the narrow numbers apply below draws at the wide numbers", () => {
  assert.deepEqual(chosenShape(640, SHAPE), { columns: 12, rowHeight: 60, gap: 10, narrow: false })
})

test("a grid measured narrower than that width draws at the narrow numbers", () => {
  assert.deepEqual(chosenShape(639, SHAPE), { columns: 4, rowHeight: 80, gap: 6, narrow: true })
})

const CARD = { key: "card", name: "Card", width: 3, height: 4, narrow_width: 6, narrow_height: 2 }
const BLOCK = { id: "b1", type: "card", x: 3, y: 0, w: 3, h: 4 }

test("a block on a narrow grid takes the narrow size its type declares", () => {
  assert.deepEqual(narrowPlaces([ BLOCK ], [ CARD ], 12).map(({ w, h }) => [ w, h ]), [ [ 6, 2 ] ])
})
