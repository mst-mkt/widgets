import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { launched, reset as resetApps, setMockApps } from '../../test/mocks/gi-apps'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/process', () => import('../../test/mocks/ags-process'))

vi.mock('gi://AstalApps', () => import('../../test/mocks/gi-apps'))

const {
  query,
  results,
  selected,
  setQuery,
  moveSelection,
  selectIndex,
  launchApp,
  launchSelected,
  initLauncher,
} = await import('./launcher')
const { openPanel, closePanel, isPanelOpen } = await import('./panel')

const app = (name: string, entry: string) => ({ name, entry })

beforeEach(() => {
  resetApps()
  closePanel()
  setQuery('')
})

describe('setQuery', () => {
  it('resets the selection and recomputes the results for the new query', () => {
    setMockApps([app('A', 'a.desktop'), app('B', 'b.desktop'), app('C', 'c.desktop')])

    moveSelection(2)
    expect(selected.peek()).toBe(2)

    setQuery('B')
    expect(selected.peek()).toBe(0)
    expect(results.peek().map((entry) => entry.entry)).toEqual(['b.desktop'])
  })
})

describe('selectIndex', () => {
  it('sets the selected index directly', () => {
    setMockApps([app('A', 'a.desktop'), app('B', 'b.desktop'), app('C', 'c.desktop')])

    selectIndex(2)

    expect(selected.peek()).toBe(2)
  })
})

describe('moveSelection', () => {
  it('clamps within the bounds of the result list', () => {
    setMockApps([app('A', 'a.desktop'), app('B', 'b.desktop'), app('C', 'c.desktop')])

    moveSelection(-1)
    expect(selected.peek()).toBe(0)

    moveSelection(5)
    expect(selected.peek()).toBe(2)

    moveSelection(1)
    expect(selected.peek()).toBe(2)
  })

  it('is a no-op when there are no results', () => {
    moveSelection(1)

    expect(selected.peek()).toBe(0)
  })
})

describe('launchSelected', () => {
  it('launches the entry under the selection and closes the panel', () => {
    setMockApps([app('A', 'a.desktop'), app('B', 'b.desktop')])
    openPanel('launcher')

    moveSelection(1)
    launchSelected()

    expect(launched()).toEqual(['b.desktop'])
    expect(isPanelOpen('launcher').peek()).toBe(false)
  })

  it('does nothing when there are no results', () => {
    openPanel('launcher')

    launchSelected()

    expect(launched()).toEqual([])
    expect(isPanelOpen('launcher').peek()).toBe(true)
  })
})

describe('launchApp', () => {
  it('launches the given entry and closes the panel', () => {
    setMockApps([app('Firefox', 'firefox.desktop')])
    openPanel('launcher')

    launchApp('firefox.desktop')

    expect(launched()).toEqual(['firefox.desktop'])
    expect(isPanelOpen('launcher').peek()).toBe(false)
  })
})

describe('initLauncher', () => {
  it('clears the query when the launcher panel opens', () => {
    initLauncher()

    setQuery('firefox')
    openPanel('launcher')

    expect(query.peek()).toBe('')
    expect(selected.peek()).toBe(0)
  })
})
