# mst-mkt/widgets

Linux Desktop widgets for [my laptop](https://github.com/mst-mkt/dotfiles), built with [Astal](https://github.com/aylur/astal) and [Gnim](https://github.com/aylur/gnim).

## Widgets

| Widget                 |                             Preview                             | Features                                                                                              |
| ---------------------- | :-------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------- |
| **Bar**                |         <img src="./docs/assets/bar.png" width="300" />         | <ul><li>Niri Workspace Indicator</li><li>Notification Panel Button</li><li>(Under construction…)</li> |
| **Notification Panel** | <img src="./docs/assets/notification-panel.png" height="300" /> | <ul><li>Grouped notifications</li><li>Actions & dismiss</li>                                          |
| **OSD**                |         <img src="./docs/assets/osd.png" width="300" />         | <ul><li>Audio Volume</li><li>Screen Brightness</li>                                                   |

_More widgets in development…_

## Usage

```sh
nix run github:mst-mkt/widgets
```

```nix
{
  inputs.widgets.url = "github:mst-mkt/widgets";
  home.packages = [ inputs.widgets.packages.${system}.default ];
}
```

### Request Handler

Widgets can be operated via the CLI.

- `widgets open {panelId}`
- `widgets toggle {panelId}`
- `widgets close`
