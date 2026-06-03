import { filePath } from './file'

export type CoverSource =
  | { kind: 'file'; path: string }
  | { kind: 'url'; url: string }
  | { kind: 'none' }

export const resolveSource = (coverArt: string, artUrl: string): CoverSource => {
  const path = filePath(coverArt)
  if (path !== null) return { kind: 'file', path }
  if (artUrl.startsWith('http')) return { kind: 'url', url: artUrl }
  return { kind: 'none' }
}
