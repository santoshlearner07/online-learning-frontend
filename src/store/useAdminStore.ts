import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';
import { useAuthStore } from './useAuthStore';
interface AdminStore {
    allUsers: any[];
    allAdmins: any[];
    allTeachers:any[];
    loading: boolean;
    error: string | null;
    fetchAllUsers: () => Promise<void>;
    fetchAllAdmins: () => Promise<void>;
    fetchAllTeachers:() => Promise<void>;
    logout: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
    allUsers: [],
    allAdmins: [],
    allTeachers:[],
    loading: false,
    error: null,
logout: () => {
        set({ 
            allUsers: [], 
            allAdmins: [], 
            error: null, 
            loading: false 
        });
    },
    fetchAllUsers: async () => {
        const token = useAuthStore.getState().token;
        set({ loading: true });
        try {
            const { data } = await axios.get(`${baseURL}/admin/alluser`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ allUsers: data, error: null });
        } catch (err: any) {
            set({ error: err.response?.data?.msg || 'Failed to fetch users' });
        } finally {
            set({ loading: false });
        }
    },

    fetchAllAdmins: async () => {
        const token = useAuthStore.getState().token;
        set({ loading: true });
        try {
            const { data } = await axios.get(`${baseURL}/admin/alladmin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ allAdmins: data, error: null });
        } catch (err: any) {
            set({ error: err.response?.data?.msg || 'Failed to fetch admins' });
        } finally {
            set({ loading: false });
        }
    },
    fetchAllTeachers:async()=> {
        const token = useAuthStore.getState().token;
        set({ loading: true });
        try {
            const { data } = await axios.get(`${baseURL}/teacher/get-teachers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ allTeachers: data, error: null });
        } catch (err: any) {
            set({ error: err.response?.data?.msg || 'Failed to fetch admins' });
        } finally {
            set({ loading: false });
        }
    },
}));