//
//  RecordCard.swift
//  Hearloom
//
//  記録カード
//  アルバムアート + 曲情報 + 気分バッジ
//

import SwiftUI

// MARK: - RecordCard

/// 記録カード（一覧表示用）
struct RecordCard: View {
    let record: MusicRecord
    let onTap: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: HearloomSpacing.paddingMD) {
                // アルバムアート
                AlbumArtView(url: record.song.albumArtUrl, size: HearloomSpacing.albumArtThumbnail)

                // 情報エリア
                VStack(alignment: .leading, spacing: HearloomSpacing.space2) {
                    // ヘッダー（日時 + 気分バッジ）
                    HStack {
                        MoodBadge(mood: record.mood)

                        Spacer()

                        ServiceBadge(source: record.song.source)
                    }

                    // 曲情報
                    VStack(alignment: .leading, spacing: 2) {
                        Text(record.song.title)
                            .font(HearloomFonts.semibold(size: HearloomFonts.sizeSM))
                            .foregroundStyle(HearloomColors.textPrimary)
                            .lineLimit(1)

                        Text(record.song.artist)
                            .font(HearloomFonts.caption)
                            .foregroundStyle(HearloomColors.textSecondary)
                            .lineLimit(1)
                    }

                    // シチュエーション（あれば）
                    if let situation = record.situation, !situation.isEmpty {
                        Text(situation)
                            .font(HearloomFonts.caption)
                            .foregroundStyle(HearloomColors.textMuted)
                            .lineLimit(1)
                    }
                }

                Spacer(minLength: 0)
            }
            .padding(HearloomSpacing.paddingMD)
            .background(HearloomColors.bgSurface)
            .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusXL))
            .overlay(
                RoundedRectangle(cornerRadius: HearloomSpacing.radiusXL)
                    .stroke(
                        isPressed ? MoodColors.color(for: record.mood).opacity(0.4) : HearloomColors.border,
                        lineWidth: 1
                    )
            )
            .shadow(
                color: isPressed ? MoodColors.glowColor(for: record.mood).opacity(0.1) : .clear,
                radius: 10
            )
        }
        .buttonStyle(RecordCardButtonStyle(isPressed: $isPressed))
    }
}

// MARK: - Button Style

private struct RecordCardButtonStyle: ButtonStyle {
    @Binding var isPressed: Bool

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
            .onChange(of: configuration.isPressed) { _, newValue in
                isPressed = newValue
            }
    }
}

// MARK: - Preview

#Preview("RecordCard") {
    VStack(spacing: HearloomSpacing.cardGap) {
        RecordCard(record: .preview, onTap: {})
        RecordCard(record: .previewCalm, onTap: {})
        RecordCard(record: .previewMelancholy, onTap: {})
    }
    .padding()
    .background(HearloomColors.bgBase)
}

#Preview("All Moods") {
    ScrollView {
        VStack(spacing: HearloomSpacing.cardGap) {
            ForEach(MusicRecord.previewList) { record in
                RecordCard(record: record, onTap: {})
            }
        }
        .padding()
    }
    .background(HearloomColors.bgBase)
}
