import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Box, Typography } from '@mui/material';
import { useAdminStore } from '../store/useAdminStore';

interface AllocateProps {
    studentId: string;
    currentTeacherId?: string;
    studentSubject: string;
}

const AllocateStudent: React.FC<AllocateProps> = ({ studentId, currentTeacherId, studentSubject }) => {
    const { allTeachers, fetchAllTeachers, allocateTeacher, loading, deallocateTeacher } = useAdminStore();
    const [selectedTeacher, setSelectedTeacher] = useState(currentTeacherId || '');

    useEffect(() => {
        if (allTeachers.length === 0) fetchAllTeachers();
    }, []);

    const matchingTeachers = allTeachers.filter(t =>
        t.subject?.toLowerCase() === studentSubject?.toLowerCase()
    );

    const handleRemove = async () => {
        if (!currentTeacherId) return;

        const confirmClear = window.confirm("Are you sure you want to remove this teacher?");
        if (confirmClear) {
            await deallocateTeacher(currentTeacherId, studentId);
            setSelectedTeacher('');
        }
    };

    const handleAssign = async () => {
        if (!selectedTeacher) return;
        await allocateTeacher(selectedTeacher, studentId);
        alert("Teacher allocated successfully!");
    };
    return (
        <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="caption" color="textSecondary">
                {selectedTeacher ? '✅ Teacher Assigned' : `⚠️ Needs ${studentSubject} Teacher`}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>Assign {studentSubject} Teacher</InputLabel>
                    <Select
                        value={selectedTeacher}
                        label={`Assign ${studentSubject} Teacher`}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                    >
                        {matchingTeachers.length > 0 ? (
                            matchingTeachers.map((teacher) => (
                                <MenuItem key={teacher._id} value={teacher._id}>
                                    {teacher.firstName} (Exp: {teacher.experience} yrs)
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No {studentSubject} teachers found</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <Button
                    variant={selectedTeacher === currentTeacherId ? "outlined" : "contained"}
                    color={selectedTeacher === currentTeacherId ? "inherit" : "primary"}
                    onClick={handleAssign}
                    disabled={loading || !selectedTeacher || selectedTeacher === currentTeacherId}
                >
                    {selectedTeacher === currentTeacherId ? 'Assigned' : 'Update'}
                </Button>
                {currentTeacherId && (
                    <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={handleRemove}
                        disabled={loading}
                        sx={{ mt: 1, fontSize: '0.7rem' }}
                    >
                        Remove Assigned Teacher
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default AllocateStudent