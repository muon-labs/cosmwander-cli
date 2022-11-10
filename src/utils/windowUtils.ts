export function clamp (min: number, max: number, target: number) {
  return Math.max(min, Math.min(max, target))
}

export function getCenterColWidth (width: number) {
  return Math.floor(width * 0.3) > 40 ? width - 80 : Math.floor(width * 0.4)
}
