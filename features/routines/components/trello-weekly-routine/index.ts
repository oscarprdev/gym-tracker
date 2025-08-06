export { TrelloWeeklyRoutine } from './trello-weekly-routine';
export { TrelloDayColumn } from './trello-weekly-routine-day-column';
export { TrelloWorkoutCard, TrelloWorkoutCardEmpty } from './trello-weekly-routine-workout-card';
export { MuscleGroupBadge, MuscleGroupBadgeList } from './trello-weekly-routine-muscle-group-badge';
export { WorkoutContextMenu } from './trello-weekly-routine-workout-context-menu';

export type * from './types';

export {
  getMuscleGroupConfig,
  extractMuscleGroups,
  getMuscleGroupPriority,
  sortMuscleGroupsByPriority,
  getDisplayMuscleGroups,
  getMuscleGroupBadgeClasses,
  generateMuscleGroupColor,
  MUSCLE_GROUP_CONFIG,
  MUSCLE_GROUP_CONFIG_DARK,
} from './utils/muscle-group-colors';

export {
  processEnhancedDragResult,
  calculateWorkoutStats,
  convertToTrelloCard,
  groupWorkoutsByDay,
  validateDragOperation,
  getDragAnimationStyles,
  getDropZoneStyles,
} from './utils/drag-helpers';

export {
  useResponsiveLayout,
  getResponsiveGridClasses,
  getCardWidthClasses,
  getOptimalBadgeCount,
  getTouchTargetClasses,
  getContainerPadding,
  getResponsiveTextClasses,
  useMobileDragOptimization,
  calculateColumnLayout,
  getMediaQueryClasses,
  useReducedMotion,
  getOptimalMobileHeight,
  supportsHover,
  getConditionalHoverClasses,
} from './utils/responsive-helpers';

export {
  TRELLO_CONFIG,
  ANIMATION_CONFIG,
  LAYOUT_CONFIG,
  DRAG_CONFIG,
  CONTEXT_MENU_CONFIG,
  PERFORMANCE_CONFIG,
  ACCESSIBILITY_CONFIG,
  THEME_CONFIG,
  VALIDATION_CONFIG,
} from './constants/trello-config';
