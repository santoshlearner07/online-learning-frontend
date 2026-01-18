import { useEffect, useState} from 'react';
import { useAdminStore } from '../store/useAdminStore';
import RegisterTeacher from '../pages/RegisterTeacher';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import AllocateStudent from '../components/AllocateStudent'
import { Box, Button, Paper, Typography,Tabs, Tab, TextField, InputAdornment, Chip } from '@mui/material';
import AdminScheduler from './AdminScheduler';
import { AdminPayment } from '../pages/AdminPayment';
import { AdminDemoManager } from '../pages/AdminDemoManager';
import SearchIcon from '@mui/icons-material/Search';
import { TeacherActivityModal } from './TeacherActivityModal';
function AdminPage() {
    const { allUsers, allAdmins, allTeachers, loading, fetchAllUsers, fetchAllAdmins, error, fetchAllTeachers } = useAdminStore();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    // const refreshData = async () => {
    //     await Promise.all([
    //         fetchAllUsers(),
    //         fetchAllAdmins(),
    //         fetchAllTeachers()
    //     ]);
    // };

    const filteredUsers = allUsers.filter(u =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pendingPayments = allUsers.filter(u => u.paymentStatus === 'AWAITING_VERIFICATION').length;
    const unclaimedDemos = allUsers.filter(u => u.demoSlot && !u.acceptedBy).length;
    const leads = allUsers.filter((u: { demoStatus: string; isPaid: string; }) => u.demoStatus === 'COMPLETED' && !u.isPaid);

    useEffect(() => {
        fetchAllUsers();
        fetchAllAdmins();
        fetchAllTeachers();
    }, [fetchAllUsers, fetchAllAdmins, fetchAllTeachers]);

    if (loading) return <p>Loading data...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

const TableSection = ({ title, data }: { title: string, data: any[] }) => (
    <div style={{ flex: 1, marginBottom: '20px' }}>
        <h3>{title}</h3>
        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                    <th>Name</th>
                    <th>Email</th>
                    {title === "All Teachers" && <th>Last Active</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item._id}>
                        <td style={{ padding: '10px' }}>
                            {title === "All Teachers" ? (
                                <button
                                    onClick={() => {
                                        setSelectedTeacherId(item._id);
                                        setModalOpen(true);
                                    }}
                                    style={{
                                        background: 'none', border: 'none', color: '#1976d2',
                                        textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'
                                    }}
                                >
                                    {item.firstName} {item.lastName}
                                </button>
                            ) : (
                                `${item.firstName} ${item.lastName}`
                            )}
                        </td>
                        <td>{item.email}</td>
                        {title === "All Teachers" && (
                            <td style={{ textAlign: 'center' }}>
                                {item.lastActive ? new Date(item.lastActive).toLocaleString() : 'Never'}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

    const handleLogout = () => {
        useAuthStore.getState().logout();
        useAdminStore.getState().logout();
        localStorage.clear();
        navigate('/login');
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Admin Control Center</Typography>
                <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                }}
            />

            <Tabs value={tabValue} onChange={(_e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
                <Tab label={`Demos (${unclaimedDemos})`} />
                <Tab label={`Payments (${pendingPayments})`} />
                <Tab label="Manage Classes" />
                <Tab label="Teacher Database" />
                <Tab label="Student Database" />
                <Tab label="Admin Database" />
                <Tab label="Demo Complete" />
            </Tabs>

            {tabValue === 0 && (
                <AdminDemoManager allUsers={allUsers} allTeachers={allTeachers} refreshData={fetchAllUsers} />
            )}

            {tabValue === 1 && (
                <AdminPayment students={allUsers} refreshData={fetchAllUsers} />
            )}

            {tabValue === 2 && (
                <Box>
                    {filteredUsers.map((user) => (
                        <Paper key={user._id} sx={{ p: 2, mb: 2, borderLeft: user.isPaid ? '5px solid green' : '5px solid red' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                                <Chip label={user.isPaid ? "PAID" : "UNPAID"} color={user.isPaid ? "success" : "error"} />
                            </Box>
                            <AllocateStudent studentId={user._id} studentSubject={user.subject} currentTeacherId={user.teacher} />
                            {user.teacher && user.isPaid && <AdminScheduler studentId={user._id} teacherId={user.teacher} studentSubject={user.subject} />}
                        </Paper>
                    ))}
                </Box>
            )}

            {tabValue === 3 && (
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <TableSection title="All Teachers" data={allTeachers} />
                    <RegisterTeacher />
                </Box>
            )}
            {tabValue === 4 && (
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <TableSection title="All Students" data={allUsers} />
                </Box>
            )}
            {tabValue === 5 && (
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <TableSection title="All Admins" data={allAdmins} />
                    <RegisterTeacher />
                </Box>
            )}
            {tabValue === 6 && (
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <Paper sx={{ p: 2, mt: 2, bgcolor: '#f1f8e9' }}>
                        <Typography variant="h6">🎯 Sales Leads (Demos Finished)</Typography>
                        {leads.map((u: { _id: string; firstName: string; email: string; updatedAt: string | number | Date; }) => (
                            <Typography key={u._id}>• {u.firstName} ({u.email}) - Completed on {new Date(u.updatedAt).toLocaleDateString()}</Typography>
                        ))}
                    </Paper>
                </Box>
            )}
            {selectedTeacherId && (
            <TeacherActivityModal 
                teacherId={selectedTeacherId} 
                open={modalOpen} 
                onClose={() => {
                    setModalOpen(false);
                    setSelectedTeacherId(null);
                }} 
            />
        )}
        </Box>
    );
}

export default AdminPage;