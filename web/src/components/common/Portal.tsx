/**
 * Portal コンポーネント
 *
 * 子要素を指定されたDOM要素（デフォルトはdocument.body）に描画します。
 * position: fixed が transform を持つ親要素の影響を受けないようにするために使用。
 */

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  container?: Element | null;
}

export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(children, container || document.body);
};
