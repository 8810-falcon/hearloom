//
//  MoodBadge.swift
//  Hearloom
//
//  気分バッジ（コンパクト表示用）
//

import SwiftUI

// MARK: - MoodBadge

/// 気分バッジ
struct MoodBadge: View {
    let mood: MoodType
    let showEmoji: Bool

    init(mood: MoodType, showEmoji: Bool = true) {
        self.mood = mood
        self.showEmoji = showEmoji
    }

    private var config: MoodConfig {
        MoodColors.config(for: mood)
    }

    var body: some View {
        HStack(spacing: HearloomSpacing.space1) {
            Text(config.label)
                .font(HearloomFonts.semibold(size: HearloomFonts.sizeXS))
                .foregroundStyle(HearloomColors.textPrimary)

            if showEmoji {
                Text(config.emoji)
                    .font(.system(size: HearloomFonts.sizeXS))
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 2)
        .background(config.bgColor)
        .clipShape(Capsule())
        .overlay(
            Capsule()
                .stroke(config.borderColor, lineWidth: 1)
        )
    }
}

// MARK: - Preview

#Preview("Mood Badges") {
    VStack(spacing: 12) {
        HStack(spacing: 8) {
            ForEach([MoodType.excited, .calm, .melancholy], id: \.self) { mood in
                MoodBadge(mood: mood)
            }
        }
        HStack(spacing: 8) {
            ForEach([MoodType.focused, .nostalgic, .other], id: \.self) { mood in
                MoodBadge(mood: mood)
            }
        }
        HStack(spacing: 8) {
            ForEach(MoodType.allCases) { mood in
                MoodBadge(mood: mood, showEmoji: false)
            }
        }
    }
    .padding()
    .background(HearloomColors.bgBase)
}
