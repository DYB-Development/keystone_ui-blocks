import { test } from "node:test"
import assert from "node:assert/strict"
import { redraw } from "../../src/content.js"

test("a block whose content changed is drawn again", () => {
  const content = { innerHTML: "<p>Old</p>" }

  redraw(content, "<p>New</p>", "<p>Old</p>")

  assert.equal(content.innerHTML, "<p>New</p>")
})

test("a block already showing this content is left alone", () => {
  const content = { innerHTML: "<p>Same</p>" }

  redraw(content, "<p>Same</p>", "<p>Same</p>")

  assert.equal(content.innerHTML, "<p>Same</p>")
})

test("a block the host drew and sent no content for is left alone", () => {
  const content = { innerHTML: "<p>From the host</p>" }

  redraw(content, undefined, null)

  assert.equal(content.innerHTML, "<p>From the host</p>")
})
