import { createState } from 'ags'
import AstalCava from 'gi://AstalCava'

import { isPanelOpen } from '../stores/panel'

export const BAR_COUNT = 40

const cava = AstalCava.get_default()

export const [bars, setBars] = createState<number[]>([])

const sync = () => setBars(cava?.get_values() ?? [])

export const initCava = () => {
  if (cava === null) return

  cava.bars = BAR_COUNT
  cava.connect('notify::values', sync)

  const active = isPanelOpen('player')
  cava.active = active.peek()
  active.subscribe(() => {
    cava.active = active.peek()
    if (!active.peek()) setBars([])
  })
}
