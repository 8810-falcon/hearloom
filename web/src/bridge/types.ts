/**
 * ブリッジAPI型定義
 *
 * ネイティブ（iOS/Android）が提供するAPIの型定義です。
 * ネイティブ側の実装と必ず一致させてください。
 */

/**
 * 楽曲情報
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArtUrl?: string;
  playedAt: string; // ISO 8601形式
  durationMs: number;
  audioFeatures?: AudioFeatures;
}

/**
 * 音響特徴（Spotify Audio Features）
 */
export interface AudioFeatures {
  valence: number; // 0-1: ポジティブ度
  energy: number; // 0-1: エネルギー
  danceability: number; // 0-1: ダンサビリティ
  acousticness: number; // 0-1: アコースティック度
  tempo: number; // BPM
}

/**
 * 感情タグ
 */
export interface EmotionTag {
  id: string;
  label: string; // "楽しい", "悲しい", "集中", など
  color: string; // HEX color
}

/**
 * 聴取履歴エントリ
 */
export interface ListeningHistoryEntry {
  track: Track;
  emotionTags: EmotionTag[];
  memo?: string;
  isManuallyEdited: boolean;
}

/**
 * 通知パラメータ
 */
export interface NotificationParams {
  title: string;
  body: string;
  scheduledAt?: string; // ISO 8601形式（省略時は即座に通知）
  data?: Record<string, unknown>;
}

/**
 * Hearloom MVP用ブリッジAPI
 *
 * docs/design/screens.md のブリッジAPI仕様に準拠
 */
export interface HearloomBridge {
  /**
   * 共有URLを取得（記録画面起動時）
   * 音楽アプリからの共有メニュー経由で渡されたURLを取得
   */
  getSharedUrl(): Promise<string | null>;

  /**
   * アプリを閉じる（保存/キャンセル後）
   * WebViewを閉じて元のアプリに戻る
   */
  closeApp(): void;
}

/**
 * ネイティブブリッジAPI
 *
 * Web UIからネイティブ機能を呼び出すためのインターフェース
 */
export interface NativeBridge {
  /**
   * 最近再生した楽曲を取得
   * @param limit 取得件数（デフォルト: 50）
   */
  fetchRecentlyPlayed(limit?: number): Promise<Track[]>;

  /**
   * 聴取履歴を取得
   * @param startDate 開始日時（ISO 8601形式）
   * @param endDate 終了日時（ISO 8601形式）
   */
  fetchListeningHistory(
    startDate: string,
    endDate: string
  ): Promise<ListeningHistoryEntry[]>;

  /**
   * 感情タグを更新
   * @param trackId 楽曲ID
   * @param emotionTags 感情タグ配列
   */
  updateEmotionTags(trackId: string, emotionTags: EmotionTag[]): Promise<void>;

  /**
   * メモを保存
   * @param trackId 楽曲ID
   * @param memo メモ内容
   */
  saveMemo(trackId: string, memo: string): Promise<void>;

  /**
   * 通知をスケジュール
   * @param params 通知パラメータ
   */
  scheduleNotification(params: NotificationParams): Promise<void>;

  /**
   * データを永続化
   * @param key キー
   * @param value 値（JSONシリアライズ可能）
   */
  saveData(key: string, value: unknown): Promise<void>;

  /**
   * データを取得
   * @param key キー
   */
  getData(key: string): Promise<unknown>;

  /**
   * データを削除
   * @param key キー
   */
  deleteData(key: string): Promise<void>;

  /**
   * Spotifyアプリで楽曲を開く
   * @param trackId Spotify Track ID
   */
  openInSpotify(trackId: string): Promise<void>;

  /**
   * 楽曲を共有
   * @param trackId 楽曲ID
   */
  shareTrack(trackId: string): Promise<void>;
}

/**
 * ブリッジAPIエラー
 */
export class BridgeError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'BridgeError';
  }
}
