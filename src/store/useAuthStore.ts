import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UserDetails } from '../components/MainPage'

interface AuthState {
    user: UserDetails | null;
    token: string | null;
    setUser: (user: UserDetails | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    updateDemoStatus: (status: string, slot: string) => void;
    updateProfileImage: (imagePath: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            logout: () => {
                set({ user: null, token: null });
                localStorage.removeItem('token'); // Clean up
            },
            updateDemoStatus: (status, slot) =>
                set((state) => ({
                    user: state.user ? { ...state.user, demoStatus: status, demoSlot: slot } : null
                })),
                updateProfileImage: (imagePath) =>
                set((state) => ({
                    user: state.user ? { ...state.user, profileImagePath: imagePath } : null
                })),
        }),
        {
            name: 'auth-storage', // This automatically syncs state with LocalStorage!
        }
    )
);


