'use client'; 

import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Button, Box, Typography } from '@mui/material';
import { baseURL } from '../routes/AppRoutes';

export default function DeleteUserAccount() {
    const { token, logout } = useAuthStore();

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure? This is permanent.");
        
        if (!confirmDelete) return;

        const typeDelete = window.prompt("Type 'DELETE' to confirm:");
        if (typeDelete !== 'DELETE') return;

        try {
            await axios.delete(`${baseURL}/delete-my-account`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("Account deleted.");
            logout();
            localStorage.clear();
            window.location.href = '/login';
        } catch (err) {
            console.error(err);
            alert("Failed to delete account.");
        }
    };

    return (
        <Box sx={{ p: 2, border: '1px solid red', borderRadius: 2, mt: 2 }}>
            <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                Danger Zone
            </Typography>
            <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDelete} // Only runs when clicked
            >
                Delete Account
            </Button>
        </Box>
    );
}