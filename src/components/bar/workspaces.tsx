import { For } from 'ags'
import { Gtk } from 'ags/gtk4'

import { available } from '../../services/player'
import { workspaces, focused, focus, type Workspace } from '../../services/workspaces'
import { openPanel } from '../../stores/panel'
import { onHover } from '../../utils/controllers'
import type { FC } from '../../utils/types'
import { WorkspaceDot } from './workspace-dot'

type WorkspacesProps = {
  $type?: string
}

export const Workspaces: FC<WorkspacesProps> = ({ $type }) => (
  <box
    $type={$type}
    class="bg-surface rounded-full px-3 py-2"
    halign={Gtk.Align.CENTER}
    spacing={8}
    $={onHover(() => {
      if (available.peek()) openPanel('player')
    })}
  >
    <For each={workspaces} id={(workspace: Workspace) => workspace.id}>
      {(workspace: Workspace) => (
        <WorkspaceDot
          active={focused.as((f) => f === workspace.idx)}
          onClick={() => focus(workspace.idx)}
        />
      )}
    </For>
  </box>
)
