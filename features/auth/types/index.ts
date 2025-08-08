// API Response types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  user: AuthUser;
  error?: string;
}

export interface RegisterResponse {
  user: AuthUser;
  error?: string;
}
