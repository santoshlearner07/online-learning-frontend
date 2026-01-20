import * as React from 'react';
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography, Dialog, DialogContent, Fade } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Profile from './Profile';
import DeleteUserAccount from './DeleteUserAccount';
import './UserNavbar.scss';

const pages = [
  { name: 'Dashboard', path: '/' },
  { name: 'My Courses', path: '/courses/' },
  { name: 'Support', path: '/support/' }
];

function UserNavbar() {
  const { token, user, logout } = useAuthStore();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [selectedSetting, setSelectedSetting] = React.useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleSettingClick = (setting: string) => {
    setSelectedSetting(setting);
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ background: '#1a237e', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h5" sx={{ mr: 4, display: { xs: 'none', md: 'flex' }, fontWeight: 800, color: '#fff', letterSpacing: '.1rem' }}>
            ITB<span style={{ color: '#ff9800' }}>.</span>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit"><MenuIcon /></IconButton>
            <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} TransitionComponent={Fade}>
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => { handleCloseNavMenu(); navigate(page.path); }}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {token && pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => navigate(page.path)}
                sx={{ 
                  my: 2, 
                  color: location.pathname === page.path ? '#ff9800' : 'white', 
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {token ? (
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Profile Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: '2px solid #ff9800' }}>
                  <Avatar alt={user?.firstName} src={user?.profileImagePath} />
                </IconButton>
              </Tooltip>
              <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                <MenuItem onClick={() => handleSettingClick('Profile')}>Profile Settings</MenuItem>
                <MenuItem onClick={() => handleSettingClick('Delete')}>Delete Account</MenuItem>
                <MenuItem onClick={() => handleSettingClick('Logout')} sx={{ color: 'red' }}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => navigate('/login')} sx={{ color: '#fff' }}>Login</Button>
              <Button onClick={() => navigate('/register')} variant="contained" color="warning" sx={{ borderRadius: '20px' }}>Register</Button>
            </Box>
          )}
        </Toolbar>
      </Container>

      <Dialog 
        open={Boolean(selectedSetting)} 
        onClose={() => setSelectedSetting(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        <DialogContent>
          {selectedSetting === 'Profile' && <Profile />}
          {selectedSetting === 'Delete' && <DeleteUserAccount />}
          {selectedSetting === 'Logout' && (
            <Box textAlign="center" py={3}>
              <Typography variant="h5" fontWeight="bold">Ready to leave?</Typography>
              <Typography color="textSecondary" sx={{ mb: 3 }}>We'll see you for your next coding session!</Typography>
              <Box display="flex" justifyContent="center" gap={2}>
                <Button variant="outlined" onClick={() => setSelectedSetting(null)}>Cancel</Button>
                <Button variant="contained" color="error" onClick={handleLogout}>Confirm Logout</Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}
export default UserNavbar;