// Responsive utilities for Trello-like weekly routine component
import { useEffect, useState } from 'react';
import { LAYOUT_CONFIG } from '../constants/trello-config';

// Hook to detect current screen size and layout mode
export function useResponsiveLayout() {
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      if (width >= 1024) {
        setLayoutMode('desktop');
      } else if (width >= 768) {
        setLayoutMode('tablet');
      } else {
        setLayoutMode('mobile');
      }
    };

    // Initial check
    updateLayout();

    // Add resize listener
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return {
    layoutMode,
    screenWidth,
    isDesktop: layoutMode === 'desktop',
    isTablet: layoutMode === 'tablet',
    isMobile: layoutMode === 'mobile',
    config: LAYOUT_CONFIG[layoutMode],
  };
}

// Generate responsive grid classes based on layout mode
export function getResponsiveGridClasses(layoutMode: 'desktop' | 'tablet' | 'mobile') {
  switch (layoutMode) {
    case 'desktop':
      return 'grid grid-cols-7 gap-4 min-h-[400px]';
    case 'tablet':
      return 'grid grid-cols-2 gap-4 min-h-[200px]';
    case 'mobile':
      return 'flex flex-col space-y-4';
    default:
      return 'grid grid-cols-7 gap-4 min-h-[400px]';
  }
}

// Get card width classes based on layout mode
export function getCardWidthClasses(layoutMode: 'desktop' | 'tablet' | 'mobile') {
  switch (layoutMode) {
    case 'desktop':
      return 'min-w-[200px] max-w-[280px]';
    case 'tablet':
      return 'w-full min-h-[200px]';
    case 'mobile':
      return 'w-full';
    default:
      return 'min-w-[200px] max-w-[280px]';
  }
}

// Calculate optimal number of visible muscle group badges based on screen size
export function getOptimalBadgeCount(layoutMode: 'desktop' | 'tablet' | 'mobile') {
  switch (layoutMode) {
    case 'desktop':
      return 3;
    case 'tablet':
      return 4;
    case 'mobile':
      return 2;
    default:
      return 3;
  }
}

// Get touch-friendly sizes for mobile interactions
export function getTouchTargetClasses(layoutMode: 'desktop' | 'tablet' | 'mobile') {
  const isTouchDevice = layoutMode === 'mobile' || layoutMode === 'tablet';

  return {
    button: isTouchDevice ? 'min-h-[44px] min-w-[44px]' : 'h-8 w-8',
    contextMenuTrigger: isTouchDevice ? 'h-10 w-10' : 'h-6 w-6',
    dragHandle: isTouchDevice ? 'p-2' : 'p-1',
  };
}

// Calculate container padding based on screen size
export function getContainerPadding(layoutMode: 'desktop' | 'tablet' | 'mobile') {
  switch (layoutMode) {
    case 'desktop':
      return 'p-6';
    case 'tablet':
      return 'p-4';
    case 'mobile':
      return 'p-3';
    default:
      return 'p-6';
  }
}

// Generate responsive text size classes
export function getResponsiveTextClasses(layoutMode: 'desktop' | 'tablet' | 'mobile') {
  return {
    title: layoutMode === 'mobile' ? 'text-sm' : 'text-base',
    subtitle: layoutMode === 'mobile' ? 'text-xs' : 'text-sm',
    badge: layoutMode === 'mobile' ? 'text-xs' : 'text-xs',
    stats: layoutMode === 'mobile' ? 'text-xs' : 'text-sm',
  };
}

// Hook for optimizing drag and drop on mobile
export function useMobileDragOptimization() {
  const { isMobile } = useResponsiveLayout();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isMobile && isDragging) {
      // Disable text selection and context menus during drag on mobile
      document.body.style.userSelect = 'none';
      (document.body.style as unknown as Record<string, string>).webkitUserSelect = 'none';
      (document.body.style as unknown as Record<string, string>).webkitTouchCallout = 'none';
    } else {
      // Re-enable text selection
      document.body.style.userSelect = '';
      (document.body.style as unknown as Record<string, string>).webkitUserSelect = '';
      (document.body.style as unknown as Record<string, string>).webkitTouchCallout = '';
    }

    return () => {
      // Cleanup on unmount
      document.body.style.userSelect = '';
      (document.body.style as unknown as Record<string, string>).webkitUserSelect = '';
      (document.body.style as unknown as Record<string, string>).webkitTouchCallout = '';
    };
  }, [isMobile, isDragging]);

  return {
    setIsDragging,
    shouldOptimizeForTouch: isMobile,
  };
}

// Calculate column layout for different screen sizes
export function calculateColumnLayout(totalColumns: number, layoutMode: 'desktop' | 'tablet' | 'mobile') {
  switch (layoutMode) {
    case 'desktop':
      return {
        columns: totalColumns,
        rows: 1,
        arrangement: 'horizontal',
      };
    case 'tablet':
      return {
        columns: 2,
        rows: Math.ceil(totalColumns / 2),
        arrangement: 'grid',
      };
    case 'mobile':
      return {
        columns: 1,
        rows: totalColumns,
        arrangement: 'vertical',
      };
    default:
      return {
        columns: totalColumns,
        rows: 1,
        arrangement: 'horizontal',
      };
  }
}

// Generate media query classes for responsive design
export function getMediaQueryClasses(desktopClasses: string, tabletClasses: string, mobileClasses: string) {
  return `${mobileClasses} md:${tabletClasses} lg:${desktopClasses}`;
}

// Hook to detect if reduced motion is preferred
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Get animation classes that respect reduced motion preference
function getAnimationClassesInternal(prefersReducedMotion: boolean, baseClasses: string, reducedMotionClasses: string) {
  return prefersReducedMotion ? reducedMotionClasses : baseClasses;
}

export function useAnimationClasses(baseClasses: string, reducedMotionClasses: string) {
  const prefersReducedMotion = useReducedMotion();
  return getAnimationClassesInternal(prefersReducedMotion, baseClasses, reducedMotionClasses);
}

// Calculate optimal viewport height for mobile layouts
export function getOptimalMobileHeight() {
  if (typeof window === 'undefined') return '100vh';

  // Account for mobile browser chrome
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.clientHeight;

  // Use the smaller value to avoid content being hidden behind browser UI
  const optimalHeight = Math.min(viewportHeight, documentHeight);

  return `${optimalHeight}px`;
}

// Utility to check if device supports hover
export function supportsHover() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover)').matches;
}

// Generate hover classes only if device supports hover
export function getConditionalHoverClasses(hoverClasses: string) {
  return supportsHover() ? hoverClasses : '';
}
