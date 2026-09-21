import { test } from "node:test"
import assert from "node:assert/strict"
import { redraw } from "../../src/content.js"

test("a block whose content changed is drawn again", () => {
  const content = { innerHTML: "<p>Old</p>" }

  redraw(content, "<p>New</p>", "<p>Old</p>")

  assert.equal(content.innerHTML, "<p>New</p>")
})
