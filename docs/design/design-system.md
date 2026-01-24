# Hearloom デザインシステム

**最終更新: 2026-01-17**

## 基本方針

- iOS/Android両方に適用する共通のデザイン原則とスタイル
- カラーパレット、タイポグラフィ、スペーシングなどの基本定義
- プラットフォーム間で一貫したユーザー体験を提供

## プラットフォーム固有の配慮

- **iOS**: Human Interface Guidelinesに準拠（Navigation Bar、Tab Bar、SF Symbols等）
- **Android**: Material Designに準拠（App Bar、Bottom Navigation、Material Icons等）
- 各プラットフォームのユーザーが慣れ親しんだUIパターンを尊重

---

## iOS実装（SwiftUI）

### カラーパレット

```swift
// 例: プライマリカラー定義
extension Color {
    static let primaryColor = Color(hex: "#000000")
    static let secondaryColor = Color(hex: "#000000")
    // ... 他の色定義
}
```

### タイポグラフィ

```swift
// 例: フォント定義
extension Font {
    static let headingLarge = Font.system(size: 32, weight: .bold)
    static let headingMedium = Font.system(size: 24, weight: .semibold)
    // ... 他のフォント定義
}
```

### Spacing/Padding規則

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

### アクセシビリティ対応

- **VoiceOver対応**: 実装した対応内容
- **Dynamic Type対応**: フォントサイズの動的調整対応
- **カラーコントラスト**: WCAG基準への準拠状況

---

## Android実装（Jetpack Compose）

### カラーパレット

```kotlin
// 例: プライマリカラー定義
val PrimaryColor = Color(0xFF000000)
val SecondaryColor = Color(0xFF000000)
// ... 他の色定義
```

### タイポグラフィ

```kotlin
// 例: タイポグラフィ定義
val Typography = Typography(
    headlineLarge = TextStyle(fontSize = 32.sp, fontWeight = FontWeight.Bold),
    headlineMedium = TextStyle(fontSize = 24.sp, fontWeight = FontWeight.SemiBold)
    // ... 他のスタイル定義
)
```

### Spacing/Padding規則

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

### アクセシビリティ対応

- **TalkBack対応**: 実装した対応内容
- **スケーラブルテキスト対応**: フォントサイズの動的調整対応
- **カラーコントラスト**: WCAG基準への準拠状況

---

## 更新履歴

- YYYY-MM-DD: [更新内容]
