import UserNavbar from './UserNavbar';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'
import { Button, Card, CardContent, Container, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AlarmIcon from '@mui/icons-material/Alarm';

function MainPage() {
  const { token } = useAuthStore();

  const roadmapData1 = [
    { tech: "HTML & CSS", l1: "The Architect: Master boilerplate and Box Model. Milestone: Biography Page.", l2: "The Designer: Master Flexbox and Grid. Milestone: Product Landing Page." },
    { tech: "Python", l1: "The Scripting Starter: Variables and logic. Milestone: Number Guessing Game.", l2: "The Logic Builder: OOP and API integration. Milestone: Weather App." },
    { tech: "JavaScript", l1: "The Interactive Coder: DOM and events. Milestone: Digital Clock.", l2: "The Web Developer: Async/Await and Fetch. Milestone: Interactive Quiz." },
    { tech: "React.js", l1: "The Component Creator: JSX and useState. Milestone: Task Tracker.", l2: "The State Master: useEffect and Zustand. Milestone: Profile Dashboard." },
    { tech: "SQL", l1: "The Data Organizer: SELECT/INSERT commands. Milestone: Contact List.", l2: "The Data Scientist: JOINS and Aggregates. Milestone: Library System." }
  ];

  return (
    <section style={{ padding: "20px", backgroundColor: "#cddc39" }}>
      <UserNavbar />
      {token && <main style={{ padding: '20px' }}>
        <Outlet />
      </main>}
      <section className="py-16 px-6 text-center bg-gray-50">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
          Empower Your Child’s Future with 1:1 Expert Mentorship
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed mb-8">
          Unlock your child's potential with a free 1-hour demo class tailored to their interests and skill level.
          Whether they want to master industry-leading technologies like <strong>React, Python, or SQL</strong>,
          or start with the essential building blocks of the web like <strong>HTML and CSS</strong>,
          our expert instructors are here to guide them.
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
          Book Your Free Demo Today
        </button>
      </section>



      <Container sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" sx={{ mb: 6, fontWeight: 700 }}>
          Learning Roadmap: Level 1 vs. Level 2
        </Typography>
        <Grid container spacing={4}>
          {roadmapData1.map((item, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card elevation={3} sx={{ height: '100%', borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                    {item.tech}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="secondary" sx={{ fontWeight: 'bold' }}>LEVEL 1</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>{item.l1}</Typography>
                  <Typography variant="subtitle2" color="secondary" sx={{ fontWeight: 'bold' }}>LEVEL 2</Typography>
                  <Typography variant="body2">{item.l2}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom textAlign="center">Why Choose Us?</Typography>
        <List>
          {[
            "Live Online 1:1 Interactive Classes",
            "Learn From Home (Safety First)",
            "AI-Driven Adaptive Journey",
            "Zero Risk (No card required for demo)"
          ].map((text) => (
            <ListItem key={text}>
              <ListItemIcon><CheckCircleOutlineIcon color="success" /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>

        <Paper elevation={0} sx={{ mt: 6, p: 4, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <AlarmIcon /> You have 1 Free Schedule Left!
          </Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            Book it as early as possible for your convenient time and date.
          </Typography>
          <Button variant="contained" color="warning" size="large" sx={{ fontWeight: 'bold' }}>
            Book a Free Trial
          </Button>
        </Paper>
      </Container>
    </section>
  )
}

export default MainPage