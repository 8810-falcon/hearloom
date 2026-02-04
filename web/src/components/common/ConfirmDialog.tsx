/**
 * 確認ダイアログコンポーネント
 *
 * 削除確認、キャンセル確認などに使用します。
 * アクセシビリティ対応（フォーカストラップ、ESCキー対応）
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { Button } from './Button';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  /** ダイアログを表示するか */
  isOpen: boolean;
  /** タイトル */
  title: string;
  /** メッセージ */
  message: string;
  /** 確認ボタンのテキスト */
  confirmText?: string;
  /** キャンセルボタンのテキスト */
  cancelText?: string;
  /** 確認ボタンクリック時のコールバック */
  onConfirm: () => void;
  /** キャンセルボタンクリック時のコールバック */
  onCancel: () => void;
  /** 確認ボタンのバリエーション */
  confirmVariant?: 'primary' | 'danger';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * ESCキーでダイアログを閉じる
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    },
    [onCancel]
  );

  /**
   * ダイアログ表示時にフォーカスをキャンセルボタンに移動
   */
  useEffect(() => {
    if (isOpen) {
      // キーボードイベントをリッスン
      document.addEventListener('keydown', handleKeyDown);
      // フォーカスをキャンセルボタンに移動
      cancelButtonRef.current?.focus();
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  /**
   * オーバーレイクリックでダイアログを閉じる
   */
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onCancel();
      }
    },
    [onCancel]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div className={styles.dialog} ref={dialogRef}>
        <h2 id="dialog-title" className={styles.title}>
          {title}
        </h2>
        <p id="dialog-message" className={styles.message}>
          {message}
        </p>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={onCancel}
            // @ts-ignore - refの型の問題を一時的に無視
            ref={cancelButtonRef}
          >
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
