'use client';

import { RoutinesSidebar } from '@/features/routines';
import { WorkoutsSidebar } from '@/features/workouts/components/workouts-sidebar';
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
  toggleRoutinesSidebar: (input: SidebarState) => void;
  toggleWorkoutsSidebar: (input: SidebarState) => void;
  // toggleExerciseSidebar: (input: SidebarState) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  routines: [],
  selectedRoutineId: undefined,
  toggleRoutinesSidebar: () => {},
  toggleWorkoutsSidebar: () => {},
  // toggleExerciseSidebar: () => {},
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
  const [workoutSidebarState, setWorkoutSidebarState] = useState<SidebarState>(defaultSidebarState);

  //   const [exerciseSidebarState, setExerciseSidebarState] = useState<SidebarState>(defaultSidebarState);

  const toggleRoutinesSidebar = (input: SidebarState) => {
    setRoutinesSidebarState(input);
  };

  const toggleWorkoutsSidebar = (input: SidebarState) => {
    setWorkoutSidebarState(input);
  };

  //   const toggleExerciseSidebar = (input: SidebarState) => {
  //     setExerciseSidebarState(input);
  //   };

  return (
    <SidebarContext.Provider
      value={{
        routines,
        selectedRoutineId,
        toggleRoutinesSidebar,
        toggleWorkoutsSidebar,
      }}
    >
      <RoutinesSidebar isOpen={routinesSidebarState.isOpen}>
        {routinesSidebarState.kind === SidebarKinds.create && <RoutinesSidebar.Create />}
      </RoutinesSidebar>
      <WorkoutsSidebar isOpen={workoutSidebarState.isOpen}>
        {workoutSidebarState.kind === SidebarKinds.select && <WorkoutsSidebar.Select />}
        {workoutSidebarState.kind === SidebarKinds.create && <WorkoutsSidebar.Create />}
      </WorkoutsSidebar>
      {children}
    </SidebarContext.Provider>
  );
};
