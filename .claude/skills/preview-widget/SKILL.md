---
name: preview-widget
description: >-
  Previews how a GTK4/AGS widget actually looks by taking a fullscreen
  screenshot on an empty niri workspace and reading it back as visual feedback,
  to check that implemented styles, layout and colors came out as intended. Use
  when the user wants to preview, visually check or screenshot a widget's
  appearance — e.g. "見た目を確認", "視覚的に確認したい", "プレビュー", "スクショ撮って",
  "how does it look". For panels that appear only on user action (notification /
  player / launcher), it opens them via the request handler before capturing.
allowed-tools: >-
  Read,
  Bash(nu .claude/skills/preview-widget/scripts/capture.nu:*),
  Bash(niri msg:*),
  Bash(ags request:*),
  Bash(ags list:*),
  Bash(ls:*)
---

# preview-widget

実装したウィジェットの見た目をスクリーンショットで確認するためのスキル
スタイルやレイアウトを変更したあと、実際の表示が意図どおりかを検証する

## 使い方

```sh
nu .claude/skills/preview-widget/scripts/capture.nu {panelId}
```

空きワークスペースへ移動して全画面を撮影し、保存した PNG のパスを返す
そのパスを Read で開き、実装と照らし合わせる

`panelId` には `notification`, `player`, `launcher` などを渡すことで、撮影前にそのパネルを開くことができる
これらは操作して初めて表示されるパネルのため、常時表示のバーなどでは省略する

## 前提

widgets を dev で起動しておく (`pnpm dev`)
稼働は `ags list` で確認できる

## CSS を変えた直後

`watch:css` と `watch:ags` は独立に走り順序が不定で変更が反映されない場合がある

```sh
pnpm gen:css      # CSS を再生成
touch src/app.tsx # watchexec による再起動を促す
```

## コマンドの内容

`capture.nu` を使わず手元で撮るときの流れ。上から順に実行する。

```sh
# 1. 空きワークスペースへ移動し、背景をクリーンにする
idx=$(nu -c 'niri msg --json workspaces | from json | where active_window_id == null | sort-by idx | get -o 0.idx')
niri msg action focus-workspace $idx

# 2. 要操作パネルを撮るときだけ開く (notification, player, launcher)
#    bar など常時表示は不要
ags request open launcher

# 3. 表示アニメーションが落ち着くのを待つ
sleep 0.4

# 4. 全画面を撮影
niri msg action screenshot-screen --show-pointer false

# 5. 保存された最新の PNG を取得
ls -t ~/Pictures/screenshots/*.png | head -1
```

保存先は niri の `screenshot-path` 設定 (`~/Pictures/screenshots/<日時>.png`, PNG)
本番バイナリではパネル操作を `widgets open {panelId}` で行う
