const UNREACHABLE = "Your change was not saved because the server could not be reached."

export const createSender = ({ base, token, fetch, version, layout: initial, onLayout, onError }) => {
  let current = version ?? initial?.version
  let stored = initial
  let queue = Promise.resolve()

  const sendNow = async (path, method, body) => {
    const response = await fetch(base + path, {
      method, headers: { "Content-Type": "application/json", "X-CSRF-Token": token }, body: body && JSON.stringify({ ...body, version: current })
    }).catch(() => null)
    if (!response) {
      onError(UNREACHABLE)
      return stored && onLayout({ ...stored })
    }

    const answered = await response.json().catch(() => ({}))
    onError(response.ok ? null : answered.error)
    const layout = await (await fetch(base + "/layout", { headers: { Accept: "application/json" } })).json()
    current = layout.version
    stored = layout
    onLayout(layout)
  }

  return (path, method, body) => (queue = queue.then(() => sendNow(path, method, body)))
}
