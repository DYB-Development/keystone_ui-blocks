import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const styles = readFileSync(new URL("../../src/block_grid.css", import.meta.url), "utf8")

test("holds no rule for the drag handle the grid no longer draws", () => {
  assert.doesNotMatch(styles, /data-block-handle/)
})

test("holds a rule for the target a block is dropped on to remove it", () => {
  assert.match(styles, /\.ks-remove-target\s*{/)
})

test("pins the remove target to the screen, so a drag down a long grid still reaches it", () => {
  assert.match(styles, /\.ks-remove-target\s*\{[^}]*position:\s*fixed/)
})

test("lifts the block under the pointer above the blocks beside it, so what it opens is not covered", () => {
  assert.match(styles, /\[data-block\]:hover[^{]*\{[^}]*z-index:\s*2/)
})

test("rounds the remove target with the look's pill radius", () => {
  assert.match(styles, /\.ks-remove-target\s*\{[^}]*border-radius:\s*var\(--ks-radius-pill, 9999px\)/)
})

test("draws the remove target's border at twice the look's border width", () => {
  assert.match(styles, /\.ks-remove-target\s*\{[^}]*border:\s*calc\(var\(--ks-border-width, 1px\) \* 2\) dashed currentColor/)
})
