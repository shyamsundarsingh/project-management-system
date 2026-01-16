import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/dashboard.css';

export default function Layout({ children }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [open, setOpen] = useState(false);
    const nav = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        nav('/login', { replace: true });
    };

    return (
        <div className="dashboard-layout">
            <header className="topbar">
                <h3>Admin Dashboard</h3>

                <div className="profile-area">
                    <span className="username">👋 {user?.name || 'User'}</span>

                    <img
                        src="https://i.pravatar.cc/40"
                        alt="Profile"
                        className="profile-img"
                        onClick={() => setOpen(!open)}
                        style={{ cursor: 'pointer', borderRadius: '50%' }}
                    />

                    {open && (
                        <div className="profile-dropdown">

                            {/* ✅ ABSOLUTE PATH */}
                            <button onClick={() => { nav('/dashboard/profile'); setOpen(false); }}>
                                👤 Update Profile
                            </button>

                            {/* ✅ ABSOLUTE PATH */}
                            <button onClick={() => { nav('/reset-password'); setOpen(false); }}>
                                🔐 Reset Password
                            </button>

                            <button onClick={logout} className="logout-btn">
                                🚪 Logout
                            </button>

                        </div>
                    )}
                </div>
            </header>

            <div className="dashboard-body">
                <Sidebar />
                <main className="dashboard-main">
                    {children}
                </main>
            </div>
        </div>
    );
}
