import { Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';
import { curriculum } from '../components/Curriculum';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';

function Courses() {
  const { user, token, refreshUser } = useAuthStore();
  const [upcoming, setUpcoming] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [now, setNow] = useState(new Date());

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

  useEffect(() => {
    const timer = setInterval(() => {
      const tick = new Date();
      setCurrentTime(tick);
      setNow(tick);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const demoStart = new Date(user.demoSlot);
  const demoEnd = new Date(demoStart.getTime() + 60 * 60000); // 60 mins after start
  const isJoinable =
    currentTime >= new Date(demoStart.getTime() - 10 * 60000) &&
    currentTime <= new Date(demoStart.getTime() + 50 * 60000);
  const meetingLink = `https://meet.jit.si/Demo-${user._id}`;

  return (
    <section>

      {user?.demoSlot && now < demoEnd && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd', borderLeft: '6px solid #1976d2' }}>
          <Typography variant="h6">Upcoming Demo: {user.subject || 'Trial'}</Typography>
          <Typography>{demoStart.toLocaleString()}</Typography>

          {isJoinable ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              href={`${meetingLink}#userInfo.displayName="${user.firstName}"`}
              target="_blank"
            >
              Join Demo Now
            </Button>
          ) : (
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
              {now < demoStart
                ? "The Join button will appear 10 minutes before the start time."
                : "The demo session has concluded."}
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
                  (() => {
                    const nowMs = new Date().getTime();
                    const classStartMs = new Date(cls.startTime).getTime();
                    const windowStart = classStartMs - (10 * 60000);
                    const windowEnd = classStartMs + (50 * 60000);
                    const isWithinWindow = nowMs >= windowStart && nowMs <= windowEnd;
                    return isWithinWindow ? (
                      <Button
                        variant="contained"
                        color="success"
                        href={`${cls.meetingLink}#config.prejoinPageEnabled=false&userInfo.displayName="${user.firstName}"`}
                        target="_blank"
                      >
                        Join Class Now
                      </Button>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        {nowMs < windowStart
                          ? `Join available at ${new Date(windowStart).toLocaleTimeString()}`
                          : "Class link expired (50 min limit reached)"}
                      </Typography>
                    );
                  })()
                )}
              </CardContent>
            </Card>
          ))}
        </Box>)}

        <Grid container spacing={4}>
          {curriculum.map((tech) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tech.id}>
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