import PropTypes from 'prop-types';
import { useState } from 'react';
import { getAvatar } from './Avatar';

/**
 * Formats an ISO date string for display.
 * @param {string} dateStr - ISO date string.
 * @returns {string} Formatted date string.
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return '';
  }
}

/**
 * Returns a styled role badge JSX element.
 * @param {string} role - The user role ("admin" or "user").
 * @returns {JSX.Element} A styled <span> element representing the role badge.
 */
function getRoleBadge(role) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-100 text-secondary-700">
        Admin
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
      User
    </span>
  );
}

/**
 * User table row (desktop) or stacked card (mobile) component.
 * Shows avatar, display name, username, role badge, created date, and delete button.
 * Handles delete confirmation, protects hard-coded admin from deletion, and prevents self-deletion.
 * @param {Object} props
 * @param {Object} props.user - The user object.
 * @param {string} props.user.id - User ID.
 * @param {string} props.user.displayName - User display name.
 * @param {string} props.user.username - Username.
 * @param {string} props.user.role - User role ("admin" or "user").
 * @param {string} props.user.createdAt - ISO date string.
 * @param {Object|null} props.session - The current session object.
 * @param {Function} props.onDelete - Callback invoked with user id when delete is confirmed.
 * @returns {JSX.Element}
 */
export default function UserRow({ user, session, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  const isHardCodedAdmin = user.id === 'admin';
  const isSelf = session && session.userId === user.id;
  const canDelete = !isHardCodedAdmin && !isSelf;

  function handleDeleteClick() {
    setConfirming(true);
  }

  function handleConfirm() {
    setConfirming(false);
    onDelete(user.id);
  }

  function handleCancel() {
    setConfirming(false);
  }

  return (
    <>
      {/* Desktop row */}
      <tr className="hidden md:table-row border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{user.displayName}</p>
              <p className="text-xs text-neutral-500 truncate">@{user.username}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          {getRoleBadge(user.role)}
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-neutral-500">{formatDate(user.createdAt)}</span>
        </td>
        <td className="px-4 py-3 text-right">
          {canDelete && !confirming && (
            <button
              onClick={handleDeleteClick}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              title="Delete user"
            >
              Delete
            </button>
          )}
          {canDelete && confirming && (
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-neutral-500">Are you sure?</span>
              <button
                onClick={handleConfirm}
                className="text-sm text-red-600 hover:text-red-800 font-semibold transition-colors"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="text-sm text-neutral-500 hover:text-neutral-700 font-medium transition-colors"
              >
                No
              </button>
            </div>
          )}
          {isHardCodedAdmin && (
            <span className="text-xs text-neutral-400 italic">Protected</span>
          )}
          {isSelf && !isHardCodedAdmin && (
            <span className="text-xs text-neutral-400 italic">You</span>
          )}
        </td>
      </tr>

      {/* Mobile card */}
      <div className="md:hidden bg-white rounded-2xl shadow-card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {getAvatar(user.role)}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-900 truncate">{user.displayName}</p>
            <p className="text-xs text-neutral-500 truncate">@{user.username}</p>
          </div>
          {getRoleBadge(user.role)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">{formatDate(user.createdAt)}</span>
          {canDelete && !confirming && (
            <button
              onClick={handleDeleteClick}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              title="Delete user"
            >
              Delete
            </button>
          )}
          {canDelete && confirming && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Sure?</span>
              <button
                onClick={handleConfirm}
                className="text-sm text-red-600 hover:text-red-800 font-semibold transition-colors"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="text-sm text-neutral-500 hover:text-neutral-700 font-medium transition-colors"
              >
                No
              </button>
            </div>
          )}
          {isHardCodedAdmin && (
            <span className="text-xs text-neutral-400 italic">Protected</span>
          )}
          {isSelf && !isHardCodedAdmin && (
            <span className="text-xs text-neutral-400 italic">You</span>
          )}
        </div>
      </div>
    </>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  session: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    role: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
};