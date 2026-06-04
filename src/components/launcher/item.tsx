import type { Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'
import Pango from 'gi://Pango'

import type { AppEntry } from '../../services/launcher'
import { mergeClass } from '../../utils/class'
import { compose, onHover, onReleased, pointer } from '../../utils/controllers'
import type { FC } from '../../utils/types'
import { AppIcon } from '../notification-panel/app-icon'
import { Icon } from '../shared/icon'

export const ITEM_HEIGHT = 56

type LauncherItemProps = {
  entry: AppEntry
  active: Accessor<boolean>
  onActivate: () => void
  onSelect: () => void
}

export const LauncherItem: FC<LauncherItemProps> = ({ entry, active, onActivate, onSelect }) => (
  <box
    class={mergeClass(
      'mx-2 rounded-8 px-3 transition',
      active.as((on) => (on ? 'bg-elevated' : '')),
    )}
    heightRequest={ITEM_HEIGHT}
    spacing={12}
    valign={Gtk.Align.CENTER}
    $={compose(pointer, onHover(onSelect), onReleased(onActivate))}
  >
    <box class="rounded-6" overflow={Gtk.Overflow.HIDDEN} valign={Gtk.Align.CENTER}>
      <AppIcon icon={entry.icon} size={30} />
    </box>
    <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER} hexpand spacing={2}>
      <label
        class="text-ink text-14 font-medium"
        xalign={0}
        hexpand
        maxWidthChars={1}
        ellipsize={Pango.EllipsizeMode.END}
        label={entry.name}
      />
      <label
        class="text-faint text-12"
        xalign={0}
        hexpand
        maxWidthChars={1}
        ellipsize={Pango.EllipsizeMode.END}
        visible={entry.description !== ''}
        label={entry.description}
      />
    </box>
    <box visible={active} valign={Gtk.Align.CENTER}>
      <Icon icon="corner-down-left" size={14} class="text-mute" />
    </box>
  </box>
)
