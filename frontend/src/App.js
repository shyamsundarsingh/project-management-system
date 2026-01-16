import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';


import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/resetPassword';
import UserProfile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import ProgramList from './pages/ProgramList';
import ProgramData from './pages/ProgramData';
import ResetPassAdmin from './pages/ResetPasswordAdmin';
function App() {
    return (
        <Routes>

            {/* 🔓 PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/resetpassword" element={<ResetPassword />} />


            <Route
                path="/dashboard/profile"
                element={
                    <PrivateRoute>
                        <Layout>
                            <UserProfile />
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/reset-password"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ResetPassAdmin />
                        </Layout>
                    </PrivateRoute>
                }
            />
            {/* 🔐 PROTECTED ROUTES */}
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/dashboard/users"
                element={
                    <PrivateRoute>
                        <Layout>
                            <UserList />
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/dashboard/program"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ProgramList />
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/programs/:tableName"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ProgramData />
                        </Layout>
                    </PrivateRoute>
                }
            />

            {/* 🔁 FALLBACK */}
            <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
    );
}
 default App;
