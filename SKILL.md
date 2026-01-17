# Hearloom Development Knowledge Base

**最終更新: 2026-01-17**

このドキュメントは、Hearloom開発中に学んだ知見、技術判断の記録、再利用可能なパターンを蓄積します。

---

## 📋 企画フェーズの決定事項

### プロダクトコンセプト
※product-planning-partnerとの対話で決定した内容をここに記録

### 主要機能一覧
※優先順位付きで記録

### ターゲットユーザー
※ペルソナ、ユーザージャーニーをここに記録

---

## 🎨 デザインフェーズの決定事項

### プラットフォーム共通デザイン

#### デザインシステム基本方針
- iOS/Android両方に適用する共通のデザイン原則とスタイル
- カラーパレット、タイポグラフィ、スペーシングなどの基本定義
- プラットフォーム間で一貫したユーザー体験を提供

#### プラットフォーム固有の配慮
- **iOS**: Human Interface Guidelinesに準拠（Navigation Bar、Tab Bar、SF Symbols等）
- **Android**: Material Designに準拠（App Bar、Bottom Navigation、Material Icons等）
- 各プラットフォームのユーザーが慣れ親しんだUIパターンを尊重

### デザインシステム（iOS/SwiftUI実装用）

#### カラーパレット
```swift
// 例: プライマリカラー定義
extension Color {
    static let primaryColor = Color(hex: "#000000")
    static let secondaryColor = Color(hex: "#000000")
    // ... 他の色定義
}
```

#### タイポグラフィ
```swift
// 例: フォント定義
extension Font {
    static let headingLarge = Font.system(size: 32, weight: .bold)
    static let headingMedium = Font.system(size: 24, weight: .semibold)
    // ... 他のフォント定義
}
```

#### Spacing/Padding規則
```swift
// 例: スペーシング定義
enum Spacing {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
}
```

### デザインシステム（Android/Jetpack Compose実装用）

#### カラーパレット
```kotlin
// 例: プライマリカラー定義
val PrimaryColor = Color(0xFF000000)
val SecondaryColor = Color(0xFF000000)
// ... 他の色定義
```

#### タイポグラフィ
```kotlin
// 例: タイポグラフィ定義
val Typography = Typography(
    headlineLarge = TextStyle(fontSize = 32.sp, fontWeight = FontWeight.Bold),
    headlineMedium = TextStyle(fontSize = 24.sp, fontWeight = FontWeight.SemiBold)
    // ... 他のスタイル定義
)
```

#### Spacing/Padding規則
```kotlin
// 例: スペーシング定義
object Spacing {
    val xs = 4.dp
    val sm = 8.dp
    val md = 16.dp
    val lg = 24.dp
    val xl = 32.dp
}
```

### 画面一覧と遷移図
※画面構成と遷移をここに記録

### iOS: SwiftUI Preview確認記録

#### [画面名/コンポーネント名]
- **日付**: YYYY-MM-DD
- **確認内容**: PreviewでのUIチェック結果
- **調整事項**: 実装で調整した内容
- **デザイン意図**: なぜこのデザインにしたか
- **技術的考慮**: SwiftUIでの実装上の工夫や注意点

### Android: Jetpack Compose Preview確認記録

#### [画面名/コンポーネント名]
- **日付**: YYYY-MM-DD
- **確認内容**: PreviewでのUIチェック結果
- **調整事項**: 実装で調整した内容
- **デザイン意図**: なぜこのデザインにしたか
- **技術的考慮**: Jetpack Composeでの実装上の工夫や注意点

### アクセシビリティ対応

#### iOS
- **VoiceOver対応**: 実装した対応内容
- **Dynamic Type対応**: フォントサイズの動的調整対応
- **カラーコントラスト**: WCAG基準への準拠状況

#### Android
- **TalkBack対応**: 実装した対応内容
- **スケーラブルテキスト対応**: フォントサイズの動的調整対応
- **カラーコントラスト**: WCAG基準への準拠状況

---

## 💻 実装フェーズの知見

### 技術選択の記録

#### [日付] [技術名]を選択
- **プラットフォーム**: iOS / Android / 共通
- **検討した選択肢**:
- **選定理由**:
- **トレードオフ**:

### iOS実装

#### プロジェクト固有パターン

##### [パターン名]
```swift
// 再利用可能なコードスニペット
```

#### トラブルシューティング

##### [問題のタイトル]
- **問題**:
- **原因**:
- **解決策**:

### Android実装

#### プロジェクト固有パターン

##### [パターン名]
```kotlin
// 再利用可能なコードスニペット
```

#### トラブルシューティング

##### [問題のタイトル]
- **問題**:
- **原因**:
- **解決策**:

### プラットフォーム間の共通実装知見

#### [共通パターン/設計方針]
- **iOS実装**:
- **Android実装**:
- **共通の考え方**:

---

## 🧪 テスト戦略
※実装フェーズで具体化

---

## 🚀 リリース準備
※リリースフェーズで具体化

---

## 📝 更新履歴
- 2026-01-17: 初期版作成
- 2026-01-17: mobile-app-foundation-architect起動 - 実装ベースデザイン対応の調整（CLAUDE.md、ui-ux-designer.md、SKILL.md更新）
- 2026-01-17: mobile-app-foundation-architect起動 - エージェント可視性とタスク振り分け規約の策定（CLAUDE.mdに新規セクション追加）
- 2026-01-17: メインのClaude Code - 最重要ルール「エージェントエラー時の対応フロー」をCLAUDE.mdに追加
- 2026-01-17: mobile-app-foundation-architect起動 - iOS/Android両対応（ネイティブ個別開発）への構造最適化（プロジェクト構造変更、CLAUDE.md/SKILL.md更新）
