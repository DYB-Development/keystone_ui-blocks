import { test, mock } from "node:test"
import assert from "node:assert/strict"
import { holdToStart } from "../../src/hold.js"

const press = (handlers) => handlers.onPointerDown({ pointerId: 1 })

test("a press held past the length starts what it was given", () => {
  mock.timers.enable({ apis: [ "setTimeout" ] })
  let started = 0
  const handlers = holdToStart(() => started++, 500)

  press(handlers)
  mock.timers.tick(500)

  assert.equal(started, 1)
  mock.timers.reset()
})
