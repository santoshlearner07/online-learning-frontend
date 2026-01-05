import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UserDetails } from '../pages/Dashboard'
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';

interface AuthState {
    user: UserDetails | null;
    token: string | null;
    setUser: (user: UserDetails | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    updateDemoStatus: (status: string, slot: string) => void;
    updateProfileImage: (imagePath: string) => void;
    refreshUser:() => void;
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
            },
            updateDemoStatus: (status, slot) =>
                set((state) => ({
                    user: state.user ? { ...state.user, demoStatus: status, demoSlot: slot } : null
                })),
            updateProfileImage: (imagePath) =>
                set((state) => ({
                    user: state.user ? { ...state.user, profileImagePath: imagePath } : null
                })),
            refreshUser: async () => {
                const token = localStorage.getItem('token');
                if (!token) return;
                try {
                    const res = await axios.get(`${baseURL}/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    set({ user: res.data }); // Updates the user status to 'PAID'
                } catch (err) {
                    console.error("Could not refresh user state");
                }
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);


