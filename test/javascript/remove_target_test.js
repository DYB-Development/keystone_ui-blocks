import { test } from "node:test"
import assert from "node:assert/strict"
import { droppedOnTarget } from "../../src/remove_target.js"

const TARGET = { left: 100, top: 200, right: 140, bottom: 240 }

test("a drag let go inside the target landed on it", () => {
  assert.equal(droppedOnTarget(TARGET, { clientX: 120, clientY: 220 }), true)
})
