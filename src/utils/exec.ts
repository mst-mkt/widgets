import { execAsync } from 'ags/process'

export const run = (cmd: string[]) => {
  return execAsync(cmd).catch(() => {})
}
