/**
 * 共通ボタンコンポーネント
 *
 * プライマリボタン、セカンダリボタンなどのバリエーションに対応
 */

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  /** ボタンテキスト */
  children: React.ReactNode;
  /** クリック時のコールバック */
  onClick?: () => void;
  /** ボタンのバリエーション */
  variant?: 'primary' | 'secondary' | 'danger';
  /** ボタンを無効化するか */
  disabled?: boolean;
  /** ボタンのタイプ */
  type?: 'button' | 'submit';
  /** 全幅で表示するか */
  fullWidth?: boolean;
  /** 追加のクラス名 */
  className?: string;
  /** aria-label */
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  fullWidth = false,
  className = '',
  ariaLabel,
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
