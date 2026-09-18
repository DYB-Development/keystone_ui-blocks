export const droppedOnTarget = (target, { clientX, clientY }) =>
  Boolean(target) &&
  clientX >= target.left && clientX <= target.right &&
  clientY >= target.top && clientY <= target.bottom

export const dragStopped = ({ layout, item, pointer, target, fixed }) =>
  droppedOnTarget(target, pointer) && !fixed ? { remove: item.i } : { place: layout }
