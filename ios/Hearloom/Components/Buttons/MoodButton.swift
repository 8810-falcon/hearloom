//
//  MoodButton.swift
//  Hearloom
//
//  気分選択ボタン
//  選択時にグロウ効果で感情を表現
//

import SwiftUI

// MARK: - MoodButton

/// 気分選択ボタン
struct MoodButton: View {
    let mood: MoodType
    let isSelected: Bool
    let action: () -> Void

    private var config: MoodConfig {
        MoodColors.config(for: mood)
    }

    var body: some View {
        Button(action: action) {
            VStack(spacing: HearloomSpacing.space1) {
                Text(config.label)
                    .font(HearloomFonts.semibold(size: HearloomFonts.sizeSM))
                    .foregroundStyle(isSelected ? HearloomColors.textPrimary : HearloomColors.textSecondary)

                Text(config.emoji)
                    .font(.system(size: 20))
            }
            .frame(maxWidth: .infinity)
            .frame(minHeight: 72)
            .background(
                RoundedRectangle(cornerRadius: HearloomSpacing.radiusLG)
                    .fill(isSelected ? config.bgColor : HearloomColors.bgSurface)
            )
            .overlay(
                RoundedRectangle(cornerRadius: HearloomSpacing.radiusLG)
                    .stroke(
                        isSelected ? config.color : HearloomColors.border,
                        lineWidth: 2
                    )
            )
            .moodGlow(mood, isActive: isSelected)
        }
        .buttonStyle(MoodButtonStyle())
    }
}

// MARK: - Button Style

private struct MoodButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - MoodSelector

/// 気分選択グリッド（3x2）
struct MoodSelector: View {
    @Binding var selectedMood: MoodType?

    private let columns = [
        GridItem(.flexible(), spacing: HearloomSpacing.inlineGap),
        GridItem(.flexible(), spacing: HearloomSpacing.inlineGap),
        GridItem(.flexible(), spacing: HearloomSpacing.inlineGap),
    ]

    var body: some View {
        LazyVGrid(columns: columns, spacing: HearloomSpacing.inlineGap) {
            ForEach(MoodType.allCases) { mood in
                MoodButton(
                    mood: mood,
                    isSelected: selectedMood == mood,
                    action: {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            selectedMood = mood
                        }
                    }
                )
            }
        }
    }
}

// MARK: - Preview

#Preview("MoodButton States") {
    VStack(spacing: HearloomSpacing.sectionGap) {
        Text("気分を選んでください")
            .font(HearloomFonts.bodyLarge)
            .foregroundStyle(HearloomColors.textPrimary)

        HStack(spacing: HearloomSpacing.inlineGap) {
            MoodButton(mood: .excited, isSelected: false, action: {})
            MoodButton(mood: .excited, isSelected: true, action: {})
        }

        HStack(spacing: HearloomSpacing.inlineGap) {
            MoodButton(mood: .calm, isSelected: true, action: {})
            MoodButton(mood: .melancholy, isSelected: true, action: {})
        }

        HStack(spacing: HearloomSpacing.inlineGap) {
            MoodButton(mood: .focused, isSelected: true, action: {})
            MoodButton(mood: .nostalgic, isSelected: true, action: {})
            MoodButton(mood: .other, isSelected: true, action: {})
        }
    }
    .padding()
    .background(HearloomColors.bgBase)
}

#Preview("MoodSelector") {
    struct PreviewWrapper: View {
        @State private var selectedMood: MoodType? = .excited

        var body: some View {
            VStack(spacing: HearloomSpacing.sectionGap) {
                Text("選択中: \(selectedMood?.rawValue ?? "なし")")
                    .font(HearloomFonts.body)
                    .foregroundStyle(HearloomColors.textPrimary)

                MoodSelector(selectedMood: $selectedMood)
            }
            .padding()
            .background(HearloomColors.bgBase)
        }
    }

    return PreviewWrapper()
}
