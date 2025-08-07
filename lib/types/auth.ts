export interface AuthState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface AuthStateWithMessage extends AuthState {
  message?: string;
  success?: boolean;
}

export type LoginState = AuthState;

export type RegisterState = AuthState;
