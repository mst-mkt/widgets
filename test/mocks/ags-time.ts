import { vi } from 'vite-plus/test'

export type Timer = { cancel: () => void }

export const timers: (() => void)[] = []
export const cancelled: number[] = []

export const resetTime = () => {
  timers.length = 0
  cancelled.length = 0
  timeout.mockClear()
}

export const timeout = vi.fn((_interval: number, callback?: () => void): Timer => {
  const fire = callback ?? (() => {})
  const id = timers.push(fire)
  const cancel = vi.fn(() => {
    cancelled.push(id)
  })

  return { cancel }
})
