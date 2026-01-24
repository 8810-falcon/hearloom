# YouTube Data API調査結果

**調査実施日:** 2026-01-17
**調査者:** mobile-tech-lead

## 調査結果サマリー

| 項目 | 結果 | 判定 |
|------|------|------|
| **視聴履歴アクセス** | **不可（2016年9月から無効化）** | **× 致命的** |
| YouTube Music履歴区別 | 不可（API経由では取得不能） | × |
| タイムスタンプ取得 | 該当なし（履歴取得自体が不可） | - |
| API制限 | 10,000クエリ/日 | 参考のみ |

## 最重要発見: 視聴履歴へのAPIアクセスは不可能

**2016年9月12日から、YouTube Data API v3での視聴履歴アクセスは完全に無効化されています。**

**公式ドキュメントより:**
> `contentDetails.relatedPlaylists.watchHistory` returns a value of **HL** for all channels.
> Requests to retrieve playlist items (`playlistItems.list`) for a channel's watch history return an **empty list**.

**影響:**
- ユーザーのYouTube視聴履歴をプログラム的に取得することは**不可能**
- YouTube Musicの再生履歴も同様に取得不可
- これはセキュリティ/プライバシー上の理由で意図的に無効化された

## 視聴履歴取得の代替手段

| 手段 | 説明 | Hearloomでの利用可否 |
|------|------|----------------------|
| Google Takeout | ユーザーが手動でデータをエクスポート | △ UX悪い、自動化不可 |
| myactivity.google.com | ユーザーが手動で確認 | × API化されていない |
| 非公式API（ytmusicapi） | リバースエンジニアリングベース | × 利用規約違反リスク |

## Activities APIについて

**取得可能なアクティビティ:**
- channelItem、comment、favorite、like、playlistItem
- promotedItem、recommendation、social、subscription、upload

**取得できないもの:**
- **視聴履歴（watch history）は含まれない**
- YouTube Musicの再生履歴

## API制限（参考情報）

| 制限項目 | 内容 |
|----------|------|
| デフォルトクォータ | **10,000 units/日** |
| クォータ増加 | 審査（コンプライアンス監査）が必要 |
| 審査要件 | YouTube API利用規約への適合確認 |

## 実現可能性の総合判定

| 機能 | 判定 | 理由 |
|------|------|------|
| YouTube視聴履歴の取得 | **× 実現不可** | 2016年からAPIで無効化 |
| YouTube Music履歴の取得 | **× 実現不可** | 同上 |
| 音楽聴取データとしての活用 | **× 採用不可** | 代替手段なし |

## 結論

**YouTube Data APIはHearloomのコア機能には使用できません。**

理由:
1. 視聴履歴へのAPIアクセスが2016年9月から完全に無効化されている
2. Google Takeoutでの手動エクスポートは「記録コストゼロ」のコンセプトと矛盾
3. 非公式APIはGoogle利用規約違反のリスクがある

**SKILL.mdの「Should have」からYouTube連携を削除することを推奨します。**

## 参考情報

- [YouTube Data API Revision History](https://developers.google.com/youtube/v3/revision_history)
- [Activities | YouTube Data API](https://developers.google.com/youtube/v3/docs/activities)
- [Issue #35172816 - API v3 Watch History](https://issuetracker.google.com/issues/35172816)
