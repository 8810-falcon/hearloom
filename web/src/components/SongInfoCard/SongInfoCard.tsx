/**
 * 曲情報カードコンポーネント
 *
 * 再生中の曲情報（アルバムアート、曲名、アーティスト名）を表示します。
 */

import React from 'react';
import type { Song } from '../../bridge/types';
import styles from './SongInfoCard.module.css';

interface SongInfoCardProps {
  /** 曲情報 */
  song: Song;
}

export const SongInfoCard: React.FC<SongInfoCardProps> = ({ song }) => {
  const sourceLabel = song.source === 'apple_music' ? 'Apple Music' : 'Spotify';

  return (
    <div className={styles.card}>
      {/* アルバムアート */}
      <div className={styles.albumArtContainer}>
        {song.albumArtUrl ? (
          <img
            src={song.albumArtUrl}
            alt={`${song.albumName || song.title} のアルバムアート`}
            className={styles.albumArt}
          />
        ) : (
          <div className={styles.albumArtPlaceholder}>
            <span className={styles.musicIcon}>♪</span>
          </div>
        )}
      </div>

      {/* 曲情報 */}
      <div className={styles.info}>
        <h2 className={styles.title}>{song.title}</h2>
        <p className={styles.artist}>{song.artist}</p>
        {song.albumName && (
          <p className={styles.album}>{song.albumName}</p>
        )}
        <span className={styles.source}>{sourceLabel}</span>
      </div>
    </div>
  );
};
