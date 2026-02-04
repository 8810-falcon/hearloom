# Hearloom iOS ネイティブシェル

## 概要

HearloomのiOSネイティブシェルです。WebView UIをホスティングし、Share Extensionを通じて音楽アプリからの共有を受け取ります。

## アーキテクチャ

```
Hearloom/
├── HearloomApp.swift              # アプリエントリーポイント
├── MainView.swift                 # メインビュー
├── Info.plist                     # アプリ設定
├── Shared/
│   └── SharedUrlManager.swift     # 共有URL管理（App Groups経由）
├── WebView/
│   ├── WebViewContainer.swift     # WKWebView SwiftUIラッパー
│   └── WebViewCoordinator.swift   # ブリッジAPIハンドラ
└── Assets.xcassets/               # アプリアイコン等

HearloomShareExtension/
├── ShareViewController.swift      # Share Extension実装
└── Info.plist                     # Extension設定
```

## セットアップ

### 1. Xcodeでプロジェクトを開く

```bash
open ios/Hearloom.xcodeproj
```

### 2. App Groups の設定

Share Extensionとメインアプリ間でデータを共有するため、App Groupsの設定が必要です。

1. Xcodeでプロジェクト設定を開く（Project Navigator で "Hearloom" を選択）
2. "Hearloom" ターゲットを選択
3. "Signing & Capabilities" タブを開く
4. "+ Capability" をクリックし、"App Groups" を追加
5. App Group として `group.com.hayato-ogura.Hearloom` を追加

### 3. Share Extension ターゲットの追加

1. Xcodeメニュー: File > New > Target
2. "Share Extension" を選択
3. Product Name: `HearloomShareExtension`
4. Language: Swift
5. 作成後、既存の `HearloomShareExtension/` ディレクトリのファイルを使用
6. Share Extensionターゲットにも同じApp Groupを追加

### 4. URL Scheme の確認

Info.plist に `hearloom://` スキームが設定されていることを確認。

### 5. 開発サーバーの起動

```bash
cd web
npm run dev
```

WebViewは開発時に `http://localhost:5173/` を読み込みます。

## ブリッジAPI

### getSharedUrl

共有されたURLを取得します。

```javascript
// Web UI側
const url = await hearloomBridge.getSharedUrl();
```

### closeApp

アプリを閉じて元のアプリに戻ります。

```javascript
// Web UI側
hearloomBridge.closeApp();
```

## 対応する音楽サービス

- Spotify: `https://open.spotify.com/track/*`, `https://spotify.link/*`
- Apple Music: `https://music.apple.com/*`
- YouTube: `https://youtu.be/*`, `https://www.youtube.com/watch*`
- YouTube Music: `https://music.youtube.com/*`

## デバッグ

### Safari Web Inspector

iOS 16.4以降では、Safariの開発メニューからWebViewをインスペクトできます。

1. Mac: Safari > Settings > Advanced > "Show features for web developers" を有効化
2. iPhone: Settings > Safari > Advanced > Web Inspector を有効化
3. 実機をMacに接続
4. Safari: Develop > [デバイス名] > [ページ名]

### ログ

- `[WebView]` プレフィックス: WebViewのナビゲーションイベント
- `[Bridge]` プレフィックス: ブリッジAPI呼び出し
- `[ShareExtension]` プレフィックス: Share Extensionイベント

## リリースビルド

1. Web UIをビルド: `cd web && npm run build`
2. `web/dist/` を `ios/Hearloom/WebUI/` にコピー
3. Xcodeでリリースビルドを作成

## 技術スタック

- Swift 5
- SwiftUI
- WKWebView
- WKScriptMessageHandler
