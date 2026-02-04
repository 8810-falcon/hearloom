/**
 * 気分選択ボタンコンポーネント
 *
 * docs/design/screens.md の気分選択の設計に準拠:
 * - 未選択状態: 透明背景、グレー枠線
 * - 選択状態: 各気分の背景色、太枠線
 * - タッチフィードバック: タップ時に軽いスケールアニメーション（0.95倍）
 */

import React from 'react';
import type { MoodConfig } from '../../types/record';
import styles from './MoodButton.module.css';

interface MoodButtonProps {
  /** 気分設定 */
  mood: MoodConfig;
  /** 選択されているか */
  isSelected: boolean;
  /** クリック時のコールバック */
  onClick: () => void;
}

export const MoodButton: React.FC<MoodButtonProps> = ({
  mood,
  isSelected,
  onClick,
}) => {
  const buttonStyle = isSelected
    ? {
        backgroundColor: mood.color,
        borderColor: mood.color,
      }
    : undefined;

  return (
    <button
      type="button"
      className={`${styles.button} ${isSelected ? styles.selected : ''}`}
      style={buttonStyle}
      onClick={onClick}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${mood.label}を選択`}
    >
      <span className={styles.label}>{mood.label}</span>
      <span className={styles.emoji}>{mood.emoji}</span>
    </button>
  );
};
