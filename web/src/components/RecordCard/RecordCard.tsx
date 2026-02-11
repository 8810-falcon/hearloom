/**
 * 記録カードコンポーネント
 *
 * 一覧画面で使用する記録表示カードです。
 * 新コンセプト（Song型ベース、MusicRecord型）に対応。
 * - 気分（アイコン付き）
 * - 曲名・アーティスト名
 * - 一言メモ
 */

import React from 'react';
import type { MusicRecord } from '../../bridge/types';
import { getMoodConfig } from '../../bridge/types';
import styles from './RecordCard.module.css';

interface RecordCardProps {
  /** 記録データ */
  record: MusicRecord;
  /** クリック時のコールバック */
  onClick: () => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record, onClick }) => {
  const moodConfig = getMoodConfig(record.mood);
  const moodClass = styles[record.mood] || '';
  const sourceLabel = record.song.source === 'apple_music' ? 'Apple Music' : 'Spotify';
  const sourceClass = record.song.source === 'apple_music' ? styles.appleMusic : styles.spotify;

  return (
    <button
      type="button"
      className={`${styles.card} ${moodClass}`}
      onClick={onClick}
      aria-label={`${moodConfig.label}の記録: ${record.song.title}`}
    >
      {/* アルバムアートサムネイル */}
      <div className={styles.thumbnail}>
        {record.song.albumArtUrl ? (
          <img
            src={record.song.albumArtUrl}
            alt=""
            className={styles.albumArt}
          />
        ) : (
          <div className={styles.albumArtPlaceholder}>♪</div>
        )}
      </div>

      {/* 情報エリア */}
      <div className={styles.info}>
        <div className={styles.header}>
          <span className={`${styles.mood} ${moodClass}`}>
            <span className={styles.moodLabel}>{moodConfig.label}</span>
            <span className={styles.moodEmoji}>{moodConfig.emoji}</span>
          </span>
          <span className={`${styles.serviceBadge} ${sourceClass}`}>
            {sourceLabel}
          </span>
        </div>

        <div className={styles.songInfo}>
          <span className={styles.songTitle}>{record.song.title}</span>
          <span className={styles.songArtist}>{record.song.artist}</span>
        </div>

        {record.situation && (
          <div className={styles.situation}>{record.situation}</div>
        )}
      </div>
    </button>
  );
};
