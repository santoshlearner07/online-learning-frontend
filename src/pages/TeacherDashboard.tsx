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
    demos: any[];
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
    const [availableDemos, setAvailableDemos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get(`${baseURL}/teacher/dashboard-data`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
                const demoRes = await axios.get(`${baseURL}/teacher/available-demos`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAvailableDemos(demoRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [token]);

    if (loading) return <Typography>Loading Dashboard...</Typography>;

    const { profile } = data;
    const filteredDemos = availableDemos.filter(d => !ignoredIds.includes(d._id));

    const handleLogout = () => {
        useAuthStore.getState().logout();
        useAdminStore.getState().logout();
        localStorage.clear();
        navigate('/login');
    }

    const handleAccept = async (id: string) => {
        try {
            await axios.put(`${baseURL}/teacher/accept-demo/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboard(); // ⭐️ Refresh everything to move student to "My Students"
            alert("Demo accepted!");
        } catch (err) {
            alert("This demo was already taken!");
            fetchDashboard();
        }
    };

    const handleComplete = async (studentId: string) => {
        if (!window.confirm("Are you sure this demo session is finished?")) return;

        try {
            await axios.put(`${baseURL}/teacher/complete-demo/${studentId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Demo marked as completed!");
            // Force refresh to remove from list
            const response = await axios.get(`${baseURL}/teacher/dashboard-data`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (err) {
            alert("Failed to update status");
        }
    };

    return (
        <Box sx={{ p: 4 }}>
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
                <Grid item xs={12} md={4}>
                    {data.demos.length > 0 && (
                        <Paper sx={{ p: 3, mb: 3, borderLeft: '6px solid #4caf50' }}>
                            <Typography variant="h6" color="success.main">🤝 Upcoming Accepted Demos</Typography>
                            <Divider sx={{ my: 1 }} />
                            <List>
                                {data.demos.length > 0 ? data.demos.map((demo: any) => (
                                    <ListItem
                                        key={demo._id}
                                        divider
                                        secondaryAction={
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="success"
                                                onClick={() => handleComplete(demo._id)}
                                            >
                                                Completed
                                            </Button>
                                        }
                                    >
                                        <ListItemText
                                            primary={`${demo.firstName} ${demo.lastName}`}
                                            secondary={
                                                <Typography variant="caption" fontWeight="bold" color="primary">
                                                    🕒 {new Date(demo.demoSlot).toLocaleString()}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )) : (
                                    <Typography variant="body2" sx={{ p: 2 }}>No future demos scheduled.</Typography>
                                )}
                            </List>
                        </Paper>
                    )}

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" color="secondary">My Regular Students ({data.students.length})</Typography>
                        <Divider sx={{ my: 1 }} />
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
            </Grid>
            <Box>
                {filteredDemos.length > 0 && (
                    <Paper sx={{ p: 3, mb: 3, bgcolor: '#fffde7', border: '1px solid #fbc02d' }}>
                        <Typography variant="h6" color="warning.dark">🔔 New Demo Requests</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>These students are looking for a trial session:</Typography>
                        <Grid container spacing={2}>
                            {filteredDemos.map(student => (
                                <Grid item xs={12} sm={6} md={4} key={student._id}>
                                    <Card sx={{ p: 2, borderLeft: '5px solid #fbc02d' }}>
                                        <Typography fontWeight="bold">{student.firstName} {student.lastName}</Typography>
                                        <Typography variant="body2">Subject: {student.subject}</Typography>
                                        <Typography variant="caption" display="block">
                                            📅 {new Date(student.demoSlot).toLocaleString()}
                                        </Typography>
                                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                            <Button size="small" variant="contained" color="success" onClick={() => handleAccept(student._id)}>
                                                Accept
                                            </Button>
                                            <Button size="small" variant="outlined" color="inherit" onClick={() => setIgnoredIds([...ignoredIds, student._id])}>
                                                Ignore
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}

export default TeacherDashboard;

// function fetchDashboard() {
//     throw new Error('Function not implemented.');
// }
