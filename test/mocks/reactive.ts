type Listener = () => void

export const reactive = <T>(initial: T) => {
  const listeners = new Set<Listener>()
  let value = initial

  return {
    accessor: {
      peek: () => value,
      subscribe: (cb: Listener) => {
        listeners.add(cb)
        return () => listeners.delete(cb)
      },
    },
    set: (next: T) => {
      value = next
      for (const cb of listeners) cb()
    },
    reset: () => {
      value = initial
      listeners.clear()
    },
  }
}
