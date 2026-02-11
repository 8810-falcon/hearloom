//
//  MainView.swift
//  Hearloom
//
//  メインビュー - フルネイティブアプリのルートビュー
//  3つの記録入口に対応:
//  - preset: ウィジェット（曲自動取得）
//  - url: 共有メニュー（URL解析）
//  - input: +ボタン（手動入力 or URL入力）
//

import SwiftUI

// MARK: - NavigationState

/// ナビゲーション先
enum NavigationDestination: Hashable {
    case record(RecordEntryMode)
    case edit(MusicRecord)
}

// MARK: - MainView

struct MainView: View {
    @EnvironmentObject var sharedUrlManager: SharedUrlManager

    @State private var records: [MusicRecord] = MusicRecord.previewList
    @State private var navigationPath = NavigationPath()
    @State private var showRecordSheet = false
    @State private var currentEntryMode: RecordEntryMode = .input

    var body: some View {
        NavigationStack(path: $navigationPath) {
            ListScreen(
                records: records,
                onRecordTap: { record in
                    navigationPath.append(NavigationDestination.edit(record))
                },
                onAddTap: {
                    // +ボタン：手動入力モードで記録画面を開く
                    currentEntryMode = .input
                    showRecordSheet = true
                }
            )
            .navigationDestination(for: NavigationDestination.self) { destination in
                switch destination {
                case .record(let entryMode):
                    RecordScreen(
                        entryMode: entryMode,
                        onSave: { record in
                            records.insert(record, at: 0)
                            navigationPath.removeLast()
                        },
                        onCancel: {
                            navigationPath.removeLast()
                        }
                    )
                    .navigationBarHidden(true)

                case .edit(let record):
                    EditScreen(
                        record: record,
                        onSave: { updatedRecord in
                            if let index = records.firstIndex(where: { $0.id == updatedRecord.id }) {
                                records[index] = updatedRecord
                            }
                            navigationPath.removeLast()
                        },
                        onDelete: {
                            records.removeAll { $0.id == record.id }
                            navigationPath.removeLast()
                        },
                        onCancel: {
                            navigationPath.removeLast()
                        }
                    )
                    .navigationBarHidden(true)
                }
            }
        }
        .sheet(isPresented: $showRecordSheet) {
            RecordScreen(
                entryMode: currentEntryMode,
                onSave: { record in
                    records.insert(record, at: 0)
                    showRecordSheet = false
                },
                onCancel: {
                    showRecordSheet = false
                }
            )
            .presentationDetents([.large])
            .presentationDragIndicator(.visible)
        }
        .onChange(of: sharedUrlManager.sharedUrl) { _, newUrl in
            // Share Extensionからの共有URLを受け取った場合
            if let url = newUrl {
                handleSharedUrl(url)
            }
        }
        .onAppear {
            // アプリ起動時にShare Extensionから渡されたURLがあれば処理
            if let url = sharedUrlManager.sharedUrl {
                handleSharedUrl(url)
            }
        }
        .preferredColorScheme(.dark)
    }

    // MARK: - URL Handling

    /// 共有URLを処理して記録画面を開く
    private func handleSharedUrl(_ url: String) {
        currentEntryMode = .url(url)
        sharedUrlManager.clearSharedUrl()
        showRecordSheet = true
    }

    // MARK: - Widget Integration (Future)

    /// ウィジェットからの曲情報で記録画面を開く
    /// - Note: 将来的にWidgetKit連携時に使用
    func openRecordWithPresetSong(_ song: Song) {
        currentEntryMode = .preset(song)
        showRecordSheet = true
    }
}

// MARK: - NavigationDestination Hashable

extension NavigationDestination {
    func hash(into hasher: inout Hasher) {
        switch self {
        case .record(let entryMode):
            hasher.combine("record")
            switch entryMode {
            case .preset(let song):
                hasher.combine("preset")
                hasher.combine(song.id)
            case .url(let urlString):
                hasher.combine("url")
                hasher.combine(urlString)
            case .input:
                hasher.combine("input")
            }
        case .edit(let record):
            hasher.combine("edit")
            hasher.combine(record.id)
        }
    }

    static func == (lhs: NavigationDestination, rhs: NavigationDestination) -> Bool {
        switch (lhs, rhs) {
        case (.record(let mode1), .record(let mode2)):
            return mode1 == mode2
        case (.edit(let record1), .edit(let record2)):
            return record1.id == record2.id
        default:
            return false
        }
    }
}

// MARK: - Preview

#Preview("MainView - Normal") {
    MainView()
        .environmentObject(SharedUrlManager.shared)
}

#Preview("MainView - With Shared URL") {
    let manager = SharedUrlManager.shared
    manager.setSharedUrl("https://open.spotify.com/track/test123")

    return MainView()
        .environmentObject(manager)
}
