import type { Accessor } from 'ags'
import { Gtk } from 'ags/gtk4'

import { mergeClass } from '../../utils/class'
import type { FC } from '../../utils/types'

export type IconName =
  | 'bell'
  | 'bell-off'
  | 'trash-2'
  | 'x'
  | 'volume-1'
  | 'volume-2'
  | 'volume-x'
  | 'sun'

const sizeStyle = (size: number) => {
  return `font-size: ${size}px;`
}

type IconProps = {
  icon: IconName | Accessor<IconName>
  class?: string | Accessor<string>
  css?: string
  size?: number
}

export const Icon: FC<IconProps> = ({ icon, class: className, size = 15, css = '' }) => (
  <label
    label={icon}
    class={mergeClass('font-icon', className)}
    css={`
      ${sizeStyle(size)}${css}
    `}
    valign={Gtk.Align.CENTER}
  />
)
