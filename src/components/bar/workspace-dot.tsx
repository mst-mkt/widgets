import type { Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'

import { lerp } from '../../utils/math'
import { tweened } from '../../utils/tweened'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'

const FILL = { r: 255, g: 255, b: 255, a: 0.25 }
const GOLD = { r: 248, g: 199, b: 6, a: 1 }

const style = (t: number) => {
  const r = Math.round(lerp(FILL.r, GOLD.r, t))
  const g = Math.round(lerp(FILL.g, GOLD.g, t))
  const b = Math.round(lerp(FILL.b, GOLD.b, t))
  const a = lerp(FILL.a, GOLD.a, t)
  return `min-width: ${lerp(10, 24, t)}px; background-color: rgba(${r}, ${g}, ${b}, ${a});`
}

type WorkspaceDotProps = {
  active: Accessor<boolean>
  onClick: () => void
}

export const WorkspaceDot: FC<WorkspaceDotProps> = ({ active, onClick }) => {
  const t = tweened(
    active.as((a) => (a ? 1 : 0)),
    { duration: 200 },
  )

  return (
    <Button
      class="min-h-[10px] rounded-full"
      css={t.as(style)}
      valign={Gtk.Align.CENTER}
      onClicked={onClick}
    />
  )
}
