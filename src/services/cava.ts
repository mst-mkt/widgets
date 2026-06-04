import { createState } from 'ags'
import AstalCava from 'gi://AstalCava'

import { isPanelOpen } from '../stores/panel'

export const BAR_COUNT = 40

let cava: AstalCava.Cava | null = null

export const [bars, setBars] = createState<number[]>([])

const sync = () => setBars(cava?.get_values() ?? [])

export const initCava = () => {
  cava = AstalCava.get_default()
  if (cava === null) return

  const instance = cava
  instance.bars = BAR_COUNT
  instance.input = AstalCava.Input.PULSE
  instance.connect('notify::values', sync)

  const active = isPanelOpen('player')
  instance.active = active.peek()
  active.subscribe(() => {
    instance.active = active.peek()
    if (!active.peek()) setBars([])
  })
}
