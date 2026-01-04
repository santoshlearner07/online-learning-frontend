import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, MenuItem } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';
import { useAuthStore } from '../store/useAuthStore';

interface SchedulerProps {
    studentId: string;
    teacherId: string; 
    studentSubject: string;
}

const AdminScheduler: React.FC<SchedulerProps> = ({ studentId, teacherId, studentSubject }) => {
    const token = useAuthStore.getState().token;
    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState({
        startTime: '',
        frequency: 'weekly', 
        totalDays: 35,
        durationInMinutes: 60
    });

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${baseURL}/admin/schedule-class-recurring`, {
                studentId,
                teacherId,
                subject: studentSubject,
                ...bookingData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Recurring schedule created successfully!");
        } catch (error: any) {
            alert(error.response?.data?.msg || "Failed to schedule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: '#f9f9f9' }}>
            <Typography variant="subtitle2">🗓️ Setup Recurring Schedule</Typography>
            <form onSubmit={handleSchedule}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                    <TextField
                        type="datetime-local"
                        label="First Class Start"
                        size="small"
                        onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        select
                        label="Repeat"
                        size="small"
                        value={bookingData.frequency}
                        onChange={(e) => setBookingData({...bookingData, frequency: e.target.value})}
                        sx={{ width: 120 }}
                    >
                        <MenuItem value="once">No Repeat</MenuItem>
                        <MenuItem value="daily">Every Day</MenuItem>
                        <MenuItem value="weekly">Weekly (Same Day)</MenuItem>
                    </TextField>
                    <TextField
                        type="number"
                        label="For (Days)"
                        size="small"
                        value={bookingData.totalDays}
                        onChange={(e) => setBookingData({...bookingData, totalDays: Number(e.target.value)})}
                        sx={{ width: 100 }}
                    />
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Creating...' : 'Set Schedule'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};
export default AdminScheduler;