//
//  Song.swift
//  Hearloom
//
//  曲情報モデル
//

import Foundation

// MARK: - MusicSource

/// 音楽サービス
enum MusicSource: String, Codable, Sendable {
    case appleMusic = "apple_music"
    case spotify = "spotify"

    var displayName: String {
        switch self {
        case .appleMusic: return "Apple Music"
        case .spotify: return "Spotify"
        }
    }
}

// MARK: - Song

/// 曲情報
struct Song: Identifiable, Codable, Equatable, Sendable {
    /// 曲ID（プラットフォーム固有）
    let id: String
    /// 曲名
    let title: String
    /// アーティスト名
    let artist: String
    /// アルバム名
    let albumName: String?
    /// アルバムアートURL
    let albumArtUrl: String?
    /// 音楽サービス
    let source: MusicSource

    init(
        id: String,
        title: String,
        artist: String,
        albumName: String? = nil,
        albumArtUrl: String? = nil,
        source: MusicSource
    ) {
        self.id = id
        self.title = title
        self.artist = artist
        self.albumName = albumName
        self.albumArtUrl = albumArtUrl
        self.source = source
    }
}

// MARK: - Mock Data

extension Song {
    /// プレビュー用モックデータ
    static let preview = Song(
        id: "mock-song-1",
        title: "Midnight City",
        artist: "M83",
        albumName: "Hurry Up, We're Dreaming",
        albumArtUrl: nil,
        source: .appleMusic
    )

    static let previewSpotify = Song(
        id: "mock-song-2",
        title: "Blinding Lights",
        artist: "The Weeknd",
        albumName: "After Hours",
        albumArtUrl: nil,
        source: .spotify
    )

    static let previewList: [Song] = [
        preview,
        previewSpotify,
        Song(
            id: "mock-song-3",
            title: "夜に駆ける",
            artist: "YOASOBI",
            albumName: "THE BOOK",
            albumArtUrl: nil,
            source: .appleMusic
        ),
    ]
}
