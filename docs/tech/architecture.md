# Hearloom アーキテクチャ設計

**最終更新: 2026-02-11**

## 概要

ハイブリッドアーキテクチャ（ネイティブシェル + WebView UI）を採用。

```
┌─────────────────────────────────────────┐
│              Native Shell               │
│  ┌─────────────────────────────────┐   │
│  │  MusicKit / Spotify SDK         │   │
│  │  Apple Intelligence / Gemini    │   │
│  │  Location / Widget / Push       │   │
│  │  Data Persistence (SQLite等)    │   │
│  └──────────────┬──────────────────┘   │
│                 │ Bridge API           │
│  ┌──────────────▼──────────────────┐   │
│  │          WebView                │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │      React App            │  │   │
│  │  │  - UI（全画面）            │  │   │
│  │  │  - 状態管理（Context）     │  │   │
│  │  │  - ビジネスロジック        │  │   │
│  │  └───────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 責務分割

### 基本方針

- **Native** = Nativeでしか実現できない機能のみ
- **Web** = UI + 状態管理 + ビジネスロジック

### Native側の責務

| 機能 | iOS | Android | 備考 |
|------|-----|---------|------|
| 再生曲取得 | MusicKit / SystemMusicPlayer | MediaSessionManager | Apple Music / Spotify |
| Spotify認証 | SPTAppRemote + ASWebAuthenticationSession | Spotify SDK + Custom Tabs | OAuth認証フロー |
| Apple Music認証 | MusicAuthorization | - | iOS only |
| オンデバイスAI | Apple Intelligence (Foundation Models) | Gemini Nano (ML Kit) | エピソード生成 |
| 位置情報 | Core Location | FusedLocationProvider | オプトイン |
| **データ永続化** | Core Data / SQLite | Room / SQLite | Record保存 |
| デバイス機能判定 | - | - | AI対応判定等 |
| ウィジェット | WidgetKit | App Widget / Glance | クイック起動 |
| 通知 | UserNotifications | FCM / WorkManager | セレンディピティ通知 |
| ハプティクス | UIImpactFeedbackGenerator | Vibrator | UIフィードバック |
| WebViewホスティング | WKWebView | Android WebView | - |

### Web側の責務

| 機能 | 詳細 |
|------|------|
| UI全般 | 記録画面、履歴一覧、設定、全ての画面 |
| 状態管理 | React Context（BridgeContext, RecordsContext） |
| ビジネスロジック | 表示、フィルタリング、バリデーション |
| UIキャッシュ | 一時的な表示用データのみ |

**注意:** 永続データの保存はNative側で行う。WebのLocalStorage/IndexedDBは信頼性が低い（WKWebViewでクリアされるリスク）。

---

## ブリッジAPI設計

### 設計方針

1. **Promiseベース**: リクエスト-レスポンスの対応を明確に
2. **型安全**: TypeScript型定義を厳密に
3. **エラーハンドリング**: 全APIで統一したエラー形式
4. **タイムアウト**: 5秒（30秒は長すぎ）

### 型定義

```typescript
// ===== 基本型 =====

interface BridgeResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ===== デバイス・認証 =====

interface DeviceCapabilities {
  supportsOnDeviceAI: boolean;      // Apple Intelligence / Gemini Nano
  platform: 'ios' | 'android';
}

interface AuthStatus {
  appleMusic: 'authorized' | 'denied' | 'not_determined';  // iOS only
  spotify: 'authorized' | 'not_authorized';
}

// ===== 曲情報 =====

interface Song {
  id: string;
  title: string;
  artist: string;
  albumName?: string;
  albumArtUrl?: string;
  source: 'apple_music' | 'spotify';
}

// ===== エピソード =====

interface EpisodeResult {
  found: boolean;
  episode?: string;
  errorCode?: 'UNSUPPORTED_DEVICE' | 'MODEL_NOT_READY' | 'UNKNOWN_SONG' | 'TIMEOUT';
}

// ===== 位置情報 =====

interface Location {
  latitude: number;
  longitude: number;
  placeName?: string;
}

// ===== 記録データ =====

interface Record {
  id: string;
  song: Song;
  mood: MoodType;
  situation?: string;
  episode?: string;
  location?: Location;
  createdAt: string;  // ISO 8601
}

type MoodType = 'excited' | 'calm' | 'melancholy' | 'focused' | 'nostalgic' | 'other';

interface RecordFilter {
  startDate?: string;
  endDate?: string;
  mood?: MoodType;
  limit?: number;
  offset?: number;
}
```

### API定義

```typescript
interface HearloomBridge {
  // ===== 初期化・状態確認 =====

  /** デバイス機能を取得（AI対応判定等） */
  getDeviceCapabilities(): Promise<DeviceCapabilities>;

  /** 音楽サービスの認証状態を取得 */
  getAuthStatus(): Promise<AuthStatus>;

  // ===== 音楽サービス連携 =====

  /** Apple Music連携（iOS only） */
  connectAppleMusic(): Promise<BridgeResult<void>>;

