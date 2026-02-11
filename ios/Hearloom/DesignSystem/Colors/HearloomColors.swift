//
//  HearloomColors.swift
//  Hearloom
//
//  Design System: "Midnight Groove" + Liquid Glass
//  深夜のクラブで感じる没入感。音楽と感情が交差する瞬間を表現。
//

import SwiftUI

// MARK: - HearloomColors

/// Hearloomカラーシステム
/// Midnight Grooveテーマに基づく深いダークカラーパレット
enum HearloomColors {

    // MARK: - Background Layers（深みのあるダークグレー階層）

    /// 最も深い背景色
    static let bgBase = Color(hex: "#0D0D0F")

    /// 少し浮いた背景色
    static let bgElevated = Color(hex: "#141418")

    /// サーフェス背景色（カード等）
    static let bgSurface = Color(hex: "#1A1A1F")

    /// サーフェスホバー状態
    static let bgSurfaceHover = Color(hex: "#1F1F24")

    /// サーフェスアクティブ状態
    static let bgSurfaceActive = Color(hex: "#252529")

    // MARK: - Primary Accent（バイオレット - グルーヴ感）

    /// プライマリカラー
    static let primary = Color(hex: "#8B5CF6")

    /// プライマリライト
    static let primaryLight = Color(hex: "#A855F7")

    /// プライマリダーク
    static let primaryDark = Color(hex: "#7C3AED")

    /// プライマリグロウ（透明度35%）
    static let primaryGlow = Color(hex: "#8B5CF6").opacity(0.35)

    /// プライマリサブトル（透明度12%）
    static let primarySubtle = Color(hex: "#8B5CF6").opacity(0.12)

    // MARK: - Secondary Accent（シアン - 躍動感）

    /// セカンダリカラー
    static let secondary = Color(hex: "#06B6D4")

    /// セカンダリライト
    static let secondaryLight = Color(hex: "#22D3EE")

    /// セカンダリグロウ（透明度35%）
    static let secondaryGlow = Color(hex: "#06B6D4").opacity(0.35)

    // MARK: - Tertiary（ティール）

    /// ターシャリカラー
    static let tertiary = Color(hex: "#14B8A6")

    /// ターシャリグロウ（透明度35%）
    static let tertiaryGlow = Color(hex: "#14B8A6").opacity(0.35)

    // MARK: - Text Colors

    /// プライマリテキスト
    static let textPrimary = Color(hex: "#F4F4F5")

    /// セカンダリテキスト
    static let textSecondary = Color(hex: "#A1A1AA")

    /// ターシャリテキスト
    static let textTertiary = Color(hex: "#71717A")

    /// ミュートテキスト
    static let textMuted = Color(hex: "#52525B")

    // MARK: - Border Colors

    /// 通常ボーダー（透明度8%）
    static let border = Color.white.opacity(0.08)

    /// サブトルボーダー（透明度4%）
    static let borderSubtle = Color.white.opacity(0.04)

    /// 強調ボーダー（透明度12%）
    static let borderStrong = Color.white.opacity(0.12)

    // MARK: - Semantic Colors

    /// 危険・エラー
    static let danger = Color(hex: "#EF4444")

    /// 危険背景（透明度15%）
    static let dangerBg = Color(hex: "#EF4444").opacity(0.15)

    /// 危険グロウ（透明度35%）
    static let dangerGlow = Color(hex: "#EF4444").opacity(0.35)

    /// 成功
    static let success = Color(hex: "#22C55E")

    /// 成功背景（透明度15%）
    static let successBg = Color(hex: "#22C55E").opacity(0.15)
}

// MARK: - Color Extension (Hex Support)

extension Color {
    /// Hex文字列からColorを生成
    /// - Parameter hex: "#RRGGBB" または "RRGGBB" 形式の文字列
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Preview

#Preview("Background Layers") {
    VStack(spacing: 16) {
        RoundedRectangle(cornerRadius: 12)
            .fill(HearloomColors.bgBase)
            .frame(height: 60)
            .overlay(Text("bgBase").foregroundStyle(HearloomColors.textPrimary))

        RoundedRectangle(cornerRadius: 12)
            .fill(HearloomColors.bgElevated)
            .frame(height: 60)
            .overlay(Text("bgElevated").foregroundStyle(HearloomColors.textPrimary))

        RoundedRectangle(cornerRadius: 12)
            .fill(HearloomColors.bgSurface)
            .frame(height: 60)
            .overlay(Text("bgSurface").foregroundStyle(HearloomColors.textPrimary))

        RoundedRectangle(cornerRadius: 12)
            .fill(HearloomColors.primary)
            .frame(height: 60)
            .overlay(Text("primary").foregroundStyle(.white))
    }
    .padding()
    .background(HearloomColors.bgBase)
}
