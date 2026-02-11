//
//  RecordEntryMode.swift
//  Hearloom
//
//  記録画面への入口モード
//

import Foundation

// MARK: - RecordEntryMode

/// 記録画面への入口モード
enum RecordEntryMode: Equatable, Sendable {
    /// 曲情報がプリセット済み（ウィジェット経由）
    case preset(Song)

    /// URLから曲情報を取得（共有メニュー経由）
    case url(String)

    /// ユーザーが入力（アプリ内+ボタン経由）
    case input
}

// MARK: - SongInputMode

/// 曲情報入力モード（inputモード内での切り替え）
enum SongInputMode: String, CaseIterable, Identifiable, Sendable {
    case url = "URLから"
    case manual = "手動入力"

    var id: String { rawValue }
}

// MARK: - ManualSongInput

/// 手動入力用の曲情報
struct ManualSongInput: Sendable {
    var title: String = ""
    var artist: String = ""
    var albumName: String = ""

    /// 必須項目が入力されているか
    var isValid: Bool {
        !title.trimmingCharacters(in: .whitespaces).isEmpty &&
        !artist.trimmingCharacters(in: .whitespaces).isEmpty
    }

    /// Songに変換
    func toSong() -> Song {
        Song(
            id: UUID().uuidString,
            title: title.trimmingCharacters(in: .whitespaces),
            artist: artist.trimmingCharacters(in: .whitespaces),
            albumName: albumName.isEmpty ? nil : albumName.trimmingCharacters(in: .whitespaces),
            albumArtUrl: nil,
            source: .appleMusic // 手動入力の場合はデフォルト
        )
    }
}

// MARK: - URLParseResult

/// URL解析結果
enum URLParseResult: Sendable {
    case idle
    case loading
    case success(Song)
    case failure(URLParseError)
}

/// URL解析エラー
enum URLParseError: Error, LocalizedError, Sendable {
    case invalidURL
    case unsupportedService
    case networkError
    case parseError

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "URLの形式が正しくありません"
        case .unsupportedService:
            return "対応していない音楽サービスです"
        case .networkError:
            return "ネットワークエラーが発生しました"
        case .parseError:
            return "曲情報を取得できませんでした"
        }
    }
}
