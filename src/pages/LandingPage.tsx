import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function LandingPage() {
    return (
        <>
            <Box sx={{ flexGrow: 1,padding:"20px" }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            ITB
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default LandingPage