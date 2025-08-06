// Types for delete-routine-modal component

export type DeleteRoutineFormState = {
  error: string | null;
};

export interface DeleteRoutineModalProps {
  routineId: string;
  routineName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
