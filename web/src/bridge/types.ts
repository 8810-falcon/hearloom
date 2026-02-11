/**
 * ブリッジAPI型定義
 *
 * ネイティブ（iOS/Android）が提供するAPIの型定義です。
 * ネイティブ側の実装と必ず一致させてください。
 *
 * @see docs/tech/architecture.md
 */

// ===== 基本型 =====

/**
 * ブリッジAPI共通レスポンス
 */
export interface BridgeResult<T = void> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ===== デバイス・認証 =====

/**
 * デバイス機能情報
 */
export interface DeviceCapabilities {
  /** オンデバイスAI（Apple Intelligence / Gemini Nano）対応 */
  supportsOnDeviceAI: boolean;
  /** プラットフォーム */
  platform: 'ios' | 'android';
}

/**
 * 音楽サービス認証状態
 */
export interface AuthStatus {
  /** Apple Music認証状態（iOS only） */
  appleMusic: 'authorized' | 'denied' | 'not_determined';
  /** Spotify認証状態 */
  spotify: 'authorized' | 'not_authorized';
}

// ===== 曲情報 =====

/**
 * 曲情報
 */
export interface Song {
  /** 曲ID（プラットフォーム固有） */
  id: string;
  /** 曲名 */
  title: string;
  /** アーティスト名 */
  artist: string;
  /** アルバム名 */
  albumName?: string;
  /** アルバムアートURL */
  albumArtUrl?: string;
  /** 音楽サービス */
  source: 'apple_music' | 'spotify';
}

// ===== エピソード =====

/**
 * エピソード生成結果
 */
export interface EpisodeResult {
  /** エピソードが見つかったか */
  found: boolean;
  /** エピソード本文 */
  episode?: string;
  /** エラーコード（found=false の場合） */
  errorCode?: 'UNSUPPORTED_DEVICE' | 'MODEL_NOT_READY' | 'UNKNOWN_SONG' | 'TIMEOUT';
}

// ===== 位置情報 =====

/**
 * 位置情報
 */
export interface Location {
  /** 緯度 */
  latitude: number;
  /** 経度 */
  longitude: number;
  /** 場所名（逆ジオコーディング結果） */
  placeName?: string;
}

// ===== 記録データ =====

/**
 * 気分タイプ
 */
export type MoodType =
  | 'excited'    // 高揚
  | 'calm'       // 穏やか
  | 'melancholy' // 切ない
  | 'focused'    // 集中
  | 'nostalgic'  // 懐かし
  | 'other';     // その他

/**
 * 気分の設定情報
 */
export interface MoodConfig {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
}

/**
 * 気分設定一覧
 */
export const MOOD_CONFIGS: MoodConfig[] = [
  { id: 'excited', label: '高揚', emoji: '^_^', color: '#FFA726' },
  { id: 'calm', label: '穏やか', emoji: '-_-', color: '#66BB6A' },
  { id: 'melancholy', label: '切ない', emoji: ';_;', color: '#42A5F5' },
  { id: 'focused', label: '集中', emoji: 'o_o', color: '#AB47BC' },
  { id: 'nostalgic', label: '懐かし', emoji: 'v_v', color: '#8D6E63' },
  { id: 'other', label: 'その他', emoji: '...', color: '#BDBDBD' },
];

/**
 * MoodTypeからMoodConfigを取得
 */
export const getMoodConfig = (moodType: MoodType): MoodConfig => {
  const config = MOOD_CONFIGS.find((c) => c.id === moodType);
  if (!config) {
    throw new Error(`Unknown mood type: ${moodType}`);
  }
  return config;
};

/**
 * 記録データ
 * NOTE: TypeScript組み込みのRecord型と衝突するためMusicRecordに命名
 */
export interface MusicRecord {
  /** 記録ID（UUID） */
  id: string;
  /** 曲情報 */
  song: Song;
  /** 気分 */
  mood: MoodType;
  /** 一言メモ（任意） */
  situation?: string;
  /** エピソード（AI生成） */
  episode?: string;
  /** 位置情報（オプトイン） */
  location?: Location;
  /** 記録日時（ISO 8601形式） */
  createdAt: string;
}

/**
 * 記録作成時の入力データ
 */
export type MusicRecordInput = Omit<MusicRecord, 'id' | 'createdAt'>;

/**
 * 記録更新時の入力データ
 */
export type MusicRecordUpdate = Partial<Pick<MusicRecord, 'mood' | 'situation'>>;

/**
 * 記録フィルタ
 */
