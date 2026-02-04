package com.hearloom.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.hearloom.webview.WebViewScreen

/**
 * Hearloom メインアクティビティ
 *
 * WebViewをホスティングし、音楽アプリからの共有インテントを処理する
 */
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // 起動時のインテントを処理
        val sharedUrl = extractSharedUrl(intent)

        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WebViewScreen(
                        initialSharedUrl = sharedUrl,
                        onCloseApp = { finishAndRemoveTask() }
                    )
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        // アプリが既に起動している状態で新しい共有インテントを受け取った場合
        // この場合はWebViewに通知する必要がある（将来的な拡張）
        setIntent(intent)
    }

    /**
     * インテントから共有URLを抽出
     */
    private fun extractSharedUrl(intent: Intent?): String? {
        if (intent == null) return null

        return when (intent.action) {
            Intent.ACTION_SEND -> {
                // 共有インテントからテキストを取得
                val text = intent.getStringExtra(Intent.EXTRA_TEXT)
                extractMusicUrl(text)
            }
            Intent.ACTION_VIEW -> {
                // ディープリンクからURLを取得
                intent.data?.getQueryParameter("url")
            }
            else -> null
        }
    }

    /**
     * テキストから音楽サービスのURLを抽出
     */
    private fun extractMusicUrl(text: String?): String? {
        if (text.isNullOrBlank()) return null

        // 対応する音楽サービスのURL形式
        val supportedPatterns = listOf(
            "https://open.spotify.com/track/",
            "https://spotify.link/",
            "https://music.apple.com/",
            "https://youtu.be/",
            "https://www.youtube.com/watch",
            "https://music.youtube.com/"
        )

        // URLパターンを検出
        val urlPattern = Regex("https?://[\\w./-]+[\\w/?=&-]*")
        val match = urlPattern.find(text)

        val url = match?.value ?: return null

        // 対応する音楽サービスかチェック
        return if (supportedPatterns.any { url.startsWith(it) }) {
            url
        } else {
            null
        }
    }
}
