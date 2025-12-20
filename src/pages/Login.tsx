export interface FormLoginData {
    email: string; password: string;
}

import { useState, type FormEvent, type ChangeEvent } from 'react';
import axios from 'axios';
import { Button, FormControl, Input, InputLabel } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Login.scss'
import { useAuthStore } from '../store/useAuthStore';

function Login() {

    const API_URL = 'http://localhost:5000/api/login';

    const [loginData, setLoginData] = useState<FormLoginData>({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

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

        try {
            // Send email and password to the backend
            const response = await axios.post(API_URL, loginData);

            const { token, firstName, user } = response.data;

            useAuthStore.getState().setUser(user);
            useAuthStore.getState().setToken(token);
            setMessage(`Welcome back, ${firstName}! You are now logged in.`);
            setIsError(false);

            // Redirect the user or update global state
            console.log('User Data:', response);

            navigate('/main');

        } catch (error) {
            console.error('Login failed:', error);

            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.msg || 'Login failed.');
            } else {
                setMessage('Network error. Could not connect to the server.');
            }
            setIsError(true);
        }
    };

    return (
        <section className='loginSection'>

            <form onSubmit={handleSubmit}>
                <h1>User Login</h1>

                {message && (
                    <div style={{ color: isError ? 'red' : 'green', margin: '10px 0' }}>
                        **{message}**
                    </div>
                )}
                <FormControl className='form-control'>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" type="email" name="email" value={loginData.email} onChange={handleChange} required />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" type="password" name="password" value={loginData.password} onChange={handleChange} required />
                </FormControl> <br /><br />
                <Button type="submit" style={{ backgroundColor: "green", color: "black" }}>
                    Log In
                </Button> <br /><br />
                <span style={{ fontWeight: "bold",display:"flex",justifyContent:"space-between" }} >
                    <span> Not a member? <Link to="/register" style={{ font: "15px", color: "black" }}>Register</Link></span>
                    <span>  <Link to="/admin" style={{ font: "15px", color: "black" }}>Admin Login</Link></span>
                </span>
            </form>
        </section>
    )
}

export default Login