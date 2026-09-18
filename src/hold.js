export const HOLD_LENGTH = 500

export const holdToStart = (start, length = HOLD_LENGTH) => {
  let waiting = null

  const giveUp = () => {
    clearTimeout(waiting)
    waiting = null
  }

  return {
    onPointerDown: () => {
      waiting = setTimeout(start, length)
    },
    onPointerUp: giveUp
  }
}
