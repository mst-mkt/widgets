export const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t
}

export const easeOutCubic = (t: number) => {
  return 1 - (1 - t) ** 3
}
