import axios from "axios";
import { baseURL } from "../routes/AppRoutes";
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";

export const AdminDemoManager = ({ allUsers, allTeachers, refreshData }: any) => {
    const { token } = useAuthStore();
  const unclaimedDemos = (allUsers || []).filter((s: any) => 
        s.demoSlot && 
        s.demoStatus === 'SCHEDULED' && 
        !s.acceptedBy
    );

    const handleManualAllocate = async (studentId: string, teacherId: string) => {
        if (!teacherId) return alert("Select a teacher first");
        
        try {
            await axios.put(`${baseURL}/admin/allocate-demo/${studentId}`, { teacherId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Allocation Successful");
            refreshData();
        } catch (err) {
            alert("Allocation Failed");
        }
    };

    return (
        <Paper sx={{ p: 3, mt: 3, border: '1px solid #ff9800' }}>
            <Typography variant="h6" color="warning.main">⚠️ Unclaimed Demo Requests</Typography>
            {unclaimedDemos.length === 0 ? (
                <Typography sx={{ mt: 2 }}>All demos are currently claimed or allocated.</Typography>
            ) : (
                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Student</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Demo Time</TableCell>
                            <TableCell>Assign Teacher</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {unclaimedDemos.map((student: { _id: string; firstName: string; subject: string ;demoSlot: string | number | Date; }) => (
                            <TableRow key={student._id}>
                                <TableCell>{student.firstName}</TableCell>
                                <TableCell>{student.subject}</TableCell>
                                <TableCell>{new Date(student.demoSlot).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <select 
                                            id={`teacher-select-${student._id}`}
                                            style={{ padding: '5px' }}
                                        >
                                            <option value="">Select Teacher...</option>
                                            {allTeachers
                                                .filter((t: any) => t.subject === student.subject)
                                                .map((t: any) => (
                                                    <option key={t._id} value={t._id}>{t.firstName}</option>
                                                ))
                                            }
                                        </select>
                                        <Button 
                                            variant="contained" 
                                            size="small"
                                            onClick={() => {
                                                const select = document.getElementById(`teacher-select-${student._id}`) as HTMLSelectElement;
                                                handleManualAllocate(student._id, select.value);
                                            }}
                                        >
                                            Assign
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Paper>
    );
};