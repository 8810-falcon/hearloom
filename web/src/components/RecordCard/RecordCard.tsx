/**
 * 記録カードコンポーネント
 *
 * 一覧画面で使用する記録表示カードです。
 * docs/design/screens.md のワイヤーフレームに準拠:
 * - 気分（アイコン付き）
 * - URL
 * - 状況の一言
 */

import React from 'react';
import type { Record } from '../../types/record';
import { getMoodConfig } from '../../types/record';
import styles from './RecordCard.module.css';

interface RecordCardProps {
  /** 記録データ */
  record: Record;
  /** クリック時のコールバック */
  onClick: () => void;
}

/**
 * URLを短縮表示用にフォーマット
 */
const formatUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // ホスト名 + パスの一部を表示
    const path = urlObj.pathname.substring(0, 15);
    return `${urlObj.host}${path}${path.length >= 15 ? '...' : ''}`;
  } catch {
    // URLパースに失敗した場合はそのまま表示
    return url.length > 30 ? `${url.substring(0, 30)}...` : url;
  }
};

export const RecordCard: React.FC<RecordCardProps> = ({ record, onClick }) => {
  const moodConfig = getMoodConfig(record.mood);

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`${moodConfig.label}の記録: ${record.situation}`}
    >
      <div className={styles.header}>
        <span
          className={styles.mood}
          style={{ backgroundColor: `${moodConfig.color}20` }}
        >
          <span className={styles.moodLabel}>{moodConfig.label}</span>
          <span className={styles.moodEmoji}>{moodConfig.emoji}</span>
        </span>
      </div>
      <div className={styles.url}>{formatUrl(record.url)}</div>
      <div className={styles.situation}>「{record.situation}」</div>
    </button>
  );
};
