package com.hearloom.bridge

import android.util.Log
import android.webkit.JavascriptInterface
import org.json.JSONObject

private const val TAG = "HearloomBridge"

/**
 * Hearloom ブリッジAPI
 *
 * Web UI（JavaScript）からネイティブ機能を呼び出すためのインターフェース
 * @JavascriptInterface アノテーションが付いたメソッドがJSから呼び出し可能
 */
class HearloomBridge(
    private val sharedUrl: String?,
    private val onCloseApp: () -> Unit
) {

    /**
     * 共有URLを取得
     *
     * Web UI側での呼び出し:
     * ```javascript
     * const result = HearloomBridge.getSharedUrl();
     * const data = JSON.parse(result);
     * if (data.url) { ... }
     * ```
     */
    @JavascriptInterface
    fun getSharedUrl(): String {
        Log.d(TAG, "getSharedUrl called, url: $sharedUrl")

        val result = JSONObject().apply {
            put("url", sharedUrl)
        }
        return result.toString()
    }

    /**
     * アプリを閉じる
     *
     * Web UI側での呼び出し:
     * ```javascript
     * HearloomBridge.closeApp();
     * ```
     */
    @JavascriptInterface
    fun closeApp() {
        Log.d(TAG, "closeApp called")
        onCloseApp()
    }
}
