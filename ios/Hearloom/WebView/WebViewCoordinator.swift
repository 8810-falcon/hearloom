//
//  WebViewCoordinator.swift
//  Hearloom
//
//  WKWebViewのデリゲートとブリッジAPIハンドラ
//

import Foundation
import UIKit
import WebKit

class WebViewCoordinator: NSObject {
    weak var webView: WKWebView?
    var sharedUrlManager: SharedUrlManager

    init(sharedUrlManager: SharedUrlManager) {
        self.sharedUrlManager = sharedUrlManager
        super.init()
    }

    // MARK: - JavaScript Callback

    /// JavaScriptにコールバックを送信
    private func sendCallback(callbackId: String, result: Any?, error: String?) {
        let resultJson: String
        if let result = result {
            if let jsonData = try? JSONSerialization.data(withJSONObject: result),
               let jsonString = String(data: jsonData, encoding: .utf8) {
                resultJson = jsonString
            } else if let stringResult = result as? String {
                resultJson = "\"\(stringResult.replacingOccurrences(of: "\"", with: "\\\""))\""
            } else {
                resultJson = "null"
            }
        } else {
            resultJson = "null"
        }

        let errorJson = error.map { "\"\($0)\"" } ?? "null"
        let js = "__bridgeCallback('\(callbackId)', \(resultJson), \(errorJson))"

        DispatchQueue.main.async { [weak self] in
            self?.webView?.evaluateJavaScript(js) { _, jsError in
                if let jsError = jsError {
                    print("[Bridge] Callback error: \(jsError)")
                }
            }
        }
    }
}

// MARK: - WKNavigationDelegate

extension WebViewCoordinator: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("[WebView] Page loaded: \(webView.url?.absoluteString ?? "unknown")")

        // ページロード完了後、共有URLがあれば通知
        if sharedUrlManager.sharedUrl != nil {
            // Web UI側でルーティングを処理するため、ここでは何もしない
            // getSharedUrl が呼ばれた時に返す
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("[WebView] Navigation failed: \(error.localizedDescription)")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("[WebView] Provisional navigation failed: \(error.localizedDescription)")

        #if DEBUG
        // 開発時: ローカルサーバーに接続できない場合のエラー表示
        let html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Hearloom - Development</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                    box-sizing: border-box;
                    background: #f5f5f5;
                }
                .error-box {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 400px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                h1 { color: #333; font-size: 20px; margin: 0 0 12px; }
                p { color: #666; margin: 0 0 16px; line-height: 1.5; }
                code {
                    display: block;
                    background: #f0f0f0;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    margin-top: 8px;
                }
            </style>
        </head>
        <body>
            <div class="error-box">
                <h1>Development Server Not Running</h1>
                <p>ローカルサーバーに接続できません。<br>以下のコマンドでWeb UIを起動してください:</p>
                <code>cd web<br>npm run dev</code>
            </div>
        </body>
        </html>
        """
        webView.loadHTMLString(html, baseURL: nil)
        #endif
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }

        // 外部URLの場合はSafariで開く
        if url.scheme == "http" || url.scheme == "https" {
            // ローカルサーバーとバンドルアセットは許可
            if url.host == "localhost" || url.isFileURL {
                decisionHandler(.allow)
                return
            }

            // 外部URLはSafariで開く
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }

        decisionHandler(.allow)
    }
}

// MARK: - WKScriptMessageHandler (Bridge API)

extension WebViewCoordinator: WKScriptMessageHandler {
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard message.name == "hearloom",
              let body = message.body as? [String: Any],
              let method = body["method"] as? String,
              let callbackId = body["callbackId"] as? String else {
            print("[Bridge] Invalid message format")
            return
        }

        let params = body["params"] as? [String: Any]

        print("[Bridge] Received: \(method)")

        switch method {
        case "getSharedUrl":
            handleGetSharedUrl(callbackId: callbackId)

        case "closeApp":
            handleCloseApp(callbackId: callbackId)

        default:
            sendCallback(callbackId: callbackId, result: nil, error: "Unknown method: \(method)")
        }
    }

    // MARK: - Bridge API Handlers

    /// 共有URLを取得
    private func handleGetSharedUrl(callbackId: String) {
        let url = sharedUrlManager.sharedUrl
        sendCallback(callbackId: callbackId, result: url, error: nil)
    }

    /// アプリを閉じる（Share Extension経由の起動時）
    private func handleCloseApp(callbackId: String) {
        // まずコールバックを返す
        sendCallback(callbackId: callbackId, result: nil, error: nil)

        // 共有URLをクリア
        sharedUrlManager.clearSharedUrl()

        // Share Extensionから起動された場合は元のアプリに戻る
        // 通常起動の場合はホーム画面に戻る
        DispatchQueue.main.async {
            // アプリをバックグラウンドに移動（実質的にアプリを閉じる動作）
            UIApplication.shared.perform(#selector(NSXPCConnection.suspend))
        }
    }
}
