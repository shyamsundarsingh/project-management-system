import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', { name, email, password });
            nav('/login');
        } catch (err) {
            setMsg(err?.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Create Account 🚀</h2>

                {msg && <p className="error">{msg}</p>}

                <form onSubmit={submit}>
                    <div className="input-group">
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Full Name"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email address"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>

                    <button className="login-btn" type="submit">
                        Register
                    </button>
                </form>
                <div className="links">
                   
                    <Link to="/login">Login Here</Link>
                </div>
            </div>
        </div>
    );
}
