import { JSDOM } from "jsdom"

const dom = new JSDOM("<!doctype html><html><body></body></html>", { pretendToBeVisual: true })

global.window = dom.window
global.document = dom.window.document
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true })
global.Element = dom.window.Element
global.HTMLElement = dom.window.HTMLElement
global.Node = dom.window.Node
global.Event = dom.window.Event
global.PointerEvent = dom.window.PointerEvent ?? dom.window.MouseEvent
global.IS_REACT_ACT_ENVIRONMENT = true

export const mounted = () => {
  const host = document.createElement("div")
  document.body.appendChild(host)

  return host
}
