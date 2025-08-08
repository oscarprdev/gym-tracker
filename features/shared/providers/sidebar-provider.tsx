'use client';

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
      }}
    >
      <RoutinesSidebar isOpen={routinesSidebarState.isOpen}>
        {routinesSidebarState.kind === SidebarKinds.create && <RoutinesSidebar.Create />}
      </RoutinesSidebar>
      {children}
    </SidebarContext.Provider>
  );
};
