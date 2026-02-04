# Hearloom Web UI 構造設計

**最終更新: 2026-02-04**

## 目的

- Share起点の入力体験を最優先
- WebView内で軽く動くUI構成
- 画面と状態の責務分離を明確化

---

## 画面構成

- `ShareCaptureScreen`
- `TimelineScreen`
- `EditScreen`

---

## ディレクトリ構造（再設計）

```
web/src/
  screens/
    ShareCaptureScreen.tsx
    TimelineScreen.tsx
    EditScreen.tsx
  components/
    MoodPicker.tsx
    RecordCard.tsx
    RecordList.tsx
    PrimaryButton.tsx
    TextField.tsx
    TextArea.tsx
  stores/
    recordStore.ts
  bridge/
    share.ts
  styles/
    tokens.css
    global.css
```

---

## 責務分離

- `screens/`: 画面単位のレイアウトとフロー
- `components/`: 再利用UI部品（状態は持たない）
- `stores/`: 記録データと永続化
- `bridge/`: ネイティブ連携（共有URL取得など）
- `styles/`: トークンとグローバル

---

## 画面初期表示のルール

- `sharedUrl`がある場合: `ShareCaptureScreen`
- ない場合: `TimelineScreen`

---

## 状態

- `sharedUrl`: 共有URL（クエリ or ブリッジ）
- `records`: 記録一覧（LocalStorage）
- `draft`: 編集中の記録

---

## データモデル

```ts
export type TimeBucket = '朝' | '昼' | '夕' | '夜';

export type RecordEntry = {
  id: string;
  sharedUrl: string;
  mood: string;
  note: string;
  createdAt: string; // ISO
  timeBucket: TimeBucket;
};
```

---

## MVP外の領域（将来）

- 検索・絞り込み
- 自動取得連携
- レポート
