# Hearloom Development Knowledge Base

**最終更新: 2026-02-11**

このドキュメントは、Hearloom開発のインデックスと最新の決定事項を記録します。詳細は各ドキュメントを参照してください。

---

## ドキュメント構造

```
Hearloom/
├── SKILL.md                                 # このファイル（インデックス）
├── docs/
│   ├── product/
│   │   ├── concept.md                       # プロダクトコンセプト
│   │   ├── features.md                      # 機能一覧
│   │   └── user-journey.md                  # ユーザージャーニー
│   ├── tech/
│   │   ├── _template-api-research.md        # 技術調査テンプレート
│   │   ├── api-research-apple-music.md      # Apple Music API調査
│   │   ├── api-research-spotify.md          # Spotify API調査
│   │   ├── api-research-youtube.md          # YouTube API調査
│   │   └── verification-summary.md          # 技術検証総括
│   └── design/
│       ├── design-system.md                 # デザインシステム
│       └── screens.md                       # 画面設計
```

---

## 最新の重要な決定事項（過去7日間）

### 2026-02-11: 記録導線の確定

**3つの記録導線**:

| 導線 | 起点 | 曲情報の取得方法 |
|------|------|-----------------|
| 1. ウィジェット | ウィジェットタップ | SpotifySDK / MusicKitで今再生中の曲を自動取得 |
| 2. 共有メニュー | Spotify/Apple Musicアプリで共有→Hearloom選択 | URLから曲情報を自動取得 |
| 3. アプリ内+ボタン | 履歴画面の+ボタン | URL入力→自動反映 **or** 完全手動入力 |

**画面構成**:

```
┌─────────────────────────────────────────┐
│           ListScreen（起動時）           │
│  ┌─────────────────────────────────┐   │
│  │ 履歴一覧                        │   │
│  │ [RecordCard]                    │   │
│  │ [RecordCard]                    │   │
│  └─────────────────────────────────┘   │
│                                  [+]   │ ← +ボタン
└─────────────────────────────────────────┘
        │               │               │
        │ ウィジェット   │ 共有メニュー   │ +ボタン
        ▼               ▼               ▼
┌─────────────────────────────────────────┐
│              RecordScreen               │
│  ┌─────────────────────────────────┐   │
│  │ 曲情報入力エリア                 │   │
│  │ ・ウィジェット: プリセット済み   │   │
│  │ ・共有: URLから自動取得済み      │   │
│  │ ・+ボタン: URL入力 or 手動入力  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 気分選択（必須）                 │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 一言メモ（任意）                 │   │
│  └─────────────────────────────────┘   │
│                [記録する]              │
└─────────────────────────────────────────┘
```

**RecordScreenの入口別初期状態**:

| 入口 | 曲情報エリアの初期状態 |
|------|----------------------|
| ウィジェット経由 | SongInfoCard表示（曲情報プリセット） |
| 共有メニュー経由 | SongInfoCard表示（URLから取得済み） |
| +ボタン経由 | URL入力フィールド + 手動入力切り替えタブ |

**次のステップ**:
1. RecordScreenに「入口モード」を追加（preset / url / manual）
2. URL入力 → 曲情報取得のロジック実装
3. 手動入力フォーム実装
4. Share Extension → RecordScreen連携

---

### 2026-02-11: iOS フルネイティブ実装完了（Phase 1）

**実装内容**: WebViewハイブリッドからフルネイティブ（SwiftUI）への移行を完了

**作成ファイル一覧**:

