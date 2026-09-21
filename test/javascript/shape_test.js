import { test } from "node:test"
import assert from "node:assert/strict"
import { chosenShape } from "../../src/shape.js"

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
