import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../api';
import '../styles/dashboard.css';

export default function Sidebar() {
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await API.get('/programs');
                setPrograms(res.data);
            } catch (err) {
                console.error('Error fetching programs:', err);
            }
        };
        fetchPrograms();
    }, []);

    // Function to apply active class
    const linkClass = ({ isActive }) =>
        isActive ? 'sidebar-link active' : 'sidebar-link';

    return (
        <aside className="sidebar">
            {/* Main links */}
            <NavLink to="/dashboard" className={linkClass}>
                🏠 Home
            </NavLink>
            <NavLink to="/dashboard/users" className={linkClass}>
                👥 User List
            </NavLink>
            <NavLink to="/dashboard/program" className={linkClass}>
                👥 My Program
            </NavLink>

            <hr />

            
        </aside>
    );
}
