const state: { pending: (() => void)[] } = {
  pending: [],
}

export const flush = () => {
  for (const callback of state.pending.splice(0)) callback()
}

export const reset = () => {
  state.pending.length = 0
}

export default {
  Session: class {
    send_and_read_async(
      _message: unknown,
      _priority: number,
      _cancellable: unknown,
      callback: (source: unknown, result: unknown) => void,
    ) {
      state.pending.push(() => callback(this, {}))
    }
    send_and_read_finish() {
      return {}
    }
  },
  Message: { new: () => ({}) },
}
