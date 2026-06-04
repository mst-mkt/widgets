import { createExternal } from 'ags'
import { Gdk } from 'ags/gtk4'
import GLib from 'gi://GLib'
import Soup from 'gi://Soup'

import { artUrl, coverArt } from '../services/player'
import { resolveSource } from '../utils/cover'

const session = new Soup.Session()

const textureFromBytes = (bytes: GLib.Bytes): Gdk.Texture | null => {
  try {
    return Gdk.Texture.new_from_bytes(bytes)
  } catch {
    return null
  }
}

const textureFromFile = (path: string): Gdk.Texture | null => {
  try {
    return Gdk.Texture.new_from_filename(path)
  } catch {
    return null
  }
}

export const cover = createExternal<Gdk.Texture | null>(null, (set) => {
  let request = 0

  const fetchRemote = (url: string, id: number) => {
    const message = Soup.Message.new('GET', url)
    session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (_, result) => {
      if (id !== request) return
      try {
        set(textureFromBytes(session.send_and_read_finish(result)))
      } catch {
        set(null)
      }
    })
  }

  const update = () => {
    const id = ++request
    const source = resolveSource(coverArt.peek(), artUrl.peek())

    if (source.kind === 'file') set(textureFromFile(source.path))
    else if (source.kind === 'url') fetchRemote(source.url, id)
    else set(null)
  }

  update()
  const unsubscribeCoverArt = coverArt.subscribe(update)
  const unsubscribeArtUrl = artUrl.subscribe(update)

  return () => {
    request++
    unsubscribeCoverArt()
    unsubscribeArtUrl()
  }
})
