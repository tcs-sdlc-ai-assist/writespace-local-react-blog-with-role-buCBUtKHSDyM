import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Guest navigation bar component.
 * Shows logo, login/get started buttons for unauthenticated users,
 * or avatar/dashboard CTA if logged in.
 * @returns {JSX.Element}
 */
export default function PublicNavbar() {
  const session = getSession();

  return (
    <nav className="bg-white shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600 font-serif">✍️ WriteSpace</span>
          </Link>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                <div className="flex items-center gap-2">
                  {getAvatar(session.role)}
                  <span className="hidden sm:inline text-sm font-medium text-neutral-700 truncate max-w-[120px]">
                    {session.displayName}
                  </span>
                </div>
                {session.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-secondary-600 hover:bg-secondary-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/blogs"
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}