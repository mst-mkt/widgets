import { createState } from 'ags'

import { launch, search } from '../services/launcher'
import { clamp } from '../utils/math'
import { closePanel, isPanelOpen } from './panel'

const [text, setText] = createState('')
const [index, setIndex] = createState(0)

export const query = text
export const results = text.as(search)
export const hasResults = results.as((list) => list.length > 0)
export const selected = index

export const setQuery = (value: string) => {
  setText(value)
  setIndex(0)
}

export const moveSelection = (delta: number) => {
  const count = results.peek().length
  if (count === 0) return
  setIndex((current) => clamp(current + delta, 0, count - 1))
}

export const selectIndex = (value: number) => setIndex(value)

export const launchApp = (entry: string) => {
  launch(entry)
  closePanel()
}

export const launchSelected = () => {
  const entry = results.peek()[index.peek()]
  if (entry !== undefined) launchApp(entry.entry)
}

export const initLauncher = () => {
  const open = isPanelOpen('launcher')

  open.subscribe(() => {
    if (open.peek()) setQuery('')
  })
}
