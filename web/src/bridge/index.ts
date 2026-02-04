/**
 * ブリッジAPI実装
 *
 * ネイティブ（iOS/Android）の機能をWeb UIから呼び出すためのラッパーです。
 * プラットフォームを自動判定し、適切なブリッジAPIを使用します。
 */

import type {
  NativeBridge,
  HearloomBridge,
  Track,
  ListeningHistoryEntry,
  EmotionTag,
  NotificationParams,
} from './types';
import { BridgeError } from './types';

/**
 * プラットフォーム判定
 */
const isIOS = (): boolean => {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
};

const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

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
      }, 30000), // 30秒タイムアウト
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
    // ブラウザでの開発時はモックデータを返す
    console.warn(`Bridge call (${method}) in browser - returning mock data`);
    return Promise.resolve({} as T);
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

/**
 * ネイティブブリッジAPI実装
 */
export const nativeBridge: NativeBridge = {
  fetchRecentlyPlayed: (limit = 50) => {
    return callNative<Track[]>('fetchRecentlyPlayed', { limit });
  },

  fetchListeningHistory: (startDate: string, endDate: string) => {
    return callNative<ListeningHistoryEntry[]>('fetchListeningHistory', {
      startDate,
      endDate,
    });
  },

  updateEmotionTags: (trackId: string, emotionTags: EmotionTag[]) => {
    return callNative<void>('updateEmotionTags', { trackId, emotionTags });
  },

  saveMemo: (trackId: string, memo: string) => {
    return callNative<void>('saveMemo', { trackId, memo });
  },

  scheduleNotification: (params: NotificationParams) => {
    return callNative<void>('scheduleNotification', params);
  },

  saveData: (key: string, value: unknown) => {
    return callNative<void>('saveData', { key, value });
  },

  getData: (key: string) => {
    return callNative<unknown>('getData', { key });
  },

  deleteData: (key: string) => {
    return callNative<void>('deleteData', { key });
  },

  openInSpotify: (trackId: string) => {
    return callNative<void>('openInSpotify', { trackId });
  },

  shareTrack: (trackId: string) => {
    return callNative<void>('shareTrack', { trackId });
  },
};

/**
 * Hearloom MVP用ブリッジAPI実装
 *
 * docs/design/screens.md のブリッジAPI仕様に準拠
 */
export const hearloomBridge: HearloomBridge = {
  getSharedUrl: async () => {
    // ブラウザ開発時はクエリパラメータから取得
    if (!isIOS() && !isAndroid()) {
      const params = new URLSearchParams(window.location.search);
      const url = params.get('url');
      if (url) {
        console.log('Got shared URL from query params:', url);
        return url;
      }
      // 開発用のデフォルトURL
      console.warn('No shared URL found, using mock URL for development');
      return 'https://spotify.link/mock-track-id';
    }

    // iOS: コールバック方式
    if (isIOS()) {
      return callIOSBridge<string | null>('getSharedUrl');
    }

    // Android: 直接呼び出し（同期）
    if (isAndroid()) {
      try {
        const result = (window as any).HearloomBridge.getSharedUrl();
        const data = JSON.parse(result);
        return data.url || null;
      } catch (error) {
        console.error('Android getSharedUrl error:', error);
        return null;
      }
    }

    return null;
  },

  closeApp: () => {
    if (!isIOS() && !isAndroid()) {
      console.log('closeApp called in browser - navigating back');
      // ブラウザでは履歴を戻るか、ウィンドウを閉じる
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
      return;
    }

    // iOS: コールバック方式
    if (isIOS()) {
      callIOSBridge<void>('closeApp');
      return;
    }

    // Android: 直接呼び出し
    if (isAndroid()) {
      (window as any).HearloomBridge.closeApp();
    }
  },
};

/**
 * TypeScript型拡張
 */
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
