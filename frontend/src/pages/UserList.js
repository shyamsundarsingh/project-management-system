import React, { useEffect, useState } from 'react';
import API from '../api';

function downloadCSV(rows) {
    if (!rows || !rows.length) return;
    const header = Object.keys(rows[0]);
    const csvRows = [header.join(',')];
    for (const row of rows) {
        const values = header.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`);
        csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
}

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await API.get('/users');
                setUsers(res.data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const csvData = filteredUsers.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt
    }));

    return (
        <div>
            <h2>User List</h2>

            <div className="user-actions">
                <input
                    className="search-box"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                <button className="csv-btn" onClick={() => downloadCSV(csvData)}>
                    Export CSV
                </button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map(u => (
                        <tr key={u._id}>
                            <td>{u._id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{new Date(u.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        className={page === i + 1 ? 'active' : ''}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
        </div>
    );
}
