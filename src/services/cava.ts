import { createExternal } from 'ags'
import AstalCava from 'gi://AstalCava'

import { isPanelOpen } from '../stores/panel'

export const BAR_COUNT = 40

export const bars = createExternal<number[]>([], (set) => {
  const cava = AstalCava.get_default()
  if (cava === null) return () => {}

  cava.bars = BAR_COUNT
  cava.input = AstalCava.Input.PULSE

  const sync = () => set(cava.get_values() ?? [])
  const valuesId = cava.connect('notify::values', sync)

  const active = isPanelOpen('player')
  cava.active = active.peek()
  const disposeActive = active.subscribe(() => {
    cava.active = active.peek()
    if (!active.peek()) set([])
  })

  return () => {
    cava.disconnect(valuesId)
    disposeActive()
    cava.active = false
  }
})
