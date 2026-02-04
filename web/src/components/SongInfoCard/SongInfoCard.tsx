/**
 * 曲情報カードコンポーネント
 *
 * 共有URLを表示するシンプルなカードです。
 * MVP後の拡張機能として曲名・アーティスト名表示を追加予定。
 */

import React from 'react';
import styles from './SongInfoCard.module.css';

interface SongInfoCardProps {
  /** 共有URL */
  url: string;
}

/**
 * URLを短縮表示用にフォーマット
 */
const formatUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // ホスト名 + パスの一部を表示
    const path = urlObj.pathname.substring(0, 20);
    return `${urlObj.host}${path}${path.length >= 20 ? '...' : ''}`;
  } catch {
    // URLパースに失敗した場合はそのまま表示
    return url.length > 40 ? `${url.substring(0, 40)}...` : url;
  }
};

export const SongInfoCard: React.FC<SongInfoCardProps> = ({ url }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <span className={styles.musicNote}>♪</span>
      </div>
      <div className={styles.content}>
        <span className={styles.label}>URL:</span>
        <span className={styles.url}>{formatUrl(url)}</span>
      </div>
    </div>
  );
};
