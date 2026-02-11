//
//  MockRecordRepository.swift
//  Hearloom
//
//  プレビュー用モックリポジトリ
//

import Foundation

// MARK: - MockRecordRepository

/// プレビュー用モックリポジトリ
/// Note: プレビュー/テスト専用のため @unchecked Sendable を使用
final class MockRecordRepository: RecordRepositoryProtocol, @unchecked Sendable {
    private var records: [MusicRecord]

    init(records: [MusicRecord] = MusicRecord.previewList) {
        self.records = records
    }

    func save(_ record: MusicRecord) async throws -> String {
        records.insert(record, at: 0)
        return record.id
    }

    func getRecords(filter: RecordFilter?) async throws -> [MusicRecord] {
        var result = records

        if let filter = filter {
            if let mood = filter.mood {
                result = result.filter { $0.mood == mood }
            }
            if let startDate = filter.startDate {
                result = result.filter { $0.createdAt >= startDate }
            }
            if let endDate = filter.endDate {
                result = result.filter { $0.createdAt <= endDate }
            }
            if let offset = filter.offset {
                result = Array(result.dropFirst(offset))
            }
            if let limit = filter.limit {
                result = Array(result.prefix(limit))
            }
        }

        return result
    }

    func getRecord(id: String) async throws -> MusicRecord? {
        records.first { $0.id == id }
    }

    func update(_ record: MusicRecord) async throws {
        guard let index = records.firstIndex(where: { $0.id == record.id }) else {
            throw RecordRepositoryError.notFound
        }
        records[index] = record
    }

    func delete(id: String) async throws {
        guard let index = records.firstIndex(where: { $0.id == id }) else {
            throw RecordRepositoryError.notFound
        }
        records.remove(at: index)
    }
}

// MARK: - Preview Helper

extension MockRecordRepository {
    /// 空のリポジトリ
    static let empty = MockRecordRepository(records: [])

    /// デフォルトのプレビュー用リポジトリ
    static let preview = MockRecordRepository()
}
