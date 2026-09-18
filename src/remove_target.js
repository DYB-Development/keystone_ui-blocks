export const droppedOnTarget = (target, { clientX, clientY }) =>
  Boolean(target) &&
  clientX >= target.left && clientX <= target.right &&
  clientY >= target.top && clientY <= target.bottom
