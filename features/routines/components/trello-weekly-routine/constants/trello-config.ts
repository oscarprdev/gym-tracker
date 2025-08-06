// Configuration constants for Trello-like weekly routine component

// Animation and transition configurations
export const ANIMATION_CONFIG = {
  // Drag and drop durations
  dragDuration: 200,
  dropDuration: 150,

  // CSS transition classes
  cardHover: 'transition-all duration-200 ease-out',
  columnHighlight: 'transition-colors duration-200 ease-in-out',
  fadeIn: 'transition-opacity duration-150 ease-in',
  slideIn: 'transition-transform duration-200 ease-out',

  // Transform effects
  dragRotation: 'rotate(5deg)',
  dragScale: 'scale(1.02)',
  hoverScale: 'scale(1.01)',
} as const;

// Layout breakpoints and responsive configuration
export const LAYOUT_CONFIG = {
  breakpoints: {
    mobile: '0px',
    tablet: '768px',
    desktop: '1024px',
  },

  desktop: {
    orientation: 'horizontal' as const,
    columns: 7,
    cardMinWidth: '200px',
    cardMaxWidth: '280px',
    gap: '1rem',
    minHeight: '400px',
  },

  tablet: {
    orientation: 'grid' as const,
    columns: 2,
    cardMinWidth: '100%',
    gap: '1rem',
    minHeight: '200px',
  },

  mobile: {
    orientation: 'vertical' as const,
    columns: 1,
    cardFullWidth: true,
    gap: '1rem',
    minHeight: '120px',
  },
} as const;

// Drag and drop configuration
export const DRAG_CONFIG = {
  // Visual feedback
  dragPreviewStyles: {
    transform: 'rotate(5deg) scale(1.02)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    zIndex: 9999,
    opacity: 0.9,
  },

  // Drop zone styles
  dropZoneActive: {
    backgroundColor: 'rgb(239 246 255)', // blue-50
    border: '2px dashed rgb(96 165 250)', // blue-400
  },

  dropZoneInvalid: {
    backgroundColor: 'rgb(254 242 242)', // red-50
    border: '2px dashed rgb(248 113 113)', // red-400
  },

  // Performance optimizations
  enableOptimisticUpdates: true,
  debounceDelay: 100,
} as const;

// Context menu configuration
export const CONTEXT_MENU_CONFIG = {
  maxWidth: '200px',
  offsetFromTrigger: 8,
  animationDuration: 150,

  actions: {
    edit: {
      priority: 1,
      category: 'primary',
    },
    duplicate: {
      priority: 2,
      category: 'primary',
    },
    move: {
      priority: 3,
      category: 'secondary',
    },
    delete: {
      priority: 4,
      category: 'destructive',
    },
  },
} as const;

// Performance optimization settings
export const PERFORMANCE_CONFIG = {
  // Virtual scrolling thresholds
  virtualScrollThreshold: 50,

  // Memoization settings
  enableMemoization: true,
  memoizationKeyFactors: ['id', 'name', 'dayOfWeek', 'exercises.length'],

  // Lazy loading
  lazyLoadImages: true,
  intersectionObserverMargin: '50px',

  // Animation performance
  useTransform3d: true,
  enableHardwareAcceleration: true,
  reduceMotionRespect: true,
} as const;

// Accessibility configuration
export const ACCESSIBILITY_CONFIG = {
  // ARIA labels and roles
  dragHandleLabel: 'Drag to move workout',
  dropZoneLabel: 'Drop workout here',
  contextMenuLabel: 'Workout options',

  // Keyboard navigation
  enableKeyboardNavigation: true,
  keyboardShortcuts: {
    edit: 'Enter',
    delete: 'Delete',
    duplicate: 'Ctrl+D',
    contextMenu: 'Space',
  },

  // Focus management
  trapFocusInModals: true,
  restoreFocusOnClose: true,
  highlightFocusedElements: true,

  // Screen reader support
  announceStateChanges: true,
  provideLiveUpdates: true,
} as const;

// Theme and styling configuration
export const THEME_CONFIG = {
  // Color palette for light mode
  light: {
    background: 'bg-slate-100',
    column: 'bg-slate-200',
    card: 'bg-white',
    cardHover: 'hover:bg-slate-50',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-400',
    },
    border: {
      default: 'border-gray-200',
      hover: 'border-gray-300',
      focus: 'border-blue-500',
    },
  },

  // Color palette for dark mode
  dark: {
    background: 'bg-slate-900',
    column: 'bg-slate-800',
    card: 'bg-slate-700',
    cardHover: 'hover:bg-slate-600',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      muted: 'text-gray-500',
    },
    border: {
      default: 'border-gray-700',
      hover: 'border-gray-600',
      focus: 'border-blue-400',
    },
  },

  // Elevation and shadows
  shadows: {
    card: 'shadow-sm',
    cardHover: 'shadow-md',
    drag: 'shadow-lg',
    contextMenu: 'shadow-xl',
  },

  // Border radius
  borderRadius: {
    card: 'rounded-lg',
    badge: 'rounded-full',
    button: 'rounded-md',
  },
} as const;

// Validation and constraints
export const VALIDATION_CONFIG = {
  workout: {
    nameMinLength: 1,
    nameMaxLength: 50,
    maxExercisesPerWorkout: 20,
  },

  routine: {
    nameMinLength: 1,
    nameMaxLength: 100,
    maxWorkoutsPerDay: 5,
    maxTotalWorkouts: 35, // 5 per day * 7 days
  },

  muscleGroups: {
    maxDisplayed: 3,
    maxTotal: 10,
  },
} as const;

// Export all configurations as a single object for convenience
export const TRELLO_CONFIG = {
  animation: ANIMATION_CONFIG,
  layout: LAYOUT_CONFIG,
  drag: DRAG_CONFIG,
  contextMenu: CONTEXT_MENU_CONFIG,
  performance: PERFORMANCE_CONFIG,
  accessibility: ACCESSIBILITY_CONFIG,
  theme: THEME_CONFIG,
  validation: VALIDATION_CONFIG,
} as const;
