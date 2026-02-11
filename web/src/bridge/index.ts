/**
 * ブリッジAPI実装
 *
 * ネイティブ（iOS/Android）の機能をWeb UIから呼び出すためのラッパーです。
 * プラットフォームを自動判定し、適切なブリッジAPIを使用します。
 *
 * @see docs/tech/architecture.md
 */

import type {
  HearloomBridge,
  DeviceCapabilities,
  AuthStatus,
  Song,
  EpisodeResult,
  Location,
  MusicRecord,
  MusicRecordInput,
  MusicRecordUpdate,
  MusicRecordFilter,
  BridgeResult,
} from './types';
import { BridgeError } from './types';

// ===== 定数 =====

/** ブリッジAPI呼び出しのタイムアウト（ミリ秒） */
const BRIDGE_TIMEOUT_MS = 5000;

// ===== プラットフォーム判定 =====

const isIOS = (): boolean => {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
};

const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

const isNative = (): boolean => {
  return isIOS() || isAndroid();
};

// ===== ブリッジ呼び出し =====

/**
 * iOS用ブリッジAPI呼び出し
 */
const callIOSBridge = async <T>(
  method: string,
  params?: unknown
): Promise<T> => {
  if (!window.webkit?.messageHandlers?.hearloom) {
    throw new BridgeError(
      'iOS bridge not available',
      'BRIDGE_NOT_AVAILABLE'
    );
  }

  return new Promise((resolve, reject) => {
    const callbackId = Math.random().toString(36).slice(2);

    // コールバックを登録
    (window as any).__bridgeCallbacks = (window as any).__bridgeCallbacks || {};
    (window as any).__bridgeCallbacks[callbackId] = {
      resolve,
      reject,
      timeout: setTimeout(() => {
        delete (window as any).__bridgeCallbacks[callbackId];
        reject(new BridgeError('Bridge call timeout', 'TIMEOUT'));
      }, BRIDGE_TIMEOUT_MS),
    };

    // ネイティブに送信
    window.webkit!.messageHandlers!.hearloom!.postMessage({
      method,
      params,
      callbackId,
    });
  });
};

/**
 * Android用ブリッジAPI呼び出し
 */
const callAndroidBridge = async <T>(
  method: string,
  params?: unknown
): Promise<T> => {
  if (!(window as any).HearloomBridge) {
    throw new BridgeError(
      'Android bridge not available',
      'BRIDGE_NOT_AVAILABLE'
    );
  }

  try {
    const result = (window as any).HearloomBridge[method](
      params ? JSON.stringify(params) : undefined
    );
    return JSON.parse(result);
  } catch (error) {
    throw new BridgeError(
      `Android bridge call failed: ${method}`,
      'BRIDGE_CALL_FAILED',
      error
    );
  }
};

/**
 * ブリッジAPI呼び出し（プラットフォーム自動判定）
 */
const callNative = async <T>(method: string, params?: unknown): Promise<T> => {
  if (isIOS()) {
    return callIOSBridge<T>(method, params);
  } else if (isAndroid()) {
    return callAndroidBridge<T>(method, params);
  } else {
    throw new BridgeError(
      'Native bridge not available in browser',
      'BRIDGE_NOT_AVAILABLE'
    );
  }
};

/**
 * iOSコールバック処理（グローバル関数として公開）
 * ネイティブ側から呼び出されます
 */
(window as any).__bridgeCallback = (
  callbackId: string,
  result: unknown,
  error: string | null
) => {
  const callback = (window as any).__bridgeCallbacks?.[callbackId];
  if (!callback) {
    console.warn(`Callback not found: ${callbackId}`);
    return;
  }

  clearTimeout(callback.timeout);
  delete (window as any).__bridgeCallbacks[callbackId];

  if (error) {
    callback.reject(new BridgeError(error, 'NATIVE_ERROR'));
  } else {
    callback.resolve(result);
  }
};

// ===== モックデータ（ブラウザ開発用） =====

const mockSong: Song = {
  id: 'mock-song-001',
  title: 'Pretender',
  artist: 'Official髭男dism',
  albumName: 'Traveler',
  albumArtUrl: 'https://via.placeholder.com/300x300?text=Album+Art',
  source: 'apple_music',
};

