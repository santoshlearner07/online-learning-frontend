export interface UserDetails {
    firstName: string; lastName: string; email: string; number: number; address?: string; country: string; age: number;
}

import { Box, Button, TextField } from '@mui/material'
import axios from 'axios';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PinIcon from '@mui/icons-material/Pin';
import HomeIcon from '@mui/icons-material/Home';
function Profile() {
    const [user, setUser] = useState<UserDetails>({
        firstName: '',
        lastName: '',
        email: '',
        number: 0,
        address: '',
        country: '',
        age: 0
    });

    useEffect(() => {
        const storageData = localStorage.getItem('data')

        if (storageData) {
            try {
                const parsedUser = JSON.parse(storageData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data: ', error);
                localStorage.removeItem('data');
            }
        }

    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();

        const storageData = localStorage.getItem('data');
        if (!storageData) return alert("No user data found. Please login again.");

        const parsedData = JSON.parse(storageData);
        const token = parsedData.token; // Ensure this matches your login response key

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // 🔑 This fixes the 401 error
                },
            };

            const { data } = await axios.put(`http://localhost:5000/api/profile`, user, config);

            localStorage.setItem('data', JSON.stringify(data));
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
                    value={user?.firstName}
                    variant="filled"
                    size="small" onChange={handleChange}
                />
                <TextField
                    hiddenLabel
                    name="lastName" id="filled-hidden-label-small"
                    value={user?.lastName}
                    variant="filled"
                    size="small" onChange={handleChange}
                />
            </div>
            <div>
                <EmailIcon />
                <TextField
                    hiddenLabel
                    name="email" id="filled-hidden-label-small"
                    defaultValue={user?.email}
                    variant="filled"
                    size="small" onChange={handleChange}
                    disabled
                />
            </div>
            <div>
                <CallIcon /> <TextField
                    hiddenLabel
                    name="number" id="filled-hidden-label-small"
                    defaultValue={user?.number}
                    variant="filled"
                    size="small" onChange={handleChange}
                    disabled
                />
            </div>
            <div>
                <PinIcon /> <TextField
                    hiddenLabel
                    name="age" id="filled-hidden-label-small"
                    value={user?.age}
                    variant="filled"
                    size="small" onChange={handleChange}
                />
            </div>
            <div style={{ display: "flex" }}>
                <HomeIcon />  <TextField
                    hiddenLabel
                    name="country" id="filled-hidden-label-small"
                    value={user?.country}
                    variant="filled"
                    size="small" onChange={handleChange}
                />
                <TextField
                    hiddenLabel
                    name="address" id="filled-hidden-label-small"
                    value={user?.address}
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