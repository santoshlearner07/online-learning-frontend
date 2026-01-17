import React, { useState, useRef, type ChangeEvent } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore'; 
import { baseURL } from '../routes/AppRoutes';

const API_UPLOAD_URL = `${baseURL}/upload`;

const PhotoUpload: React.FC = () => {
    const { user, token, updateProfileImage } = useAuthStore();
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const displayImage = localPreview || (user?.profileImagePath ? `${baseURL}${user.profileImagePath}` : null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setLocalPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !token || !user) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('profileImage', selectedFile);
        formData.append('id', user.email);

        try {
            const response = await axios.post(API_UPLOAD_URL, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const serverPath = response.data.filePath;
            
            updateProfileImage(serverPath);
            setLocalPreview(null);
            setSelectedFile(null);
            alert('Profile picture updated!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    if (!user) return <p>Please log in.</p>;

    return (
        <div style={{ textAlign: 'center' }}>
            <div
                style={{
                    cursor: 'pointer',
                    width: '100px',
                    height: '100px',
                    border: '2px dashed #ff9800',
                    borderRadius: '50%',
                    margin: '0 auto',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                {displayImage ? (
                    <img src={displayImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span>📸</span>
                )}
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept="image/*" 
            />

            {selectedFile && (
                <button 
                    onClick={handleUpload} 
                    disabled={uploading}
                    style={{ marginTop: '10px', backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
                >
                    {uploading ? 'Uploading...' : 'Confirm New Photo'}
                </button>
            )}
        </div>
    );
};

export default PhotoUpload;