/**
 * 気分選択コンポーネント
 *
 * docs/design/screens.md の気分選択の設計に準拠:
 * - 6つのボタン（単一選択、必須）
 * - 2行x3列でバランスよく配置
 * - role="radiogroup" でアクセシビリティ対応
 */

import React from 'react';
import { MoodButton } from './MoodButton';
import { MOOD_CONFIGS, type MoodType } from '../../types/record';
import styles from './MoodSelector.module.css';

interface MoodSelectorProps {
  /** 選択中の気分 */
  selectedMood: MoodType | null;
  /** 気分選択時のコールバック */
  onSelect: (mood: MoodType) => void;
  /** ラベルテキスト */
  label?: string;
  /** 必須かどうか */
  required?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelect,
  label = '今の気分は？',
  required = false,
}) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>
        {label}
        {required && <span className={styles.required}> *必須</span>}
      </span>
      <div className={styles.grid} role="radiogroup" aria-label={label}>
        {MOOD_CONFIGS.map((mood) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onClick={() => onSelect(mood.id)}
          />
        ))}
      </div>
    </div>
  );
};