export interface MusicRecordFilter {
  /** 開始日時（ISO 8601形式） */
  startDate?: string;
  /** 終了日時（ISO 8601形式） */
  endDate?: string;
  /** 気分でフィルタ */
  mood?: MoodType;
  /** 取得件数上限 */
  limit?: number;
  /** オフセット */
  offset?: number;
}

// ===== ブリッジAPI =====

/**
 * Hearloom ブリッジAPI
 *
 * @see docs/tech/architecture.md
 */
export interface HearloomBridge {
  // ===== 初期化・状態確認 =====

  /**
   * デバイス機能を取得
   * - AI対応判定
   * - プラットフォーム判定
   */
  getDeviceCapabilities(): Promise<DeviceCapabilities>;

  /**
   * 音楽サービスの認証状態を取得
   */
  getAuthStatus(): Promise<AuthStatus>;

  // ===== 音楽サービス連携 =====

  /**
   * Apple Music連携（iOS only）
   * - メディアライブラリアクセス許可をリクエスト
   */
  connectAppleMusic(): Promise<BridgeResult>;

  /**
   * Spotify連携
   * - OAuth認証フローを開始
   */
  connectSpotify(): Promise<BridgeResult>;

  /**
   * 現在再生中の曲を取得
   * - 再生中でない場合は null
   */
  getCurrentSong(): Promise<Song | null>;

  // ===== AI機能 =====

  /**
   * エピソード生成（オンデバイスAI）
   * - 対応デバイスのみ
   * - 見つからない場合は found: false
   */
  generateEpisode(song: Song): Promise<EpisodeResult>;

  // ===== データ永続化 =====

  /**
   * 記録を保存
   */
  saveRecord(record: MusicRecordInput): Promise<BridgeResult<{ id: string }>>;

  /**
   * 記録一覧を取得
   */
  getRecords(filter?: MusicRecordFilter): Promise<MusicRecord[]>;

  /**
   * 記録を取得（単一）
   */
  getRecord(id: string): Promise<MusicRecord | null>;

  /**
   * 記録を更新
   */
  updateRecord(id: string, updates: MusicRecordUpdate): Promise<BridgeResult>;

  /**
   * 記録を削除
   */
  deleteRecord(id: string): Promise<BridgeResult>;

  // ===== 位置情報 =====

  /**
   * 位置情報の権限をリクエスト
   */
  requestLocationPermission(): Promise<BridgeResult<{ granted: boolean }>>;

  /**
   * 現在地を取得
   */
  getCurrentLocation(): Promise<Location | null>;

  // ===== UI補助 =====

  /**
   * ハプティクスフィードバック
   */
  triggerHapticFeedback(type: 'light' | 'medium' | 'heavy'): void;

  /**
   * アプリを閉じる
   */
  closeApp(): void;
}

// ===== エラー =====

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

// ===== 旧API（後方互換用、将来削除予定） =====

/**
 * @deprecated 旧設計の型定義。新コンセプトでは使用しない。
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArtUrl?: string;
  playedAt: string;
  durationMs: number;
  audioFeatures?: AudioFeatures;
}

/**
 * @deprecated 旧設計の型定義。新コンセプトでは使用しない。
 */
export interface AudioFeatures {
  valence: number;
  energy: number;
  danceability: number;
  acousticness: number;
  tempo: number;
}

/**
 * @deprecated 旧設計の型定義。新コンセプトでは使用しない。
 */
export interface EmotionTag {
  id: string;
  label: string;
  color: string;
}

/**
 * @deprecated 旧設計の型定義。新コンセプトでは使用しない。
 */
export interface ListeningHistoryEntry {
  track: Track;
  emotionTags: EmotionTag[];
  memo?: string;
  isManuallyEdited: boolean;
}

/**
 * @deprecated 旧設計の型定義。新コンセプトでは使用しない。
 */
export interface NotificationParams {
  title: string;
  body: string;
  scheduledAt?: string;
  data?: Record<string, unknown>;
}

/**
 * @deprecated 旧設計のAPI。新コンセプトでは HearloomBridge を使用。
 */
export interface NativeBridge {
  fetchRecentlyPlayed(limit?: number): Promise<Track[]>;
  fetchListeningHistory(startDate: string, endDate: string): Promise<ListeningHistoryEntry[]>;
  updateEmotionTags(trackId: string, emotionTags: EmotionTag[]): Promise<void>;
  saveMemo(trackId: string, memo: string): Promise<void>;
  scheduleNotification(params: NotificationParams): Promise<void>;
  saveData(key: string, value: unknown): Promise<void>;
  getData(key: string): Promise<unknown>;
  deleteData(key: string): Promise<void>;
  openInSpotify(trackId: string): Promise<void>;
  shareTrack(trackId: string): Promise<void>;
}
