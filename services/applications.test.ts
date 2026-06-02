import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { reset, setMockApps } from '../mocks/gi-gio'
import { desktopApp, desktopId, resolveApp } from './applications'

vi.mock('gi://Gio', () => import('../mocks/gi-gio'))

type MockApp = {
  get_id: () => string
  get_name: () => string
  get_icon: () => { to_string: () => string | null } | null
}

const app = (id: string, name: string, icon: string | null): MockApp => ({
  get_id: () => id,
  get_name: () => name,
  get_icon: () => (icon === null ? null : { to_string: () => icon }),
})

beforeEach(reset)

describe('desktopId', () => {
  it('appends .desktop when missing', () => {
    expect(desktopId('firefox')).toBe('firefox.desktop')
    expect(desktopId('org.mozilla.firefox')).toBe('org.mozilla.firefox.desktop')
  })

  it('leaves an existing .desktop suffix untouched', () => {
    expect(desktopId('firefox.desktop')).toBe('firefox.desktop')
  })
})

describe('desktopApp', () => {
  it('resolves name and icon from the matching .desktop entry', () => {
    setMockApps([app('discord.desktop', 'Discord', 'discord')])

    expect(desktopApp('discord')).toEqual({ name: 'Discord', icon: 'discord' })
  })

  it('returns null when no entry matches', () => {
    setMockApps([app('other.desktop', 'Other', 'other')])

    expect(desktopApp('no-match-app')).toBeNull()
  })

  it('falls back to an empty icon when the entry has none', () => {
    setMockApps([app('noicon.desktop', 'NoIcon', null)])

    expect(desktopApp('noicon')).toEqual({ name: 'NoIcon', icon: '' })
  })

  it('returns null for an empty entry without scanning', () => {
    setMockApps([app('discord.desktop', 'Discord', 'discord')])

    expect(desktopApp('')).toBeNull()
  })
})

describe('resolveApp', () => {
  it('prefers the .desktop name and uses its icon when the notification has none', () => {
    setMockApps([app('res1.desktop', 'Discord', 'discord')])

    expect(resolveApp({ appName: 'zzz', appIcon: '', desktopEntry: 'res1' })).toEqual({
      name: 'Discord',
      icon: 'discord',
    })
  })

  it("keeps the notification's own appIcon over the .desktop icon", () => {
    setMockApps([app('res2.desktop', 'Discord', 'discord')])

    expect(resolveApp({ appName: 'zzz', appIcon: 'file:///i.png', desktopEntry: 'res2' })).toEqual({
      name: 'Discord',
      icon: 'file:///i.png',
    })
  })

  it('falls back to appName and empty icon when the entry resolves to nothing', () => {
    expect(resolveApp({ appName: 'Slack', appIcon: '', desktopEntry: '' })).toEqual({
      name: 'Slack',
      icon: '',
    })
  })
})
