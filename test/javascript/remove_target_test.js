import { test } from "node:test"
import assert from "node:assert/strict"
import { dragStopped, droppedOnTarget } from "../../src/remove_target.js"

const TARGET = { left: 100, top: 200, right: 140, bottom: 240 }

test("a drag let go inside the target landed on it", () => {
  assert.equal(droppedOnTarget(TARGET, { clientX: 120, clientY: 220 }), true)
})

test("a drag let go outside the target landed elsewhere", () => {
  assert.equal(droppedOnTarget(TARGET, { clientX: 320, clientY: 220 }), false)
})

test("a drag let go while no target is drawn landed elsewhere", () => {
  assert.equal(droppedOnTarget(null, { clientX: 120, clientY: 220 }), false)
})

test("a block let go on the target is the one removed", () => {
  const stopped = dragStopped({ layout: [ { i: "b1", x: 0, y: 0, w: 3, h: 4 } ], item: { i: "b1" }, pointer: { clientX: 120, clientY: 220 }, target: TARGET, fixed: false })

  assert.deepEqual(stopped, { remove: "b1" })
})
