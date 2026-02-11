//
//  FloatingActionButton.swift
//  Hearloom
//
//  フローティングアクションボタン（FAB）
//  iOS 26 Liquid Glassスタイル + Mood対応
//

import SwiftUI

// MARK: - FloatingActionButton

/// フローティングアクションボタン
struct FloatingActionButton: View {
    let icon: String
    let mood: MoodType?
    let action: () -> Void

    @State private var isPressed = false

    init(
        icon: String = "plus",
        mood: MoodType? = nil,
        action: @escaping () -> Void
    ) {
        self.icon = icon
        self.mood = mood
        self.action = action
    }

    private var accentColor: Color {
        if let mood = mood {
            return MoodColors.color(for: mood)
        }
        return HearloomColors.primary
    }

    private var glowColor: Color {
        if let mood = mood {
            return MoodColors.glowColor(for: mood)
        }
        return HearloomColors.primaryGlow
    }

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 24, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 56, height: 56)
                .background(
                    Circle()
                        .fill(.ultraThinMaterial) // Liquid Glass効果
                        .overlay(
                            Circle()
                                .fill(accentColor.opacity(0.8))
                        )
                )
                .clipShape(Circle())
                .shadow(color: glowColor, radius: isPressed ? 16 : 8)
                .shadow(color: glowColor.opacity(0.5), radius: isPressed ? 24 : 12)
        }
        .buttonStyle(FABButtonStyle(isPressed: $isPressed))
    }
}

// MARK: - Button Style

private struct FABButtonStyle: ButtonStyle {
    @Binding var isPressed: Bool

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.9 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: configuration.isPressed)
            .onChange(of: configuration.isPressed) { _, newValue in
                isPressed = newValue
            }
    }
}

// MARK: - Positioned FAB

/// 画面右下に配置されたFAB
struct PositionedFAB: View {
    let icon: String
    let mood: MoodType?
    let action: () -> Void

    init(
        icon: String = "plus",
        mood: MoodType? = nil,
        action: @escaping () -> Void
    ) {
        self.icon = icon
        self.mood = mood
        self.action = action
    }

    var body: some View {
        VStack {
            Spacer()
            HStack {
                Spacer()
                FloatingActionButton(icon: icon, mood: mood, action: action)
                    .padding(.trailing, HearloomSpacing.screenMargin)
                    .padding(.bottom, HearloomSpacing.sectionGap)
            }
        }
    }
}

// MARK: - Preview

#Preview("FAB Variants") {
    ZStack {
        HearloomColors.bgBase
            .ignoresSafeArea()

        VStack(spacing: 32) {
            Text("Floating Action Buttons")
                .font(HearloomFonts.title)
                .foregroundStyle(HearloomColors.textPrimary)

            HStack(spacing: 24) {
                FloatingActionButton(action: {})

                FloatingActionButton(mood: .excited, action: {})

                FloatingActionButton(icon: "music.note", mood: .calm, action: {})
            }

            HStack(spacing: 24) {
                FloatingActionButton(mood: .melancholy, action: {})
                FloatingActionButton(mood: .focused, action: {})
                FloatingActionButton(mood: .nostalgic, action: {})
            }
        }
    }
}

#Preview("Positioned FAB") {
    ZStack {
        HearloomColors.bgBase
            .ignoresSafeArea()

        VStack {
            Text("Content Area")
                .foregroundStyle(HearloomColors.textPrimary)
        }

        PositionedFAB(action: {})
    }
}
