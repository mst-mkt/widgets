import { lerp } from './math'

export const TOAST_WIDTH = 380

export const PEEK = 20
export const GAP = 14
export const SCALE_STEP = 0.05
export const VISIBLE_TOASTS = 3
export const DEFAULT_HEIGHT = 64

export const heightOf = (sizes: Map<number, number>, id: number) => sizes.get(id) ?? DEFAULT_HEIGHT

export const depthOf = (ids: number[], id: number) => {
  const index = ids.indexOf(id)
  return index < 0 ? 0 : ids.length - 1 - index
}

export const stackOffset = (
  ids: number[],
  sizes: Map<number, number>,
  id: number,
  expand: number,
) => {
  const index = ids.indexOf(id)
  if (index < 0) return 0

  const depth = ids.length - 1 - index
  const myHeight = heightOf(sizes, id)
  const frontId = ids.at(-1)
  const frontHeight = frontId === undefined ? myHeight : heightOf(sizes, frontId)
  const sumFront = ids.slice(index + 1).reduce((sum, other) => sum + heightOf(sizes, other), 0)

  const collapsed = frontHeight + PEEK * depth - myHeight
  const expanded = sumFront + GAP * depth
  return -lerp(collapsed, expanded, expand)
}

export const stackHeight = (ids: number[], sizes: Map<number, number>, expand: number) => {
  if (ids.length === 0) return 1

  const frontId = ids.at(-1)
  const frontHeight = frontId === undefined ? DEFAULT_HEIGHT : heightOf(sizes, frontId)
  const visible = Math.min(ids.length, VISIBLE_TOASTS)
  const collapsed = frontHeight + PEEK * (visible - 1)
  const total = ids.reduce((sum, id) => sum + heightOf(sizes, id), 0) + GAP * (ids.length - 1)
  return Math.round(lerp(collapsed, total, expand))
}
