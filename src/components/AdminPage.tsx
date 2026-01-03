import { useEffect } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import RegisterTeacher from '../pages/RegisterTeacher';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import AllocateStudent from '../components/AllocateStudent'
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
            {allUsers.filter(u => u.demoStatus === 'SCHEDULED').map(user => (
                <div key={user._id}>
                    <h3>{user.firstName} - Needs {user.subject}</h3>
                    <AllocateStudent
                        studentId={user._id}
                        studentSubject={user.subject}
                        currentTeacherId={typeof user.teacher === 'object' ? user.teacher?._id : user.teacher}
                    />
                </div>
            ))}
            <RegisterTeacher />
        </div>
    );
}

// 3. Helper Component to keep the code DRY (Don't Repeat Yourself)
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
    </div>
);

export default AdminPage;