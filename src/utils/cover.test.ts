import { describe, expect, it } from 'vite-plus/test'

import { resolveSource } from './cover'

describe('resolveSource', () => {
  it('prefers a local cover-art file path', () => {
    expect(resolveSource('/tmp/cover.png', 'https://example.com/a.jpg')).toEqual({
      kind: 'file',
      path: '/tmp/cover.png',
    })
  })

  it('strips the file:// scheme of a local cover-art', () => {
    expect(resolveSource('file:///tmp/cover.png', '')).toEqual({
      kind: 'file',
      path: '/tmp/cover.png',
    })
  })

  it('falls back to the http art url when there is no local file', () => {
    expect(resolveSource('', 'https://i.scdn.co/image/abc')).toEqual({
      kind: 'url',
      url: 'https://i.scdn.co/image/abc',
    })
  })

  it('is none when neither a local file nor an http url is available', () => {
    expect(resolveSource('', '')).toEqual({ kind: 'none' })
    expect(resolveSource('', 'spotify:track:xyz')).toEqual({ kind: 'none' })
  })
})
