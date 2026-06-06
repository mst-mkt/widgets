import { type Accessor, createComputed, For, onCleanup } from 'ags'
import { Gtk } from 'ags/gtk4'

import type { AppEntry } from '../../services/launcher'
import { launchApp, results, selectIndex, selected } from '../../stores/launcher'
import { onMove } from '../../utils/controllers'
import { clamp } from '../../utils/math'
import type { FC } from '../../utils/types'
import { ITEM_HEIGHT, LauncherItem } from './item'

const LIST_PADDING = 8
export const LIST_HEIGHT = 6 * ITEM_HEIGHT + 2 * LIST_PADDING

const selectAt = (_x: number, y: number) => {
  const count = results.peek().length
  if (count === 0) return
  selectIndex(clamp(Math.floor(y / ITEM_HEIGHT), 0, count - 1))
}

const scrollToSelected = (self: Gtk.ScrolledWindow) => {
  const adjustment = self.get_vadjustment()

  const scroll = () => {
    const page = adjustment.get_page_size()
    if (page === 0) return

    const top = LIST_PADDING + selected.peek() * ITEM_HEIGHT
    const bottom = top + ITEM_HEIGHT
    const value = adjustment.get_value()

    if (top < value) {
      adjustment.set_value(top)
    } else if (bottom > value + page) {
      adjustment.set_value(bottom - page)
    }
  }

  const disposers = [selected.subscribe(scroll), results.subscribe(scroll)]
  onCleanup(() => {
    for (const dispose of disposers) dispose()
  })
}

export const LauncherList: FC = () => (
  <scrolledwindow
    hscrollbarPolicy={Gtk.PolicyType.NEVER}
    vscrollbarPolicy={Gtk.PolicyType.EXTERNAL}
    heightRequest={LIST_HEIGHT}
    $={scrollToSelected}
  >
    <box
      orientation={Gtk.Orientation.VERTICAL}
      marginTop={LIST_PADDING}
      marginBottom={LIST_PADDING}
      $={onMove(selectAt)}
    >
      <For each={results} id={(entry: AppEntry) => entry.entry}>
        {(entry: AppEntry, index: Accessor<number>) => (
          <LauncherItem
            entry={entry}
            active={createComputed(() => selected() === index())}
            onActivate={() => launchApp(entry.entry)}
          />
        )}
      </For>
    </box>
  </scrolledwindow>
)