```
ios/Hearloom/
├── HearloomApp.swift (更新)
├── MainView.swift (更新)
├── DesignSystem/
│   ├── Colors/
│   │   ├── HearloomColors.swift     # カラーシステム（背景階層、アクセント、セマンティック）
│   │   └── MoodColors.swift         # 気分カラー6種（色、背景、グロウ、ボーダー）
│   ├── Typography/
│   │   └── HearloomFonts.swift      # タイポグラフィ（SF Pro使用）
│   ├── Spacing/
│   │   └── HearloomSpacing.swift    # スペーシング（4ptベース）+ Border Radius
│   └── Effects/
│       └── GlowEffect.swift         # グロウViewModifier（Mood対応、Primary、Pulsing）
├── Components/
│   ├── Navigation/
│   │   └── HearloomHeader.swift     # Liquid Glass効果のヘッダー
│   ├── Buttons/
│   │   ├── HearloomButton.swift     # 汎用ボタン（primary/secondary/ghost/danger）
│   │   ├── MoodButton.swift         # 気分選択ボタン + MoodSelector
│   │   └── FloatingActionButton.swift # Liquid Glass FAB
│   ├── Cards/
│   │   ├── RecordCard.swift         # 記録一覧カード
│   │   └── SongInfoCard.swift       # 曲情報カード + AlbumArtView
│   ├── Inputs/
│   │   └── HearloomTextField.swift  # テキスト入力（文字数カウンター付き）
│   └── Badges/
│       ├── MoodBadge.swift          # 気分バッジ（コンパクト表示）
│       └── ServiceBadge.swift       # 音楽サービスバッジ（Apple Music/Spotify）
├── Screens/
│   ├── RecordScreen/
│   │   └── RecordScreen.swift       # 記録作成画面
│   ├── ListScreen/
│   │   └── ListScreen.swift         # 記録一覧画面（フィルター機能付き）
│   └── EditScreen/
│       └── EditScreen.swift         # 記録編集・削除画面
└── Core/
    ├── Models/
    │   ├── Song.swift               # 曲情報モデル + MusicSource
    │   └── MusicRecord.swift        # 記録データモデル + Location
    ├── Protocols/
    │   ├── MusicServiceProtocol.swift     # 音楽サービス連携プロトコル
    │   └── RecordRepositoryProtocol.swift # 記録リポジトリプロトコル + RecordFilter
    └── Mocks/
        ├── MockRecordRepository.swift     # プレビュー用モックリポジトリ
        └── MockMusicService.swift         # プレビュー用モック音楽サービス
```

**削除ファイル**:
- `ios/Hearloom/WebView/` ディレクトリ全体
- `ios/Hearloom/Bridge/` ディレクトリ全体

**デザインシステム**: Midnight Groove + Liquid Glass ハイブリッド
- ダークモード専用
- 6つの気分カラーシステム（excited/calm/melancholy/focused/nostalgic/other）
- 深い背景階層（#0D0D0F → #1A1A1F）
- グロウ効果による選択状態表現
- Liquid Glass: ナビゲーション/FAB/モーダルに適用
- ソリッド背景: コンテンツ（カード、ボタン）に適用

**ビルド状態**: ✅ ビルド成功（iOS 26.0 Simulator）

**次のステップ（Phase 2）**:
1. 実際のApple Music連携（MusicKit / SystemMusicPlayer）
2. Spotify SDK連携（SPTAppRemote）
3. Core Data または SwiftData でのデータ永続化
4. オンデバイスAI（Apple Intelligence）でのエピソード生成
5. Share Extension からの記録作成フロー

---

### 2026-02-11: フルネイティブアーキテクチャ設計確定

**決定**: WebViewハイブリッドからフルネイティブ（iOS: SwiftUI / Android: Kotlin + Compose）へ移行

**移行理由**:
- 3画面程度ならWebViewのオーバーヘッドに見合わない
- MusicKit、Spotify SDK、Apple Intelligence連携が多く、直接呼び出しが効率的
- iOS 26限定で最新SwiftUI機能をフル活用可能

**デバッグ容易性の確保**:
- **Protocol抽象化**: `MusicServiceProtocol`, `EpisodeGeneratorProtocol`, `RecordRepositoryProtocol`
- **DIコンテナ**: 環境（production/development/preview）で実装を切り替え
- **モック実装**: 遅延シミュレーション、エラー注入が可能
- **SwiftUI Preview**: 各状態（正常、エラー、ローディング等）のプレビュー

**共通仕様ドキュメント構造**:
```
docs/specs/
├── data-models.md    # データモデル定義（Swift/Kotlin両方）
├── protocols.md      # Protocol/Interface仕様
├── error-codes.md    # エラーコード定義
└── integration-test-plan.md  # 統合テストプラン
```

