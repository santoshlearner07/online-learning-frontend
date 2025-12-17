import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

function LandingPage() {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            ITB
                        </Typography>
                        <Link to="/login">
                            <Button color="inherit">Login</Button>/
                        </Link>
                        <Link to="/register">
                            <Button color="inherit">Register</Button>
                        </Link>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default LandingPage