import { Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';
import { curriculum } from '../components/Curriculum';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';

function Courses() {
  const { user, token, refreshUser } = useAuthStore();
  const [upcoming, setUpcoming] = useState([]);
  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await axios.get(`${baseURL}/my-schedule`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpcoming(data);
    };
    fetchClasses();
    refreshUser();
  }, []);
  const now = new Date();

  return (
    <section>

      {user?.demoSlot && new Date(user.demoSlot) > now && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd' }}>
          <Typography variant="h6">Upcoming Demo {user.subject}</Typography>
          <Typography>{new Date(user.demoSlot).toLocaleString()}</Typography>
          {!user?.subject && (
            <Typography variant="caption" color="error">
              Note: Subject not specified. Please contact admin.
            </Typography>
          )}
        </Paper>
      )}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Developer Roadmap 2025
        </Typography>

        {(user?.paymentStatus === 'AWAITING_VERIFICATION') && (<Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
          <Paper elevation={3} sx={{ p: 5, borderRadius: 3, bgcolor: '#fff9c4' }}>
            <Typography variant="h4" gutterBottom>⏳ Verification Pending</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              We've received your payment reference: <strong>{user?.paymentReference}</strong>.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Our admin team in the UK is verifying the bank transfer.
              Usually, this takes 2–12 hours. You will get access to your
              <b> {user?.subject}</b> course once confirmed.
            </Typography>
            <Button variant="outlined" sx={{ mt: 3 }} onClick={() => window.location.reload()}>
              Refresh Status
            </Button>
          </Paper>
        </Box>)}

        {(user?.paymentStatus === 'PAID') && (<Box>
          <Typography variant="h5">Upcoming Classes</Typography>
          {upcoming.map((cls: any) => (
            <Card key={cls._id} sx={{ mb: 2, borderLeft: '5px solid green' }}>
              <CardContent>
                <Typography variant="h6">{cls.subject}</Typography>
                <Typography>Teacher: {cls.teacherId.firstName}</Typography>
                <Typography>
                  Time: {new Date(cls.startTime).toLocaleString()}
                </Typography>
                {cls.meetingLink && (
                  <Button
                    variant="contained"
                    color="primary"
                    href={cls.meetingLink}
                    target="_blank"
                    disabled={new Date() < new Date(new Date(cls.startTime).getTime() - 10 * 60000)} // Enable 10 mins before
                  >
                    Join Class
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>)}

        <Grid container spacing={4}>
          {curriculum.map((tech) => (
            <Grid item xs={12} md={6} lg={4} key={tech.id}>
              <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 3, width: "100%" }}>
                <CardContent>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {tech.icon} {tech.name}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {tech.levels.map((lvl) => (
                    <Box key={lvl.level} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="secondary">
                        Level {lvl.level}: {lvl.title}
                      </Typography>

                      <Box sx={{ my: 1 }}>
                        {lvl.topics.map((topic, index) => (
                          <Chip
                            key={`${topic}-${index}`}
                            label={topic}
                            size="small"
                            sx={{ m: 0.5, fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>

                      <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                        🏆 Milestone: {lvl.project}
                      </Typography>
                      {lvl.level === 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </section>
  )
}

export default Courses