export interface TeacherFormData {
    firstName: string;
    email: string;
    subject: string;
    experience: number;
    qualification: string;
    phoneNumber: number;
}
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';

const RegisterTeacher: React.FC = () => {
    const [formData, setFormData] = useState<TeacherFormData>({
        firstName: '',
        email: '',
        subject: '',
        experience: 0,
        qualification: '',
        phoneNumber: 0
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const isNumeric = name === 'experience' || name === 'phoneNumber';

        setFormData(prev => ({
            ...prev,
            [name]: isNumeric ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log(formData)
        try {
            const response = await axios.post(`${baseURL}/teacher/register`, formData);
            alert("Teacher registered successfully!");
            console.log(response.data);
            setFormData({
                firstName: '', email: '', subject: '', experience: 0,
                qualification: '',
                phoneNumber: 0,
            });
        } catch (error) {
            console.error("Error registering teacher:", error);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Teacher Registration
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth label="Full Name" name="firstName"
                                value={formData.firstName} onChange={handleChange} required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth label="Email Address" name="email" type="email"
                                value={formData.email} onChange={handleChange} required
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth label="Subject Specialty" name="subject"
                                value={formData.subject} onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth label="Years of Experience" name="experience" type="number"
                                value={formData.experience} onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth label="Highest Qualification" name="qualification"
                                value={formData.qualification} onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth label="Phone Number" name="phoneNumber" type="number"
                                value={formData.phoneNumber} onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                                Submit Teacher Profile
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default RegisterTeacher;