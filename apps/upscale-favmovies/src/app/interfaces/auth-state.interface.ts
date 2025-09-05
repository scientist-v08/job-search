export interface AuthState {
  access_token: string | null;
  isAdmin: boolean;
  setAuth: (token: string, isAdmin: boolean) => void;
  clearAuth: () => void;
}
