import { Gtk } from 'ags/gtk4'

import { mergeClass } from '../../utils/class'
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

  return <button class={mergeClass(resetClassName, className)} $={setup} {...rest} />
}
