import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import BlockGrid from "../../src/BlockGrid.jsx"

const HEADING = { key: "heading", name: "Heading", width: 12, height: 1 }
const BLOCK = { id: "b1", type: "heading", x: 0, y: 0, w: 12, h: 1 }

const render = (props) => renderToStaticMarkup(React.createElement(BlockGrid, { base: "/pages/1", block_types: [], blocks: [], ...props }))
const opening = (markup, attribute) => markup.match(new RegExp(`<[^>]*${attribute}[^>]*>`))?.[0] ?? ""

test("shows no block list while edit mode is off", () => {
  assert.doesNotMatch(render({ block_types: [ HEADING ], blocks: [ BLOCK ] }), /Blocks<\/h2>/)
})

test("shows no drag handle on a block while edit mode is off", () => {
  assert.doesNotMatch(render({ block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-block-handle/)
})

test("offers no way to remove a block while edit mode is off", () => {
  assert.doesNotMatch(render({ block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-remove-block/)
})

test("offers one Edit control while edit mode is off", () => {
  assert.match(render({ block_types: [ HEADING ], blocks: [ BLOCK ] }), /<button[^>]*data-start-editing[^>]*>Edit<\/button>/)
})

test("refuses to resize a block while edit mode is off", () => {
  assert.match(render({ block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-block="b1"[^>]*class="[^"]*react-resizable-hide/)
})

test("offers one Done control while edit mode is on", () => {
  assert.match(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /<button[^>]*data-stop-editing[^>]*>Done<\/button>/)
})

test("allows a block to be resized while edit mode is on", () => {
  assert.doesNotMatch(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /react-resizable-hide/)
})

test("draws no drag handle on a block being edited, because the whole block drags", () => {
  assert.doesNotMatch(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-block-handle/)
})

test("refuses to drag a block while edit mode is off", () => {
  assert.doesNotMatch(render({ block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-block="b1"[^>]*class="[^"]*react-draggable /)
})

test("a block on a grid that is not being edited is held to start editing", () => {
  assert.match(render({ block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-block="b1"[^>]*data-hold-to-edit/)
})

test("a block on a grid already being edited is not held to start editing again", () => {
  assert.doesNotMatch(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-hold-to-edit/)
})

test("draws no panel of its own around a block", () => {
  assert.doesNotMatch(opening(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), 'data-block="b1"'), /ks-panel/)
})

test("gives the host's markup a slot with no styling of its own", () => {
  assert.doesNotMatch(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /class="grow"/)
})

test("draws a target to drop a block on to remove it while edit mode is on", () => {
  assert.match(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-remove-target/)
})

test("draws no target for removing a block while edit mode is off", () => {
  assert.doesNotMatch(render({ block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-remove-target/)
})

test("puts no Remove button on a block, because the target removes it", () => {
  assert.doesNotMatch(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /data-remove-block/)
})

test("offers a control that opens the block list while edit mode is on", () => {
  assert.match(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /<button[^>]*data-open-blocks[^>]*>Add a block<\/button>/)
})

test("holds the block list in a dialog rather than beside the grid", () => {
  assert.match(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /<dialog[^>]*data-blocks-dialog/)
})

test("offers only a corner to resize a block by", () => {
  const markup = render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] })

  assert.deepEqual([ ...new Set(markup.match(/react-resizable-handle-[a-z]+/g) ?? []) ], [ "react-resizable-handle-se" ])
})

test("lists the block types in their own keystone section titled Blocks", () => {
  assert.match(render({ editing: true, block_types: [ HEADING ] }), /<h2 class="ks-section-title">Blocks<\/h2>.*<ul[^>]*><li[^>]*data-block-type="heading"/)
})

test("lists exactly the block types it is given, by name", () => {
  const markup = render({ editing: true, block_types: [ HEADING, { key: "text", name: "Text", width: 6, height: 2 } ] })

  assert.deepEqual([ ...markup.matchAll(/<[^>]*data-block-type[^>]*><span>([^<]*)</g) ].map((found) => found[1]), [ "Heading", "Text" ])
})

test("says there are no blocks to add when it is given no block types", () => {
  assert.match(render({ editing: true }), /There are no blocks to add/)
})

test("offers an Add button beside each block type", () => {
  assert.match(render({ editing: true, block_types: [ HEADING ] }), /<li[^>]*data-block-type="heading"[^>]*>.*<button[^>]*>Add<\/button>.*<\/li>/)
})

test("spaces each block type's name apart from its Add button", () => {
  assert.match(opening(render({ editing: true, block_types: [ HEADING ] }), 'data-block-type="heading"'), /class="[^"]*\bjustify-between\b[^"]*\bgap-2\b/)
})

test("lets each block type be dragged", () => {
  assert.match(opening(render({ editing: true, block_types: [ HEADING ] }), 'data-block-type="heading"'), /draggable="true"/)
})

test("shows the message it is given while there are no blocks", () => {
  assert.match(render({ emptyMessage: "Nothing arranged yet." }), /Nothing arranged yet\./)
})

test("does not show its empty message once there is a block", () => {
  assert.doesNotMatch(render({ emptyMessage: "Nothing arranged yet.", block_types: [ HEADING ], blocks: [ BLOCK ] }), /Nothing arranged yet/)
})

test("draws no panel of its own around the grid, because a block is the card", () => {
  assert.doesNotMatch(render({}), /ks-panel/)
})

test("draws each block on the grid by its type's name", () => {
  assert.match(render({ editing: true, block_types: [ HEADING ], blocks: [ BLOCK ] }), /<[^>]*data-block="b1"[^>]*>.*Heading/)
})

test("keeps blocks inside the grid so the page never scrolls sideways", () => {
  assert.match(opening(render({}), "data-block-grid(?!-)"), /overflow:hidden/)
})

test("keeps the grid hidden until it has measured its container", () => {
  assert.match(opening(render({}), "data-block-grid(?!-)"), /visibility:hidden/)
})

test("marks a block whose type is no longer registered as an unknown type", () => {
  const markup = render({ block_types: [ HEADING ], blocks: [ { id: "b9", type: "retired_widget", x: 0, y: 0, w: 6, h: 2 } ] })

  assert.match(markup, /<div[^>]*data-block="b9"[^>]*>.*Unknown block type \(retired_widget\)/)
})

test("draws the grid with the shape it is given", () => {
  const markup = render({ grid: { columns: 6, row_height: 40, gap: 4 }, block_types: [ HEADING ], blocks: [ { id: "b1", type: "heading", x: 3, y: 0, w: 3, h: 1 } ] })

  assert.match(opening(markup, `data-block="b1"`), /height:40px/)
})

test("offers no Remove button on a block of a fixed type", () => {
  const masthead = { key: "masthead", name: "Masthead", width: 12, height: 1, fixed: true }
  const block = { id: "b1", type: "masthead", x: 0, y: 0, w: 12, h: 1 }

  assert.doesNotMatch(render({ block_types: [ masthead ], blocks: [ block ] }), /Remove<\/button>/)
})

test("says a type that may be used once is already added once it is on the layout", () => {
  const notice = { key: "notice", name: "Notice", width: 12, height: 1, once: true }
  const block = { id: "b1", type: "notice", x: 0, y: 0, w: 12, h: 1 }

  assert.match(render({ editing: true, block_types: [ notice ], blocks: [ block ] }), /<li[^>]*data-block-type="notice"[^>]*>.*Added<\/button>/)
})

test("refuses another add of a type that may be used once and is on the layout", () => {
  const notice = { key: "notice", name: "Notice", width: 12, height: 1, once: true }
  const block = { id: "b1", type: "notice", x: 0, y: 0, w: 12, h: 1 }

  assert.match(render({ editing: true, block_types: [ notice ], blocks: [ block ] }), /<button[^>]*disabled[^>]*>Added<\/button>/)
})

test("shows the sentence describing a block type with it in the list", () => {
  const notice = { key: "notice", name: "Notice", width: 12, height: 1, description: "A short message across the top." }

  assert.match(render({ editing: true, block_types: [ notice ] }), /<li[^>]*data-block-type="notice"[^>]*>.*A short message across the top\./)
})

test("shows block types under the name of the group they were put in", () => {
  const notice = { key: "notice", name: "Notice", width: 12, height: 1, group: "Layout" }

  assert.match(render({ editing: true, block_types: [ notice ] }), /Layout<\/h3>.*data-block-type="notice"/)
})

test("shows no handle on a block of a fixed type, which nobody can move", () => {
  const masthead = { key: "masthead", name: "Masthead", width: 12, height: 1, fixed: true }
  const block = { id: "b1", type: "masthead", x: 0, y: 0, w: 12, h: 1 }

  assert.doesNotMatch(render({ block_types: [ masthead ], blocks: [ block ] }), /data-block-handle/)
})

test("keeps a block's limits when its type is no longer offered", () => {
  const fixed = { key: "retired", name: "Retired", width: 6, height: 2, fixed: true }
  const block = { id: "b1", type: "retired", x: 0, y: 0, w: 6, h: 2 }
  const markup = render({ block_types: [ HEADING ], limits: [ HEADING, fixed ], blocks: [ block ] })

  assert.doesNotMatch(markup, /data-block-handle/)
})

test("a grid narrower than the narrow width refuses dragging even while edit mode is on", () => {
  const grid = { columns: 12, row_height: 60, gap: 10, narrow_columns: 4, narrow_below: 5000 }

  assert.doesNotMatch(render({ editing: true, grid, block_types: [ HEADING ], blocks: [ BLOCK ] }), /react-draggable /)
})
