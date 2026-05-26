import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Authenticated navigation bar component.
 * Shows logo, role-based nav links, avatar chip with display name, and logout dropdown.
 * Mobile hamburger toggle using React state.
 * @returns {JSX.Element}
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const session = getSession();
  const navigate = useNavigate();

  function handleLogout() {
    clearSession();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login');
  }

  function toggleMobile() {
    setMobileOpen((prev) => !prev);
  }

  function toggleDropdown() {
    setDropdownOpen((prev) => !prev);
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  const isAdmin = session && session.role === 'admin';

  return (
    <nav className="bg-white shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : '/blogs'} className="flex items-center gap-2" onClick={closeMobile}>
            <span className="text-2xl font-bold text-primary-600 font-serif">✍️ WriteSpace</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/blogs"
              className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/write"
              className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
            >
              Write
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="text-sm font-medium text-neutral-700 hover:text-secondary-600 transition-colors"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className="text-sm font-medium text-neutral-700 hover:text-secondary-600 transition-colors"
                >
                  Users
                </Link>
              </>
            )}

            {/* Avatar chip with dropdown */}
            {session && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors focus:outline-none"
                >
                  {getAvatar(session.role)}
                  <span className="text-sm font-medium text-neutral-700 truncate max-w-[120px]">
                    {session.displayName}
                  </span>
                  <span className="text-xs text-neutral-400">▼</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-soft border border-neutral-100 py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobile}
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <span className="text-xl">✕</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 shadow-soft">
          <div className="px-4 py-4 space-y-3">
            {session && (
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                {getAvatar(session.role)}
                <span className="text-sm font-medium text-neutral-700 truncate">
                  {session.displayName}
                </span>
              </div>
            )}
            <Link
              to="/blogs"
              className="block text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors py-2"
              onClick={closeMobile}
            >
              Blogs
            </Link>
            <Link
              to="/write"
              className="block text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors py-2"
              onClick={closeMobile}
            >
              Write
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="block text-sm font-medium text-neutral-700 hover:text-secondary-600 transition-colors py-2"
                  onClick={closeMobile}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className="block text-sm font-medium text-neutral-700 hover:text-secondary-600 transition-colors py-2"
                  onClick={closeMobile}
                >
                  Users
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm font-medium text-red-600 hover:text-red-700 transition-colors py-2 border-t border-neutral-100 mt-2 pt-3"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}