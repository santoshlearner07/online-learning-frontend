import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export function Footer() {
    return (
        <Box sx={{ bgcolor: '#1a237e', color: 'white', py: 6, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* 1. Brand Section */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            ITB TUITION
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                            Empowering students across the UK with expert-led technical courses and personalized mentorship.
                            Bridging the gap between learning and industry.
                        </Typography>
                        <Box>
                            <IconButton color="inherit"><FacebookIcon /></IconButton>
                            <IconButton color="inherit"><TwitterIcon /></IconButton>
                            <IconButton color="inherit"><LinkedInIcon /></IconButton>
                        </Box>
                    </Grid>

                    {/* 2. Quick Links */}
                    <Grid size={{ xs: 6, md: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Navigation
                        </Typography>
                        <Link href="/" color="inherit" underline="none" display="block">Home</Link>
                        <Link href="/courses" color="inherit" underline="none" display="block">Courses</Link>
                        <Link href="/support" color="inherit" underline="none" display="block">Support</Link>
                    </Grid>

                    {/* 3. Courses */}
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Top Subjects
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Full Stack Development</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Python for Beginners</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Data Science</Typography>
                    </Grid>

                    {/* 4. Contact Info */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Llanelli, Wales, United Kingdom</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Email: nandiyawarsantosh.0719@gmail.com</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Phone: +44 7393 063349</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />

                {/* Bottom Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', opacity: 0.6 }}>
                    <Typography variant="caption">
                        © 2026 ITB Tuition Ltd. All rights reserved.
                    </Typography>
                    <Box>
                        <Link href="#" color="inherit" sx={{ mx: 1, fontSize: '0.75rem' }}>Privacy Policy</Link>
                        <Link href="#" color="inherit" sx={{ mx: 1, fontSize: '0.75rem' }}>Terms of Service</Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}