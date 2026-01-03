import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';
import { useAuthStore } from './useAuthStore';
interface AdminStore {
    allUsers: any[];
    allAdmins: any[];
    allTeachers: any[];
    loading: boolean;
    error: string | null;
    fetchAllUsers: () => Promise<void>;
    fetchAllAdmins: () => Promise<void>;
    fetchAllTeachers: () => Promise<void>;
    allocateTeacher: (teacherId: string, studentId: string) => Promise<void>;
    deallocateTeacher: (teacherId: string, studentId: string) => Promise<void>;
    logout: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
    allUsers: [],
    allAdmins: [],
    allTeachers: [],
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
    fetchAllTeachers: async () => {
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
    allocateTeacher: async (teacherId: string, studentId: string) => {
        const token = useAuthStore.getState().token;
        set({ loading: true });
        try {
            await axios.put(`${baseURL}/admin/allocate`,
                { teacherId, studentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // After successful allocation, refresh the lists to show updated links
            await get().fetchAllUsers();
            await get().fetchAllTeachers();

            set({ error: null });
        } catch (err: any) {
            set({ error: err.response?.data?.msg || 'Allocation failed' });
        } finally {
            set({ loading: false });
        }
    },
    deallocateTeacher: async (teacherId: string, studentId: string) => {
    const token = useAuthStore.getState().token;
    set({ loading: true });
    try {
        await axios.put(`${baseURL}/admin/deallocate`, 
            { teacherId, studentId }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Refresh local state to reflect the removal
        const { fetchAllUsers, fetchAllTeachers } = get();
        await Promise.all([fetchAllUsers(), fetchAllTeachers()]);
        
        set({ error: null });
    } catch (err: any) {
        set({ error: err.response?.data?.msg || 'Deallocation failed' });
    } finally {
        set({ loading: false });
    }
},
}));