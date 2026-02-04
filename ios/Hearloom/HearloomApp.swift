//
//  HearloomApp.swift
//  Hearloom
//
//  ネイティブシェルのエントリーポイント
//  WebView UIをホスティングし、Share Extensionからの共有URLを処理する
//

import SwiftUI

@main
struct HearloomApp: App {
    @StateObject private var sharedUrlManager = SharedUrlManager.shared

    var body: some Scene {
        WindowGroup {
            MainView()
                .environmentObject(sharedUrlManager)
                .onOpenURL { url in
                    // ディープリンクからの共有URLを処理
                    handleIncomingUrl(url)
                }
        }
    }

    private func handleIncomingUrl(_ url: URL) {
        // hearloom://share?url=xxx 形式のディープリンクを処理
        guard url.scheme == "hearloom",
              url.host == "share",
              let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
              let sharedUrl = components.queryItems?.first(where: { $0.name == "url" })?.value else {
            return
        }

        sharedUrlManager.setSharedUrl(sharedUrl)
    }
}
