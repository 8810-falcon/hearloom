//
//  RecordRepositoryProtocol.swift
//  Hearloom
//
//  記録データリポジトリプロトコル
//

import Foundation

// MARK: - RecordFilter

/// 記録フィルタ
struct RecordFilter: Sendable {
    /// 開始日時
    var startDate: Date?
    /// 終了日時
    var endDate: Date?
    /// 気分でフィルタ
    var mood: MoodType?
    /// 取得件数上限
    var limit: Int?
    /// オフセット
    var offset: Int?

    init(
        startDate: Date? = nil,
        endDate: Date? = nil,
        mood: MoodType? = nil,
        limit: Int? = nil,
        offset: Int? = nil
    ) {
        self.startDate = startDate
        self.endDate = endDate
        self.mood = mood
        self.limit = limit
        self.offset = offset
    }
}

// MARK: - RecordRepositoryProtocol

/// 記録データリポジトリプロトコル
protocol RecordRepositoryProtocol: Sendable {
    /// 記録を保存
    func save(_ record: MusicRecord) async throws -> String

    /// 記録一覧を取得
    func getRecords(filter: RecordFilter?) async throws -> [MusicRecord]

    /// 記録を取得（単一）
    func getRecord(id: String) async throws -> MusicRecord?

    /// 記録を更新
    func update(_ record: MusicRecord) async throws

    /// 記録を削除
    func delete(id: String) async throws
}

// MARK: - RecordRepositoryError

/// リポジトリエラー
enum RecordRepositoryError: Error, Sendable {
    case notFound
    case saveFailed
    case deleteFailed
}
