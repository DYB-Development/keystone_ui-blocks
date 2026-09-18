export const HOLD_LENGTH = 500

export const holdToStart = (start, length = HOLD_LENGTH) => {
  let waiting = null
  let held = false

  const giveUp = () => {
    clearTimeout(waiting)
    waiting = null
  }

  return {
    onPointerDown: () => {
      waiting = setTimeout(() => {
        held = true
        start()
      }, length)
    },
    onPointerUp: giveUp,
    onPointerLeave: giveUp,
    onPointerCancel: giveUp,
    onClickCapture: (event) => {
      if (!held) return

      held = false
      event.stopPropagation()
      event.preventDefault()
    }
  }
}

export const swallowPress = () => ({
  onClickCapture: (event) => {
    event.stopPropagation()
    event.preventDefault()
  }
})
