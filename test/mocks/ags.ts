type Listener = () => void

type Tracked = { subscribe: (cb: Listener) => () => void }

const accessStack: Array<Set<Tracked>> = []

const accessorFrom = <T>(get: () => T, subscribe: (cb: Listener) => () => void) => {
  const read = () => {
    accessStack.at(-1)?.add(accessor)
    return get()
  }
  const as = <R>(fn: (v: T) => R) => accessorFrom(() => fn(get()), subscribe)
  const accessor = Object.assign(read, { get, peek: get, subscribe, as })
  return accessor
}

export const createState = <T>(initial: T) => {
  let value = initial
  const listeners = new Set<Listener>()

  const subscribe = (cb: Listener) => {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }

  const set = (next: T | ((prev: T) => T)) => {
    value = typeof next === 'function' ? (next as (prev: T) => T)(value) : next
    for (const cb of listeners) {
      cb()
    }
  }

  return [accessorFrom(() => value, subscribe), set]
}

export const createComputed = <T>(producer: () => T) => {
  const subscribe = (cb: Listener) => {
    const deps = new Set<Tracked>()
    accessStack.push(deps)
    producer()
    accessStack.pop()
    const disposers = [...deps].map((dep) => dep.subscribe(cb))
    return () => {
      for (const dispose of disposers) dispose()
    }
  }

  return accessorFrom(producer, subscribe)
}

export const cleanups: (() => void)[] = []

export const onCleanup = (cleanup: () => void) => {
  cleanups.push(cleanup)
}

export const runCleanups = () => {
  for (const cleanup of cleanups.splice(0)) {
    cleanup()
  }
}

export const appendChild = Symbol('appendChild')
export const removeChild = Symbol('removeChild')

export const createBinding = <T, K extends keyof T>(object: T, property: K) => {
  return accessorFrom(
    () => object[property],
    () => () => {},
  )
}

export const createExternal = <T>(
  initial: T,
  producer: (set: (next: T | ((prev: T) => T)) => void) => () => void,
) => {
  let value = initial
  let dispose: () => void = () => {}
  const listeners = new Set<Listener>()

  const subscribe = (cb: Listener) => {
    if (listeners.size === 0) {
      dispose = producer((next) => {
        value = typeof next === 'function' ? (next as (prev: T) => T)(value) : next
        for (const listener of listeners) {
          listener()
        }
      })
    }
    listeners.add(cb)
    return () => {
      listeners.delete(cb)
      if (listeners.size === 0) {
        dispose()
      }
    }
  }

  return accessorFrom(() => value, subscribe)
}

export class Accessor<T = unknown> extends Function {
  #get: () => T
  #subscribe: (callback: Listener) => () => void

  constructor(get: () => T, subscribe?: (callback: Listener) => () => void) {
    super()
    this.#get = get
    this.#subscribe = subscribe ?? (() => () => {})
  }

  peek() {
    return this.#get()
  }

  subscribe(callback: Listener) {
    return this.#subscribe(callback)
  }

  as<R>(transform: (value: T) => R) {
    return new Accessor(() => transform(this.#get()), this.#subscribe)
  }
}
