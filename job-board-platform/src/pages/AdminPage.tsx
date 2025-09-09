import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
    provider: string;
    avatar?: string;
    is_verified: boolean;
    created_at?: string;
}

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch('http://localhost:5004/api/auth/users');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    setError(data.message || 'Failed to fetch users');
                }
            } catch (err) {
                setError('Network error.');
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-purple-700">Admin Dashboard</h1>
                <nav>
                    <Link to="/" className="text-blue-500 hover:underline mr-4">Home</Link>
                    <Link to="/find-jobs" className="text-blue-500 hover:underline mr-4">Find Jobs</Link>
                    <Link to="/applied-jobs" className="text-blue-500 hover:underline">Applied Jobs</Link>
                </nav>
            </header>
            <main className="max-w-4xl mx-auto p-6">
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">User Management</h2>
                    <p className="text-gray-600 mb-4">View, search, and manage registered users.</p>
                    {loading ? (
                        <div>Loading users...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <table className="w-full border rounded shadow text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Provider</th>
                                    <th className="p-2">Verified</th>
                                    <th className="p-2">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-t">
                                        <td className="p-2">{user.id}</td>
                                        <td className="p-2">{user.name}</td>
                                        <td className="p-2">{user.email}</td>
                                        <td className="p-2">{user.provider}</td>
                                        <td className="p-2">{user.is_verified ? 'Yes' : 'No'}</td>
                                        <td className="p-2">{user.created_at || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Job Management</h2>
                    <p className="text-gray-600 mb-4">View, edit, and delete job postings.</p>
                    {/* TODO: Add job table/list here */}
                </section>
                <section>
                    <h2 className="text-xl font-semibold mb-2">Admin Actions</h2>
                    <p className="text-gray-600 mb-4">Perform admin tasks like user cleanup, stats, etc.</p>
                    {/* TODO: Add admin actions here */}
                </section>
            </main>
        </div>
    );
};

export default AdminPage;
