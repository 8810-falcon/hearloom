//
//  ListScreen.swift
//  Hearloom
//
//  記録一覧画面
//

import SwiftUI

// MARK: - ListScreen

/// 記録一覧画面
struct ListScreen: View {
    let records: [MusicRecord]
    let onRecordTap: (MusicRecord) -> Void
    let onAddTap: () -> Void

    @State private var selectedMoodFilter: MoodType?

    private var filteredRecords: [MusicRecord] {
        if let mood = selectedMoodFilter {
            return records.filter { $0.mood == mood }
        }
        return records
    }

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                // ヘッダー
                SimpleHeader(title: "履歴")

                // フィルターチップ
                MoodFilterChips(selectedMood: $selectedMoodFilter)
                    .padding(.horizontal, HearloomSpacing.screenMargin)
                    .padding(.bottom, HearloomSpacing.paddingMD)

                // コンテンツ
                if filteredRecords.isEmpty {
                    EmptyStateView(
                        hasFilter: selectedMoodFilter != nil,
                        onClearFilter: { selectedMoodFilter = nil }
                    )
                } else {
                    RecordList(
                        records: filteredRecords,
                        onRecordTap: onRecordTap
                    )
                }
            }

            // FAB
            PositionedFAB(action: onAddTap)
        }
        .background(HearloomColors.bgBase)
    }
}

// MARK: - MoodFilterChips

/// 気分フィルターチップ
private struct MoodFilterChips: View {
    @Binding var selectedMood: MoodType?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: HearloomSpacing.inlineGap) {
                // 全て
                FilterChip(
                    label: "すべて",
                    isSelected: selectedMood == nil,
                    color: HearloomColors.primary
                ) {
                    selectedMood = nil
                }

                // 各気分
                ForEach(MoodType.allCases) { mood in
                    let config = MoodColors.config(for: mood)
                    FilterChip(
                        label: config.label,
                        isSelected: selectedMood == mood,
                        color: config.color
                    ) {
                        selectedMood = mood
                    }
                }
            }
        }
    }
}

/// フィルターチップ
private struct FilterChip: View {
    let label: String
    let isSelected: Bool
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(HearloomFonts.semibold(size: HearloomFonts.sizeSM))
                .foregroundStyle(isSelected ? .white : HearloomColors.textSecondary)
                .padding(.horizontal, HearloomSpacing.paddingMD)
                .padding(.vertical, HearloomSpacing.paddingSM)
                .background(isSelected ? color : HearloomColors.bgSurface)
                .clipShape(Capsule())
                .overlay(
                    Capsule()
                        .stroke(isSelected ? color : HearloomColors.border, lineWidth: 1)
                )
        }
        .buttonStyle(.plain)
    }
}

// MARK: - RecordList

/// 記録リスト
private struct RecordList: View {
    let records: [MusicRecord]
    let onRecordTap: (MusicRecord) -> Void

    var body: some View {
        ScrollView {
            LazyVStack(spacing: HearloomSpacing.cardGap) {
                ForEach(records) { record in
                    RecordCard(record: record) {
                        onRecordTap(record)
                    }
                }
            }
            .padding(.horizontal, HearloomSpacing.screenMargin)
            .padding(.bottom, 100) // FABのためのスペース
        }
    }
}

// MARK: - EmptyStateView

/// 空状態表示
private struct EmptyStateView: View {
    let hasFilter: Bool
    let onClearFilter: () -> Void

    var body: some View {
        VStack(spacing: HearloomSpacing.paddingLG) {
            Image(systemName: hasFilter ? "line.3.horizontal.decrease.circle" : "music.note.list")
                .font(.system(size: 48))
                .foregroundStyle(HearloomColors.textMuted)

            Text(hasFilter ? "この気分の記録はありません" : "まだ記録がありません")
                .font(HearloomFonts.body)
                .foregroundStyle(HearloomColors.textSecondary)

            if hasFilter {
                Button("フィルターをクリア") {
                    onClearFilter()
                }
                .font(HearloomFonts.small)
                .foregroundStyle(HearloomColors.primary)
            } else {
                Text("右下の + ボタンから\n曲を記録してみましょう")
                    .font(HearloomFonts.small)
                    .foregroundStyle(HearloomColors.textTertiary)
                    .multilineTextAlignment(.center)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Preview

#Preview("ListScreen - With Records") {
    ListScreen(
        records: MusicRecord.previewList,
        onRecordTap: { _ in },
        onAddTap: {}
    )
}

#Preview("ListScreen - Empty") {
    ListScreen(
        records: [],
        onRecordTap: { _ in },
        onAddTap: {}
    )
}
