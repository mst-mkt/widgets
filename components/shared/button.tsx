import { Gtk } from 'ags/gtk4'
import { unoMerge } from 'unocss-merge'

import type { FC } from '../../utils/types'

const resetClassName = 'bg-transparent border-none shadow-none p-0 m-0'

type ButtonProps = Omit<JSX.IntrinsicElements['button'], '$'> & {
  $?: (self: Gtk.Button) => void
}

export const Button: FC<ButtonProps> = ({ class: className, $, ...rest }) => {
  const setup = (self: Gtk.Button) => {
    self.set_cursor_from_name('pointer')
    $?.(self)
  }

  const mergedClassName =
    className === undefined || typeof className === 'string'
      ? unoMerge(resetClassName, className)
      : className.as((c: string) => unoMerge(resetClassName, c))

  return <button class={mergedClassName} $={setup} {...rest} />
}
