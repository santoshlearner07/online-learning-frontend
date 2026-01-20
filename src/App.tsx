import { Footer } from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './store/useAuthStore'
import { CircularProgress, Box, Typography } from '@mui/material';

function App() {
  const { isHydrated, user } = useAuthStore();
  const showFooter = !user || user?.role === 'student';

if (!isHydrated) {
    return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        bgcolor: '#f8f9fa' 
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#1a237e' }}>
          Loading ITB Workspace...
        </Typography>
      </Box>
    );
  }


  return (
    <>
      <div>
        <AppRoutes />
        {showFooter && <Footer />}
      </div>
    </>
  )
}

export default App
