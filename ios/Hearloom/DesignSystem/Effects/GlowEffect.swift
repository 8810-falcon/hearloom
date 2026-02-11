//
//  GlowEffect.swift
//  Hearloom
//
//  グロウエフェクト ViewModifier
//  Midnight Grooveテーマにおける選択状態や強調表現に使用
//

import SwiftUI

// MARK: - Glow View Modifier

/// グロウエフェクトを追加するViewModifier
struct GlowModifier: ViewModifier {
    let color: Color
    let radius: CGFloat
    let isActive: Bool

    func body(content: Content) -> some View {
        content
            .shadow(color: isActive ? color : .clear, radius: radius)
            .shadow(color: isActive ? color.opacity(0.5) : .clear, radius: radius * 2)
            .animation(.easeInOut(duration: 0.2), value: isActive)
    }
}

/// Mood専用のグロウエフェクト
struct MoodGlowModifier: ViewModifier {
    let mood: MoodType
    let isActive: Bool

    private var glowColor: Color {
        MoodColors.glowColor(for: mood)
    }

    func body(content: Content) -> some View {
        content
            .shadow(color: isActive ? glowColor : .clear, radius: 10)
            .shadow(color: isActive ? glowColor.opacity(0.5) : .clear, radius: 20)
            .animation(.easeInOut(duration: 0.2), value: isActive)
    }
}

/// プライマリグロウエフェクト
struct PrimaryGlowModifier: ViewModifier {
    let isActive: Bool

    func body(content: Content) -> some View {
        content
            .shadow(color: isActive ? HearloomColors.primaryGlow : .clear, radius: 10)
            .shadow(color: isActive ? HearloomColors.primaryGlow.opacity(0.5) : .clear, radius: 20)
            .animation(.easeInOut(duration: 0.2), value: isActive)
    }
}

// MARK: - View Extension

extension View {
    /// 汎用グロウエフェクト
    /// - Parameters:
    ///   - color: グロウの色
    ///   - radius: グロウの半径
    ///   - isActive: アクティブ状態
    func glow(color: Color, radius: CGFloat = 10, isActive: Bool = true) -> some View {
        modifier(GlowModifier(color: color, radius: radius, isActive: isActive))
    }

    /// Mood専用グロウエフェクト
    /// - Parameters:
    ///   - mood: 気分タイプ
    ///   - isActive: アクティブ状態
    func moodGlow(_ mood: MoodType, isActive: Bool = true) -> some View {
        modifier(MoodGlowModifier(mood: mood, isActive: isActive))
    }

    /// プライマリグロウエフェクト
    /// - Parameter isActive: アクティブ状態
    func primaryGlow(isActive: Bool = true) -> some View {
        modifier(PrimaryGlowModifier(isActive: isActive))
    }
}

// MARK: - Animated Glow

/// パルスアニメーション付きグロウ
struct PulsingGlowModifier: ViewModifier {
    let color: Color
    let radius: CGFloat

    @State private var isPulsing = false

    func body(content: Content) -> some View {
        content
            .shadow(color: color.opacity(isPulsing ? 0.6 : 0.3), radius: isPulsing ? radius * 1.5 : radius)
            .onAppear {
                withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                    isPulsing = true
                }
            }
    }
}

extension View {
    /// パルスグロウエフェクト（注意を引くための使用）
    func pulsingGlow(color: Color, radius: CGFloat = 10) -> some View {
        modifier(PulsingGlowModifier(color: color, radius: radius))
    }
}

// MARK: - Preview

#Preview("Glow Effects") {
    VStack(spacing: 32) {
        Text("Glow Effects")
            .font(HearloomFonts.title)
            .foregroundStyle(HearloomColors.textPrimary)

        // Mood Glows
        HStack(spacing: 24) {
            ForEach([MoodType.excited, .calm, .melancholy], id: \.self) { mood in
                Circle()
                    .fill(MoodColors.color(for: mood))
                    .frame(width: 50, height: 50)
                    .moodGlow(mood)
            }
        }

        HStack(spacing: 24) {
            ForEach([MoodType.focused, .nostalgic, .other], id: \.self) { mood in
                Circle()
                    .fill(MoodColors.color(for: mood))
                    .frame(width: 50, height: 50)
                    .moodGlow(mood)
            }
        }

        // Primary Glow
        RoundedRectangle(cornerRadius: HearloomSpacing.radiusLG)
            .fill(HearloomColors.primary)
            .frame(width: 120, height: 50)
            .primaryGlow()
            .overlay(
                Text("Primary")
                    .foregroundStyle(.white)
            )

        // Pulsing Glow
        Circle()
            .fill(HearloomColors.secondary)
            .frame(width: 60, height: 60)
            .pulsingGlow(color: HearloomColors.secondaryGlow, radius: 15)
            .overlay(
                Text("+")
                    .font(.system(size: 28, weight: .medium))
                    .foregroundStyle(.white)
            )
    }
    .padding()
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(HearloomColors.bgBase)
}
