/**
 * ページ遷移トランジションコンポーネント
 *
 * 画面間の遷移時にスムーズなアニメーションを提供します。
 * 「Midnight Groove」デザインに合わせた、フェードとスライドの組み合わせ。
 *
 * アニメーション:
 * - 進む時（一覧→編集）: フェードイン + 右からスライド
 * - 戻る時（編集→一覧）: フェードイン + 左からスライド
 *
 * パフォーマンス考慮:
 * - transform と opacity のみ使用（GPU アクセラレーション）
 * - will-change で最適化ヒントを提供
 */

import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * パス階層の深さを取得
 * / = 0, /edit/xxx = 1, etc.
 */
const getPathDepth = (pathname: string): number => {
  const segments = pathname.split('/').filter(Boolean);
  return segments.length;
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const prevPathnameRef = useRef(location.pathname);

  useEffect(() => {
    // 遷移方向を判定（パスの深さで判定）
    const prevDepth = getPathDepth(prevPathnameRef.current);
    const currentDepth = getPathDepth(location.pathname);

    if (currentDepth > prevDepth) {
      setDirection('forward');
    } else if (currentDepth < prevDepth) {
      setDirection('backward');
    }
    // 同じ深さの場合は前の方向を維持

    prevPathnameRef.current = location.pathname;

    // まずアニメーション開始状態にリセット
    setIsVisible(false);

    // 次のフレームでアニメーション開始
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  const transitionClass = isVisible
    ? styles.visible
    : direction === 'forward'
      ? styles.enterForward
      : styles.enterBackward;

  return (
    <div className={`${styles.container} ${transitionClass}`}>
      {children}
    </div>
  );
};
