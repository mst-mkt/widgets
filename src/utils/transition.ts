import { lerp } from './math'

export type Offset = [x: number, y: number]

export const slide = (offset: Offset) => (t: number) => {
  return `opacity: ${t}; transform: translate(${lerp(offset[0], 0, t)}px, ${lerp(offset[1], 0, t)}px);`
}
