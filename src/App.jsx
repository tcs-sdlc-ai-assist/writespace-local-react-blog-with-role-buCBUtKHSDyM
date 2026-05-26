import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import ReadBlog from './pages/ReadBlog';
import WriteBlog from './pages/WriteBlog';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

/**
 * Root application component.
 * Defines all route entries using React Router v6.
 * Public routes: /, /login, /register
 * Protected routes (any authenticated user): /blogs, /blog/:id, /write, /write/:id
 * Admin-only routes: /admin, /admin/users
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes - any authenticated user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/blogs" element={<Home />} />
          <Route path="/blog/:id" element={<ReadBlog />} />
          <Route path="/write" element={<WriteBlog />} />
          <Route path="/write/:id" element={<WriteBlog />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}