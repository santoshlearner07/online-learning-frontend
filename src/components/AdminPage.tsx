interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    userAddress?: string;
    phoneNumber?: number;
}
interface Admin {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    userAddress?: string;
    phoneNumber?: number;
}


import axios from 'axios';
import React, { useEffect, useState } from 'react'

function AdminPage() {
    const GET_USER_URL = 'http://localhost:5000/api/admin/alluser'
    const GET_Admin_URL = 'http://localhost:5000/api/admin/alladmin'

    const [allUser, setAllUser] = useState<User[]>();
    const [allAdmin, setAllAdmin] = useState<Admin[]>();
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(GET_USER_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setAllUser(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchAdmins = async () => {
        try {
            const { data } = await axios.get(GET_Admin_URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setAllAdmin(data);
        } catch (error) {
            console.error('Error fetching Admins:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAdmins();
    }, []);

    if (loading) return <p>Loading users...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard: All Users and Admin</h1>
            <table border={1} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 4. Map through the users and display them */}
                    {allUser && allUser.length > 0 ? (
                        allUser.map((user: any, index: number) => (
                            <tr key={user._id || index}>
                                <td>{user.role}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>Nothing to display</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <table border={1} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 4. Map through the users and display them */}
                    {allAdmin && allAdmin.length > 0 ? (
                        allAdmin.map((admin: any, index: number) => (
                            <tr key={admin._id || index}>
                                <td>{admin.role}</td>
                                <td>{admin.firstName}</td>
                                <td>{admin.lastName}</td>
                                <td>{admin.email}</td>
                                <td>{admin.phoneNumber || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>Nothing to display</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default AdminPage