import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function resetPassword() {
    const [email, setEmail] = useState('');
   
    const [msg, setMsg] = useState('');
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/resetPassword', { email});
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            nav('/dashboard');
        } catch (err) { setMsg(err?.response?.data?.message || 'Error'); }
    }

    return (
        <div className="center card">
            <h2>Reset Password</h2>
            {msg && <p className="error">{msg}</p>}
            <form onSubmit={submit}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                
                <button type="submit">Submit</button>
            </form>
            <p>Login Here <Link to="/login">Login</Link></p>
            <p>New user? <Link to="/register">Register</Link></p>
        </div>
    );
}
