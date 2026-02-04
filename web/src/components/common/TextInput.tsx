/**
 * 共通テキスト入力コンポーネント
 *
 * 1行テキスト入力に使用します。
 * WebView環境でのキーボード処理を最適化しています。
 */

import React, { useCallback } from 'react';
import styles from './TextInput.module.css';

interface TextInputProps {
  /** 入力値 */
  value: string;
  /** 値変更時のコールバック */
  onChange: (value: string) => void;
  /** プレースホルダー */
  placeholder?: string;
  /** 入力を無効化するか */
  disabled?: boolean;
  /** 最大文字数 */
  maxLength?: number;
  /** aria-label */
  ariaLabel?: string;
  /** 必須かどうか */
  required?: boolean;
  /** エラー状態かどうか */
  hasError?: boolean;
  /** ID */
  id?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  maxLength,
  ariaLabel,
  required = false,
  hasError = false,
  id,
}) => {
  /**
   * 入力値の変更処理
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  /**
   * Enterキーでの改行を防止
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    },
    []
  );

  const inputClasses = [styles.input, hasError ? styles.error : '']
    .filter(Boolean)
    .join(' ');

  return (
    <input
      id={id}
      type="text"
      className={inputClasses}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      aria-label={ariaLabel}
      required={required}
      aria-invalid={hasError}
      // WebView最適化: ソフトキーボードで「完了」ボタンを表示
      enterKeyHint="done"
    />
  );
};
