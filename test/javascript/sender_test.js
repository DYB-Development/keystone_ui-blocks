import { test } from "node:test"
import assert from "node:assert/strict"
import { createSender } from "../../src/sender.js"

const fakeServer = () => {
  const requests = []
  let version = "v1"
  const fetch = async (url, options = {}) => {
    requests.push({ url, method: options.method, body: options.body && JSON.parse(options.body) })
    if (options.method === "PATCH") version = `v${Number(version.slice(1)) + 1}`
    return { ok: true, json: async () => (url.endsWith("/layout") ? { blocks: [], version } : {}) }
  }
  return { fetch, requests }
}

test("a change sent before the previous one finished carries the version the previous one produced", async () => {
  const server = fakeServer()
  const send = createSender({ base: "/pages/1", token: "t", fetch: server.fetch, version: "v1", onLayout: () => {}, onError: () => {} })

  await Promise.all([ send("/blocks", "PATCH", { layout: [] }), send("/blocks", "PATCH", { layout: [] }) ])

  assert.deepEqual(server.requests.filter((request) => request.method === "PATCH").map((request) => request.body.version), [ "v1", "v2" ])
})

test("a change that cannot reach the server says it was not saved", async () => {
  const errors = []
  const unreachable = async () => { throw new TypeError("Failed to fetch") }
  const send = createSender({ base: "/pages/1", token: "t", fetch: unreachable, version: "v1", onLayout: () => {}, onError: (error) => errors.push(error) })

  await send("/blocks", "PATCH", { layout: [] }).catch(() => {})

  assert.deepEqual(errors, [ "Your change was not saved because the server could not be reached." ])
})

test("a change that cannot reach the server puts the grid back to the last stored layout", async () => {
  const stored = { blocks: [ { id: "b1", type: "text", x: 0, y: 0, w: 6, h: 2 } ], version: "v1" }
  const drawn = []
  const unreachable = async () => { throw new TypeError("Failed to fetch") }
  const send = createSender({ base: "/pages/1", token: "t", fetch: unreachable, layout: stored, onLayout: (layout) => drawn.push(layout), onError: () => {} })

  await send("/blocks", "PATCH", { layout: [] }).catch(() => {})

  assert.deepEqual(drawn, [ stored ])
})

test("a change the server refuses shows the message the server gave", async () => {
  const refusing = async (url) => url.endsWith("/layout")
    ? { ok: true, json: async () => ({ blocks: [ { id: "b1", type: "heading", x: 0, y: 0, w: 12, h: 1 } ], version: "v1" }) }
    : { ok: false, json: async () => ({ error: "Heading overlaps Text" }) }
  const errors = []

  const send = createSender({ base: "/pages/1", token: "t", fetch: refusing, version: "v1", onLayout: () => {}, onError: (error) => errors.push(error) })
  await send("/blocks", "PATCH", { layout: [] })

  assert.deepEqual(errors, [ "Heading overlaps Text" ])
})

test("a change the server refuses draws the layout the server has stored", async () => {
  const stored = [ { id: "b1", type: "heading", x: 0, y: 0, w: 12, h: 1 } ]
  const refusing = async (url) => url.endsWith("/layout")
    ? { ok: true, json: async () => ({ blocks: stored, version: "v1" }) }
    : { ok: false, json: async () => ({ error: "Heading overlaps Text" }) }
  const drawn = []

  const send = createSender({ base: "/pages/1", token: "t", fetch: refusing, version: "v1", onLayout: (layout) => drawn.push(layout.blocks), onError: () => {} })
  await send("/blocks", "PATCH", { layout: [] })

  assert.deepEqual(drawn, [ stored ])
})

test("a refusal message is cleared once a change is accepted", async () => {
  let refuse = true
  const sometimes = async (url) => {
    if (url.endsWith("/layout")) return { ok: true, json: async () => ({ blocks: [], version: "v1" }) }
    const answer = refuse ? { ok: false, json: async () => ({ error: "Heading overlaps Text" }) } : { ok: true, json: async () => ({}) }
    refuse = false
    return answer
  }
  const errors = []

  const send = createSender({ base: "/pages/1", token: "t", fetch: sometimes, version: "v1", onLayout: () => {}, onError: (error) => errors.push(error) })
  await send("/blocks", "PATCH", { layout: [] })
  await send("/blocks", "PATCH", { layout: [] })

  assert.deepEqual(errors, [ "Heading overlaps Text", null ])
})
