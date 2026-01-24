# Spotify Web API調査結果

**調査実施日:** 2026-01-17
**調査者:** mobile-tech-lead

## 調査結果サマリー

| 項目 | 結果 | 判定 |
|------|------|------|
| Recently Played取得 | 可能 | ◎ |
| **タイムスタンプ取得** | **可能（秒単位精度）** | **◎ 最重要** |
| ジャンル情報取得 | アーティスト経由で取得 | ○ |
| 曲・アーティスト・アルバム取得 | 可能 | ◎ |
| Audio Features（感情推定用）| 可能（valence, energy等） | ◎ |
| スキップ検出 | 不可 | × |
| バックグラウンド定期同期 | iOS/Android共に制約あり | △ |

## 最重要発見: タイムスタンプ取得が可能

**エンドポイント:** `/v1/me/player/recently-played`

**レスポンスに含まれる`played_at`フィールド:**
- 形式: ISO 8601 (例: `2024-01-15T14:30:00Z`)
- 精度: **秒単位**
- 意味: 「その曲が再生された日時」

これにより、Apple Music APIでは不可能だった「時間帯×ジャンル×頻度からAIで感情推定」がSpotifyでは実現可能。

## 履歴取得の制限

| 制限項目 | 内容 |
|----------|------|
| **総取得可能数** | **50曲のみ（ハードリミット）** |
| 1回あたりの取得上限 | 最大50件（limit=50） |
| デフォルト取得数 | 20件 |
| ページネーション | cursor-based（before/after） |

**重要な制約:**
- ページネーションを使用しても、合計50曲を超える履歴は取得不可
- Spotify公式アプリでは50曲以上の履歴が表示されるが、APIでは50曲が上限
- 2018年から一貫してこの制限が存在

**対策:**
- 定期的なポーリング（数時間おき）で50曲制限内のデータを継続収集
- Last.fmとの連携（Spotify scrobbling機能を利用してフル履歴を取得）
- ユーザーにアプリの定期起動を促すオンボーディング

## 取得可能なデータの詳細

| データ項目 | 取得可否 | 取得方法 |
|------------|----------|----------|
| 曲名 (Title) | ◎ | track.name |
| アーティスト名 | ◎ | track.artists[].name |
| アルバム名 | ◎ | track.album.name |
| アートワーク | ◎ | track.album.images[] |
| ジャンル情報 | ○ | **Artist APIから取得**（Track APIには含まれない） |
| 曲の長さ (Duration) | ◎ | track.duration_ms |
| **再生時刻** | **◎** | **played_at** |
| 再生コンテキスト | ○ | context（プレイリスト名等） |
| 人気度 | ◎ | track.popularity (0-100) |
| スキップ判定 | × | APIでサポートなし |

## Audio Features API（感情推定に有用）

**エンドポイント:** `/v1/audio-features/{id}`

**取得可能なパラメータ:**

| パラメータ | 説明 | 範囲 | 感情推定への活用 |
|------------|------|------|------------------|
| **valence** | 曲の「明るさ・ポジティブさ」 | 0.0-1.0 | **感情推定の中核指標** |
| **energy** | 曲の「激しさ・強度」 | 0.0-1.0 | **活動状態の推定** |
| tempo | BPM | 数値 | 活動レベルの参考 |
| danceability | 踊りやすさ | 0.0-1.0 | ムード推定の補助 |
| acousticness | アコースティック度 | 0.0-1.0 | ジャンル傾向の把握 |
| instrumentalness | 楽器度（ボーカルなし度） | 0.0-1.0 | 集中モード検出 |
| mode | メジャー(1)/マイナー(0) | 0 or 1 | 明暗の判定 |
| liveness | ライブ録音らしさ | 0.0-1.0 | - |
| speechiness | 話し言葉度 | 0.0-1.0 | ポッドキャスト検出 |
| loudness | 音量(dB) | -60〜0 | - |
| time_signature | 拍子 | 3-7 | - |
| key | 調 | -1〜11 | - |

**Hearloomへの活用:**
Apple Music APIでは曲のメタデータ（ジャンル等）しか取得できなかったが、Spotify Audio Featuresでは曲自体の「感情特性」を数値化したデータが取得可能。これにより、より精度の高い感情推定が実現できる。

## API制限

| 制限項目 | 内容 |
|----------|------|
| レートリミット | **30秒ローリングウィンドウ**ベース（具体的な数値は非公開） |
| 429エラー時 | `Retry-After`ヘッダーで待機時間を指示 |
| Development Mode | **最大25ユーザー**まで |
| Extended Quota Mode | 無制限ユーザー、高レートリミット |

## クォータモードと審査要件

**Development Mode（開発モード）:**
- ユーザー数制限: **最大25人**（アローリストへの事前登録が必要）
- 非登録ユーザーからのリクエストは403エラー
- テスト・開発用途に最適

