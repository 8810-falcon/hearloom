/**
 * 気分選択ボタンコンポーネント
 *
 * docs/design/screens.md の気分選択の設計に準拠:
 * - 未選択状態: ダーク背景、微細な枠線
 * - 選択状態: 各気分のグロウ効果
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
  // mood.idに基づいてCSSクラスを取得
  const moodClass = styles[mood.id] || '';

  return (
    <button
      type="button"
      className={`${styles.button} ${isSelected ? `${styles.selected} ${moodClass}` : ''}`}
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
