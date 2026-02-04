# Hearloom Development Knowledge Base

**最終更新: 2026-01-17**

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

### iOS実装（ネイティブシェル）

#### WebView統合パターン

※実装開始後に追記

#### ブリッジAPI実装

※実装開始後に追記

#### トラブルシューティング

※実装開始後に追記

### Android実装（ネイティブシェル）

#### WebView統合パターン

※実装開始後に追記

#### ブリッジAPI実装

※実装開始後に追記

#### トラブルシューティング

※実装開始後に追記

---

## 更新履歴

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
