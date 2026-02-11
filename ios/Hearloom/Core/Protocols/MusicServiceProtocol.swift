//
//  MusicServiceProtocol.swift
//  Hearloom
//
//  音楽サービス連携プロトコル
//

import Foundation

// MARK: - AuthStatus

/// 認証状態
enum AuthStatus: Sendable {
    case authorized
    case denied
    case notDetermined
}

// MARK: - MusicServiceProtocol

/// 音楽サービス連携プロトコル
protocol MusicServiceProtocol: Sendable {
    /// サービス種別
    var source: MusicSource { get }

    /// 認証状態を取得
    func getAuthStatus() async -> AuthStatus

    /// 認証をリクエスト
    func requestAuthorization() async -> Bool

    /// 現在再生中の曲を取得
    func getCurrentSong() async -> Song?
}

// MARK: - AppleMusicService

/// Apple Music サービス（プレースホルダー）
final class AppleMusicService: MusicServiceProtocol, Sendable {
    let source: MusicSource = .appleMusic

    func getAuthStatus() async -> AuthStatus {
        // TODO: 実装
        .notDetermined
    }

    func requestAuthorization() async -> Bool {
        // TODO: 実装
        false
    }

    func getCurrentSong() async -> Song? {
        // TODO: 実装
        nil
    }
}

// MARK: - SpotifyService

/// Spotify サービス（プレースホルダー）
final class SpotifyService: MusicServiceProtocol, Sendable {
    let source: MusicSource = .spotify

    func getAuthStatus() async -> AuthStatus {
        // TODO: 実装
        .notDetermined
    }

    func requestAuthorization() async -> Bool {
        // TODO: 実装
        false
    }

    func getCurrentSong() async -> Song? {
        // TODO: 実装
        nil
    }
}
