import { AppBar, Box, Toolbar, Typography } from '@mui/material'
function LandingPage() {
    return (
        <>
            <Box sx={{ flexGrow: 1, padding: "20px" }}>
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