import type { Gtk as GtkTypes } from 'ags/gtk4'
import { vi } from 'vite-plus/test'

type Handler = (...args: unknown[]) => unknown

class Controller {
  private handlers: Record<string, Handler> = {}

  connect(signal: string, handler: Handler) {
    this.handlers[signal] = handler
    return 0
  }

  emit(signal: string, ...args: unknown[]) {
    return this.handlers[signal]?.(this, ...args)
  }
}

export class GestureClick extends Controller {}

export class EventControllerMotion extends Controller {}

export class EventControllerKey extends Controller {
  set_propagation_phase() {}
}

export const Gtk = {
  GestureClick,
  EventControllerMotion,
  EventControllerKey,
  PropagationPhase: { CAPTURE: 3 },
  DirectionType: { TAB_FORWARD: 0 },
}

export const textures = {
  file: { tag: 'file' },
  bytes: { tag: 'bytes' },
}

export const Gdk = {
  KEY_Escape: 0xff1b,
  Texture: {
    new_from_filename: () => textures.file,
    new_from_bytes: () => textures.bytes,
  },
}

export type Emitter = { emit: (signal: string, ...args: unknown[]) => unknown }

export type MockWidget = GtkTypes.Widget & {
  controllers: Emitter[]
  map: () => void
  set_focusable: ReturnType<typeof vi.fn>
  child_focus: ReturnType<typeof vi.fn>
  grab_focus: ReturnType<typeof vi.fn>
  set_cursor_from_name: ReturnType<typeof vi.fn>
}

export const createWidget = (childFocusable = false): MockWidget => {
  const controllers: Emitter[] = []
  let onMap: (() => void) | undefined

  const widget = {
    controllers,
    map: () => onMap?.(),
    add_controller: (controller: Emitter) => controllers.push(controller),
    connect: (signal: string, handler: () => void) => {
      if (signal === 'map') onMap = handler
    },
    set_focusable: vi.fn(),
    child_focus: vi.fn(() => childFocusable),
    grab_focus: vi.fn(),
    set_cursor_from_name: vi.fn(),
    get_root: () => null,
  } as unknown as MockWidget

  return widget
}
