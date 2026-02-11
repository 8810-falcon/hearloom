/**
 * URL解析ユーティリティ
 *
 * 音楽サービスのURLを解析し、埋め込み用URLを生成します。
 */

export type MusicService = 'spotify' | 'apple-music' | 'youtube' | 'youtube-music' | 'unknown';

/**
 * URLから音楽サービスを判定
 */
export const getMusicService = (url: string): MusicService => {
  try {
    const urlObj = new URL(url);
    const host = urlObj.hostname.toLowerCase();

    if (host.includes('spotify.com') || host.includes('spotify.link')) {
      return 'spotify';
    }
    if (host.includes('music.apple.com')) {
      return 'apple-music';
    }
    if (host.includes('music.youtube.com')) {
      return 'youtube-music';
    }
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return 'youtube';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
};

/**
 * YouTube動画IDを抽出
 * 対応パターン:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://music.youtube.com/watch?v=VIDEO_ID
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    // youtu.be 短縮URL
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1) || null;
    }

    // youtube.com または music.youtube.com
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Spotifyトラック/アルバム/プレイリストIDとタイプを抽出
 * 対応パターン:
 * - https://open.spotify.com/track/TRACK_ID
 * - https://open.spotify.com/album/ALBUM_ID
 * - https://open.spotify.com/playlist/PLAYLIST_ID
 */
export const extractSpotifyInfo = (url: string): { type: string; id: string } | null => {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('spotify.com')) {
      return null;
    }

    // パスから type/id を抽出
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const type = pathParts[0]; // track, album, playlist, etc.
      const id = pathParts[1].split('?')[0]; // クエリパラメータを除去
      return { type, id };
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Apple Music URLから埋め込み用パスを生成
 * 対応パターン:
 * - https://music.apple.com/jp/album/album-name/ALBUM_ID?i=TRACK_ID
 */
export const extractAppleMusicPath = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('music.apple.com')) {
      return null;
    }

    // パスとクエリをそのまま使用
    return urlObj.pathname + urlObj.search;
  } catch {
    return null;
  }
};

/**
 * 埋め込み用URLを生成
 */
export const getEmbedUrl = (url: string): string | null => {
  const service = getMusicService(url);

  switch (service) {
    case 'youtube':
    case 'youtube-music': {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return null;
    }

    case 'spotify': {
      const info = extractSpotifyInfo(url);
      if (info) {
        return `https://open.spotify.com/embed/${info.type}/${info.id}?utm_source=generator&theme=0`;
      }
      return null;
    }

    case 'apple-music': {
      const path = extractAppleMusicPath(url);
      if (path) {
        return `https://embed.music.apple.com${path}`;
      }
      return null;
    }

    default:
      return null;
  }
};

/**
 * サービスごとの表示名を取得
 */
export const getServiceDisplayName = (service: MusicService): string => {
  switch (service) {
    case 'spotify':
      return 'Spotify';
    case 'apple-music':
      return 'Apple Music';
    case 'youtube':
      return 'YouTube';
    case 'youtube-music':
      return 'YouTube Music';
    default:
      return '不明';
  }
};
