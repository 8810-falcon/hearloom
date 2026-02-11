//
//  MoodColors.swift
//  Hearloom
//
//  気分（Mood）カラーシステム
//  6種類の感情に対応したカラーパレット
//

import SwiftUI

// MARK: - MoodType

/// 気分タイプ
enum MoodType: String, CaseIterable, Codable, Identifiable, Sendable {
    case excited    // 高揚
    case calm       // 穏やか
    case melancholy // 切ない
    case focused    // 集中
    case nostalgic  // 懐かし
    case other      // その他

    var id: String { rawValue }
}

// MARK: - Mood Config

/// 気分の設定情報
struct MoodConfig {
    let type: MoodType
    let label: String
    let emoji: String
    let color: Color
    let bgColor: Color
    let glowColor: Color
    let borderColor: Color

    init(
        type: MoodType,
        label: String,
        emoji: String,
        hexColor: String
    ) {
        self.type = type
        self.label = label
        self.emoji = emoji
        self.color = Color(hex: hexColor)
        self.bgColor = Color(hex: hexColor).opacity(0.15)
        self.glowColor = Color(hex: hexColor).opacity(0.4)
        self.borderColor = Color(hex: hexColor).opacity(0.3)
    }
}

// MARK: - MoodColors

/// 気分カラーシステム
enum MoodColors {

    // MARK: - Individual Colors

    /// 高揚（ゴールド）
    static let excited = Color(hex: "#FBBF24")
    static let excitedBg = Color(hex: "#FBBF24").opacity(0.15)
    static let excitedGlow = Color(hex: "#FBBF24").opacity(0.4)

    /// 穏やか（グリーン）
    static let calm = Color(hex: "#34D399")
    static let calmBg = Color(hex: "#34D399").opacity(0.15)
    static let calmGlow = Color(hex: "#34D399").opacity(0.4)

    /// 切ない（ブルー）
    static let melancholy = Color(hex: "#60A5FA")
    static let melancholyBg = Color(hex: "#60A5FA").opacity(0.15)
    static let melancholyGlow = Color(hex: "#60A5FA").opacity(0.4)

    /// 集中（パープル）
    static let focused = Color(hex: "#A855F7")
    static let focusedBg = Color(hex: "#A855F7").opacity(0.15)
    static let focusedGlow = Color(hex: "#A855F7").opacity(0.4)

    /// 懐かし（ローズピンク）
    static let nostalgic = Color(hex: "#F472B6")
    static let nostalgicBg = Color(hex: "#F472B6").opacity(0.15)
    static let nostalgicGlow = Color(hex: "#F472B6").opacity(0.4)

    /// その他（グレー）
    static let other = Color(hex: "#71717A")
    static let otherBg = Color(hex: "#71717A").opacity(0.15)
    static let otherGlow = Color(hex: "#71717A").opacity(0.4)

    // MARK: - Mood Configs

    /// 全気分設定
    static let configs: [MoodConfig] = [
        MoodConfig(type: .excited, label: "高揚", emoji: "^_^", hexColor: "#FBBF24"),
        MoodConfig(type: .calm, label: "穏やか", emoji: "-_-", hexColor: "#34D399"),
        MoodConfig(type: .melancholy, label: "切ない", emoji: ";_;", hexColor: "#60A5FA"),
        MoodConfig(type: .focused, label: "集中", emoji: "o_o", hexColor: "#A855F7"),
        MoodConfig(type: .nostalgic, label: "懐かし", emoji: "v_v", hexColor: "#F472B6"),
        MoodConfig(type: .other, label: "その他", emoji: "...", hexColor: "#71717A"),
    ]

    /// MoodTypeからMoodConfigを取得
    static func config(for mood: MoodType) -> MoodConfig {
        configs.first { $0.type == mood } ?? configs.last!
    }

    /// MoodTypeから色を取得
    static func color(for mood: MoodType) -> Color {
        switch mood {
        case .excited: return excited
        case .calm: return calm
        case .melancholy: return melancholy
        case .focused: return focused
        case .nostalgic: return nostalgic
        case .other: return other
        }
    }

    /// MoodTypeから背景色を取得
    static func bgColor(for mood: MoodType) -> Color {
        switch mood {
        case .excited: return excitedBg
        case .calm: return calmBg
        case .melancholy: return melancholyBg
        case .focused: return focusedBg
        case .nostalgic: return nostalgicBg
        case .other: return otherBg
        }
    }

    /// MoodTypeからグロウ色を取得
    static func glowColor(for mood: MoodType) -> Color {
        switch mood {
        case .excited: return excitedGlow
        case .calm: return calmGlow
        case .melancholy: return melancholyGlow
        case .focused: return focusedGlow
        case .nostalgic: return nostalgicGlow
        case .other: return otherGlow
        }
    }
}

// MARK: - Preview

#Preview("Mood Colors") {
    VStack(spacing: 12) {
        ForEach(MoodColors.configs, id: \.type) { config in
            HStack {
                Circle()
                    .fill(config.color)
                    .frame(width: 24, height: 24)
                    .shadow(color: config.glowColor, radius: 8)

                Text(config.emoji)
                    .font(.system(size: 16))

                Text(config.label)
                    .foregroundStyle(HearloomColors.textPrimary)

                Spacer()

                RoundedRectangle(cornerRadius: 8)
                    .fill(config.bgColor)
                    .frame(width: 60, height: 32)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(config.borderColor, lineWidth: 1)
                    )
            }
            .padding(.horizontal)
        }
    }
    .padding()
    .background(HearloomColors.bgBase)
}
