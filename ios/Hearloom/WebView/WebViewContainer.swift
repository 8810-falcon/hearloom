//
//  WebViewContainer.swift
//  Hearloom
//
//  WKWebViewをSwiftUIでラップするコンテナビュー
//

import SwiftUI
import WebKit

struct WebViewContainer: UIViewRepresentable {
    @EnvironmentObject var sharedUrlManager: SharedUrlManager

    func makeCoordinator() -> WebViewCoordinator {
        WebViewCoordinator(sharedUrlManager: sharedUrlManager)
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()

        // ブリッジAPIの設定
        let userContentController = WKUserContentController()
        userContentController.add(context.coordinator, name: "hearloom")
        configuration.userContentController = userContentController

        // WebView設定
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        // デバッグ用: Safariでのインスペクション有効化
        #if DEBUG
        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
        #endif

        // Web UIを読み込み
        loadWebUI(in: webView)

        context.coordinator.webView = webView
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        // sharedUrlManager の変更を検知してWebViewに通知
        context.coordinator.sharedUrlManager = sharedUrlManager
    }

    private func loadWebUI(in webView: WKWebView) {
        #if DEBUG
        // 開発時: ローカルサーバーを使用
        let devServerUrl = URL(string: "http://localhost:5173/")!
        webView.load(URLRequest(url: devServerUrl))
        #else
        // リリース時: バンドルされたアセットを使用
        if let indexUrl = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "WebUI") {
            webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
        }
        #endif
    }
}

// MARK: - Preview

#Preview {
    WebViewContainer()
        .environmentObject(SharedUrlManager.shared)
}
