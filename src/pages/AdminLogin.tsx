export interface FormLoginData {
    email: string; password: string;
}

import { useState, type FormEvent, type ChangeEvent } from 'react';
import axios from 'axios';
import { Button, FormControl, Input, InputLabel, Switch, FormControlLabel, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../routes/AppRoutes';
import { useAuthStore } from '../store/useAuthStore'
function AdminLogin() {
    const { setToken, setUser } = useAuthStore();
    const [loginData, setLoginData] = useState<FormLoginData>({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isAdminForm, setIsAdminForm] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('Logging in...');
        setIsError(false);

        // ⭐️ Determine endpoint based on toggle state
        const endpoint = isAdminForm ? `${baseURL}/admin/login` : `${baseURL}/teacher/login`;

        try {
            const response = await axios.post(endpoint, loginData);
            const { token, user } = response.data;
            setToken(token);
            setUser(user);

            // ⭐️ Navigate based on role
            navigate(isAdminForm ? '/admin/dashboard' : '/teacher/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.msg || 'Login failed.');
            } else {
                setMessage('Network error.');
            }
            setIsError(true);
        }
    };

    return (
        <section className='loginSection'>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                {/* ⭐️ The Toggle Switch */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={isAdminForm}
                            onChange={() => {
                                setIsAdminForm(!isAdminForm);
                                setMessage(''); // Clear messages on switch
                            }}
                            color="success"
                        />
                    }
                    label={isAdminForm ? "Admin Access" : "Teacher Access"}
                />
            </Box>

            <form onSubmit={handleSubmit}>
                <h1>{isAdminForm ? 'Admin Login' : 'Teacher Login'}</h1>

                {message && (
                    <div style={{ color: isError ? 'red' : 'green', margin: '10px 0' }}>
                        {message}
                    </div>
                )}

                <FormControl className='form-control' fullWidth sx={{ mb: 2 }}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" type="email" name="email" value={loginData.email} onChange={handleChange} required />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" type="password" name="password" value={loginData.password} onChange={handleChange} required />
                </FormControl>

                <Button
                    type="submit"
                    fullWidth
                    style={{
                        backgroundColor: isAdminForm ? "green" : "#1976d2",
                        color: "white",
                        fontWeight: 'bold'
                    }}
                >
                    Log In as {isAdminForm ? 'Admin' : 'Teacher'}
                </Button>
            </form>
        </section>
    )
}

export default AdminLogin