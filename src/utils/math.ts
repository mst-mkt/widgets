export const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t
}

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

export const easeOutCubic = (t: number) => {
  return 1 - (1 - t) ** 3
}
