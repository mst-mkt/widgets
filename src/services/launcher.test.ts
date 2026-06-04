import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { launched, queries, reset, setMockApps } from '../../test/mocks/gi-apps'

vi.mock('gi://AstalApps', () => import('../../test/mocks/gi-apps'))

const { toEntry, byFrequency, search, launch } = await import('./launcher')

beforeEach(reset)

describe('toEntry', () => {
  it('maps an application onto a plain entry', () => {
    expect(
      toEntry({
        name: 'Firefox',
        description: 'Web Browser',
        iconName: 'firefox',
        entry: 'firefox.desktop',
      }),
    ).toEqual({
      name: 'Firefox',
      description: 'Web Browser',
      icon: 'firefox',
      entry: 'firefox.desktop',
    })
  })

  it('coerces a missing (null) description to an empty string', () => {
    expect(
      toEntry({
        name: 'Discord',
        description: null,
        iconName: 'discord',
        entry: 'discord.desktop',
      }),
    ).toEqual({ name: 'Discord', description: '', icon: 'discord', entry: 'discord.desktop' })
  })

  it('coerces a missing (null) icon to an empty string', () => {
    expect(
      toEntry({ name: 'CLI Tool', description: 'x', iconName: null, entry: 'cli.desktop' }),
    ).toEqual({ name: 'CLI Tool', description: 'x', icon: '', entry: 'cli.desktop' })
  })
})

describe('byFrequency', () => {
  it('orders the more frequently launched app first', () => {
    expect(byFrequency({ frequency: 1, name: 'A' }, { frequency: 5, name: 'B' })).toBeGreaterThan(0)
  })

  it('breaks ties alphabetically by name', () => {
    expect(
      byFrequency({ frequency: 2, name: 'Apple' }, { frequency: 2, name: 'Banana' }),
    ).toBeLessThan(0)
  })
})

describe('search', () => {
  it('lists every app sorted by frequency when the query is blank', () => {
    setMockApps([
      { name: 'Rare', entry: 'rare.desktop', frequency: 1 },
      { name: 'Often', entry: 'often.desktop', frequency: 9 },
    ])

    expect(search('').map((entry) => entry.entry)).toEqual(['often.desktop', 'rare.desktop'])
  })

  it('treats a whitespace-only query as blank without querying', () => {
    setMockApps([{ name: 'Solo', entry: 'solo.desktop' }])

    expect(search('   ').map((entry) => entry.name)).toEqual(['Solo'])
    expect(queries()).toEqual([])
  })

  it('fuzzy-queries when the query has content', () => {
    setMockApps([
      { name: 'Firefox', entry: 'firefox.desktop' },
      { name: 'Chromium', entry: 'chromium.desktop' },
    ])

    expect(search('fire').map((entry) => entry.name)).toEqual(['Firefox'])
    expect(queries()).toEqual(['fire'])
  })
})

describe('launch', () => {
  it('launches the application with the matching entry', () => {
    setMockApps([{ name: 'Firefox', entry: 'firefox.desktop' }])

    launch('firefox.desktop')

    expect(launched()).toEqual(['firefox.desktop'])
  })

  it('does nothing when no entry matches', () => {
    setMockApps([{ name: 'Firefox', entry: 'firefox.desktop' }])

    launch('missing.desktop')

    expect(launched()).toEqual([])
  })
})
