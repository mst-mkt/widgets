import type { Accessor } from 'ags'
import { unoMerge } from 'unocss-merge'

export const mergeClass = (base: string, className?: string | Accessor<string>) => {
  if (className === undefined || typeof className === 'string') {
    return unoMerge(base, className)
  }
  return className.as((value) => unoMerge(base, value))
}
