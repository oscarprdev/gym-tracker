// Types specific to create-routine.tsx component

export interface FormState {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
}

export type CreateRoutineProps = Record<string, never>;