**テスト戦略**:
| 種類 | iOS | Android |
|------|-----|---------|
| ユニットテスト | XCTest | JUnit + Truth |
| UIテスト | SnapshotTesting | Compose Screenshot Tests |
| 統合テスト | チェックリスト形式 | チェックリスト形式 |

**開発順序**:
- **初期リリース**: iOS / Android 両方
- **開発アプローチ**: iOS先行開発 → Androidに適用
  - iOSで設計・実装パターンを確立
  - 共通仕様ドキュメントをiOS実装と並行して整備
  - AndroidはiOSの設計をベースに実装

**次のステップ（iOS先行）**:
1. iOSプロジェクト構造再構築（WebView関連削除）
2. Protocol定義実装（MusicService, EpisodeGenerator, RecordRepository）
3. モック実装整備 + SwiftUI Preview活用
4. 画面実装（RecordScreen → ListScreen → EditScreen）
5. 実装完了後、共通仕様ドキュメントを `/docs/specs/` に整理
6. Androidプロジェクト構築（iOS設計をベースに）

**ステータス**: 設計確定、iOS実装開始準備中

---

### 2026-02-11: Web UI実装完了（新コンセプト対応）

**実装内容**:
- Bridge API型定義・モック実装完了
- RecordScreen: 新フロー対応（曲取得→気分選択→エピソード生成→記録）
- EditScreen: MusicRecord型対応
- ListScreen: MusicRecord型対応
- SongInfoCard: Song型表示（URL形式廃止）
- RecordCard: アルバムアート+曲情報表示
- useRecordsフック: Bridge API経由に変更（LocalStorage廃止）

**削除したファイル**:
- `stores/recordStore.ts` - LocalStorage操作は不要に

**iOS対応バージョン**: 26.0に更新

---

### 2026-02-11: 新コンセプト確定

**背景**: 旧コンセプト「自動収集 → AI推定 → セレンディピティ通知」は技術的制約（タイムスタンプ取得不可、バックグラウンド同期不可）により実現困難。また「記録先行」だとユーザーは見返りがないまま記録を続けなければならない課題があった。

**本質的にやりたいこと**:
> 「ふとした瞬間に過去聞いていた音楽を、場所や時間帯、期間などに応じてユーザーに投げかけることで、過去の思い出を想起させる」体験

**新コンセプト（確定）**:
```
ウィジェットタップ → アプリ起動 → 今聴いている曲が自動表示
      ↓
気分を選ぶ（必須）+ 一言（任意）
      ↓
エピソード（曲の裏話・豆知識）がAIで生成され表示（即時報酬）
      ↓
記録完了（曲・気分・時間帯・場所を収集）
      ↓
蓄積後、ふとした瞬間に通知で思い出想起
```

**気分の選択肢（既存実装を踏襲）**:
- 高揚 / 穏やか / 切ない / 集中 / 懐かし / その他（6種類）

**ターゲット**: 音楽マニア

---

### 2026-02-11: 技術検証完了・技術スタック確定

**技術検証結果サマリー**:

| 項目 | 結果 |
|------|------|
| iOS Apple Music再生曲取得 | ✅ 可能（SystemMusicPlayer.shared） |
| iOS サードパーティアプリ再生曲取得 | ❌ 不可（サンドボックス制限） |
| iOS Spotify連携 | ✅ 可能（Spotify SDK / SPTAppRemote） |
| Android 再生曲取得 | ✅ 可能（MediaSessionManager + NotificationListener） |
| ウィジェット再生状態検知 | iOS: ❌ 不可 / Android: ✅ 可能 |
| 端末AI（Apple Intelligence/Gemini） | ⚠️ Web検索機能なし → クラウドAI推奨 |

**採用技術スタック**:

| 機能 | iOS | Android |
|------|-----|---------|
| Apple Music再生曲取得 | MusicKit / SystemMusicPlayer | - |
| Spotify再生曲取得 | Spotify iOS SDK (SPTAppRemote) | MediaSessionManager or Spotify SDK |
| エピソード生成 | **Apple Intelligence（オンデバイス）** | **Gemini Nano（オンデバイス）** |
| ウィジェット | クイック起動ボタン（検知なし） | 再生状態検知 + クイック起動 |

