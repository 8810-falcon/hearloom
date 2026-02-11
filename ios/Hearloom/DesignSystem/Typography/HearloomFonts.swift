//
//  HearloomFonts.swift
//  Hearloom
//
//  タイポグラフィシステム
//  システムフォント（SF Pro）を使用し、iOS標準のタイポグラフィスケールに準拠
//

import SwiftUI

// MARK: - HearloomFonts

/// Hearloomタイポグラフィシステム
enum HearloomFonts {

    // MARK: - Font Sizes

    /// 極小サイズ（11pt）
    static let sizeXS: CGFloat = 11

    /// 小サイズ（13pt）
    static let sizeSM: CGFloat = 13

    /// 基本サイズ（15pt）
    static let sizeBase: CGFloat = 15

    /// 大サイズ（17pt）
    static let sizeLG: CGFloat = 17

    /// 特大サイズ（20pt）
    static let sizeXL: CGFloat = 20

    /// 2XLサイズ（24pt）
    static let size2XL: CGFloat = 24

    /// 3XLサイズ（32pt）
    static let size3XL: CGFloat = 32

    // MARK: - Predefined Fonts

    /// 極小（キャプション、バッジ）
    static let caption = Font.system(size: sizeXS)

    /// 小（セカンダリテキスト）
    static let small = Font.system(size: sizeSM)

    /// 基本（本文）
    static let body = Font.system(size: sizeBase)

    /// 大（強調本文）
    static let bodyLarge = Font.system(size: sizeLG)

    /// 特大（サブヘッダー）
    static let subheadline = Font.system(size: sizeXL)

    /// タイトル（セクションヘッダー）
    static let title = Font.system(size: size2XL, weight: .semibold)

    /// 大見出し
    static let largeTitle = Font.system(size: size3XL, weight: .bold)

    // MARK: - Weight Variants

    /// 中太字体
    static func medium(size: CGFloat) -> Font {
        .system(size: size, weight: .medium)
    }

    /// 半太字体
    static func semibold(size: CGFloat) -> Font {
        .system(size: size, weight: .semibold)
    }

    /// 太字体
    static func bold(size: CGFloat) -> Font {
        .system(size: size, weight: .bold)
    }

    // MARK: - Rounded Variants（親しみやすい印象）

    /// 丸みを帯びた中太字体
    static func roundedMedium(size: CGFloat) -> Font {
        .system(size: size, weight: .medium, design: .rounded)
    }

    /// 丸みを帯びた半太字体
    static func roundedSemibold(size: CGFloat) -> Font {
        .system(size: size, weight: .semibold, design: .rounded)
    }
}

// MARK: - Text Style Extension

extension View {
    /// プライマリテキストスタイル
    func textStylePrimary() -> some View {
        self
            .font(HearloomFonts.body)
            .foregroundStyle(HearloomColors.textPrimary)
    }

    /// セカンダリテキストスタイル
    func textStyleSecondary() -> some View {
        self
            .font(HearloomFonts.small)
            .foregroundStyle(HearloomColors.textSecondary)
    }

    /// ターシャリテキストスタイル
    func textStyleTertiary() -> some View {
        self
            .font(HearloomFonts.caption)
            .foregroundStyle(HearloomColors.textTertiary)
    }

    /// ミュートテキストスタイル
    func textStyleMuted() -> some View {
        self
            .font(HearloomFonts.caption)
            .foregroundStyle(HearloomColors.textMuted)
    }
}

// MARK: - Preview

#Preview("Typography") {
    VStack(alignment: .leading, spacing: 16) {
        Text("Large Title (32pt)")
            .font(HearloomFonts.largeTitle)
            .foregroundStyle(HearloomColors.textPrimary)

        Text("Title (24pt)")
            .font(HearloomFonts.title)
            .foregroundStyle(HearloomColors.textPrimary)

        Text("Subheadline (20pt)")
            .font(HearloomFonts.subheadline)
            .foregroundStyle(HearloomColors.textPrimary)

        Text("Body Large (17pt)")
            .font(HearloomFonts.bodyLarge)
            .foregroundStyle(HearloomColors.textPrimary)

        Text("Body (15pt)")
            .textStylePrimary()

        Text("Small (13pt)")
            .textStyleSecondary()

        Text("Caption (11pt)")
            .textStyleTertiary()

        Text("Muted (11pt)")
            .textStyleMuted()
    }
    .padding()
    .background(HearloomColors.bgBase)
}
