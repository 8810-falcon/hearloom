# Hearloom Web UI

このディレクトリは、Hearloomアプリの**Web UI（React + TypeScript）**実装です。

## アーキテクチャ

ハイブリッドアプリとして、以下の構成を採用しています：

```
┌─────────────────────────────────────┐
│  iOS/Android ネイティブシェル       │
│  ├─ WebViewホスティング              │
│  ├─ ブリッジAPI提供                  │
│  └─ プラットフォーム固有機能         │
└─────────────────────────────────────┘
          ↑ ブリッジAPI ↓
┌─────────────────────────────────────┐
│  Web UI（React + TypeScript）       │  ← このディレクトリ
│  ├─ UIコンポーネント                 │
│  ├─ ブリッジAPI呼び出し              │
│  └─ 状態管理・UIロジック             │
└─────────────────────────────────────┘
```

## ディレクトリ構造

```
web/
├── src/
│   ├── components/           # 再利用可能なUIコンポーネント
│   ├── screens/              # 画面コンポーネント
│   ├── bridge/               # ブリッジAPI呼び出しロジック
│   ├── hooks/                # カスタムフック
│   ├── stores/               # 状態管理
│   ├── styles/               # グローバルスタイル
│   └── utils/                # ユーティリティ関数
├── public/                   # 静的ファイル
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md                 # このファイル
```

## セットアップ

### 依存関係のインストール

```bash
cd web
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開くと、Web UIの動作確認ができます。

### ビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

### テスト

```bash
npm run test
```

### 型チェック

```bash
npm run type-check
```

## 開発ガイドライン

### ブリッジAPI呼び出し

ネイティブ機能を呼び出す際は、必ず `src/bridge/` 配下のラッパーを使用してください。

```typescript
import { nativeBridge } from '@/bridge';

// OK: ラッパー経由で呼び出し
const tracks = await nativeBridge.fetchRecentlyPlayed();

// NG: 直接window.webkit.messageHandlers等を呼ばない
```

### 型安全性

TypeScriptの型定義を活用し、実行時エラーを防いでください。

```typescript
// ブリッジAPIの型定義例
export interface NativeBridge {
  fetchRecentlyPlayed(): Promise<Track[]>;
  scheduleNotification(params: NotificationParams): Promise<void>;
}
```

### パフォーマンス

WebView環境での動作を常に意識してください。

- React.memo、useMemo、useCallbackを適切に使用
- 仮想スクロール（react-window等）を活用
- 不要な再レンダリングを避ける

### WebView特有の考慮事項

- iOS WKWebView、Android WebView両対応
- スクロール最適化（`overflow-scrolling: touch`等）
- タッチイベント（タップ遅延の回避）
- SafeArea対応（`viewport-fit=cover`）

## トラブルシューティング

### WebViewでの動作確認方法

#### iOS
1. Xcodeでアプリをビルド
2. Safari > 開発メニュー > Simulator > WebView を選択
3. Safari Web Inspectorでデバッグ

#### Android
1. Android Studioでアプリをビルド
2. Chrome DevToolsで `chrome://inspect` を開く
3. WebViewを選択してデバッグ

### よくある問題

**問題: ブリッジAPIが呼べない**
- ネイティブ側でブリッジAPIが実装されているか確認
- TypeScript型定義とネイティブ実装が一致しているか確認

**問題: スクロールがカクつく**
- 仮想スクロールを使用
- React DevToolsでプロファイリングし、不要な再レンダリングを削減

## 関連ドキュメント

- [CLAUDE.md](/Users/01046382/Documents/Hearloom/CLAUDE.md): プロジェクト全体のガイドライン
- [SKILL.md](/Users/01046382/Documents/Hearloom/SKILL.md): 開発知見
- [docs/design/](/Users/01046382/Documents/Hearloom/docs/design/): デザイン仕様
