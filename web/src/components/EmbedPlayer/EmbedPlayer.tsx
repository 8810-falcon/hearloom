/**
 * 埋め込みプレーヤーコンポーネント
 *
 * 音楽サービスの公式埋め込みプレーヤーを表示します。
 * Spotify, Apple Music, YouTube に対応。
 */

import React, { useState, useMemo } from 'react';
import { getEmbedUrl, getMusicService, getServiceDisplayName } from '../../utils/urlUtils';
import type { MusicService } from '../../utils/urlUtils';
import styles from './EmbedPlayer.module.css';

interface EmbedPlayerProps {
  /** 音楽サービスの共有URL */
  url: string;
  /** コンパクト表示（カード内での使用向け） */
  compact?: boolean;
}

/**
 * サービスごとのiframeサイズ設定
 */
const getIframeConfig = (service: MusicService, compact: boolean) => {
  if (compact) {
    // コンパクトモード: カード内表示用
    return {
      spotify: { width: '100%', height: '80' },
      'apple-music': { width: '100%', height: '150' },
      youtube: { width: '100%', height: '120' },
      'youtube-music': { width: '100%', height: '120' },
      unknown: { width: '100%', height: '80' },
    }[service];
  }

  // 通常モード
  return {
    spotify: { width: '100%', height: '152' },
    'apple-music': { width: '100%', height: '175' },
    youtube: { width: '100%', height: '200' },
    'youtube-music': { width: '100%', height: '200' },
    unknown: { width: '100%', height: '152' },
  }[service];
};

export const EmbedPlayer: React.FC<EmbedPlayerProps> = ({ url, compact = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const service = useMemo(() => getMusicService(url), [url]);
  const embedUrl = useMemo(() => getEmbedUrl(url), [url]);
  const iframeConfig = useMemo(() => getIframeConfig(service, compact), [service, compact]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // 埋め込みURL生成失敗時
  if (!embedUrl || hasError) {
    return (
      <div className={`${styles.fallback} ${compact ? styles.compact : ''}`}>
        <div className={styles.serviceIcon} data-service={service}>
          {service === 'spotify' && '♪'}
          {service === 'apple-music' && '♫'}
          {service === 'youtube' && '▶'}
          {service === 'youtube-music' && '▶'}
          {service === 'unknown' && '🔗'}
        </div>
        <div className={styles.fallbackText}>
          <span className={styles.serviceName}>{getServiceDisplayName(service)}</span>
          <span className={styles.urlText}>{url}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`} data-service={service}>
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.shimmer} />
        </div>
      )}
      <iframe
        className={styles.iframe}
        src={embedUrl}
        width={iframeConfig.width}
        height={iframeConfig.height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        title={`${getServiceDisplayName(service)} Player`}
      />
    </div>
  );
};
