export interface UserDetails {
  _id: string;
  firstName: string; lastName: string; email: string; phoneNumber: number; userAddress?: string; country: string; userAge: number; demoStatus: string; demoSlot: string; subject: string; profileImagePath: string
  paymentReference: string; paymentStatus: string; role: 'student' | 'teacher' | 'admin';
}

export interface DemoBookingData {
  subject: string;
  preferredDate: string;
  preferredTime: string;
}

import React, { useState } from 'react';
import PhotoUpload from '../components/PhotoUpload';
import {
  Button, Modal, Box, TextField, Select, MenuItem,
  Grid, Card, CardContent, Typography, Paper, Divider
} from '@mui/material';
import {
  RocketLaunch, EventAvailable, School,
  LaptopMac, WorkspacePremium
} from '@mui/icons-material';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { baseURL } from '../routes/AppRoutes';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

function Dashboard() {
  const { user, token, updateDemoStatus, setUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    preferredDate: '',
    preferredTime: ''
  });

  const subjects = ['Web Development', 'Python for Kids', 'Mobile Apps', 'Robotics', 'Data Science'];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const [currentTime, setCurrentTime] = useState(new Date());
  const now = new Date();
  const demoStart = user?.demoSlot ? new Date(user.demoSlot) : null;
  const isDemoOver = demoStart ? now > new Date(demoStart.getTime() + 60 * 60000) : true;
  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const combinedDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
    try {
      const response = await axios.put(`${baseURL}/demo-booking`,
        { demoSlot: combinedDateTime, subject: formData.subject },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateDemoStatus('SCHEDULED', combinedDateTime.toISOString());
      alert('Demo Booked Successfully!');
      setUser(response.data);
      handleClose();
    } catch (err) {
      console.error('Booking failed', err);
    }
  };

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date()); // Forces re-render every minute
  //   }, 60000);
  //   return () => clearInterval(timer);
  // }, []);


  // const isDemoOver = demoStart ? currentTime > new Date(demoStart.getTime() + 60 * 60000) : true;

  if (!user) return <Typography sx={{ p: 4 }}>Loading your workspace...</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 3, bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
        <PhotoUpload />
        <Box>
          <Typography variant="h4" fontWeight="bold">Welcome back, {user.firstName}! 👋</Typography>
          <Typography color="textSecondary">Track your progress and upcoming sessions here.</Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
            <School color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h6">0</Typography>
            <Typography variant="body2" color="textSecondary">Classes Completed</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
            <LaptopMac color="secondary" sx={{ fontSize: 40 }} />
            <Typography variant="h6">0</Typography>
            <Typography variant="body2" color="textSecondary">Projects Built</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
            <WorkspacePremium color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Beginner</Typography>
            <Typography variant="body2" color="textSecondary">Learning Level</Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <RocketLaunch color="warning" />
                <Typography variant="h5" fontWeight="bold">Your Learning Journey</Typography>
              </Box>

              <Typography variant="body1" paragraph>
                At ITB Tuition, we don't just teach code; we build creators. Your journey starts with an expert-led 1:1 session designed to spark curiosity and build confidence.
              </Typography>

              {user.demoStatus === 'PENDING' ? (
                <Box sx={{ bgcolor: '#fff9c4', p: 3, borderRadius: 2, border: '1px solid #fbc02d' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    🎁 Free Trial Available
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    You have <b>1 free session</b> remaining. Pick a date and time that suits you best to start building your first project.
                  </Typography>
                  <Button variant="contained" color="warning" onClick={handleOpen} startIcon={<EventAvailable />}>
                    Book Free Trial Now
                  </Button>
                </Box>
              ) : !isDemoOver ? (
                <Box sx={{ bgcolor: '#e3f2fd', p: 3, borderRadius: 2, border: '1px solid #2196f3' }}>
                  <Typography variant="subtitle1" fontWeight="bold">🗓️ Session Scheduled</Typography>
                  <Typography>
                    Your 1-hour <b>{user.subject}</b> demo is confirmed for:
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {new Date(user.demoSlot).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    A meeting link will appear in your "Courses" tab 10 minutes before the start.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2, border: '1px solid #bdbdbd' }}>
                  <Typography variant="subtitle1" fontWeight="bold">🎓 Demo Completed</Typography>
                  <Typography variant="body2">
                    We hope you enjoyed your session! Check the <b>Support</b> tab to enroll in the full course.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, bgcolor: '#1a237e', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Why 1:1 Mentorship?</Typography>
              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 2 }} />
              <Typography variant="body2" sx={{ mb: 2 }}>
                ✅ <b>Personalized Pace:</b> No more getting left behind in a crowded classroom.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                ✅ <b>UK Based Experts:</b> Learn from industry professionals with real-world experience.
              </Typography>
              <Typography variant="body2">
                ✅ <b>Project Based:</b> Every class ends with a tangible result your child can show off.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Book Your Session</Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="caption" color="textSecondary">Select Subject</Typography>
            <Select
              fullWidth
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              sx={{ mb: 2, mt: 0.5 }}
            >
              {subjects.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>

            <Typography variant="caption" color="textSecondary">Select Date</Typography>
            <TextField
              fullWidth
              type="date"
              required
              inputProps={{ min: minDate }}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              sx={{ mb: 2, mt: 0.5 }}
            />

            <Typography variant="caption" color="textSecondary">Select Time</Typography>
            <TextField
              fullWidth
              type="time"
              required
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              sx={{ mb: 3, mt: 0.5 }}
            />

            <Button type="submit" variant="contained" fullWidth size="large">
              Confirm Booking
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

export default Dashboard;