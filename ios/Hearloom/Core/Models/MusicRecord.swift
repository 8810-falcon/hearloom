//
//  MusicRecord.swift
//  Hearloom
//
//  記録データモデル
//

import Foundation

// MARK: - Location

/// 位置情報
struct Location: Codable, Equatable, Sendable {
    /// 緯度
    let latitude: Double
    /// 経度
    let longitude: Double
    /// 場所名（逆ジオコーディング結果）
    let placeName: String?

    init(latitude: Double, longitude: Double, placeName: String? = nil) {
        self.latitude = latitude
        self.longitude = longitude
        self.placeName = placeName
    }
}

// MARK: - MusicRecord

/// 記録データ
struct MusicRecord: Identifiable, Codable, Equatable, Sendable {
    /// 記録ID（UUID）
    let id: String
    /// 曲情報
    let song: Song
    /// 気分
    var mood: MoodType
    /// 一言メモ（任意）
    var situation: String?
    /// エピソード（AI生成）
    var episode: String?
    /// 位置情報（オプトイン）
    let location: Location?
    /// 記録日時
    let createdAt: Date

    init(
        id: String = UUID().uuidString,
        song: Song,
        mood: MoodType,
        situation: String? = nil,
        episode: String? = nil,
        location: Location? = nil,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.song = song
        self.mood = mood
        self.situation = situation
        self.episode = episode
        self.location = location
        self.createdAt = createdAt
    }

    /// 記録日時のフォーマット済み文字列
    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        formatter.locale = Locale(identifier: "ja_JP")
        return formatter.string(from: createdAt)
    }

    /// 相対日時（例: "3時間前"）
    var relativeDate: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.locale = Locale(identifier: "ja_JP")
        formatter.unitsStyle = .short
        return formatter.localizedString(for: createdAt, relativeTo: Date())
    }
}

// MARK: - Mock Data

extension MusicRecord {
    /// プレビュー用モックデータ
    static let preview = MusicRecord(
        id: "mock-record-1",
        song: .preview,
        mood: .excited,
        situation: "深夜のドライブ中に聴いた",
        episode: nil,
        location: Location(latitude: 35.6812, longitude: 139.7671, placeName: "東京駅"),
        createdAt: Date().addingTimeInterval(-3600)
    )

    static let previewCalm = MusicRecord(
        id: "mock-record-2",
        song: .previewSpotify,
        mood: .calm,
        situation: "朝のコーヒータイム",
        episode: nil,
        location: nil,
        createdAt: Date().addingTimeInterval(-86400)
    )

    static let previewMelancholy = MusicRecord(
        id: "mock-record-3",
        song: Song(
            id: "mock-song-4",
            title: "Lemon",
            artist: "米津玄師",
            albumName: "BOOTLEG",
            albumArtUrl: nil,
            source: .appleMusic
        ),
        mood: .melancholy,
        situation: "雨の日の帰り道",
        episode: nil,
        location: nil,
        createdAt: Date().addingTimeInterval(-172800)
    )

    static let previewList: [MusicRecord] = [
        preview,
        previewCalm,
        previewMelancholy,
        MusicRecord(
            id: "mock-record-4",
            song: Song(
                id: "mock-song-5",
                title: "Pretender",
                artist: "Official髭男dism",
                albumName: nil,
                albumArtUrl: nil,
                source: .spotify
            ),
            mood: .nostalgic,
            situation: nil,
            episode: nil,
            location: nil,
            createdAt: Date().addingTimeInterval(-259200)
        ),
        MusicRecord(
            id: "mock-record-5",
            song: Song(
                id: "mock-song-6",
                title: "Time",
                artist: "Hans Zimmer",
                albumName: "Inception",
                albumArtUrl: nil,
                source: .appleMusic
            ),
            mood: .focused,
            situation: "仕事に集中したいとき",
            episode: nil,
            location: nil,
            createdAt: Date().addingTimeInterval(-345600)
        ),
    ]
}
