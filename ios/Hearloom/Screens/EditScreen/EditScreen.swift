//
//  EditScreen.swift
//  Hearloom
//
//  記録編集画面
//

import SwiftUI

// MARK: - EditScreen

/// 記録編集画面
struct EditScreen: View {
    let record: MusicRecord
    let onSave: (MusicRecord) -> Void
    let onDelete: () -> Void
    let onCancel: () -> Void

    @State private var selectedMood: MoodType
    @State private var situation: String
    @State private var isSaving = false
    @State private var showDeleteConfirm = false

    init(
        record: MusicRecord,
        onSave: @escaping (MusicRecord) -> Void,
        onDelete: @escaping () -> Void,
        onCancel: @escaping () -> Void
    ) {
        self.record = record
        self.onSave = onSave
        self.onDelete = onDelete
        self.onCancel = onCancel
        self._selectedMood = State(initialValue: record.mood)
        self._situation = State(initialValue: record.situation ?? "")
    }

    private var hasChanges: Bool {
        selectedMood != record.mood || situation != (record.situation ?? "")
    }

    var body: some View {
        VStack(spacing: 0) {
            // ヘッダー
            HearloomHeader(
                title: "編集",
                showBackButton: true,
                onBack: onCancel
            ) {
                // 削除ボタン
                Button(action: { showDeleteConfirm = true }) {
                    Image(systemName: "trash")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(HearloomColors.danger)
                        .frame(width: 36, height: 36)
                        .background(HearloomColors.dangerBg)
                        .clipShape(Circle())
                }
            }

            ScrollView {
                VStack(spacing: HearloomSpacing.sectionGap) {
                    // 曲情報（読み取り専用）
                    SongInfoCard(song: record.song, showServiceBadge: true)

                    // 記録日時
                    HStack {
                        Image(systemName: "clock")
                            .foregroundStyle(HearloomColors.textTertiary)
                        Text(record.formattedDate)
                            .font(HearloomFonts.small)
                            .foregroundStyle(HearloomColors.textSecondary)
                        Spacer()
                    }

                    // 気分選択
                    VStack(alignment: .leading, spacing: HearloomSpacing.paddingMD) {
                        Text("気分")
                            .font(HearloomFonts.semibold(size: HearloomFonts.sizeLG))
                            .foregroundStyle(HearloomColors.textPrimary)

                        MoodSelector(selectedMood: Binding(
                            get: { selectedMood },
                            set: { if let mood = $0 { selectedMood = mood } }
                        ))
                    }

                    // シチュエーション入力
                    VStack(alignment: .leading, spacing: HearloomSpacing.paddingMD) {
                        Text("一言メモ")
                            .font(HearloomFonts.semibold(size: HearloomFonts.sizeLG))
                            .foregroundStyle(HearloomColors.textPrimary)

                        HearloomTextField(
                            "どんな時に聴いた？",
                            text: $situation,
                            maxLength: 100
                        )
                    }

                    // エピソード（あれば）
                    if let episode = record.episode {
                        VStack(alignment: .leading, spacing: HearloomSpacing.paddingSM) {
                            Text("エピソード")
                                .font(HearloomFonts.semibold(size: HearloomFonts.sizeLG))
                                .foregroundStyle(HearloomColors.textPrimary)

                            Text(episode)
                                .font(HearloomFonts.body)
                                .foregroundStyle(HearloomColors.textSecondary)
                                .padding(HearloomSpacing.paddingMD)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(HearloomColors.bgSurface)
                                .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
                        }
                    }
                }
                .padding(.horizontal, HearloomSpacing.screenMargin)
                .padding(.top, HearloomSpacing.paddingMD)
                .padding(.bottom, HearloomSpacing.space12)
            }

            // 保存ボタン
            VStack(spacing: 0) {
                Divider()
                    .background(HearloomColors.border)

                HearloomButton(
                    "変更を保存",
                    isFullWidth: true,
                    isLoading: isSaving,
                    isDisabled: !hasChanges
                ) {
                    saveChanges()
                }
                .padding(HearloomSpacing.screenMargin)
            }
            .background(HearloomColors.bgBase)
        }
        .background(HearloomColors.bgBase)
        .confirmationDialog("この記録を削除しますか？", isPresented: $showDeleteConfirm, titleVisibility: .visible) {
            Button("削除", role: .destructive) {
                onDelete()
            }
            Button("キャンセル", role: .cancel) {}
        }
    }

    private func saveChanges() {
        isSaving = true

        var updatedRecord = record
        updatedRecord.mood = selectedMood
        updatedRecord.situation = situation.isEmpty ? nil : situation

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            isSaving = false
            onSave(updatedRecord)
        }
    }
}

// MARK: - Preview

#Preview("EditScreen") {
    EditScreen(
        record: .preview,
        onSave: { _ in },
        onDelete: {},
        onCancel: {}
    )
}

#Preview("EditScreen - With Episode") {
    var record = MusicRecord.preview
    record.episode = "深夜のドライブ中、高速道路を走りながら聴いた一曲。窓の外を流れる街灯の光と、この曲のシンセサイザーが完璧にマッチして、まるで映画のワンシーンにいるような気分だった。"
    return EditScreen(
        record: record,
        onSave: { _ in },
        onDelete: {},
        onCancel: {}
    )
}
