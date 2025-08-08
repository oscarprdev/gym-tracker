import { RoutinesSidebar } from '@/features/routines';
import { RoutineRecord } from '@/lib/db/queries';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { SidebarKinds, SidebarState } from '../types';

interface SidebarContextProps {
  routines: RoutineRecord[];
  selectedRoutineId?: string;
}

const defaultSidebarState: SidebarState = {
  isOpen: false,
  kind: SidebarKinds.create,
};

interface SidebarContextType {
  routines: RoutineRecord[];
  selectedRoutineId?: string;
  toggleRoutineSidebar: (input: SidebarState) => void;
  // toggleExerciseSidebar: (input: SidebarState) => void;
  // toggleWorkoutSidebar: (input: SidebarState) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  routines: [],
  selectedRoutineId: undefined,
  toggleRoutineSidebar: () => {},
  // toggleExerciseSidebar: () => {},
  // toggleWorkoutSidebar: () => {},
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children, routines, selectedRoutineId }: PropsWithChildren<SidebarContextProps>) => {
  const [routinesSidebarState, setRoutinesSidebarState] = useState<SidebarState>(defaultSidebarState);
  //   const [exerciseSidebarState, setExerciseSidebarState] = useState<SidebarState>(defaultSidebarState);
  //   const [workoutSidebarState, setWorkoutSidebarState] = useState<SidebarState>(defaultSidebarState);

  const toggleRoutinesSidebar = (input: SidebarState) => {
    setRoutinesSidebarState(input);
  };

  //   const toggleExerciseSidebar = (input: SidebarState) => {
  //     setExerciseSidebarState(input);
  //   };

  //   const toggleWorkoutSidebar = (input: SidebarState) => {
  //     setWorkoutSidebarState(input);
  //   };

  return (
    <SidebarContext.Provider
      value={{
        routines,
        selectedRoutineId,
        toggleRoutineSidebar: toggleRoutinesSidebar,
        // toggleExerciseSidebar,
        // toggleWorkoutSidebar,
      }}
    >
      <RoutinesSidebar isOpen={routinesSidebarState.isOpen}>
        <RoutinesSidebar.Header />
        {routinesSidebarState.kind === SidebarKinds.create && <RoutinesSidebar.Create />}
        {/* {
            routineSidebarState.kind === SidebarKinds.edit && <RoutinesSidebar.Edit />
        } */}
      </RoutinesSidebar>
      {/* <WorkoutsSidebar isOpen={workoutsSidebarState.isOpen} onWorkoutSelect={() => {}}>
        <WorkoutsSidebar.Header />
        {workoutsSidebarState.kind === SidebarKinds.create && <WorkoutsSidebar.Create />}
        {workoutsSidebarState.kind === SidebarKinds.edit && <WorkoutsSidebar.Edit />}
      </ExercisesSidebar>
      <ExercisesSidebar isOpen={exercisesSidebarState.isOpen} onExerciseSelect={() => {}}>
        <ExercisesSidebar.Header />
        {exercisesSidebarState.kind === SidebarKinds.create && <ExercisesSidebar.Create />}
        {exercisesSidebarState.kind === SidebarKinds.edit && <ExercisesSidebar.Edit />}
      </WorkoutsSidebar> */}
      {children}
    </SidebarContext.Provider>
  );
};
