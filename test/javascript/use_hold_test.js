import { test } from "node:test"
import assert from "node:assert/strict"
import { mounted } from "./support/dom.js"
import React from "react"
import { createRoot } from "react-dom/client"
import { act } from "react"
import { useHold } from "../../src/hold.js"

const after = (ms) => new Promise((done) => setTimeout(done, ms))

const Pressable = ({ onHeld }) => {
  const [ , redraw ] = React.useState(0)
  const held = useHold(onHeld, 200)

  return React.createElement("button", { ...held, onClick: () => redraw((count) => count + 1) }, "press")
}

const drawPressable = (onHeld) => {
  const host = mounted()
  act(() => createRoot(host).render(React.createElement(Pressable, { onHeld })))

  return host.querySelector("button")
}

test("a press let go early starts nothing, even when its component redrew while it was held", async () => {
  let started = 0
  const button = drawPressable(() => started++)

  act(() => button.dispatchEvent(new window.PointerEvent("pointerdown", { bubbles: true })))
  act(() => button.dispatchEvent(new window.Event("click", { bubbles: true })))
  act(() => button.dispatchEvent(new window.PointerEvent("pointerup", { bubbles: true })))
  await act(() => after(400))

  assert.equal(started, 0)
})
