//
//  HearloomSpacing.swift
//  Hearloom
//
//  スペーシングシステム
//  4ptベースのスケールで一貫したレイアウトを実現
//

import SwiftUI

// MARK: - HearloomSpacing

/// Hearloomスペーシングシステム
/// 4pt単位のスケールで一貫したマージン・パディングを提供
enum HearloomSpacing {

    // MARK: - Base Spacing

    /// 4pt
    static let space1: CGFloat = 4

    /// 8pt
    static let space2: CGFloat = 8

    /// 12pt
    static let space3: CGFloat = 12

    /// 16pt
    static let space4: CGFloat = 16

    /// 20pt
    static let space5: CGFloat = 20

    /// 24pt
    static let space6: CGFloat = 24

    /// 32pt
    static let space8: CGFloat = 32

    /// 40pt
    static let space10: CGFloat = 40

    /// 48pt
    static let space12: CGFloat = 48

    // MARK: - Semantic Spacing

    /// コンポーネント内パディング（小）
    static let paddingSM: CGFloat = space2 // 8pt

    /// コンポーネント内パディング（標準）
    static let paddingMD: CGFloat = space3 // 12pt

    /// コンポーネント内パディング（大）
    static let paddingLG: CGFloat = space4 // 16pt

    /// 画面端からのマージン
    static let screenMargin: CGFloat = space4 // 16pt

    /// セクション間のギャップ
    static let sectionGap: CGFloat = space6 // 24pt

    /// カード間のギャップ
    static let cardGap: CGFloat = space3 // 12pt

    /// インライン要素間のギャップ
    static let inlineGap: CGFloat = space2 // 8pt

    // MARK: - Border Radius

    /// 小（バッジ、チップ）
    static let radiusSM: CGFloat = 6

    /// 中（入力フィールド、小ボタン）
    static let radiusMD: CGFloat = 10

    /// 大（カード、ボタン）
    static let radiusLG: CGFloat = 14

    /// 特大（モーダル、シート）
    static let radiusXL: CGFloat = 18

    /// 2XL
    static let radius2XL: CGFloat = 24

    /// フル（円形、ピル型）
    static let radiusFull: CGFloat = 9999

    // MARK: - Component Sizes

    /// タッチターゲット最小サイズ（iOS HIG: 44pt）
    static let minTouchTarget: CGFloat = 44

    /// アイコンサイズ（小）
    static let iconSM: CGFloat = 16

    /// アイコンサイズ（標準）
    static let iconMD: CGFloat = 20

    /// アイコンサイズ（大）
    static let iconLG: CGFloat = 24

    /// アルバムアートサイズ（サムネイル）
    static let albumArtThumbnail: CGFloat = 56

    /// アルバムアートサイズ（大）
    static let albumArtLarge: CGFloat = 200
}

// MARK: - Padding Extension

extension View {
    /// 画面標準パディング
    func screenPadding() -> some View {
        self.padding(.horizontal, HearloomSpacing.screenMargin)
    }

    /// カードパディング
    func cardPadding() -> some View {
        self.padding(HearloomSpacing.paddingMD)
    }
}

// MARK: - Preview

#Preview("Spacing System") {
    VStack(alignment: .leading, spacing: HearloomSpacing.sectionGap) {
        Text("Spacing System")
            .font(HearloomFonts.title)
            .foregroundStyle(HearloomColors.textPrimary)

        VStack(alignment: .leading, spacing: HearloomSpacing.cardGap) {
            SpacingPreviewRow(name: "space1", value: HearloomSpacing.space1)
            SpacingPreviewRow(name: "space2", value: HearloomSpacing.space2)
            SpacingPreviewRow(name: "space3", value: HearloomSpacing.space3)
            SpacingPreviewRow(name: "space4", value: HearloomSpacing.space4)
            SpacingPreviewRow(name: "space6", value: HearloomSpacing.space6)
            SpacingPreviewRow(name: "space8", value: HearloomSpacing.space8)
        }

        Text("Border Radius")
            .font(HearloomFonts.bodyLarge)
            .foregroundStyle(HearloomColors.textPrimary)
            .padding(.top)

        HStack(spacing: HearloomSpacing.cardGap) {
            RadiusPreview(name: "SM", radius: HearloomSpacing.radiusSM)
            RadiusPreview(name: "MD", radius: HearloomSpacing.radiusMD)
            RadiusPreview(name: "LG", radius: HearloomSpacing.radiusLG)
            RadiusPreview(name: "XL", radius: HearloomSpacing.radiusXL)
        }
    }
    .screenPadding()
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .background(HearloomColors.bgBase)
}

private struct SpacingPreviewRow: View {
    let name: String
    let value: CGFloat

    var body: some View {
        HStack {
            Text(name)
                .font(HearloomFonts.small)
                .foregroundStyle(HearloomColors.textSecondary)
                .frame(width: 60, alignment: .leading)

            Rectangle()
                .fill(HearloomColors.primary)
                .frame(width: value, height: 20)

            Text("\(Int(value))pt")
                .font(HearloomFonts.caption)
                .foregroundStyle(HearloomColors.textTertiary)
        }
    }
}

private struct RadiusPreview: View {
    let name: String
    let radius: CGFloat

    var body: some View {
        VStack(spacing: HearloomSpacing.space2) {
            RoundedRectangle(cornerRadius: radius)
                .fill(HearloomColors.bgSurface)
                .frame(width: 50, height: 50)
                .overlay(
                    RoundedRectangle(cornerRadius: radius)
                        .stroke(HearloomColors.border, lineWidth: 1)
                )

            Text(name)
                .font(HearloomFonts.caption)
                .foregroundStyle(HearloomColors.textTertiary)
        }
    }
}
