import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

const VerifyEmail = () => {
    const { token } = useParams(); 
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                await axios.get(`https://itb-learning.onrender.com/api/verify-email/${token}`);
                setStatus('success');
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };
        if (token) verify();
    }, [token]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
            {status === 'loading' && (
                <>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Verifying your account...</Typography>
                </>
            )}

            {status === 'success' && (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">Email Verified! 🎉</Typography>
                    <Typography sx={{ mb: 3 }}>You can now log in to your dashboard.</Typography>
                    <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
                </Box>
            )}

            {status === 'error' && (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="error">Verification Failed</Typography>
                    <Typography>The link may be expired or invalid.</Typography>
                    <Button sx={{ mt: 2 }} onClick={() => navigate('/register')}>Back to Register</Button>
                </Box>
            )}
        </Box>
    );
};

export default VerifyEmail;