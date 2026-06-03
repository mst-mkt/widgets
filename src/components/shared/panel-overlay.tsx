import type { Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'

import { autofocus, onEscape, onPressed } from '../../utils/controllers'
import { slide, type Offset } from '../../utils/transition'
import type { FC } from '../../utils/types'

type PanelOverlayProps = {
  progress: Accessor<number>
  onClose: () => void
  align: Gtk.Align
  valign?: Gtk.Align
  hiddenOffset: Offset
  children: JSX.Element
}

export const PanelOverlay: FC<PanelOverlayProps> = ({
  progress,
  onClose,
  align,
  valign = Gtk.Align.FILL,
  hiddenOffset,
  children,
}) => (
  <overlay $={onEscape(onClose)}>
    <box class="bg-transparent" hexpand vexpand $={onPressed(onClose)} />
    <box
      $type="overlay"
      halign={align}
      valign={valign}
      css={progress.as(slide(hiddenOffset))}
      $={autofocus}
    >
      {children}
    </box>
  </overlay>
)
