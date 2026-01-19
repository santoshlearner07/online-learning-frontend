import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { baseURL } from "../routes/AppRoutes";
import { Box, Button, Divider, Grid, Paper, TextField, Typography } from "@mui/material";

function Support() {

    const [ref, setRef] = useState('');
    const { token } = useAuthStore();

    const handleSubmit = async () => {
        try {
            await axios.post(`${baseURL}/submit-payment`, {
                reference: ref
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Payment details submitted. Admin will verify within 24 hours.");
        } catch (err) {
            alert("Error submitting payment.");
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '900px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Support & Payments</Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" color="primary">Manual Bank Transfer</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            To enroll, please transfer the fee to our UK business account:
                        </Typography>

                        <Box sx={{ p: 2, bgcolor: '#f0f7ff', borderRadius: 2, mb: 3, border: '1px solid #cce3ff' }}>
                            <Typography><strong>Account Name:</strong> ITB Tuition Ltd</Typography>
                            <Typography><strong>Sort Code:</strong> 00-00-00</Typography>
                            <Typography><strong>Account No:</strong> 12345678</Typography>
                        </Box>

                        <Typography variant="subtitle2" gutterBottom>Already Paid?</Typography>
                        <TextField
                            fullWidth
                            placeholder="Example: JohnDoe-Python-Ref123"
                            label="Transaction Reference"
                            value={ref}
                            onChange={(e) => setRef(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" fullWidth onClick={handleSubmit}>
                            Submit for Verification
                        </Button>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 3, height: '100%', bgcolor: '#fafafa' }}>
                        <Typography variant="h6">Need Help?</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ mb: 2, mt: 2 }}>
                            <Typography variant="subtitle2">📧 Email Support</Typography>
                            <Typography variant="body2" color="textSecondary">nandiyawarsantosh.0719@gmail.com</Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">🟢 WhatsApp (Mon-Fri)</Typography>
                            <Typography variant="body2" color="textSecondary">+44 7393 063349</Typography>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: '#fff4e5', borderRadius: 2 }}>
                            <Typography variant="caption" color="#663c00">
                                <strong>Note:</strong> Verification is handled manually by our team in the UK.
                                Please allow up to 24 hours before escalating.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Support