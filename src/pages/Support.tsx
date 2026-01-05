import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { baseURL } from "../routes/AppRoutes";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

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
        <section style={{ padding: "20px" }}>
           <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Bank Transfer Details (UK)</Typography>
            <Box sx={{ my: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography><strong>Bank:</strong> Barclays / Monzo / etc</Typography>
                <Typography><strong>Sort Code:</strong> 00-00-00</Typography>
                <Typography><strong>Account:</strong> 12345678</Typography>
                <Typography variant="caption">Use your Full Name as Reference</Typography>
            </Box>
            <TextField 
                fullWidth 
                label="Enter Transaction Reference + Name used + Course" 
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSubmit}>Confirm I have Paid</Button>
        </Paper>
        </section>
    )
}

export default Support