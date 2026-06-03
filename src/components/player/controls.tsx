import { Gtk } from 'ags/gtk4'

import {
  canGoNext,
  canGoPrevious,
  isPlaying,
  next,
  playPause,
  previous,
} from '../../services/player'
import type { FC } from '../../utils/types'
import { Button } from '../shared/button'
import { Icon } from '../shared/icon'

export const PlayerControls: FC = () => (
  <box hexpand valign={Gtk.Align.CENTER}>
    <Button
      class="hover:bg-elevated min-h-7 min-w-7 rounded-full transition"
      valign={Gtk.Align.CENTER}
      sensitive={canGoPrevious}
      onClicked={previous}
    >
      <Icon icon="skip-back" size={14} class="text-mute font-normal" />
    </Button>
    <box hexpand />
    <Button
      class="bg-elevated hover:bg-card min-h-8 min-w-8 rounded-full transition"
      valign={Gtk.Align.CENTER}
      onClicked={playPause}
    >
      <Icon
        icon={isPlaying.as((playing) => (playing ? 'pause' : 'play'))}
        size={14}
        class="text-ink font-normal"
      />
    </Button>
    <box hexpand />
    <Button
      class="hover:bg-elevated min-h-7 min-w-7 rounded-full transition"
      valign={Gtk.Align.CENTER}
      sensitive={canGoNext}
      onClicked={next}
    >
      <Icon icon="skip-forward" size={14} class="text-mute font-normal" />
    </Button>
  </box>
)
