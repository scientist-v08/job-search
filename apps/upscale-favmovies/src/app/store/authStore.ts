import { create } from 'zustand';
import { AuthState } from '../interfaces/auth-state.interface';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access_token: null,
      isAdmin: false,
      setAuth: (token: string, isAdmin: boolean) =>
        set({ access_token: token, isAdmin }),
      clearAuth: () => set({ access_token: null, isAdmin: false }),
    }),
    {
      name: 'auth-storage', // name of the item in session storage
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage (clears when tab closes)
      partialize: (state) => ({
        access_token: state.access_token,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
