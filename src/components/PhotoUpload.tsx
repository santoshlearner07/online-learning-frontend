import axios from 'axios';
import React, { useState, useRef, useEffect, type ChangeEvent } from 'react';

const API_UPLOAD_URL = 'http://localhost:5000/api/upload';
const API_PROFILE_URL = 'http://localhost:5000/api/profile';
const BASE_URL = 'http://localhost:5000'; 

const PhotoUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // New loading state

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Helper to get user ID ---
    const getUserId = () => localStorage.getItem('_id');

    // Function to fetch the user's current image path ---
    const fetchUserProfileImage = async (token: string) => {
        try {
            const response = await axios.get(API_PROFILE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const imagePath = response.data.profileImage; 
            
            if (imagePath) {
                setImagePreviewUrl(`${BASE_URL}${imagePath}`);
            }
        } catch (error) {
            console.error('Failed to fetch initial profile image:', error);
        } finally {
            setLoading(false);
        }
    };


    // useEffect for Initialization and Data Fetching ---
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            alert('You must be logged in to use this feature.');
            setIsLoggedIn(false);
            setLoading(false);
        } else {
            setIsLoggedIn(true);
            fetchUserProfileImage(token);
        }
    }, []); 
    
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;

        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                // Set the local preview URL when a new file is selected
                setImagePreviewUrl(reader.result as string); 
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
        }
    };
    
    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        if (!selectedFile || !isLoggedIn) {
            alert('Cannot upload: File or login status missing.');
            return;
        }

        const id = getUserId();
        const token = localStorage.getItem('authToken');
        
        if (!id || !token) {
             alert('Cannot upload: Session data is missing.');
             return;
        }

        const formData = new FormData();
        formData.append('profileImage', selectedFile);
        formData.append('id', id); 

        try {
            const response = await axios.post(API_UPLOAD_URL, formData, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            
            const serverPath = response.data.filePath;
            // Set the image URL to the server path immediately
            setImagePreviewUrl(`${BASE_URL}${serverPath}`); 

            alert('Image uploaded and profile updated!');

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed. Check server logs.');
        }
    };

    if (loading) {
        return <div>Loading user data...</div>;
    }
    
    if (!isLoggedIn) {
        return <div>Please log in to view and upload images.</div>;
    }

    return (
        <div>
             <div
                style={{
                    cursor: 'pointer',
                    width: '100px',
                    height: '100px',
                    border: '2px dashed gray',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}
                onClick={handleIconClick}
            >
                {imagePreviewUrl ? (
                    <img
                        src={imagePreviewUrl}
                        alt="Profile Image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <span style={{ fontSize: '30px' }}>📸</span>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />

            <button onClick={handleUpload} disabled={!selectedFile || !isLoggedIn} style={{ marginTop: '10px' }}>
                Upload Image
            </button>
        </div>
    );
};

export default PhotoUpload;