**Extended Quota Mode（拡張クォータモード）:**
- **2025年5月15日以降、取得条件が大幅に厳格化**

**新要件（2025年5月15日〜）:**
| 要件 | 詳細 |
|------|------|
| 申請主体 | **組織のみ**（個人開発者は不可） |
| 法人格 | 法的に登録された事業体が必要 |
| MAU要件 | **25万MAU以上**が事実上必要 |
| 市場展開 | Spotifyの主要市場でのプレゼンス |
| 商業的実現性 | 持続可能なビジネスモデル |
| 審査期間 | 最大6週間 |

**Hearloomへの影響:**
- MVP段階では**Development Mode（25ユーザー制限）**での運用
- ユーザー拡大時には法人化とMAU要件のクリアが必須
- 「25ユーザー → 25万MAU」のギャップが大きい（Catch-22問題）

## 認証フロー

**推奨:** Authorization Code Flow with PKCE（モバイルアプリ向け）

**理由:**
- クライアントシークレットをアプリ内に埋め込む必要がない
- アクセストークン（1時間有効）とリフレッシュトークンを取得
- セキュアな認証が可能

**トークン管理:**
- アクセストークン有効期限: **1時間**
- リフレッシュトークン: 長期有効（ただしSpotifyが無効化する場合あり）
- iOS: Keychainに安全に保存
- Android: Keystoreに安全に保存

## Developer Policy制限事項

**禁止事項:**
- ゲーム・クイズ機能の構築
- 音声制御機能
- 機械学習モデルの学習用途でのデータ使用
- 統計分析・プロファイリング用途でのデータ利用
- 他サービスへのデータ転送（プレイリスト移行支援を除く）

**Hearloomへの影響:**
- 「統計分析・プロファイリング用途」が懸念点
- ただし、ユーザー自身の履歴を可視化するのは許容範囲と解釈可能
- サーバーサイドでの大規模分析は避けるべき

## プライバシー・審査注意点

**必須対応:**
- 明確なプライバシーポリシーの提供
- データ収集・利用方法の透明性確保
- 簡単なアカウント切断メカニズムの提供
- 切断後のデータ削除義務

**App Store/Google Play固有の制約:**
- ドキュメント上に明示的な記載なし
- Spotify Developer Terms遵守が前提

## Apple Music APIとの比較

| 機能 | Apple Music API | Spotify Web API | 判定 |
|------|----------------|-----------------|------|
| **タイムスタンプ取得** | **不可** | **可能（秒単位）** | **Spotify優位** |
| 履歴取得上限 | 50曲 | 50曲 | 同等 |
| ジャンル情報 | 直接取得可能 | Artist経由 | Apple優位 |
| Audio Features | なし | **valence, energy等** | **Spotify優位** |
| バックグラウンド同期 | 制約あり | 制約あり | 同等 |
| 認証の複雑さ | 中〜高 | 中 | やや同等 |
| ユーザー数制限（開発） | なし | **25人** | Apple優位 |
| 拡張審査要件 | なし | **25万MAU必要** | Apple優位 |
| マネタイズ制限 | 厳格 | 厳格 | 同等 |

## 実現可能性の総合判定

| 機能 | 判定 | 理由 |
|------|------|------|
| **時間帯×ジャンル×頻度からAI推定** | **◎ 実現可能** | タイムスタンプ + Audio Featuresの組み合わせ |
| Recently Played取得 | ◎ 実現可能 | 50曲制限はあるが定期ポーリングで対応 |
| 感情・ムード推定 | ◎ 実現可能 | valence, energy等のAudio Features活用 |
| バックグラウンド定期同期 | △ 制約あり | iOS/Android共通の制約 |
| スキップ検出 | × 実現困難 | APIでサポートされていない |
| **25ユーザー超のサービス展開** | **△ ハードル高** | Extended Quota Mode取得に25万MAU必要 |

## 推奨される次のアクション

**決定が必要な事項:**
- [ ] Apple Music APIの代わりにSpotify Web APIを主要プラットフォームとして採用するか判断
- [ ] Development Mode（25ユーザー制限）でのMVPローンチは許容可能か検討
- [ ] 将来のExtended Quota Mode取得に向けた法人化計画の策定

**技術検証（P0）:**
- [ ] Spotify OAuth with PKCE のiOS/Android実装検証
- [ ] Recently Played + Audio Features取得のプロトタイプ作成
- [ ] 定期ポーリングの最適間隔の検証（50曲制限内でのデータ欠損回避）

## 参考情報

- [Get Recently Played Tracks | Spotify for Developers](https://developer.spotify.com/documentation/web-api/reference/get-recently-played)
- [Get Track's Audio Features | Spotify for Developers](https://developer.spotify.com/documentation/web-api/reference/get-audio-features)
- [Quota Modes | Spotify for Developers](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)
- [Spotify Developer Policy](https://developer.spotify.com/policy)
- [Authorization Code with PKCE | Spotify for Developers](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)