const mockRecords: MusicRecord[] = [
  {
    id: 'mock-record-001',
    song: mockSong,
    mood: 'melancholy',
    situation: '帰り道、ふと聴きたくなった',
    episode: 'この曲は2019年にリリースされ、映画「コンフィデンスマンJP」の主題歌として大ヒット。実は最初ドラマ主題歌のオファーを断ろうとしていたが、脚本を読んで心を動かされたという。',
    createdAt: '2026-02-10T18:30:00+09:00',
  },
  {
    id: 'mock-record-002',
    song: {
      id: 'mock-song-002',
      title: 'KICK BACK',
      artist: '米津玄師',
      albumName: 'KICK BACK',
      albumArtUrl: 'https://via.placeholder.com/300x300?text=Kick+Back',
      source: 'spotify',
    },
    mood: 'excited',
    situation: '朝のランニング中',
    episode: 'アニメ「チェンソーマン」のオープニングテーマ。米津玄師がアニメ主題歌を手がけるのは「海獣の子供」以来。Queenの「Crazy Little Thing Called Love」をサンプリングしている。',
    createdAt: '2026-02-09T07:15:00+09:00',
  },
];

// ===== モック実装（ブラウザ開発用） =====

const createMockBridge = (): HearloomBridge => {
  console.info('[Bridge] Running in browser mode with mock data');

  // モック用のレコード保存（メモリ内）
  let records = [...mockRecords];

  return {
    // 初期化・状態確認
    getDeviceCapabilities: async () => {
      console.log('[Bridge Mock] getDeviceCapabilities');
      return {
        supportsOnDeviceAI: true,
        platform: 'ios' as const,
      };
    },

    getAuthStatus: async () => {
      console.log('[Bridge Mock] getAuthStatus');
      return {
        appleMusic: 'authorized' as const,
        spotify: 'not_authorized' as const,
      };
    },

    // 音楽サービス連携
    connectAppleMusic: async () => {
      console.log('[Bridge Mock] connectAppleMusic');
      return { success: true };
    },

    connectSpotify: async () => {
      console.log('[Bridge Mock] connectSpotify');
      // OAuth認証のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },

    getCurrentSong: async () => {
      console.log('[Bridge Mock] getCurrentSong');
      return mockSong;
    },

    // AI機能
    generateEpisode: async (song: Song) => {
      console.log('[Bridge Mock] generateEpisode', song);
      // AI生成のシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 有名な曲ならエピソードを返す（モック）
      if (song.title === 'Pretender') {
        return {
          found: true,
          episode: 'この曲は2019年にリリースされ、映画「コンフィデンスマンJP」の主題歌として大ヒット。実は最初ドラマ主題歌のオファーを断ろうとしていたが、脚本を読んで心を動かされたという。',
        };
      }

      // 不明な曲
      return {
        found: false,
        errorCode: 'UNKNOWN_SONG' as const,
      };
    },

    // データ永続化
    saveRecord: async (record: MusicRecordInput) => {
      console.log('[Bridge Mock] saveRecord', record);
      const id = `record-${Date.now()}`;
      const newRecord: MusicRecord = {
        ...record,
        id,
        createdAt: new Date().toISOString(),
      };
      records = [newRecord, ...records];
      return { success: true, data: { id } };
    },

    getRecords: async (filter?: MusicRecordFilter) => {
      console.log('[Bridge Mock] getRecords', filter);
      let result = [...records];

      if (filter?.mood) {
        result = result.filter((r) => r.mood === filter.mood);
      }
      if (filter?.limit) {
        result = result.slice(0, filter.limit);
      }

      return result;
    },

    getRecord: async (id: string) => {
      console.log('[Bridge Mock] getRecord', id);
      return records.find((r) => r.id === id) || null;
    },

    updateRecord: async (id: string, updates: MusicRecordUpdate) => {
      console.log('[Bridge Mock] updateRecord', id, updates);
      const index = records.findIndex((r) => r.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Record not found' } };
      }
      records[index] = { ...records[index], ...updates };
      return { success: true };
    },

    deleteRecord: async (id: string) => {
      console.log('[Bridge Mock] deleteRecord', id);
      const index = records.findIndex((r) => r.id === id);
      if (index === -1) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Record not found' } };
      }
      records.splice(index, 1);
      return { success: true };
    },

    // 位置情報
    requestLocationPermission: async () => {
      console.log('[Bridge Mock] requestLocationPermission');
      return { success: true, data: { granted: true } };
    },

    getCurrentLocation: async () => {
      console.log('[Bridge Mock] getCurrentLocation');
      return {
        latitude: 35.6812,
        longitude: 139.7671,
        placeName: '東京駅',
      };
    },

    // UI補助
    triggerHapticFeedback: (type) => {
      console.log('[Bridge Mock] triggerHapticFeedback', type);
    },

    closeApp: () => {
      console.log('[Bridge Mock] closeApp');
      if (window.history.length > 1) {
        window.history.back();
      }
    },
  };
};

