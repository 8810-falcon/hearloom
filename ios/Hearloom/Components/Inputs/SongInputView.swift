//
//  SongInputView.swift
//  Hearloom
//
//  曲情報入力ビュー（URL入力 / 手動入力切り替え）
//

import SwiftUI

// MARK: - SongInputView

/// 曲情報入力ビュー
struct SongInputView: View {
    @StateObject private var viewModel: SongInputViewModel

    // MARK: - Initialization

    init(onSongConfirmed: (@MainActor (Song) -> Void)? = nil) {
        _viewModel = StateObject(wrappedValue: SongInputViewModel(onSongConfirmed: onSongConfirmed))
    }

    var body: some View {
        VStack(spacing: HearloomSpacing.sectionGap) {
            // モード切り替えPicker
            Picker("入力方法", selection: $viewModel.inputMode) {
                ForEach(SongInputMode.allCases) { mode in
                    Text(mode.rawValue).tag(mode)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal, HearloomSpacing.screenMargin)

            // 入力フォーム
            switch viewModel.inputMode {
            case .url:
                urlInputSection
            case .manual:
                manualInputSection
            }
        }
    }

    // MARK: - URL Input Section

    private var urlInputSection: some View {
        VStack(spacing: HearloomSpacing.paddingMD) {
            // URL入力フィールド
            VStack(alignment: .leading, spacing: HearloomSpacing.space2) {
                Text("Spotify / Apple Music のURLを貼り付け")
                    .font(HearloomFonts.small)
                    .foregroundStyle(HearloomColors.textSecondary)

                HStack(spacing: HearloomSpacing.space2) {
                    TextField("https://...", text: $viewModel.urlText)
                        .font(HearloomFonts.body)
                        .foregroundStyle(HearloomColors.textPrimary)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .padding(HearloomSpacing.paddingMD)
                        .background(HearloomColors.bgSurface)
                        .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
                        .overlay(
                            RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD)
                                .stroke(HearloomColors.border, lineWidth: 1)
                        )

                    // ペーストボタン
                    Button(action: { viewModel.pasteFromClipboard() }) {
                        Image(systemName: "doc.on.clipboard")
                            .font(.system(size: 18))
                            .foregroundStyle(HearloomColors.primary)
                            .frame(width: 44, height: 44)
                            .background(HearloomColors.primarySubtle)
                            .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
                    }
                }
            }

            // 取得ボタン
            HearloomButton(
                "曲を取得",
                variant: .secondary,
                isFullWidth: true,
                isLoading: viewModel.urlParseResult.isLoading,
                isDisabled: viewModel.urlText.isEmpty
            ) {
                viewModel.fetchSongFromURL()
            }

            // 結果表示
            switch viewModel.urlParseResult {
            case .idle:
                EmptyView()
            case .loading:
                EmptyView() // ボタンがローディング表示
            case .success(let fetchedSong):
                SongInfoCard(song: fetchedSong)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            case .failure(let error):
                errorView(message: error.localizedDescription)
            }
        }
        .padding(.horizontal, HearloomSpacing.screenMargin)
        .animation(.easeInOut(duration: 0.2), value: viewModel.urlParseResult.isSuccess)
    }

    // MARK: - Manual Input Section

    private var manualInputSection: some View {
        VStack(spacing: HearloomSpacing.paddingMD) {
            // 曲名（必須）
            VStack(alignment: .leading, spacing: HearloomSpacing.space2) {
                HStack(spacing: HearloomSpacing.space1) {
                    Text("曲名")
                        .font(HearloomFonts.semibold(size: HearloomFonts.sizeSM))
                        .foregroundStyle(HearloomColors.textPrimary)
                    Text("*")
                        .foregroundStyle(HearloomColors.danger)
                }

                TextField("曲名を入力", text: $viewModel.manualInput.title)
                    .font(HearloomFonts.body)
                    .foregroundStyle(HearloomColors.textPrimary)
                    .padding(HearloomSpacing.paddingMD)
                    .background(HearloomColors.bgSurface)
                    .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
                    .overlay(
                        RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD)
                            .stroke(HearloomColors.border, lineWidth: 1)
                    )
            }

            // アーティスト名（必須）
            VStack(alignment: .leading, spacing: HearloomSpacing.space2) {
                HStack(spacing: HearloomSpacing.space1) {
                    Text("アーティスト名")
                        .font(HearloomFonts.semibold(size: HearloomFonts.sizeSM))
                        .foregroundStyle(HearloomColors.textPrimary)
                    Text("*")
                        .foregroundStyle(HearloomColors.danger)
                }

                TextField("アーティスト名を入力", text: $viewModel.manualInput.artist)
                    .font(HearloomFonts.body)
                    .foregroundStyle(HearloomColors.textPrimary)
                    .padding(HearloomSpacing.paddingMD)
                    .background(HearloomColors.bgSurface)
                    .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
                    .overlay(
                        RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD)
                            .stroke(HearloomColors.border, lineWidth: 1)
                    )
            }

            // アルバム名（任意）
            VStack(alignment: .leading, spacing: HearloomSpacing.space2) {
                Text("アルバム名")
                    .font(HearloomFonts.semibold(size: HearloomFonts.sizeSM))
                    .foregroundStyle(HearloomColors.textPrimary)

                TextField("アルバム名を入力（任意）", text: $viewModel.manualInput.albumName)
                    .font(HearloomFonts.body)
                    .foregroundStyle(HearloomColors.textPrimary)
                    .padding(HearloomSpacing.paddingMD)
                    .background(HearloomColors.bgSurface)
                    .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
                    .overlay(
                        RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD)
                            .stroke(HearloomColors.border, lineWidth: 1)
                    )
            }

            // 確認ボタン
            HearloomButton(
                "この曲で記録する",
                variant: .secondary,
                isFullWidth: true,
                isDisabled: !viewModel.manualInput.isValid
            ) {
                viewModel.confirmManualInput()
            }

            // 入力結果表示
            if let confirmedSong = viewModel.confirmedSong, viewModel.inputMode == .manual {
                SongInfoCard(song: confirmedSong)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .padding(.horizontal, HearloomSpacing.screenMargin)
        .animation(.easeInOut(duration: 0.2), value: viewModel.confirmedSong?.id)
    }

    // MARK: - Error View

    private func errorView(message: String) -> some View {
        HStack(spacing: HearloomSpacing.space2) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(HearloomColors.danger)

            Text(message)
                .font(HearloomFonts.small)
                .foregroundStyle(HearloomColors.danger)

            Spacer()
        }
        .padding(HearloomSpacing.paddingMD)
        .background(HearloomColors.dangerBg)
        .clipShape(RoundedRectangle(cornerRadius: HearloomSpacing.radiusMD))
    }
}

// MARK: - URLParseResult Extensions

extension URLParseResult {
    var isLoading: Bool {
        if case .loading = self { return true }
        return false
    }

    var isSuccess: Bool {
        if case .success = self { return true }
        return false
    }
}

// MARK: - Preview

#Preview("SongInputView") {
    ScrollView {
        VStack(spacing: HearloomSpacing.sectionGap) {
            Text("曲を追加")
                .font(HearloomFonts.title)
                .foregroundStyle(HearloomColors.textPrimary)

            SongInputView(onSongConfirmed: { song in
                print("Song confirmed: \(song.title)")
            })
        }
        .padding(.vertical)
    }
    .background(HearloomColors.bgBase)
}

#Preview("SongInputView - URL Mode") {
    ScrollView {
        SongInputView()
    }
    .background(HearloomColors.bgBase)
}
