
import { Box, Button, TextField } from '@mui/material'
import axios from 'axios';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PinIcon from '@mui/icons-material/Pin';
import HomeIcon from '@mui/icons-material/Home';
import { useAuthStore } from '../store/useAuthStore';

function Profile() {
    const { user, token,  setUser } = useAuthStore();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userAge: 0,
        country: '',
        userAddress: '',
        phoneNumber: '',
        email:''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                userAge: user.userAge || 0,
                country: user.country || '',
                userAddress: user.userAddress || '',
                phoneNumber: user.phoneNumber?.toString() || '',
                email:user.email || ''
            });
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();

        if (!token) return alert("No user data found. Please login again.");

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,  
                },
            };

            const { data } = await axios.put(`http://localhost:5000/api/profile`, formData, config);
            setUser(data.user)
            alert("Profile updated!");

        } catch (error: any) {
            console.error("Update failed:", error.response?.data?.msg || error.message);
            if (error.response?.status === 401) {
                alert("Session expired. Please log in again.");
            }
        }
    };

    return (
        <Box sx={{ width: 500, maxWidth: '100%', color: 'black' }}>
            <div style={{ display: "flex" }}>
                <BadgeIcon />
                <TextField
                    hiddenLabel
                    name="firstName" id="filled-hidden-label-small"
                    value={formData?.firstName}
                    variant="filled"
                    size="small" onChange={handleChange}
                />
                <TextField
                    hiddenLabel
                    name="lastName" id="filled-hidden-label-small"
                    value={formData?.lastName}
                    variant="filled"
                    size="small" onChange={handleChange}
                />
            </div>
            <div>
                <EmailIcon />
                <TextField
                    hiddenLabel
                    name="email" id="filled-hidden-label-small"
                    defaultValue={formData?.email}
                    variant="filled"
                    size="small" onChange={handleChange}
                    disabled
                />
            </div>
            <div>
                <CallIcon /> <TextField
                    hiddenLabel
                    name="phoneNumber" id="filled-hidden-label-small"
                    defaultValue={formData?.phoneNumber}
                    variant="filled"
                    size="small" onChange={handleChange}
                    disabled
                />
            </div>
            <div>
                <PinIcon /> <TextField
                    hiddenLabel
                    name="userAge" id="filled-hidden-label-small"
                    value={formData?.userAge}
                    variant="filled"
                    size="small" onChange={handleChange}
                />
            </div>
            <div style={{ display: "flex" }}>
                <HomeIcon />  <TextField
                    hiddenLabel
                    name="country" id="filled-hidden-label-small"
                    value={formData?.country}
                    variant="filled"
                    size="small" onChange={handleChange}
                />
                <TextField
                    hiddenLabel
                    name="userAddress" id="filled-hidden-label-small"
                    value={formData?.userAddress}
                    variant="filled"
                    size="small" onChange={handleChange}
                />
            </div>
            <p>
                <Button color='warning' onClick={handleUpdate}>Update</Button>
            </p>
        </Box>
    )
}

export default Profile