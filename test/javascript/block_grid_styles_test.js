import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const styles = readFileSync(new URL("../../src/block_grid.css", import.meta.url), "utf8")

test("holds no rule for the drag handle the grid no longer draws", () => {
  assert.doesNotMatch(styles, /data-block-handle/)
})
