import { useEffect } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import RegisterTeacher from '../pages/RegisterTeacher';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import AllocateStudent from '../components/AllocateStudent'
import { Box, Typography } from '@mui/material';
import AdminScheduler from './AdminScheduler';
function AdminPage() {
    const { allUsers, allAdmins, allTeachers, loading, fetchAllUsers, fetchAllAdmins, error, fetchAllTeachers } = useAdminStore();
    const navigate = useNavigate();
    useEffect(() => {
        fetchAllUsers();
        fetchAllAdmins();
        fetchAllTeachers();
    }, [fetchAllUsers, fetchAllAdmins, fetchAllTeachers]);

    if (loading) return <p>Loading data...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const handleLogout = () => {
        useAuthStore.getState().logout();
        useAdminStore.getState().logout();
        localStorage.clear();
        navigate('/login');
    }

    return (
        <div style={{ padding: '20px' }}>
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} >Logout</button>
            </span>
            <div>

                {/* User Table Section */}
                <TableSection title="All Student" data={allUsers} />

                {/* Admin Table Section */}
                <TableSection title="All Admins" data={allAdmins} />

                {/* Teacher Table Section */}
                <TableSection title="All Teachers" data={allTeachers} />
            </div>
{allUsers.map((user) => (
    <Box key={user._id} sx={{ mb: 4, p: 3, border: '1px solid #eee' }}>
        <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
        
        {/* 1. Allocate the teacher first */}
        <AllocateStudent 
            studentId={user._id} 
            studentSubject={user.subject} 
            currentTeacherId={user.teacher?._id || user.teacher} 
        />

        {/* 2. If a teacher is assigned, show the scheduling box */}
        {(user.teacher) && (
            <AdminScheduler 
                studentId={user._id}
                teacherId={user.teacher?._id || user.teacher}
                studentSubject={user.subject}
            />
        )}
    </Box>
))}
            
            <RegisterTeacher />
        </div>
    );
}

const TableSection = ({ title, data }: { title: string, data: any[] }) => (
    <div style={{ flex: 1 }}>
        <h3>{title}</h3>
        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th>Role</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? data.map((item) => (
                    <tr key={item._id}>
                        <td>{item.role}</td>
                        <td>{item.firstName} {item.lastName}</td>
                        <td>{item.email}</td>
                    </tr>
                )) : <tr><td colSpan={3}>No data found</td></tr>}
            </tbody>
        </table>
        {/* <AdminScheduler /> */}
    </div>
);

export default AdminPage;