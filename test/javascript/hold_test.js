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

test("a press let go before the length starts nothing", () => {
  mock.timers.enable({ apis: [ "setTimeout" ] })
  let started = 0
  const handlers = holdToStart(() => started++, 500)

  press(handlers)
  handlers.onPointerUp({ pointerId: 1 })
  mock.timers.tick(500)

  assert.equal(started, 0)
  mock.timers.reset()
})

test("a press that moves off what it started on starts nothing", () => {
  mock.timers.enable({ apis: [ "setTimeout" ] })
  let started = 0
  const handlers = holdToStart(() => started++, 500)

  press(handlers)
  handlers.onPointerLeave({ pointerId: 1 })
  mock.timers.tick(500)

  assert.equal(started, 0)
  mock.timers.reset()
})

test("a press that turned into a hold does not reach what it was held on", () => {
  mock.timers.enable({ apis: [ "setTimeout" ] })
  const handlers = holdToStart(() => {}, 500)
  let stopped = 0
  let prevented = 0

  press(handlers)
  mock.timers.tick(500)
  handlers.onClickCapture({ stopPropagation: () => stopped++, preventDefault: () => prevented++ })

  assert.deepEqual([ stopped, prevented ], [ 1, 1 ])
  mock.timers.reset()
})
