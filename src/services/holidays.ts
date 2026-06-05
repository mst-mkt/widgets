import holiday_jp from '@holiday-jp/holiday_jp/lib/holiday_jp.js'

import { dayKey, type YearMonth } from '../utils/calendar'
import { pad2 } from '../utils/format'

export const holidayKeys = ({ year, month }: YearMonth): Set<string> => {
  const prefix = `${year}-${pad2(month)}-`

  return new Set(
    Object.keys(holiday_jp.holidays)
      .filter((date) => date.startsWith(prefix))
      .map((date) => dayKey({ year, month, day: Number(date.slice(8, 10)) })),
  )
}
