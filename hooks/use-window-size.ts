'use client';

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // 初期値を設定
    handleResize();

    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function useIsMobile(breakpoint: number = 768): boolean {
  const { width } = useWindowSize();
  return width > 0 && width < breakpoint;
}

export function useIsTablet(minBreakpoint: number = 768, maxBreakpoint: number = 1024): boolean {
  const { width } = useWindowSize();
  return width >= minBreakpoint && width < maxBreakpoint;
}

export function useIsDesktop(breakpoint: number = 1024): boolean {
  const { width } = useWindowSize();
  return width >= breakpoint;
}