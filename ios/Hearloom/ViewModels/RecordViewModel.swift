//
//  RecordViewModel.swift
//  Hearloom
//
//  記録画面のViewModel（MVVMパターン）
//

import SwiftUI
import Combine

// MARK: - RecordViewModelProtocol

/// RecordViewModelのプロトコル（テスト・モック用）
@MainActor
protocol RecordViewModelProtocol: ObservableObject {
    var song: Song? { get set }
    var selectedMood: MoodType? { get set }
    var situation: String { get set }
    var isSaving: Bool { get }
    var urlParseResult: URLParseResult { get }
    var entryMode: RecordEntryMode { get }
    var canSave: Bool { get }

    func initializeFromEntryMode()
    func fetchSongFromURL(_ urlString: String)
    func saveRecord(completion: @escaping @MainActor (MusicRecord) -> Void)
    func setSong(_ song: Song)
}

// MARK: - RecordViewModel

/// 記録画面のViewModel
@MainActor
final class RecordViewModel: RecordViewModelProtocol {
    // MARK: - Published Properties

    @Published var song: Song?
    @Published var selectedMood: MoodType?
    @Published var situation: String = ""
    @Published private(set) var isSaving = false
    @Published private(set) var urlParseResult: URLParseResult = .idle

    // MARK: - Properties

    let entryMode: RecordEntryMode

    /// 保存可能かどうか
    var canSave: Bool {
        song != nil && selectedMood != nil
    }

    // MARK: - Initialization

    init(entryMode: RecordEntryMode) {
        self.entryMode = entryMode
    }

    // MARK: - Public Methods

    /// 入口モードに応じて初期化
    func initializeFromEntryMode() {
        switch entryMode {
        case .preset(let presetSong):
            song = presetSong
        case .url:
            // URLからの取得は別途 fetchSongFromURL で実行
            break
        case .input:
            // ユーザー入力を待つ
            break
        }
    }

    /// URLから曲情報を取得
    func fetchSongFromURL(_ urlString: String) {
        urlParseResult = .loading

        // TODO: 実際のURL解析実装（MusicServiceProtocol経由）
        // 現在はモック実装
        Task {
            try? await Task.sleep(nanoseconds: 1_500_000_000) // 1.5秒

            if urlString.contains("spotify") || urlString.contains("music.apple") {
                let mockSong = Song(
                    id: UUID().uuidString,
                    title: "共有から取得した曲",
                    artist: "アーティスト名",
                    albumName: "アルバム名",
                    albumArtUrl: nil,
                    source: urlString.contains("spotify") ? .spotify : .appleMusic
                )
                urlParseResult = .success(mockSong)
                song = mockSong
            } else {
                urlParseResult = .failure(.unsupportedService)
            }
        }
    }

    /// 記録を保存
    func saveRecord(completion: @escaping @MainActor (MusicRecord) -> Void) {
        guard let song = song, let mood = selectedMood else { return }

        isSaving = true

        let record = MusicRecord(
            song: song,
            mood: mood,
            situation: situation.isEmpty ? nil : situation
        )

        // 少し遅延を入れてUX向上
        Task { [weak self] in
            try? await Task.sleep(nanoseconds: 500_000_000) // 0.5秒
            self?.isSaving = false
            completion(record)
        }
    }

    /// 曲を設定（SongInputViewから呼び出される）
    func setSong(_ song: Song) {
        self.song = song
    }
}

// MARK: - Preview Helper

#if DEBUG
extension RecordViewModel {
    /// プレビュー用のViewModel（presetモード）
    static var previewPreset: RecordViewModel {
        let viewModel = RecordViewModel(entryMode: .preset(.preview))
        viewModel.initializeFromEntryMode()
        return viewModel
    }

    /// プレビュー用のViewModel（urlモード）
    static var previewUrl: RecordViewModel {
        RecordViewModel(entryMode: .url("https://open.spotify.com/track/xxx"))
    }

    /// プレビュー用のViewModel（inputモード）
    static var previewInput: RecordViewModel {
        RecordViewModel(entryMode: .input)
    }
}
#endif