**対応デバイス・機能差**:

| プラットフォーム | エピソード機能 | 記録機能 |
|-----------------|---------------|----------|
| iOS（iPhone 15 Pro以降） | ✅ | ✅ |
| iOS（それ以前） | ❌ | ✅ |
| Android（Gemini Nano対応機） | ✅ | ✅ |
| Android（非対応機） | ❌ | ✅ |

※古いデバイスでも記録機能は利用可能（エピソード表示のみ非対応）

**ユーザー認証フロー**:

| ユーザータイプ | 必要な認証 |
|---------------|-----------|
| Apple Musicユーザー | メディアライブラリ許可のみ（標準ダイアログ） |
| Spotifyユーザー | Spotify OAuth認証（アプリ遷移→認可→戻る） |
| 両方使う人 | 両方連携可能 |

**エピソード生成**:
- **オンデバイスAI完結**（バックエンド不要）
- コスト: **0円**
- 対応範囲: 有名曲のみ（モデルの学習データに含まれる曲）
- 非対応時UX: 「エピソードが見つかりませんでした。代わりに一言を残しませんか？」

詳細: 技術検証ログは別途docs/tech/に整理予定

---

### 2026-02-02: ハイブリッドアーキテクチャ採用

**アーキテクチャ方針変更**: ネイティブ個別開発 → **ハイブリッドアーキテクチャ（ネイティブシェル + WebView UI）**

**採用理由:**
- 個人開発 × 両プラットフォーム対応 × 開発スピード最優先
- WebViewアプリの開発経験あり、アーキテクチャへの理解が深い
- SwiftUI/Jetpack Composeの実務経験（2年）、React経験あり
- 将来的なWeb版展開も視野

**技術スタック:**
- **iOS**: Swift + SwiftUI + WKWebView
- **Android**: Kotlin + Jetpack Compose + WebView
- **Web UI**: React + TypeScript + Vite

**責務分離:**
- **ネイティブシェル**: WebViewホスティング、プラットフォーム固有機能（バックグラウンド、通知等）、ブリッジAPI提供
- **Web UI**: アプリ内UI実装（聴取履歴、感情タグ編集、時系列ビュー等）、ブリッジAPI経由でネイティブ機能呼び出し

**プロジェクト構造の追加:**
- `/web/` ディレクトリ作成（React + TypeScript）
- ブリッジAPI実装（`/web/src/bridge/`）

**エージェント体制の変更:**
- **新規追加**: web-ui-developerエージェント（Web UI実装担当）
- **更新**: ui-ux-designer（React実装前提に変更）、mobile-tech-lead（WebViewハイブリッド専門性追加）

詳細: [CLAUDE.md](CLAUDE.md)、[web/README.md](web/README.md)

### 2026-01-17: 技術検証フェーズ完了

**採用技術スタック（暫定）:**
- **主要プラットフォーム**: Spotify Web API（タイムスタンプ + Audio Features取得可能）
- **補助的手段**: 共有メニュー方式（iOS: Share Extension、Android: Share Intent）
- **将来的選択肢**: Apple Music API（タイムスタンプなしだが、ジャンル×頻度分析は可能）

**不採用:**
- YouTube Data API（視聴履歴APIが2016年から無効化）
- ShazamKit（iOS/イヤホン使用時は実現不可能）

**残された課題:**
- Spotify Development Mode（25ユーザー制限）の突破戦略
- 定期ポーリング最適化（50曲制限内でのデータ欠損回避）
- 手動記録の記録率向上（現在24-44%）

詳細: [docs/tech/verification-summary.md](docs/tech/verification-summary.md)

### 2026-01-17: プロダクトコンセプト確定

**コンセプト**: 音楽と感情・記憶を紐づけて記録し、過去の自分を振り返ることで現在のモチベーションに繋げるアプリ

**MVP機能（P0）:**
- Apple Music連携（または Spotify連携）
- 聴取履歴の自動収集
- AIによる感情・文脈の自動推定
- 時系列での履歴閲覧
- セレンディピティ通知
- 手動編集機能

詳細: [docs/product/concept.md](docs/product/concept.md)、[docs/product/features.md](docs/product/features.md)

---

## クイックリンク

