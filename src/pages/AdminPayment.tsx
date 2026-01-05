import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { baseURL } from '../routes/AppRoutes';

export const AdminPayment = ({ students,refreshData }: { students: any[]; refreshData:any }) => {
        const { refreshUser } = useAuthStore();
    
    const token = useAuthStore.getState().token;

    const handleVerify = async (studentId: string, status: 'PAID' | 'REJECTED') => {
        const confirmMsg = status === 'PAID' ? "Confirm money received?" : "Reject this payment?";
        if (!window.confirm(confirmMsg)) return;

        try {
            await axios.put(`${baseURL}/admin/verify-payment/${studentId}`, 
                { status }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Student has been marked as ${status}`);
            refreshUser(); // Refresh the list from the server
        } catch (err) {
            alert("Update failed");
        }
    };

    // Filter to only show students waiting for verification
    const pendingStudents = students.filter(s => s.paymentStatus === 'AWAITING_VERIFICATION');

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Reference Provided</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {pendingStudents.map((student) => (
                    <TableRow key={student._id}>
                        <TableCell>{student.firstName} {student.lastName}</TableCell>
                        <TableCell><code>{student.paymentReference}</code></TableCell>
                        <TableCell>
                            <Button 
                                color="success" 
                                onClick={() => handleVerify(student._id, 'PAID')}
                            >
                                Confirm & Start
                            </Button>
                            <Button 
                                color="error" 
                                onClick={() => handleVerify(student._id, 'REJECTED')}
                            >
                                Reject
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};