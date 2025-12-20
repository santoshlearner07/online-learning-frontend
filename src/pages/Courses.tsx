import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';
import { curriculum } from '../components/Curriculum';

function Courses() {
  const { user, token } = useAuthStore();

  return (
    <section>
      {token ? (<p style={{ fontSize: "35px" }}> Your 1 hour class is <b>{user?.demoStatus}</b> on <b>{user?.demoSlot}</b> of <b>{user?.subject}</b> class. <br />Enjoy it.
      </p>) : (<span></span>)}
      <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Developer Roadmap 2025
      </Typography>
      
      <Grid container spacing={4}>
        {curriculum.map((tech) => (
          <Grid item xs={12} md={6} lg={4} key={tech.id}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: 3,width:"100%" }}>
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
                      {lvl.topics.map((topic) => (
                        <Chip 
                          key={topic} 
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