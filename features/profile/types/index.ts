// Profile-related types
export interface UpdateProfileState {
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
}

export interface ChangePasswordState {
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
}

export interface DeleteAccountState {
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
}
