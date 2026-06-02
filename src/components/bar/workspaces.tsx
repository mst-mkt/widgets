import { For } from 'ags'
import { Gtk } from 'ags/gtk4'

import { workspaces, focused, focus, type Workspace } from '../../services/workspaces'
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