// ===== Native実装 =====

const createNativeBridge = (): HearloomBridge => {
  return {
    // 初期化・状態確認
    getDeviceCapabilities: () => callNative<DeviceCapabilities>('getDeviceCapabilities'),
    getAuthStatus: () => callNative<AuthStatus>('getAuthStatus'),

    // 音楽サービス連携
    connectAppleMusic: () => callNative<BridgeResult>('connectAppleMusic'),
    connectSpotify: () => callNative<BridgeResult>('connectSpotify'),
    getCurrentSong: () => callNative<Song | null>('getCurrentSong'),

    // AI機能
    generateEpisode: (song: Song) => callNative<EpisodeResult>('generateEpisode', song),

    // データ永続化
    saveRecord: (record: MusicRecordInput) => callNative<BridgeResult<{ id: string }>>('saveRecord', record),
    getRecords: (filter?: MusicRecordFilter) => callNative<MusicRecord[]>('getRecords', filter),
    getRecord: (id: string) => callNative<MusicRecord | null>('getRecord', { id }),
    updateRecord: (id: string, updates: MusicRecordUpdate) => callNative<BridgeResult>('updateRecord', { id, updates }),
    deleteRecord: (id: string) => callNative<BridgeResult>('deleteRecord', { id }),

    // 位置情報
    requestLocationPermission: () => callNative<BridgeResult<{ granted: boolean }>>('requestLocationPermission'),
    getCurrentLocation: () => callNative<Location | null>('getCurrentLocation'),

    // UI補助
    triggerHapticFeedback: (type) => {
      if (isIOS()) {
        callIOSBridge<void>('triggerHapticFeedback', { type });
      } else if (isAndroid()) {
        (window as any).HearloomBridge?.triggerHapticFeedback(type);
      }
    },

    closeApp: () => {
      if (isIOS()) {
        callIOSBridge<void>('closeApp');
      } else if (isAndroid()) {
        (window as any).HearloomBridge?.closeApp();
      }
    },
  };
};

// ===== エクスポート =====

/**
 * Hearloom ブリッジAPI
 *
 * - ネイティブ環境: iOS/Android のブリッジを使用
 * - ブラウザ環境: モックデータを使用（開発用）
 */
export const bridge: HearloomBridge = isNative()
  ? createNativeBridge()
  : createMockBridge();

/**
 * プラットフォーム情報
 */
export const platform = {
  isIOS,
  isAndroid,
  isNative,
};

// ===== TypeScript型拡張 =====

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        hearloom?: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

// ===== 旧API（後方互換用） =====

/**
 * @deprecated 旧設計のブリッジAPI。新コンセプトでは bridge を使用。
 */
export const hearloomBridge = {
  getSharedUrl: async (): Promise<string | null> => {
    // ブラウザ開発時
    if (!isNative()) {
      const params = new URLSearchParams(window.location.search);
      const url = params.get('url');
      if (url) return url;
      return 'https://spotify.link/mock-track-id';
    }
    // Native
    return callNative<string | null>('getSharedUrl');
  },
  closeApp: () => {
    bridge.closeApp();
  },
};

// Re-export types
export * from './types';
