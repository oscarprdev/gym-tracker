export interface AuthState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export type LoginState = AuthState;

export type RegisterState = AuthState;
