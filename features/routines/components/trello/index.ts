// Trello-like Weekly Routine Component Suite
// Complete export index for all Trello-style components and utilities

// Main Components
export { TrelloWeeklyRoutine } from './trello-weekly-routine';
export { TrelloWorkoutCard, TrelloWorkoutCardEmpty } from './trello-workout-card';
export { TrelloDayColumn } from './trello-day-column';
export { WorkoutContextMenu } from './workout-context-menu';
export { MuscleGroupBadge, MuscleGroupBadgeList } from './muscle-group-badge';

// Type Definitions
export type {
  TrelloWeeklyRoutineProps,
  TrelloWorkoutCardProps,
  TrelloDayColumnProps,
  WorkoutContextMenuProps,
  MuscleGroupBadgeProps,
  TrelloWorkoutCard as TrelloWorkoutCardType,
  TrelloDayColumn as TrelloDayColumnType,
  WorkoutContextAction,
  DragState,
  EnhancedDropResult,
  TrelloLayoutConfig,
  MuscleGroup,
  MuscleGroupConfig,
  TrelloAnimationConfig,
} from './trello-weekly-routine.types';

// Utility Functions
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
  getAnimationClasses,
  getOptimalMobileHeight,
  supportsHover,
  getConditionalHoverClasses,
} from './utils/responsive-helpers';

// Configuration Constants
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

// Component Usage Examples (for documentation)
export const USAGE_EXAMPLES = {
  basicUsage: `
import { TrelloWeeklyRoutine } from '@/features/routines/components/trello';

function MyRoutinePage() {
  const [routineName, setRoutineName] = useState('My Workout');
  const [workouts, setWorkouts] = useState([]);

  return (
    <TrelloWeeklyRoutine
      routineName={routineName}
      onRoutineNameChange={setRoutineName}
      weeklyWorkouts={workouts}
      onWeeklyWorkoutsChange={setWorkouts}
      onWorkoutUpdated={handleWorkoutUpdate}
      onWorkoutRemoved={handleWorkoutRemove}
      mode="create"
    />
  );
}
`,

  advancedUsage: `
import { 
  TrelloWeeklyRoutine, 
  useResponsiveLayout,
  TRELLO_CONFIG 
} from '@/features/routines/components/trello';

function AdvancedRoutinePage() {
  const { layoutMode, isDesktop } = useResponsiveLayout();
  
  return (
    <TrelloWeeklyRoutine
      routineName={routineName}
      onRoutineNameChange={setRoutineName}
      weeklyWorkouts={workouts}
      onWeeklyWorkoutsChange={setWorkouts}
      onWorkoutUpdated={handleWorkoutUpdate}
      onWorkoutRemoved={handleWorkoutRemove}
      onWorkoutDuplicated={handleWorkoutDuplicate}
      mode="edit"
      enableContextMenu={true}
      enableDragDrop={isDesktop}
      showRoutineSummary={true}
    />
  );
}
`,

  customMuscleGroupBadges: `
import { MuscleGroupBadgeList } from '@/features/routines/components/trello';

function CustomWorkoutCard({ workout }) {
  return (
    <div className="workout-card">
      <h3>{workout.name}</h3>
      <MuscleGroupBadgeList
        muscleGroups={workout.muscleGroups}
        maxVisible={3}
        size="sm"
        showIcon={true}
      />
    </div>
  );
}
`,
} as const;

// Component Feature Matrix
export const FEATURE_MATRIX = {
  components: {
    TrelloWeeklyRoutine: {
      features: [
        'Drag and drop',
        'Responsive layout',
        'Context menus',
        'Real-time updates',
        'Keyboard navigation',
        'Accessibility support',
      ],
      props: ['routineName', 'weeklyWorkouts', 'mode', 'enableDragDrop'],
    },
    TrelloWorkoutCard: {
      features: ['Muscle group badges', 'Context menu', 'Drag handle', 'Stats display', 'Hover effects'],
      props: ['workout', 'onEdit', 'onDelete', 'enableContextMenu'],
    },
    MuscleGroupBadge: {
      features: ['Color coding', 'Icon support', 'Size variants', 'Dark mode'],
      props: ['muscleGroup', 'size', 'showIcon'],
    },
  },
  utilities: {
    responsive: ['useResponsiveLayout', 'getResponsiveGridClasses', 'useMobileDragOptimization'],
    dragHelpers: ['processEnhancedDragResult', 'validateDragOperation', 'getDragAnimationStyles'],
    muscleGroups: ['extractMuscleGroups', 'getMuscleGroupConfig', 'sortMuscleGroupsByPriority'],
  },
} as const;
