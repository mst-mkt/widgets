type Listener = () => void

const accessorFrom = <T>(get: () => T, subscribe: (cb: Listener) => () => void) => {
  const as = <R>(fn: (v: T) => R) => accessorFrom(() => fn(get()), subscribe)
  return Object.assign(get, { get, subscribe, as })
}

export const createState = <T>(initial: T) => {
  let value = initial
  const listeners = new Set<Listener>()

  const subscribe = (cb: Listener) => {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }

  const set = (next: T) => {
    value = next
    for (const cb of listeners) {
      cb()
    }
  }

  return [accessorFrom(() => value, subscribe), set]
}
