'use client';

import { WorkoutsSelectSidebar } from '@/features/workouts/components/workouts-select-sidebar/workouts-select-sidebar';
import { WorkoutsCreateSidebar } from '@/features/workouts/components/workouts-create-sidebar/workouts-create-sidebar';
import { RoutineRecord } from '@/lib/db/queries';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { RoutinesCreateSidebar } from '@/features/routines/components/routines-create-sidebar/routines-create-sidebar';

interface SidebarContextProps {
  routines: RoutineRecord[];
  selectedRoutineId?: string;
}

interface SidebarContextType {
  routines: RoutineRecord[];
  selectedRoutineId?: string;
  routinesCreateSidebar: { isOpen: boolean };
  workoutsSelectSidebar: { isOpen: boolean };
  workoutsCreateSidebar: { isOpen: boolean };
  toggleRoutinesCreateSidebar: (isOpen: boolean) => void;
  toggleWorkoutsSelectSidebar: (isOpen: boolean) => void;
  toggleWorkoutsCreateSidebar: (isOpen: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  routines: [],
  selectedRoutineId: undefined,
  routinesCreateSidebar: { isOpen: false },
  workoutsSelectSidebar: { isOpen: false },
  workoutsCreateSidebar: { isOpen: false },
  toggleRoutinesCreateSidebar: () => {},
  toggleWorkoutsSelectSidebar: () => {},
  toggleWorkoutsCreateSidebar: () => {},
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children, routines, selectedRoutineId }: PropsWithChildren<SidebarContextProps>) => {
  const [routinesCreateSidebar, setRoutinesCreateSidebar] = useState({ isOpen: false });
  const [workoutsSelectSidebar, setWorkoutsSelectSidebar] = useState({ isOpen: false });
  const [workoutsCreateSidebar, setWorkoutsCreateSidebar] = useState({ isOpen: false });

  const toggleRoutinesCreateSidebar = (isOpen: boolean) => {
    setRoutinesCreateSidebar({ isOpen });
  };

  const toggleWorkoutsSelectSidebar = (isOpen: boolean) => {
    setWorkoutsSelectSidebar({ isOpen });
  };

  const toggleWorkoutsCreateSidebar = (isOpen: boolean) => {
    setWorkoutsCreateSidebar({ isOpen });
  };

  return (
    <SidebarContext.Provider
      value={{
        routines,
        selectedRoutineId,
        routinesCreateSidebar,
        workoutsSelectSidebar,
        workoutsCreateSidebar,
        toggleRoutinesCreateSidebar,
        toggleWorkoutsSelectSidebar,
        toggleWorkoutsCreateSidebar,
      }}
    >
      <RoutinesCreateSidebar isOpen={routinesCreateSidebar.isOpen} onOpenChange={toggleRoutinesCreateSidebar} />
      <WorkoutsSelectSidebar isOpen={workoutsSelectSidebar.isOpen} onOpenChange={toggleWorkoutsSelectSidebar} />
      <WorkoutsCreateSidebar isOpen={workoutsCreateSidebar.isOpen} onOpenChange={toggleWorkoutsCreateSidebar} />
      {children}
    </SidebarContext.Provider>
  );
};
