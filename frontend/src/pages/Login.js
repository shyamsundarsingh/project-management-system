import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            nav('/dashboard');
        } catch (err) {
            setMsg(err?.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Welcome Back 👋</h2>

                {msg && <p className="error">{msg}</p>}

                <form onSubmit={submit}>
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
                        Login
                    </button>
                </form>

                <div className="links">
                    <Link to="/resetPassword">Forgot Password?</Link>
                    <Link to="/register">Create Account</Link>
                </div>
            </div>
        </div>
    );
}
