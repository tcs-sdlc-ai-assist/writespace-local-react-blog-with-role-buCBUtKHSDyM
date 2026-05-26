import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../utils/auth';

/**
 * Route guard component.
 * Checks writespace_session in localStorage via getSession().
 * Redirects guests to /login.
 * If role prop is 'admin' and user role is not 'admin', redirects to /blogs.
 * Renders Outlet (nested routes) if authorized.
 * @param {Object} props
 * @param {string} [props.role] - Required role to access the route (e.g. "admin").
 * @returns {JSX.Element}
 */
export default function ProtectedRoute({ role }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role && session.role !== role) {
    return <Navigate to="/blogs" replace />;
  }

  return <Outlet />;
}

ProtectedRoute.propTypes = {
  role: PropTypes.string,
};