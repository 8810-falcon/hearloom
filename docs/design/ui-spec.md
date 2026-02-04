# Hearloom UI仕様（Figma想定）

**最終更新: 2026-02-04**

## アートボード

- Mobile: 390 x 844（iPhone 14）
- Android: 360 x 800
- Safe Area: 上44 / 下34（iOS想定）

---

## トークン

### Color

- `--bg`: #F6F2ED
- `--surface`: #FFFFFF
- `--surface-dim`: #EEE7DF
- `--text`: #1E1A16
- `--text-sub`: #6B625B
- `--border`: #D8CFC6
- `--accent-a`: #E07A5F
- `--accent-b`: #3D5A80
- `--accent-c`: #81B29A
- `--accent-d`: #F2CC8F
- `--error`: #B42318

### Type

- Display: 28 / 1.2
- H1: 22 / 1.3
- H2: 18 / 1.4
- Body: 15 / 1.6
- Caption: 12 / 1.4

### Radius

- 8, 12, 20

### Spacing

- 4, 8, 12, 16, 24, 32

---

## コンポーネント

### Primary Button

- 高さ: 44
- Radius: 12
- 背景: `--accent-a`
- 文字: 白
- 影: なし

### Secondary Button

- 高さ: 44
- Radius: 12
- 背景: 透明
- 枠: `--border`
- 文字: `--text`

### Text Field

- 高さ: 44
- Radius: 12
- 背景: `--surface`
- 枠: `--border`
- フォーカス: `--accent-b` 20%

### Text Area

- 最小高さ: 96
- Radius: 12
- 背景: `--surface`
- 枠: `--border`

### Mood Chip

- 高さ: 32
- Radius: 16
- 未選択: `--surface-dim`
- 選択: `--accent-d`

### Card

- Radius: 16
- 背景: `--surface`
- 枠: `--border`

---

## 画面仕様

### Share Capture

- Header
  - Title: Hearloom
  - Subtitle: 音楽と感情・状況を紐づける記録
- Inputs
  - 共有URL（TextField）
  - 気分（Mood Chips）
  - 状況（TextArea）
- CTA
  - Primary: 保存
  - Secondary: クリア

### Timeline

- Header
  - Title: 最近の記録
  - Count: {n}件
- Record Card
  - Date + TimeBucket
  - Mood
  - Note
  - Edit
  - URL（リンク）

### Edit

- Share Captureと同レイアウト
- Primary: 更新
- Secondary: キャンセル
