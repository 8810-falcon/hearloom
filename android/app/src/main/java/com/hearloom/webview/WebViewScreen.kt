package com.hearloom.webview

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.util.Log
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.hearloom.BuildConfig
import com.hearloom.bridge.HearloomBridge

private const val TAG = "WebViewScreen"

/**
 * WebViewを表示するComposable画面
 */
@Composable
fun WebViewScreen(
    initialSharedUrl: String?,
    onCloseApp: () -> Unit
) {
    var isLoading by remember { mutableStateOf(true) }
    var hasError by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        HearloomWebView(
            sharedUrl = initialSharedUrl,
            onCloseApp = onCloseApp,
            onLoadingChanged = { isLoading = it },
            onError = { message ->
                hasError = true
                errorMessage = message
            }
        )

        // エラー時のフォールバック表示（開発時のみ）
        if (hasError && BuildConfig.DEBUG) {
            ErrorOverlay(
                message = errorMessage,
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
private fun HearloomWebView(
    sharedUrl: String?,
    onCloseApp: () -> Unit,
    onLoadingChanged: (Boolean) -> Unit,
    onError: (String) -> Unit
) {
    var webViewInstance by remember { mutableStateOf<WebView?>(null) }

    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )

                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    allowFileAccess = true
                    loadWithOverviewMode = true
                    useWideViewPort = true

                    // デバッグ用
                    if (BuildConfig.DEBUG) {
                        WebView.setWebContentsDebuggingEnabled(true)
                    }
                }

                // ブリッジAPIを登録
                val bridge = HearloomBridge(
                    sharedUrl = sharedUrl,
                    onCloseApp = onCloseApp
                )
                addJavascriptInterface(bridge, "HearloomBridge")

                webViewClient = object : WebViewClient() {
                    override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                        super.onPageStarted(view, url, favicon)
                        Log.d(TAG, "Page started: $url")
                        onLoadingChanged(true)
                    }

                    override fun onPageFinished(view: WebView?, url: String?) {
                        super.onPageFinished(view, url)
                        Log.d(TAG, "Page finished: $url")
                        onLoadingChanged(false)
                    }

                    override fun onReceivedError(
                        view: WebView?,
                        request: WebResourceRequest?,
                        error: WebResourceError?
                    ) {
                        super.onReceivedError(view, request, error)
                        if (request?.isForMainFrame == true) {
                            val message = error?.description?.toString() ?: "Unknown error"
                            Log.e(TAG, "WebView error: $message")
                            onError(message)
                        }
                    }

                    override fun shouldOverrideUrlLoading(
                        view: WebView?,
                        request: WebResourceRequest?
                    ): Boolean {
                        val url = request?.url?.toString() ?: return false

                        // ローカルサーバーとアセットは許可
                        if (url.startsWith("http://10.0.2.2:") ||
                            url.startsWith("http://localhost:") ||
                            url.startsWith("file:///android_asset/")) {
                            return false
                        }

                        // 外部URLはブラウザで開く
                        if (url.startsWith("http://") || url.startsWith("https://")) {
                            val intent = android.content.Intent(
                                android.content.Intent.ACTION_VIEW,
                                android.net.Uri.parse(url)
                            )
                            context.startActivity(intent)
                            return true
                        }

                        return false
                    }
                }

                webChromeClient = WebChromeClient()

                // Web UIを読み込み
                loadUrl(BuildConfig.WEB_UI_URL)

                webViewInstance = this
            }
        },
        update = { webView ->
            // WebViewインスタンスを更新
            webViewInstance = webView
        }
    )
}

@Composable
private fun ErrorOverlay(
    message: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .background(Color.White)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Development Server Not Running",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = "ローカルサーバーに接続できません。",
            style = MaterialTheme.typography.bodyMedium
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "cd web && npm run dev",
            style = MaterialTheme.typography.bodySmall,
            color = Color.Gray
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "エラー: $message",
            style = MaterialTheme.typography.bodySmall,
            color = Color.Red
        )
    }
}
