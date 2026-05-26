import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

describe('ProtectedRoute component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('unauthenticated users', () => {
    it('redirects to /login when no session exists', () => {
      auth.getSession.mockReturnValue(null);

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/blogs" element={<div>Blogs Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
    });

    it('redirects to /login when session is null for admin route', () => {
      auth.getSession.mockReturnValue(null);

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<div>Admin Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('authenticated users without required role', () => {
    it('redirects regular user to /blogs when accessing admin route', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<div>Admin Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });

    it('redirects regular user to /blogs when accessing admin users route', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <Routes>
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin/users" element={<div>User Management</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('User Management')).not.toBeInTheDocument();
    });
  });

  describe('authenticated users with correct role', () => {
    it('renders child route for authenticated user accessing general protected route', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/blogs" element={<div>Blogs Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('renders child route for admin user accessing general protected route', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Site Owner',
        role: 'admin',
      });

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/blogs" element={<div>Blogs Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('renders child route for admin user accessing admin-only route', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Site Owner',
        role: 'admin',
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<div>Admin Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
    });

    it('renders child route for admin user accessing admin users route', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Site Owner',
        role: 'admin',
      });

      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin/users" element={<div>User Management</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
    });
  });

  describe('nested routes rendering', () => {
    it('renders the correct nested child route among multiple children', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/write']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/blogs" element={<div>Blogs Page</div>} />
              <Route path="/write" element={<div>Write Page</div>} />
              <Route path="/blog/:id" element={<div>Read Blog</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Write Page')).toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('renders blog detail route with dynamic param for authenticated user', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/blog/p_123']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/blog/:id" element={<div>Read Blog</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Read Blog')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });

  describe('role prop behavior', () => {
    it('does not require role prop and allows any authenticated user', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/blogs" element={<div>Blogs Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
    });

    it('blocks user with mismatched role when role prop is specified', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<div>Admin Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });

    it('allows user with matching role when role prop is specified', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Site Owner',
        role: 'admin',
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<div>Admin Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
    });
  });

  describe('getSession is called', () => {
    it('calls getSession when rendering the protected route', () => {
      auth.getSession.mockReturnValue(null);

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/blogs" element={<div>Blogs Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(auth.getSession).toHaveBeenCalled();
    });
  });
});