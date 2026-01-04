interface TeacherProfile {
    firstName: string;
    email: string;
    subject: string;
    qualification: string;
    experience: number;
}

interface TeacherDashboardData {
    profile: TeacherProfile | null;
    students: any[]; 
    classes: any[];  
}

import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';
import { useAuthStore } from '../store/useAuthStore';
import { useAdminStore } from '../store/useAdminStore';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
    const { token } = useAuthStore();
    const [data, setData] = useState<TeacherDashboardData>({ profile: null, students: [], classes: [] });
    const [loading, setLoading] = useState(true);
const navigate = useNavigate();
    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await axios.get(`${baseURL}/teacher/dashboard-data`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchTeacherData();
    }, [token]);
    if (loading) return <Typography>Loading Dashboard...</Typography>;
    const { profile } = data;
const handleLogout = () => {
        useAuthStore.getState().logout();
        useAdminStore.getState().logout();
        localStorage.clear();
        navigate('/login');
    }
    return (
        <Box sx={{ p: 4 }}>
            {/* <Typography variant="h4" gutterBottom>Welcome, {user?.firstName}! 👋</Typography> */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f0f4f8' }}>
                <Typography variant="h4">Welcome, {profile?.firstName}!</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item>
                        <Typography variant="body1"><strong>📧 Email:</strong> {profile?.email}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1"><strong>📚 Subject:</strong> {profile?.subject}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1"><strong>🎓 Qualification:</strong> {profile?.qualification}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1"><strong>⏳ Experience:</strong> {profile?.experience} Years</Typography>
                    </Grid>
                </Grid>
                <Button onClick={handleLogout}>Logout</Button>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, minHeight: '400px' }}>
                        <Typography variant="h6" color="primary">Upcoming Classes</Typography>
                        <Divider sx={{ my: 2 }} />
                        {data.classes.length > 0 ? (
                            data.classes.map((cls: any) => (
                                <Card key={cls._id} variant="outlined" sx={{ mb: 2, p: 2, borderLeft: '6px solid #1976d2' }}>
                                    <Grid container alignItems="center">
                                        <Grid item xs={8}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {cls.studentId.firstName} - {cls.subject}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                📅 {new Date(cls.startTime).toLocaleString([], { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} textAlign="right">
                                            <Button variant="contained" href={cls.meetingLink} target="_blank">
                                                Join Meeting
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Card>
                            ))
                        ) : (
                            <Typography>No upcoming classes scheduled.</Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" color="secondary">My Students ({data.students.length})</Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            {data.students.map((student: any) => (
                                <ListItem key={student._id} divider>
                                    <ListItemText
                                        primary={student.firstName}
                                        secondary={`${student.subject} | ${student.phoneNumber}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default TeacherDashboard;