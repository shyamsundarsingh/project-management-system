import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="center">
      <h1>Welcome — MERN Dashboard</h1>
      <p><Link to="/login">Login</Link> or <Link to="/register">Register</Link></p>
    </div>
  );
}
