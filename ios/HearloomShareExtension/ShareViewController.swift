//
//  ShareViewController.swift
//  HearloomShareExtension
//
//  音楽アプリからの共有を受け取るShare Extension
//

import UIKit
import UniformTypeIdentifiers

class ShareViewController: UIViewController {

    // 対応する音楽サービスのURL形式
    private let supportedMusicUrlPatterns: [String] = [
        "https://open.spotify.com/track/",
        "https://spotify.link/",
        "https://music.apple.com/",
        "https://youtu.be/",
        "https://www.youtube.com/watch",
        "https://music.youtube.com/"
    ]

    override func viewDidLoad() {
        super.viewDidLoad()
        processSharedContent()
    }

    private func processSharedContent() {
        guard let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem,
              let attachments = extensionItem.attachments else {
            completeWithError("共有アイテムを取得できませんでした")
            return
        }

        // URLを探す
        for attachment in attachments {
            if attachment.hasItemConformingToTypeIdentifier(UTType.url.identifier) {
                attachment.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) { [weak self] item, error in
                    if let url = item as? URL {
                        self?.handleUrl(url)
                    } else {
                        self?.completeWithError("URLを読み取れませんでした")
                    }
                }
                return
            }

            // プレーンテキストからURLを抽出
            if attachment.hasItemConformingToTypeIdentifier(UTType.plainText.identifier) {
                attachment.loadItem(forTypeIdentifier: UTType.plainText.identifier, options: nil) { [weak self] item, error in
                    if let text = item as? String,
                       let url = self?.extractUrl(from: text) {
                        self?.handleUrl(url)
                    } else {
                        self?.completeWithError("共有テキストからURLを抽出できませんでした")
                    }
                }
                return
            }
        }

        completeWithError("対応する共有コンテンツが見つかりませんでした")
    }

    private func extractUrl(from text: String) -> URL? {
        // テキストからURLを抽出
        let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
        let range = NSRange(text.startIndex..., in: text)

        guard let match = detector?.firstMatch(in: text, options: [], range: range),
              let url = match.url else {
            return nil
        }

        return url
    }

    private func handleUrl(_ url: URL) {
        let urlString = url.absoluteString

        // 対応する音楽サービスのURLかチェック
        let isMusicUrl = supportedMusicUrlPatterns.contains { pattern in
            urlString.hasPrefix(pattern)
        }

        guard isMusicUrl else {
            completeWithError("対応していない音楽サービスのURLです")
            return
        }

        // URLをApp Groups経由でメインアプリに渡す
        SharedUrlManager.saveSharedUrl(urlString)

        // メインアプリを起動
        openMainApp(with: urlString)
    }

    private func openMainApp(with sharedUrl: String) {
        // URLエンコード
        guard let encodedUrl = sharedUrl.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let appUrl = URL(string: "hearloom://share?url=\(encodedUrl)") else {
            completeWithError("アプリを開けませんでした")
            return
        }

        // 注意: Share Extensionから直接URL Schemeを開くことはできない
        // 代わりにApp Groupsを使ってメインアプリにURLを渡し、
        // ユーザーがアプリを開いた時に処理される

        // Extension を正常終了
        extensionContext?.completeRequest(returningItems: nil) { [weak self] _ in
            // メインアプリを開くためのワークアラウンド
            self?.openUrl(appUrl)
        }
    }

    /// Share ExtensionからURLを開くためのヘルパー
    private func openUrl(_ url: URL) {
        // iOS 18以降: openURL は非推奨だが、Share Extension では他に方法がない
        var responder: UIResponder? = self
        while responder != nil {
            if let application = responder as? UIApplication {
                application.open(url, options: [:], completionHandler: nil)
                return
            }
            responder = responder?.next
        }

        // フォールバック: Selector を使用
        let selector = sel_registerName("openURL:")
        var responder2: UIResponder? = self
        while responder2 != nil {
            if responder2!.responds(to: selector) {
                responder2!.perform(selector, with: url)
                return
            }
            responder2 = responder2?.next
        }
    }

    private func completeWithError(_ message: String) {
        print("[ShareExtension] Error: \(message)")

        // エラーアラートを表示
        let alert = UIAlertController(
            title: "共有できませんでした",
            message: message,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default) { [weak self] _ in
            self?.extensionContext?.cancelRequest(withError: NSError(
                domain: "com.hayato-ogura.Hearloom.ShareExtension",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: message]
            ))
        })

        DispatchQueue.main.async {
            self.present(alert, animated: true)
        }
    }
}

// MARK: - SharedUrlManager (Share Extension用)

/// Share Extension用のSharedUrlManager
/// App Groupsを通じてメインアプリにURLを渡す
enum SharedUrlManager {
    static let appGroupIdentifier = "group.com.hayato-ogura.Hearloom"
    private static let sharedUrlKey = "pendingSharedUrl"

    static func saveSharedUrl(_ url: String) {
        let userDefaults = UserDefaults(suiteName: appGroupIdentifier)
        userDefaults?.set(url, forKey: sharedUrlKey)
    }
}