### プロダクト企画
- [プロダクトコンセプト](docs/product/concept.md)
- [機能一覧](docs/product/features.md)
- [ユーザージャーニー](docs/product/user-journey.md)

### 技術調査
- [アーキテクチャ設計](docs/tech/architecture.md) **← NEW**
- [技術検証総括](docs/tech/verification-summary.md)
- [Apple Music API調査](docs/tech/api-research-apple-music.md)
- [Spotify API調査](docs/tech/api-research-spotify.md)
- [YouTube API調査](docs/tech/api-research-youtube.md)
- [技術調査テンプレート](docs/tech/_template-api-research.md)

### デザイン
- [デザインシステム](docs/design/design-system.md)
- [画面設計](docs/design/screens.md)

---

## 実装知見（実装フェーズで追記）

### Web UI実装

#### ブリッジAPI設計パターン

※実装開始後に追記

#### パフォーマンス最適化

※実装開始後に追記

#### トラブルシューティング

※実装開始後に追記

### iOS実装（フルネイティブ SwiftUI）

#### Design System 実装パターン

**カラー定義（Hex対応）**:
```swift
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        // RGB (24-bit) 対応
        let (r, g, b) = (int >> 16, int >> 8 & 0xFF, int & 0xFF)
        self.init(.sRGB, red: Double(r) / 255, green: Double(g) / 255, blue: Double(b) / 255)
    }
}
```

**グロウエフェクト ViewModifier**:
```swift
struct MoodGlowModifier: ViewModifier {
    let mood: MoodType
    let isActive: Bool

    func body(content: Content) -> some View {
        content
            .shadow(color: isActive ? MoodColors.glowColor(for: mood) : .clear, radius: 10)
            .shadow(color: isActive ? MoodColors.glowColor(for: mood).opacity(0.5) : .clear, radius: 20)
            .animation(.easeInOut(duration: 0.2), value: isActive)
    }
}

extension View {
    func moodGlow(_ mood: MoodType, isActive: Bool = true) -> some View {
        modifier(MoodGlowModifier(mood: mood, isActive: isActive))
    }
}
```

#### コンポーネント設計パターン

**ボタンスタイル分離**:
```swift
// Button内でスタイルを直接定義せず、ButtonStyleで分離
struct MoodButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}
```

**Liquid Glass効果**:
```swift
// iOS 26+ でultraThinMaterialを使用
.background(.ultraThinMaterial)
.background(HearloomColors.bgBase.opacity(0.5))
```

#### Protocol + Mock パターン

**依存性注入の準備**:
```swift
protocol MusicServiceProtocol {
    var source: MusicSource { get }
    func getAuthStatus() async -> AuthStatus
    func getCurrentSong() async -> Song?
}

// Previewで使用
final class MockMusicService: MusicServiceProtocol {
    var mockCurrentSong: Song? = .preview
    func getCurrentSong() async -> Song? { mockCurrentSong }
}
```

#### Xcode プロジェクト設定

**PBXFileSystemSynchronizedRootGroup**:
- Xcode 15+の新機能でフォルダ内ファイルが自動同期
- ファイル追加時にpbxproj編集不要
- ディレクトリ構造変更が即座に反映

**ビルドターゲット**: iOS 26.0（最小サポートバージョン）

#### トラブルシューティング

**SourceKit エラー "Cannot find X in scope"**:
- 同一モジュール内のSwiftファイルは自動参照される
- SourceKitのインデックス更新が遅れることがある
- 実際のビルドでは問題なし（xcodebuildで確認）

**解決策**: クリーンビルド実行
```bash
xcodebuild -project Hearloom.xcodeproj -scheme Hearloom clean build
```

### Android実装（ネイティブシェル）

#### WebView統合パターン

※実装開始後に追記

#### ブリッジAPI実装

※実装開始後に追記

#### トラブルシューティング

※実装開始後に追記

---

## 更新履歴

