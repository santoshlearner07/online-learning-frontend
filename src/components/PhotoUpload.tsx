import React, { useState, useRef, type ChangeEvent } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { baseURL } from '../routes/AppRoutes';
import { CircularProgress, Box } from '@mui/material';

const PhotoUpload: React.FC = () => {
    const { user, token, updateProfileImage } = useAuthStore();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getImageUrl = () => {
        if (localPreview) return localPreview;
        if (!user?.profileImagePath) return null;
        return user.profileImagePath.startsWith('http') 
            ? user.profileImagePath 
            : `${baseURL}${user.profileImagePath}`;
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setLocalPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const { data } = await axios.post(`${baseURL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            // Update Zustand store with the Cloudinary URL from backend
            updateProfileImage(data.imageUrl);
            setSelectedFile(null); // Clear selection
            setLocalPreview(null);
            alert("Photo updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (!user) return null;

    return (
        <Box sx={{ textAlign: 'center', position: 'relative' }}>
            <div
                style={{
                    cursor: 'pointer',
                    width: '100px',
                    height: '100px',
                    border: '3px solid #ff9800',
                    borderRadius: '50%',
                    margin: '0 auto',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    position: 'relative'
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                {getImageUrl() ? (
                    <img 
                        src={getImageUrl()!} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: uploading ? 0.5 : 1 }} 
                    />
                ) : (
                    <span style={{ fontSize: '2rem' }}>📸</span>
                )}

                {uploading && (
                    <CircularProgress 
                        size={40} 
                        sx={{ position: 'absolute', color: '#ff9800' }} 
                    />
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />

            {selectedFile && !uploading && (
                <button
                    onClick={handleUpload} // ⭐️ No more TS Error!
                    style={{ 
                        marginTop: '10px', 
                        backgroundColor: '#ff9800', 
                        color: 'white', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                    }}
                >
                    Save Changes
                </button>
            )}
        </Box>
    );
};

export default PhotoUpload;