import { test } from "node:test"
import assert from "node:assert/strict"
import { mounted } from "./support/dom.js"
import React from "react"
import { createRoot } from "react-dom/client"
import { act } from "react"
import BlockGrid from "../../src/BlockGrid.jsx"

const HEADING = { key: "heading", name: "Heading", width: 12, height: 1 }
const BLOCK = { id: "b1", type: "heading", x: 0, y: 0, w: 12, h: 1 }

const draw = () => {
  const host = mounted()
  const root = createRoot(host)
  act(() => root.render(React.createElement(BlockGrid, { base: "/pages/1", block_types: [ HEADING ], blocks: [ BLOCK ] })))

  return host
}

test("a grid can be drawn into a document", () => {
  assert.ok(draw().querySelector("[data-block=\"b1\"]"))
})
