//
//  RecordScreen.swift
//  Hearloom
//
//  記録作成画面
//  3つの入口モードに対応：preset（ウィジェット）/ url（共有）/ input（+ボタン）
//

import SwiftUI

// MARK: - RecordScreen

/// 記録作成画面
struct RecordScreen: View {
    @StateObject private var viewModel: RecordViewModel
    let onSave: (MusicRecord) -> Void
    let onCancel: () -> Void

    // MARK: - Initialization

    init(
        entryMode: RecordEntryMode,
        onSave: @escaping (MusicRecord) -> Void,
        onCancel: @escaping () -> Void
    ) {
        _viewModel = StateObject(wrappedValue: RecordViewModel(entryMode: entryMode))
        self.onSave = onSave
        self.onCancel = onCancel
    }

    var body: some View {
        VStack(spacing: 0) {
            // ヘッダー
            HearloomHeader(
                title: "記録する",
                showBackButton: true,
                onBack: onCancel
            )

            ScrollView {
                VStack(spacing: HearloomSpacing.sectionGap) {
                    // 曲情報セクション（入口モードで分岐）
                    songSection

                    // 気分選択（曲が決まっている場合のみ表示）
                    if viewModel.song != nil {
                        moodSection
                            .transition(.opacity.combined(with: .move(edge: .bottom)))
                    }

                    // シチュエーション入力（曲が決まっている場合のみ表示）
                    if viewModel.song != nil {
                        situationSection
                            .transition(.opacity.combined(with: .move(edge: .bottom)))
                    }
                }
                .padding(.top, HearloomSpacing.paddingMD)
                .padding(.bottom, HearloomSpacing.space12)
                .animation(.easeInOut(duration: 0.3), value: viewModel.song?.id)
            }

            // 保存ボタン
            saveButtonSection
        }
        .background(HearloomColors.bgBase)
        .onAppear {
            viewModel.initializeFromEntryMode()
        }
    }

    // MARK: - Song Section

    @ViewBuilder
    private var songSection: some View {
        switch viewModel.entryMode {
        case .preset(let presetSong):
            // プリセット済み：SongInfoCard表示
            SongInfoCard(song: presetSong)
                .padding(.horizontal, HearloomSpacing.screenMargin)

        case .url(let urlString):
            // URL経由：ローディング → 結果表示
            urlParseSection(urlString: urlString)

        case .input:
            // ユーザー入力：SongInputView表示
            SongInputView(onSongConfirmed: { song in
                viewModel.setSong(song)
            })
        }
    }

    // MARK: - URL Parse Section

    private func urlParseSection(urlString: String) -> some View {
        VStack(spacing: HearloomSpacing.paddingMD) {
            switch viewModel.urlParseResult {
            case .idle, .loading:
                // ローディング表示
                VStack(spacing: HearloomSpacing.paddingMD) {
                    ProgressView()
                        .tint(HearloomColors.primary)
                        .scaleEffect(1.5)

                    Text("曲情報を取得中...")
                        .font(HearloomFonts.body)
                        .foregroundStyle(HearloomColors.textSecondary)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 150)
                .background(HearloomColors.bgSurface)
                .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusXL))
                .padding(.horizontal, HearloomSpacing.screenMargin)

            case .success(let fetchedSong):
                // 取得成功：SongInfoCard表示
                SongInfoCard(song: fetchedSong)
                    .padding(.horizontal, HearloomSpacing.screenMargin)

            case .failure(let error):
                // 取得失敗：エラー表示 + 手動入力フォールバック
                VStack(spacing: HearloomSpacing.paddingMD) {
                    // エラーメッセージ
                    HStack(spacing: HearloomSpacing.space2) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundStyle(HearloomColors.danger)

                        Text(error.localizedDescription)
                            .font(HearloomFonts.small)
                            .foregroundStyle(HearloomColors.danger)

                        Spacer()
                    }
                    .padding(HearloomSpacing.paddingMD)
                    .background(HearloomColors.dangerBg)
                    .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
                    .padding(.horizontal, HearloomSpacing.screenMargin)

                    // 手動入力に切り替え
                    Text("手動で曲情報を入力してください")
                        .font(HearloomFonts.small)
                        .foregroundStyle(HearloomColors.textSecondary)

                    SongInputView(onSongConfirmed: { song in
                        viewModel.setSong(song)
                    })
                }
            }
        }
        .onAppear {
            viewModel.fetchSongFromURL(urlString)
        }
    }

    // MARK: - Mood Section

    private var moodSection: some View {
        VStack(alignment: .leading, spacing: HearloomSpacing.paddingMD) {
            Text("今の気分は？")
                .font(HearloomFonts.semibold(size: HearloomFonts.sizeLG))
                .foregroundStyle(HearloomColors.textPrimary)
                .padding(.horizontal, HearloomSpacing.screenMargin)

            MoodSelector(selectedMood: $viewModel.selectedMood)
                .padding(.horizontal, HearloomSpacing.screenMargin)
        }
    }

    // MARK: - Situation Section

    private var situationSection: some View {
        VStack(alignment: .leading, spacing: HearloomSpacing.paddingMD) {
            Text("一言メモ（任意）")
                .font(HearloomFonts.semibold(size: HearloomFonts.sizeLG))
                .foregroundStyle(HearloomColors.textPrimary)

            HearloomTextField(
                "どんな時に聴いた？",
                text: $viewModel.situation,
                maxLength: 100
            )
        }
        .padding(.horizontal, HearloomSpacing.screenMargin)
    }

    // MARK: - Save Button Section

    private var saveButtonSection: some View {
        VStack(spacing: 0) {
            Divider()
                .background(HearloomColors.border)

            HearloomButton(
                "記録を保存",
                isFullWidth: true,
                isLoading: viewModel.isSaving,
                isDisabled: !viewModel.canSave
            ) {
                viewModel.saveRecord { record in
                    onSave(record)
                }
            }
            .padding(HearloomSpacing.screenMargin)
        }
        .background(HearloomColors.bgBase)
    }
}

// MARK: - Preview

#Preview("RecordScreen - Preset Mode") {
    RecordScreen(
        entryMode: .preset(.preview),
        onSave: { _ in },
        onCancel: {}
    )
}

#Preview("RecordScreen - URL Mode") {
    RecordScreen(
        entryMode: .url("https://open.spotify.com/track/xxx"),
        onSave: { _ in },
        onCancel: {}
    )
}

#Preview("RecordScreen - Input Mode") {
    RecordScreen(
        entryMode: .input,
        onSave: { _ in },
        onCancel: {}
    )
}
