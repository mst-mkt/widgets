import { With } from 'ags'
import { Gtk } from 'ags/gtk4'
import Pango from 'gi://Pango'

import type { CalendarEvent } from '../../services/calendar'
import { eventsView, selectedDate, type EventsView } from '../../stores/calendar'
import { formatEventTime, formatMonthDayWeekday } from '../../utils/format'
import type { FC } from '../../utils/types'
import { Icon, type IconName } from '../shared/icon'

type EventsPlaceholderProps = {
  icon: IconName
  label: string
}

const EventsPlaceholder: FC<EventsPlaceholderProps> = ({ icon, label }) => (
  <box
    orientation={Gtk.Orientation.VERTICAL}
    halign={Gtk.Align.CENTER}
    valign={Gtk.Align.CENTER}
    vexpand
    spacing={10}
  >
    <Icon icon={icon} size={22} class="text-ghost" />
    <label class="text-ghost text-12" label={label} />
  </box>
)

const EventRow = (event: CalendarEvent) => (
  <box class="py-2" spacing={10}>
    <box class="bg-gold min-w-[3px] rounded-full" valign={Gtk.Align.FILL} />
    <label
      class="text-mute text-12"
      valign={Gtk.Align.CENTER}
      widthChars={5}
      xalign={0}
      label={formatEventTime(event)}
    />
    <label
      class="text-ink text-13"
      xalign={0}
      hexpand
      valign={Gtk.Align.CENTER}
      maxWidthChars={1}
      ellipsize={Pango.EllipsizeMode.END}
      label={event.summary}
    />
  </box>
)

export const CalendarEvents: FC = () => (
  <box class="pt-4" orientation={Gtk.Orientation.VERTICAL} spacing={6}>
    <label
      class="text-dim text-13 font-medium"
      xalign={0}
      label={selectedDate.as(formatMonthDayWeekday)}
    />
    <box class="min-h-24" orientation={Gtk.Orientation.VERTICAL}>
      <With value={eventsView}>
        {(view: EventsView) =>
          view.kind === 'error' ? (
            <EventsPlaceholder icon="cloud-off" label="Couldn't Load Events" />
          ) : view.kind === 'empty' ? (
            <EventsPlaceholder icon="calendar" label="No Events" />
          ) : (
            <box orientation={Gtk.Orientation.VERTICAL}>{view.events.map(EventRow)}</box>
          )
        }
      </With>
    </box>
  </box>
)
