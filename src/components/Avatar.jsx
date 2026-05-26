import PropTypes from 'prop-types';

/**
 * Returns a styled JSX <span> element with an emoji and role-specific Tailwind color classes.
 * @param {string} role - The user role ("admin" or "user").
 * @returns {JSX.Element} A styled <span> element representing the avatar.
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-100 text-secondary-700 text-sm font-semibold"
        title="Admin"
      >
        👑
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold"
      title="User"
    >
      📖
    </span>
  );
}

/**
 * Avatar component that renders a role-specific avatar.
 * @param {Object} props
 * @param {string} props.role - The user role ("admin" or "user").
 * @returns {JSX.Element}
 */
export default function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.string.isRequired,
};