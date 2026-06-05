import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { execAsync } from '../../test/mocks/ags-process'
import {
  buildListCommand,
  events,
  eventsOnDay,
  eventsStatus,
  fetchEvents,
  parseEvents,
  toEvent,
} from './calendar'

vi.mock('ags', () => import('../../test/mocks/ags'))

vi.mock('ags/process', () => import('../../test/mocks/ags-process'))

describe('toEvent', () => {
  it('maps a timed event', () => {
    expect(
      toEvent({
        summary: 'Standup',
        start: { dateTime: '2026-06-05T09:30:00+09:00' },
        end: { dateTime: '2026-06-05T10:00:00+09:00' },
      }),
    ).toEqual({
      summary: 'Standup',
      start: '2026-06-05T09:30:00+09:00',
      end: '2026-06-05T10:00:00+09:00',
      allDay: false,
      day: { year: 2026, month: 6, day: 5 },
    })
  })

  it('maps an all-day event from date', () => {
    const event = toEvent({
      summary: 'Holiday',
      start: { date: '2026-06-05' },
      end: { date: '2026-06-06' },
    })
    expect(event.allDay).toBe(true)
    expect(event.day).toEqual({ year: 2026, month: 6, day: 5 })
  })

  it('coerces a missing summary to an empty string', () => {
    expect(toEvent({ start: { dateTime: '2026-06-05T09:30:00+09:00' } }).summary).toBe('')
  })
})

describe('parseEvents', () => {
  it('parses the items array', () => {
    const raw = JSON.stringify({
      items: [{ summary: 'A', start: { dateTime: '2026-06-05T09:00:00Z' } }],
    })
    expect(parseEvents(raw)).toHaveLength(1)
  })

  it('returns an empty list on invalid json, missing items, or a non-array items', () => {
    expect(parseEvents('not json')).toEqual([])
    expect(parseEvents('{}')).toEqual([])
    expect(parseEvents(JSON.stringify({ items: 'unauthorized' }))).toEqual([])
  })
})

describe('eventsOnDay', () => {
  const timed = (time: string) =>
    toEvent({ summary: time, start: { dateTime: `2026-06-05T${time}:00+09:00` } })

  it('keeps the matching day and sorts all-day first, then by start', () => {
    const all = [
      timed('14:00'),
      timed('09:00'),
      toEvent({ summary: 'whole', start: { date: '2026-06-05' } }),
      toEvent({ summary: 'other', start: { dateTime: '2026-06-06T09:00:00+09:00' } }),
    ]

    expect(eventsOnDay(all, { year: 2026, month: 6, day: 5 }).map((e) => e.summary)).toEqual([
      'whole',
      '09:00',
      '14:00',
    ])
  })
})

describe('buildListCommand', () => {
  it('targets the month window as a primary-calendar params json', () => {
    const cmd = buildListCommand({ year: 2026, month: 12 })
    expect(cmd.slice(0, 6)).toEqual(['gws', 'calendar', 'events', 'list', '--format', 'json'])
    expect(cmd[6]).toBe('--params')
    expect(JSON.parse(cmd[7] ?? '')).toEqual({
      calendarId: 'primary',
      timeMin: '2026-12-01T00:00:00Z',
      timeMax: '2027-01-01T00:00:00Z',
      singleEvents: true,
      orderBy: 'startTime',
    })
  })
})

describe('fetchEvents', () => {
  beforeEach(() => execAsync.mockReset())

  it('stores parsed events on success', async () => {
    execAsync.mockResolvedValueOnce(
      JSON.stringify({ items: [{ summary: 'A', start: { dateTime: '2026-06-05T09:00:00Z' } }] }),
    )

    await fetchEvents({ year: 2026, month: 6 })

    expect(events.peek()).toHaveLength(1)
    expect(eventsStatus.peek()).toBe('ready')
  })

  it('falls back to an empty list and reports failure when the cli fails', async () => {
    execAsync.mockResolvedValueOnce(
      JSON.stringify({ items: [{ summary: 'A', start: { dateTime: '2026-06-05T09:00:00Z' } }] }),
    )
    await fetchEvents({ year: 2026, month: 6 })
    expect(events.peek()).toHaveLength(1)

    execAsync.mockImplementationOnce(() => Promise.reject(new Error('no gws')))
    await fetchEvents({ year: 2026, month: 6 })

    expect(events.peek()).toEqual([])
    expect(eventsStatus.peek()).toBe('error')
  })

  it('discards a stale fetch that resolves after a newer one', async () => {
    let resolveStale: ((value: string) => void) | undefined
    execAsync.mockImplementationOnce(
      () =>
        new Promise<string>((resolve) => {
          resolveStale = resolve
        }),
    )
    execAsync.mockResolvedValueOnce(
      JSON.stringify({
        items: [{ summary: 'fresh', start: { dateTime: '2026-07-01T09:00:00Z' } }],
      }),
    )

    const stale = fetchEvents({ year: 2026, month: 6 })
    await fetchEvents({ year: 2026, month: 7 })
    expect(events.peek().map((e) => e.summary)).toEqual(['fresh'])

    resolveStale?.(
      JSON.stringify({
        items: [{ summary: 'stale', start: { dateTime: '2026-06-01T09:00:00Z' } }],
      }),
    )
    await stale

    expect(events.peek().map((e) => e.summary)).toEqual(['fresh'])
  })
})
