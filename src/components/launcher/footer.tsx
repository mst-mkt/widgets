import { Gtk } from 'ags/gtk4'

import { results } from '../../stores/launcher'
import type { FC } from '../../utils/types'
import { Icon, type IconName } from '../shared/icon'

type HintProps = {
  keys: IconName[]
  label: string
}

const Hint: FC<HintProps> = ({ keys, label }) => (
  <box spacing={6} valign={Gtk.Align.CENTER}>
    <box spacing={3} valign={Gtk.Align.CENTER}>
      {keys.map((key) => (
        <box class="bg-elevated rounded-4 px-1 py-1" valign={Gtk.Align.CENTER}>
          <Icon icon={key} size={11} class="text-mute" />
        </box>
      ))}
    </box>
    <label class="text-faint text-11" label={label} />
  </box>
)

const resultLabel = (count: number) => `${count} ${count === 1 ? 'result' : 'results'}`

export const LauncherFooter: FC = () => (
  <centerbox class="px-4 py-2">
    <label
      $type="start"
      class="text-faint text-11"
      valign={Gtk.Align.CENTER}
      label={results.as((list) => resultLabel(list.length))}
    />
    <box $type="end" spacing={16} valign={Gtk.Align.CENTER}>
      <Hint keys={['arrow-up', 'arrow-down']} label="Navigate" />
      <Hint keys={['corner-down-left']} label="Open" />
    </box>
  </centerbox>
)
