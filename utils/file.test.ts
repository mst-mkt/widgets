import { describe, expect, it } from 'vite-plus/test'

import { filePath } from './file'

describe('filePath', () => {
  it('returns an absolute path as-is', () => {
    expect(filePath('/tmp/a.png')).toBe('/tmp/a.png')
  })

  it('strips the file:// scheme', () => {
    expect(filePath('file:///tmp/a.png')).toBe('/tmp/a.png')
  })

  it('returns null for theme names or empty values', () => {
    expect(filePath('firefox')).toBeNull()
    expect(filePath('')).toBeNull()
  })
})
