import { useMemo, useState } from "react"
import { createSender } from "./sender"

const useLayout = (base, token, initial) => {
  const [ layout, setLayout ] = useState(initial)
  const [ error, setError ] = useState(null)

  const send = useMemo(
    () => createSender({ base, token, fetch: (...request) => window.fetch(...request), layout: initial, onLayout: setLayout, onError: setError }),
    [ base, token ]
  )

  return { layout, error, send }
}

export default useLayout
