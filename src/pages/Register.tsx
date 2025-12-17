export interface FormData {
    firstName: string; lastName: string; email: string; phoneNumber: number; userAddress?: string; country: string; userAge: number; password: string;
}

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button, FormControl, Grid, Input, InputLabel } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.scss';

function Register() {

    const baseUrl = 'http://localhost:5000/api/register'

    const [formData, setFormData] = useState<FormData>({
        firstName: '', email: '', lastName: '', phoneNumber: 0, country: "", userAddress: "", userAge: 0, password: ""
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
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
        setMessage('Submitting...');
        setIsError(false);

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
                firstName: '', email: '', lastName: '', phoneNumber: 0, country: "", userAddress: "", userAge: 0, password: ""
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
            <Grid container spacing={2}>
                <Grid size={6}>
                    SOmething
                </Grid>
                <Grid size={6} className="secondGrid">

                    <form onSubmit={handleSubmit}>
                    <h1>Register</h1> <br />

                    {message && (
                        <div style={{ color: isError ? 'red' : 'green', margin: '10px 0' }}>
                            {message}
                        </div>
                    )}
                        <FormControl className='form-control'>
                            <InputLabel htmlFor="my-input">First name</InputLabel>
                            <Input id="my-input" aria-describedby="my-helper-text" value={formData.firstName} name='firstName' onChange={handleChange} />
                        </FormControl>
                        <FormControl className='form-control'>
                            <InputLabel htmlFor="my-input">Last name</InputLabel>
                            <Input id="my-input" aria-describedby="my-helper-text" value={formData.lastName} name='lastName' onChange={handleChange} />
                        </FormControl>
                        <FormControl className='form-control'>
                            <InputLabel htmlFor="my-input">Email address</InputLabel>
                            <Input id="my-input" aria-describedby="my-helper-text" value={formData.email} name='email' onChange={handleChange} />
                        </FormControl>
                        <FormControl className='form-control'>
                            <InputLabel htmlFor="my-input">Password</InputLabel>
                            <Input id="my-input" aria-describedby="my-helper-text" value={formData.password} name='password' onChange={handleChange} />
                        </FormControl>
                        <FormControl className='form-control'>
                            <InputLabel htmlFor="my-input">Phone number</InputLabel>
                            <Input id="my-input" aria-describedby="my-helper-text" value={formData.phoneNumber} name='phoneNumber' onChange={handleChange} />
                        </FormControl>
                        <FormControl className='form-control'>
                            <InputLabel htmlFor="my-input">Address</InputLabel>
                            <Input id="my-input" aria-describedby="my-helper-text" value={formData.userAddress} name='userAddress' onChange={handleChange} />
                        </FormControl>
                        <FormControl className='form-control'>
                            <InputLabel htmlFor="my-input">Country</InputLabel>
                            <Input id="my-input" aria-describedby="my-helper-text" value={formData.country} name='country' onChange={handleChange} />
                        </FormControl>
                        <FormControl className='form-control'>
                            <InputLabel htmlFor="my-input">Age</InputLabel>
                            <Input id="my-input" aria-describedby="my-helper-text" value={formData.userAge} name='userAge' onChange={handleChange} />
                        </FormControl>
                        <FormControl className='form-control'>
                            <Button type="submit" disabled={!formData}>Register</Button>
                        </FormControl>
                    <p>Already a member? <Link to="/login">Sign In</Link></p>
                    </form>
                </Grid>
            </Grid>
        </section>
    )
}

export default Register