- 2026-02-11: メインのClaude Code - **記録導線の確定**。3つの導線（ウィジェット/共有メニュー/アプリ内+ボタン）と画面構成を決定。RecordScreenの入口別初期状態を定義
- 2026-02-11: メインのClaude Code - **iOS フルネイティブ実装完了（Phase 1）**。WebViewハイブリッドからSwiftUIへの移行実施。Design System（Midnight Groove + Liquid Glass）、コンポーネント（ヘッダー、ボタン、カード、バッジ、入力等）、画面（ListScreen/RecordScreen/EditScreen）、Core層（Models/Protocols/Mocks）を実装。ビルド成功確認済み
- 2026-02-11: メインのClaude Code - 開発順序確定。iOS先行開発→Androidに適用のアプローチを採用
- 2026-02-11: メインのClaude Code + mobile-tech-lead - フルネイティブアーキテクチャ設計確定。Protocol抽象化（MusicService/EpisodeGenerator/RecordRepository）、DIコンテナ、モック実装、テスト戦略を設計
- 2026-02-11: メインのClaude Code - Web UI実装完了（新コンセプト対応）。RecordScreen/EditScreen/ListScreen/SongInfoCard/RecordCardを新Bridge API（MusicRecord型）に対応。LocalStorage廃止、recordStore.ts削除。iOS対応バージョンを26.0に更新
- 2026-02-11: メインのClaude Code - アーキテクチャ方針検討開始。WebViewハイブリッドからフルネイティブ（SwiftUI/Compose）への移行を検討
- 2026-02-11: メインのClaude Code + mobile-tech-lead + web-ui-developer - アーキテクチャ設計確定。責務分割（Native=Native専用機能+データ永続化、Web=UI+状態管理）、ブリッジAPI設計、データフローを文書化
- 2026-02-11: メインのClaude Code - エピソード生成をオンデバイスAI（Apple Intelligence / Gemini Nano）に変更。コスト0円、バックエンド不要。古いデバイスでも記録機能は利用可能（エピソードのみ非対応）
- 2026-02-11: メインのClaude Code + mobile-tech-lead - 新コンセプト確定＆技術スタック決定。Apple Music（SystemMusicPlayer）+ Spotify SDK連携方式を採用
- 2026-02-02: mobile-app-foundation-architect - ハイブリッドアーキテクチャ（ネイティブシェル + WebView UI）採用。CLAUDE.md、ui-ux-designer.md、mobile-tech-lead.md更新。web-ui-developerエージェント新規作成。/web/ディレクトリ構造作成（React + TypeScript）
- 2026-01-17: SKILL.md構造改善 - ドキュメント分割によりインデックス化、最新決定事項のみを本ファイルに記録
- 2026-01-17: mobile-tech-lead - 技術検証フェーズ完了。Spotify API/YouTube Data API/共有メニュー方式/ShazamKit、計5つのアプローチを検証。最終推奨：Spotify API（自動記録）+ 共有メニュー（手動記録）のハイブリッド方式
- 2026-01-17: mobile-tech-lead - Apple Music API（MusicKit）技術調査完了。重大な制約を発見：タイムスタンプ（再生時刻）取得不可、バックグラウンド同期保証なし。コア機能「時間帯×ジャンル×頻度からAI推定」に直接的影響
- 2026-01-17: product-planning-partner - 企画フェーズ完了（プロダクトコンセプト、MVP機能一覧、ターゲットユーザー、ユーザージャーニー、技術検証項目、残存リスクを記録）
- 2026-01-17: メインのClaude Code - 最重要ルール「徹底的なフィードバック原則」をCLAUDE.mdに追加（すべてのエージェントはバチバチに厳しくフィードバック、事実ベース分析必須）
- 2026-01-17: mobile-app-foundation-architect - iOS/Android両対応（ネイティブ個別開発）への構造最適化（プロジェクト構造変更、CLAUDE.md/SKILL.md更新）
- 2026-01-17: メインのClaude Code - 最重要ルール「エージェントエラー時の対応フロー」をCLAUDE.mdに追加
- 2026-01-17: mobile-app-foundation-architect - エージェント可視性とタスク振り分け規約の策定（CLAUDE.mdに新規セクション追加）
- 2026-01-17: mobile-app-foundation-architect - 実装ベースデザイン対応の調整（CLAUDE.md、ui-ux-designer.md、SKILL.md更新）
- 2026-01-17: 初期版作成
