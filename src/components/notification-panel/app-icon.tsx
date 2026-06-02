import { Gdk, Gtk } from 'ags/gtk4'

import { filePath } from '../../utils/file'
import type { FC } from '../../utils/types'

const themed = (name: string) => {
  const display = Gdk.Display.get_default()
  if (display === null) return null

  return Gtk.IconTheme.get_for_display(display).has_icon(name) ? name : null
}

type AppIconProps = {
  icon: string
  size?: number
}

export const AppIcon: FC<AppIconProps> = ({ icon, size = 24 }) => {
  const path = filePath(icon)
  const name = path === null && icon !== '' ? themed(icon) : null

  return (
    <box widthRequest={size} heightRequest={size} valign={Gtk.Align.CENTER}>
      {path !== null ? <image file={path} pixelSize={size} /> : null}
      {name !== null ? <image iconName={name} pixelSize={size} /> : null}
    </box>
  )
}
