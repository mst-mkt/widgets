#!/usr/bin/env nu
# Usage: nu capture.nu [panelId]   panelId in: notification | player | launcher
# Move to an empty workspace, optionally open a panel, screenshot, print the PNG path.

def main [panel?: string] {
  # Switch to an empty workspace (no windows) on the focused output for a clean backdrop.
  let ws = (niri msg --json workspaces | from json)
  let focused_output = ($ws | where is_focused | get -o 0.output)
  let empty = (
    $ws
    | where {|w| $w.active_window_id == null and ($focused_output == null or $w.output == $focused_output) }
    | sort-by idx
    | get -o 0.idx
  )
  if $empty != null {
    niri msg action focus-workspace $empty | ignore
  }

  # Open a user-action panel via the request handler (dev instance name is "ags").
  if ($panel | is-not-empty) {
    try { ags request open $panel | ignore } catch {
      print -e $"warn: 'ags request open ($panel)' failed; is widgets running? \(ags list / pnpm dev)"
    }
  }

  sleep 400ms  # let the layer-shell tween settle
  niri msg action screenshot-screen --show-pointer false | ignore  # non-interactive, saved per niri screenshot-path
  sleep 300ms  # wait for the disk write

  # Newest PNG in ~/Pictures/screenshots (PNG); caller Reads it back as visual feedback.
  ls ~/Pictures/screenshots/*.png | sort-by modified | last | get name
}
