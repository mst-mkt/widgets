import type { Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'

import { autofocus, onEscape, onPressed } from '../../utils/controllers'
import { slide, type Offset } from '../../utils/transition'
import { tweened } from '../../utils/tweened'
import type { FC } from '../../utils/types'

export const panelProgress = (open: Accessor<boolean>) => {
  return tweened(
    open.as((value) => (value ? 1 : 0)),
    { duration: 280 },
  )
}

type PanelOverlayProps = {
  progress: Accessor<number>
  onClose: () => void
  align: Gtk.Align
  hiddenOffset: Offset
  children: JSX.Element
}

export const PanelOverlay: FC<PanelOverlayProps> = ({
  progress,
  onClose,
  align,
  hiddenOffset,
  children,
}) => (
  <overlay $={onEscape(onClose)}>
    <box class="bg-transparent" hexpand vexpand $={onPressed(onClose)} />
    <box $type="overlay" halign={align} css={progress.as(slide(hiddenOffset))} $={autofocus}>
      {children}
    </box>
  </overlay>
)
