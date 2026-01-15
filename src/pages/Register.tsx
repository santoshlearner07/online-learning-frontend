export interface FormData {
    firstName: string; lastName: string; email: string; phoneNumber: number; userAddress?: string; country: string; userAge: number; password: string; role: string;
    confirmPassword: string;
}

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Box, Button, FormControl, Grid, Input, InputLabel, Typography } from '@mui/material';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { InputAdornment, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import './Register.scss';

function Register() {
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/;
    const baseUrl = 'http://localhost:5000/api/register'

    const [formData, setFormData] = useState<FormData>({
        firstName: '', email: '', lastName: '', phoneNumber: 0, country: "", userAddress: "", userAge: 0, password: "", role: 'student', confirmPassword: "",
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevents losing focus on the input
    };
    const getPasswordStrength = (password: string) => {
        let score = 0;
        if (!password) return score;

        if (password.length >= 8) score += 1; // Length check
        if (/[A-Z]/.test(password)) score += 1; // Uppercase check
        if (/[0-9]/.test(password)) score += 1; // Number check
        if (/[!@#$%^&*]/.test(password)) score += 1; // Symbol check

        return score;
    }
    const strengthScore = getPasswordStrength(formData.password);

    // Determine color based on score
    const getStrengthColor = () => {
        switch (strengthScore) {
            case 1: return 'error';   // Red
            case 2: return 'warning'; // Orange
            case 3: return 'info';    // Blue
            case 4: return 'success'; // Green
            default: return 'error';
        }
    };

    const getStrengthLabel = () => {
        const labels = ["Too Weak", "Weak", "Fair", "Good", "Strong"];
        return labels[strengthScore];
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const isNumericField = name === "phoneNumber" || name === "userAge";

        setFormData(prevData => {
            let updatedValue: string | number | undefined;

            if (isNumericField) {
                const parsedNumber = parseInt(value, 10);
                updatedValue = isNaN(parsedNumber) ? prevData[name as keyof FormData] : parsedNumber;
            } else {
                updatedValue = value;
            }

            return {
                ...prevData,
                [name]: updatedValue,
            };
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        // 1. Basic Field Check
        if (!formData.firstName || !formData.lastName || !formData.password) {
            setMessage('All fields are required.');
            setIsError(true);
            return;
        }

        // 2. Email Validation (@gmail or @yahoo only)
        if (!EMAIL_REGEX.test(formData.email)) {
            setMessage('Email must be a valid @gmail.com or @yahoo.com address.');
            setIsError(true);
            return;
        }

        // 3. Password Complexity Check
        if (!PWD_REGEX.test(formData.password)) {
            setMessage('Password must be 8+ chars with a Capital letter, Number, and Symbol.');
            setIsError(true);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match.');
            setIsError(true);
            return;
        }

        // 4. Age Check (Logical validation)
        if (formData.userAge < 5 || formData.userAge > 100) {
            setMessage('Please enter a valid age (5-100).');
            setIsError(true);
            return;
        }

        if (isNaN(formData.phoneNumber) || isNaN(formData.userAge)) {
            setMessage('Invalid input for Phone Number or Age.');
            setIsError(true);
            return;
        }
        try {
            const response = await axios.post(baseUrl, formData);

            setMessage(response.data.msg || 'Registration successful!');
            setIsError(false);

            setFormData({
                firstName: '', email: '', lastName: '', phoneNumber: 0, country: "", userAddress: "", userAge: 0, password: "", role: 'student', confirmPassword: ''
            });

        } catch (error) {
            console.error('Registration failed:', error);

            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.msg || 'Registration failed due to a server error.');
            } else {
                setMessage('Network error. Check if the backend server is running.');
            }
            setIsError(true);
        }

    }

    return (
        <section className='register'>
            {/* ⭐️ Use container spacing and proper breakpoints */}
            <Grid container sx={{ minHeight: '100vh' }}>

                {/* ⭐️ Hidden on mobile, shown on medium screens and up */}
                <Grid size={{ xs: false, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        {/* Replace with your 2 images */}
                        <img src="img1.jpg" alt="img1" style={{ width: '80%', marginBottom: '20px' }} />
                        <img src="img2.jpg" alt="img2" style={{ width: '80%' }} />
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} className="secondGrid">
                    <form onSubmit={handleSubmit}>
                        <h1>Register</h1>

                        {message && (
                            <div style={{ color: isError ? 'red' : 'green', margin: '10px 0', textAlign: 'center' }}>
                                {message}
                            </div>
                        )}

                        <Grid container spacing={1}>
                            {/* ⭐️ Split Name fields on desktop, stack on mobile */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth className='form-control'>
                                    <InputLabel>First name</InputLabel>
                                    <Input value={formData.firstName} name='firstName' onChange={handleChange} />
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth className='form-control'>
                                    <InputLabel>Last name</InputLabel>
                                    <Input value={formData.lastName} name='lastName' onChange={handleChange} />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth className='form-control'>
                                    <InputLabel>Email address</InputLabel>
                                    <Input value={formData.email} name='email' onChange={handleChange} />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth className='form-control' variant="standard">
                                    <InputLabel>Password</InputLabel>
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'} // ⭐️ Toggle type
                                        value={formData.password}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    {formData.password.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(strengthScore / 4) * 100}
                                                color={getStrengthColor()}
                                                sx={{ height: 6, borderRadius: 5 }}
                                            />
                                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                                Strength: <strong>{getStrengthLabel()}</strong>
                                            </Typography>
                                        </Box>
                                    )}
                                    <p style={{ fontSize: '11px', color: '#666', margin: '5px 0' }}>
                                        Min. 8 chars, 1 Uppercase, 1 Number & 1 Symbol (!@#$)
                                    </p>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth className='form-control'>
                                    <InputLabel>Confirm Password</InputLabel>
                                    <Input
                                        type="password" // Usually keep this hidden for security
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth className='form-control'>
                                    <InputLabel>Phone number</InputLabel>
                                    <Input type="number" value={formData.phoneNumber === 0 ? '' : formData.phoneNumber} name='phoneNumber' onChange={handleChange} />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth className='form-control'>
                                    <InputLabel>Age</InputLabel>
                                    <Input type="number" value={formData.userAge === 0 ? '' : formData.userAge} name='userAge' onChange={handleChange} />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth className='form-control'>
                                    <InputLabel>Address</InputLabel>
                                    <Input value={formData.userAddress} name='userAddress' onChange={handleChange} />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth className='form-control'>
                                    <InputLabel>Country</InputLabel>
                                    <Input value={formData.country} name='country' onChange={handleChange} />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={message === 'Submitting...'} // Prevent double-submit
                                >
                                    {message === 'Submitting...' ? 'Creating Account...' : 'Register'}
                                </Button>
                            </Grid>
                        </Grid>
                        <p style={{ textAlign: 'center', marginTop: '15px' }}>
                            Already a member? <Link to="/login">Sign In</Link>
                        </p>
                    </form>
                </Grid>
            </Grid>
        </section>
    );
}

export default Register