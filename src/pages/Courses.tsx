import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';
import { curriculum } from '../components/Curriculum';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';

function Courses() {
  const { user, token } = useAuthStore();
  const [upcoming, setUpcoming] = useState([]);
  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await axios.get(`${baseURL}/my-schedule`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpcoming(data);
    };
    fetchClasses();
  }, []);

  return (
    <section>
      {token ? (<p style={{ fontSize: "35px" }}> Your 1 hour class is <b>{user?.demoStatus}</b> on <b>{user?.demoSlot}</b> of <b>{user?.subject}</b> class. <br />Enjoy it.
      </p>) : (<span></span>)}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Developer Roadmap 2025
        </Typography>

        <Box>
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
        </Box>

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