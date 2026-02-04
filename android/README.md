# Hearloom Android ネイティブシェル

## 概要

HearloomのAndroidネイティブシェルです。WebView UIをホスティングし、Intent Filterを通じて音楽アプリからの共有を受け取ります。

## アーキテクチャ

```
app/src/main/
├── java/com/hearloom/
│   ├── app/
│   │   └── MainActivity.kt        # アプリエントリーポイント
│   ├── webview/
│   │   └── WebViewScreen.kt       # WebView Composable
│   └── bridge/
│       └── HearloomBridge.kt      # JavaScriptInterface
├── res/
│   ├── values/
│   │   ├── strings.xml
│   │   ├── themes.xml
│   │   └── colors.xml
│   └── mipmap-*/                  # アプリアイコン
└── AndroidManifest.xml            # Intent Filter設定
```

## セットアップ

### 1. Android Studioでプロジェクトを開く

1. Android Studio を起動
2. "Open" を選択し、`android/` ディレクトリを指定
3. Gradle sync が完了するまで待機

### 2. 開発サーバーの起動

```bash
cd web
npm run dev
```

エミュレータからローカルサーバーにアクセスするため、`10.0.2.2:5173` を使用します（`localhost` ではなく）。

### 3. 実行

1. エミュレータまたは実機を選択
2. "Run" ボタンをクリック

## Intent Filter

AndroidManifest.xml で以下の共有インテントを受け取るよう設定しています:

```xml
<intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="text/plain" />
</intent-filter>
```

## ブリッジAPI

### getSharedUrl

共有されたURLを取得します。

```javascript
// Web UI側
const result = HearloomBridge.getSharedUrl();
const data = JSON.parse(result);
const url = data.url; // string | null
```

### closeApp

アプリを閉じて元のアプリに戻ります。

```javascript
// Web UI側
HearloomBridge.closeApp();
```

## 対応する音楽サービス

- Spotify: `https://open.spotify.com/track/*`, `https://spotify.link/*`
- Apple Music: `https://music.apple.com/*`
- YouTube: `https://youtu.be/*`, `https://www.youtube.com/watch*`
- YouTube Music: `https://music.youtube.com/*`

## デバッグ

### Chrome DevTools

1. Chrome で `chrome://inspect` を開く
2. 実機/エミュレータでアプリを起動
3. "Remote Target" に表示されるWebViewを選択して "inspect"

### ログ

Logcat で以下のタグをフィルタ:

- `WebViewScreen`: WebViewのナビゲーションイベント
- `HearloomBridge`: ブリッジAPI呼び出し

## リリースビルド

1. Web UIをビルド: `cd web && npm run build`
2. `web/dist/` の内容を `android/app/src/main/assets/web/` にコピー
3. Android Studio で "Build" > "Generate Signed Bundle / APK"

## 技術スタック

- Kotlin 2.0
- Jetpack Compose
- Android WebView
- JavaScriptInterface
- minSdk: 26 (Android 8.0)
- targetSdk: 34 (Android 14)

## 注意事項

### Cleartext Traffic

開発時のローカルサーバー接続のため、`android:usesCleartextTraffic="true"` を設定しています。リリースビルドでは無効化を推奨します。

### ProGuard

`HearloomBridge` クラスは ProGuard で保護されています（`proguard-rules.pro`）。

---

**最終更新**: 2026-02-04
