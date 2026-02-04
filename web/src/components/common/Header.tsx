/**
 * 共通ヘッダーコンポーネント
 *
 * 全画面で使用するヘッダーです。
 * - 左側: 戻るボタン（任意）またはタイトル
 * - 右側: アクションボタン（任意）
 */

import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  /** タイトルテキスト */
  title: string;
  /** 戻るボタンを表示するか */
  showBackButton?: boolean;
  /** 戻るボタンクリック時のコールバック */
  onBack?: () => void;
  /** 右側アクションボタンのテキスト（省略時は非表示） */
  rightAction?: string;
  /** 右側アクションボタンクリック時のコールバック */
  onRightAction?: () => void;
  /** 右側アクションボタンのスタイル */
  rightActionVariant?: 'default' | 'danger';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  onRightAction,
  rightActionVariant = 'default',
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {showBackButton && (
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
            aria-label="戻る"
          >
            <span className={styles.backArrow}>←</span>
          </button>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.right}>
        {rightAction && (
          <button
            type="button"
            className={`${styles.actionButton} ${
              rightActionVariant === 'danger' ? styles.danger : ''
            }`}
            onClick={onRightAction}
          >
            {rightAction}
          </button>
        )}
      </div>
    </header>
  );
};
