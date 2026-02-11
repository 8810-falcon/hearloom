//
//  SongInputViewModel.swift
//  Hearloom
//
//  曲情報入力ビューのViewModel（MVVMパターン）
//

import SwiftUI
import Combine

// MARK: - SongInputViewModelProtocol

/// SongInputViewModelのプロトコル（テスト・モック用）
@MainActor
protocol SongInputViewModelProtocol: ObservableObject {
    var inputMode: SongInputMode { get set }
    var urlText: String { get set }
    var urlParseResult: URLParseResult { get }
    var manualInput: ManualSongInput { get set }
    var confirmedSong: Song? { get }

    func fetchSongFromURL()
    func pasteFromClipboard()
    func confirmManualInput()
    func clearConfirmedSong()
}

// MARK: - SongInputViewModel

/// 曲情報入力ビューのViewModel
@MainActor
final class SongInputViewModel: SongInputViewModelProtocol {
    // MARK: - Published Properties

    @Published var inputMode: SongInputMode = .url
    @Published var urlText: String = ""
    @Published private(set) var urlParseResult: URLParseResult = .idle
    @Published var manualInput = ManualSongInput()
    @Published private(set) var confirmedSong: Song?

    // MARK: - Callbacks

    /// 曲が確定した時に呼び出されるコールバック（MainActor上で実行）
    var onSongConfirmed: (@MainActor (Song) -> Void)?

    // MARK: - Initialization

    init(onSongConfirmed: (@MainActor (Song) -> Void)? = nil) {
        self.onSongConfirmed = onSongConfirmed
    }

    // MARK: - Public Methods

    /// URLから曲情報を取得
    func fetchSongFromURL() {
        guard !urlText.isEmpty else { return }

        urlParseResult = .loading

        // TODO: 実際のURL解析実装（MusicServiceProtocol経由）
        // 現在はモック実装
        Task {
            try? await Task.sleep(nanoseconds: 1_000_000_000) // 1秒

            if urlText.contains("spotify") || urlText.contains("music.apple") {
                let mockSong = Song(
                    id: UUID().uuidString,
                    title: "URLから取得した曲",
                    artist: "アーティスト名",
                    albumName: "アルバム名",
                    albumArtUrl: nil,
                    source: urlText.contains("spotify") ? .spotify : .appleMusic
                )
                urlParseResult = .success(mockSong)
                confirmedSong = mockSong
                onSongConfirmed?(mockSong)
            } else {
                urlParseResult = .failure(.unsupportedService)
            }
        }
    }

    /// クリップボードからペースト
    func pasteFromClipboard() {
        if let clipboardString = UIPasteboard.general.string {
            urlText = clipboardString
        }
    }

    /// 手動入力を確定
    func confirmManualInput() {
        guard manualInput.isValid else { return }

        let song = manualInput.toSong()
        confirmedSong = song
        onSongConfirmed?(song)
    }

    /// 確定済みの曲をクリア
    func clearConfirmedSong() {
        confirmedSong = nil
        urlParseResult = .idle
    }
}

// MARK: - Preview Helper

#if DEBUG
extension SongInputViewModel {
    /// プレビュー用のViewModel
    static var preview: SongInputViewModel {
        SongInputViewModel()
    }

    /// URLモードでプレビュー用
    static var previewWithUrl: SongInputViewModel {
        let viewModel = SongInputViewModel()
        viewModel.urlText = "https://open.spotify.com/track/test"
        return viewModel
    }

    /// 手動入力モードでプレビュー用
    static var previewManual: SongInputViewModel {
        let viewModel = SongInputViewModel()
        viewModel.inputMode = .manual
        viewModel.manualInput = ManualSongInput(
            title: "テスト曲",
            artist: "テストアーティスト",
            albumName: "テストアルバム"
        )
        return viewModel
    }

    /// 曲確定済みでプレビュー用
    static var previewWithSong: SongInputViewModel {
        let viewModel = SongInputViewModel()
        viewModel.confirmedSong = .preview
        viewModel.urlParseResult = .success(.preview)
        return viewModel
    }
}
#endif
