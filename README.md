# Hearloom

音楽と感情・記憶を紐づけて記録し、過去の自分を振り返ることで現在のモチベーションに繋げるモバイルアプリ

## プロジェクト概要

Hearloomは、日々聴く音楽に紐づいた感情や記憶を自動記録し、「あの時の自分」を振り返ることで現在のモチベーションに繋げるアプリです。

**現在のフェーズ**: 企画・技術検証完了、実装フェーズ準備中

## 技術スタック

- **iOS**: Swift、SwiftUI、Xcode
- **Android**: Kotlin（準備中）
- **アーキテクチャ**: ネイティブ個別開発（デザインとロジックを共有）
- **音楽API**: Spotify Web API（主要）、Apple Music API（補助的）

## AI駆動開発の特徴

このプロジェクトは、Claude Codeを中心としたAI協働開発で進行しています。

### 専門エージェント体制

- **product-planning-partner**: プロダクト企画・コンセプト策定
- **ui-ux-designer**: UI/UXデザイン・デザインシステム構築
- **mobile-tech-lead**: 技術選択・コードレビュー・実装支援
- **mobile-app-foundation-architect**: プロジェクト基盤改善・ワークフロー最適化

### AI協働ガイドライン

- プロジェクトルールと開発知見は `CLAUDE.md` と `SKILL.md` に集約
- 各フェーズ（企画/デザイン/実装）ごとに適切なエージェントが連携
- すべての重要な決定事項はドキュメント化

## ドキュメント構造

```
Hearloom/
├── README.md                      # このファイル（プロジェクト概要）
├── CLAUDE.md                      # AI協働ガイドライン
├── SKILL.md                       # 開発知見インデックス
├── docs/
│   ├── product/                   # プロダクト企画
│   │   ├── concept.md
│   │   ├── features.md
│   │   └── user-journey.md
│   ├── tech/                      # 技術調査・検証
│   │   ├── verification-summary.md
│   │   └── api-research-*.md
│   └── design/                    # デザイン仕様
│       ├── design-system.md
│       └── screens.md
├── ios/                          # iOSプロジェクト
│   └── Hearloom.xcodeproj
└── android/                       # Androidプロジェクト（準備中）
```

## セットアップ

### iOS開発環境

**必須環境:**
- macOS
- Xcode（最新版推奨）
- Swift（Xcodeに同梱）

**プロジェクトを開く:**
```bash
cd ios
open Hearloom.xcodeproj
```

### Android開発環境

**準備中** - iOS MVP完成後に構築予定

## 開発ステータス

### 完了

- ✅ プロジェクト基盤構築
- ✅ プロダクトコンセプト策定
- ✅ MVP機能定義
- ✅ 技術検証（Spotify API、Apple Music API等）
- ✅ ユーザージャーニー設計

### 進行中

- 🚧 UI/UXデザイン
- 🚧 プロジェクト構造最適化

### 今後の予定

- iOS実装開始
- テスト戦略策定
- CI/CD環境構築
- Android版開発

## 主要な技術的決定

詳細は [SKILL.md](SKILL.md) を参照してください。

**採用技術:**
- Spotify Web API（タイムスタンプ + Audio Features取得可能）
- 共有メニュー方式（Share Extension/Intent）による手動記録補完

**技術的課題:**
- Spotify Development Mode（25ユーザー制限）の突破戦略
- 定期ポーリング最適化（50曲制限内でのデータ欠損回避）

## ライセンス

TBD

## お問い合わせ

TBD