  /** Spotify連携（OAuth認証フロー） */
  connectSpotify(): Promise<BridgeResult<void>>;

  /** 現在再生中の曲を取得 */
  getCurrentSong(): Promise<Song | null>;

  // ===== AI機能 =====

  /** エピソード生成（オンデバイスAI） */
  generateEpisode(song: Song): Promise<EpisodeResult>;

  // ===== データ永続化 =====

  /** 記録を保存 */
  saveRecord(record: Omit<Record, 'id' | 'createdAt'>): Promise<BridgeResult<{ id: string }>>;

  /** 記録一覧を取得 */
  getRecords(filter?: RecordFilter): Promise<Record[]>;

  /** 記録を取得（単一） */
  getRecord(id: string): Promise<Record | null>;

  /** 記録を更新 */
  updateRecord(id: string, updates: Partial<Pick<Record, 'mood' | 'situation'>>): Promise<BridgeResult<void>>;

  /** 記録を削除 */
  deleteRecord(id: string): Promise<BridgeResult<void>>;

  // ===== 位置情報 =====

  /** 位置情報の権限をリクエスト */
  requestLocationPermission(): Promise<BridgeResult<{ granted: boolean }>>;

  /** 現在地を取得 */
  getCurrentLocation(): Promise<Location | null>;

  // ===== UI補助 =====

  /** ハプティクスフィードバック */
  triggerHapticFeedback(type: 'light' | 'medium' | 'heavy'): void;
}
```

---

## データフロー

### 記録フロー

```
1. [ユーザー] ウィジェットタップ
      ↓
2. [Native] アプリ起動
      ↓
3. [Native] 再生曲取得（MusicKit / Spotify SDK）
      ↓
4. [Native → Web] bridge.onReady() + 曲情報
      ↓
5. [Web] 曲情報を表示、気分選択UIを表示
      ↓
6. [ユーザー] 気分を選択
      ↓
7. [Web → Native] bridge.generateEpisode(song)
      ↓
8. [Native] オンデバイスAIでエピソード生成
      ↓
9. [Native → Web] エピソード返却（または「見つかりませんでした」）
      ↓
10. [Web] エピソード表示
      ↓
11. [ユーザー] 記録ボタンタップ
      ↓
12. [Web → Native] bridge.saveRecord(record)
      ↓
13. [Native] SQLite/Room に保存
      ↓
14. [Web] 完了表示
```

### 状態管理（Web側）

```
┌──────────────────────────────────────────────────────┐
│                    App.tsx                            │
│  ┌────────────────────────────────────────────────┐  │
│  │           BridgeContext (Provider)              │  │
│  │  - bridge: HearloomBridge                       │  │
│  │  - deviceCapabilities: DeviceCapabilities       │  │
│  │  - authStatus: AuthStatus                       │  │
│  │  - currentSong: Song | null                    │  │
│  │  - isLoading: boolean                          │  │
│  └────────────────────────────────────────────────┘  │
│         ↓                                            │
│  ┌────────────────────────────────────────────────┐  │
│  │              RecordsContext (Provider)          │  │
│  │  - records: Record[]                           │  │
│  │  - addRecord, updateRecord, deleteRecord       │  │
│  │  - refreshRecords (Native から再取得)           │  │
│  └────────────────────────────────────────────────┘  │
│         ↓                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │RecordScreen│ │ListScreen│ │SettingsScreen│       │
│  └──────────┘  └──────────┘  └──────────┘          │
└──────────────────────────────────────────────────────┘
```

---

## 実装上の注意点

### iOS

| 項目 | 注意点 |
|------|--------|
| Apple Intelligence | iOS 18.1以降 + A17 Pro以上。`MLModel.isAvailable` で確認 |
| MusicKit | `MusicAuthorization.request()` で許可後に `SystemMusicPlayer.shared` |
| Spotify OAuth | `ASWebAuthenticationSession` を使用。WebView内では完結しない |
| 位置情報 | `CLLocationManager` の許可ダイアログは一度だけ。タイミング注意 |
| WKWebView | データ永続化は保証されない。重要データはNative側で |

### Android

| 項目 | 注意点 |
|------|--------|
| Gemini Nano | `GenerativeAI` SDK。対応デバイスは限定的（Pixel 9以降等） |
| MediaSession | `NotificationListenerService` は設定から有効化が必要 |
| Spotify OAuth | Custom Tabs を使用 |
| 位置情報 | Android 10以降はバックグラウンド位置情報に制限 |
| WebView | `setJavaScriptEnabled(true)` 必須 |

### 共通

| 項目 | 注意点 |
|------|--------|
| タイムアウト | ブリッジAPI呼び出しは5秒でタイムアウト |
| エラーハンドリング | 全APIで `BridgeResult` 形式を使用 |
| 型安全 | TypeScript定義とSwift/Kotlin実装の整合性を保つ |

---

## 関連ドキュメント

- [プロダクトコンセプト](../product/concept.md)
- [機能一覧](../product/features.md)
- [ユーザージャーニー](../product/user-journey.md)
- [画面設計](../design/screens.md)
