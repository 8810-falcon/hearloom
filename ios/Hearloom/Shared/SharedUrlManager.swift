//
//  SharedUrlManager.swift
//  Hearloom
//
//  Share Extensionからの共有URLを管理するシングルトン
//  App GroupsでShare Extensionとメインアプリ間でデータを共有
//

import Foundation
import Combine

final class SharedUrlManager: ObservableObject {
    static let shared = SharedUrlManager()

    /// App Groupsの識別子（Share Extensionとの共有用）
    static let appGroupIdentifier = "group.com.hayato-ogura.Hearloom"

    /// UserDefaultsのキー
    private static let sharedUrlKey = "pendingSharedUrl"

    /// 共有されたURL
    @Published private(set) var sharedUrl: String?

    /// 共有URL取得モード（アプリ起動経路によって変わる）
    @Published var launchMode: LaunchMode = .normal

    private let userDefaults: UserDefaults?

    enum LaunchMode {
        case normal      // 通常起動（一覧画面を表示）
        case share       // Share Extensionからの起動（記録画面を表示）
    }

    private init() {
        userDefaults = UserDefaults(suiteName: Self.appGroupIdentifier)

        // アプリ起動時にShare Extensionから渡されたURLがあれば取得
        checkPendingSharedUrl()
    }

    /// Share Extensionから渡されたURLを確認
    func checkPendingSharedUrl() {
        if let pendingUrl = userDefaults?.string(forKey: Self.sharedUrlKey) {
            sharedUrl = pendingUrl
            launchMode = .share
            // 読み取り後は削除（1回限り）
            userDefaults?.removeObject(forKey: Self.sharedUrlKey)
        }
    }

    /// 共有URLを設定（ディープリンク経由）
    func setSharedUrl(_ url: String) {
        sharedUrl = url
        launchMode = .share
    }

    /// 共有URLをクリア（保存/キャンセル後）
    func clearSharedUrl() {
        sharedUrl = nil
        launchMode = .normal
    }

    /// Share Extension用: URLを保存してメインアプリに渡す
    static func saveSharedUrl(_ url: String) {
        let userDefaults = UserDefaults(suiteName: appGroupIdentifier)
        userDefaults?.set(url, forKey: sharedUrlKey)
    }
}
