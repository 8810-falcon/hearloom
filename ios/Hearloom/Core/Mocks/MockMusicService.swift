//
//  MockMusicService.swift
//  Hearloom
//
//  プレビュー用モック音楽サービス
//

import Foundation

// MARK: - MockMusicService

/// プレビュー用モック音楽サービス
/// Note: プレビュー/テスト専用のため @unchecked Sendable を使用
final class MockMusicService: MusicServiceProtocol, @unchecked Sendable {
    let source: MusicSource
    var mockAuthStatus: AuthStatus
    var mockCurrentSong: Song?

    init(
        source: MusicSource = .appleMusic,
        authStatus: AuthStatus = .authorized,
        currentSong: Song? = .preview
    ) {
        self.source = source
        self.mockAuthStatus = authStatus
        self.mockCurrentSong = currentSong
    }

    func getAuthStatus() async -> AuthStatus {
        mockAuthStatus
    }

    func requestAuthorization() async -> Bool {
        mockAuthStatus = .authorized
        return true
    }

    func getCurrentSong() async -> Song? {
        mockCurrentSong
    }
}

// MARK: - Preview Helper

extension MockMusicService {
    /// Apple Music認証済み
    static let appleMusicAuthorized = MockMusicService(
        source: .appleMusic,
        authStatus: .authorized,
        currentSong: .preview
    )

    /// Spotify認証済み
    static let spotifyAuthorized = MockMusicService(
        source: .spotify,
        authStatus: .authorized,
        currentSong: .previewSpotify
    )

    /// 未認証
    static let notAuthorized = MockMusicService(
        source: .appleMusic,
        authStatus: .notDetermined,
        currentSong: nil
    )
}
