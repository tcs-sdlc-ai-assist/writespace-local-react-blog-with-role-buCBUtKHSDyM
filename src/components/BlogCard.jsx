import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar';

const borderColors = [
  'border-primary-500',
  'border-secondary-500',
  'border-primary-400',
  'border-secondary-400',
  'border-primary-600',
  'border-secondary-600',
];

/**
 * Extracts a plain-text excerpt from content.
 * @param {string} content - The full post content.
 * @param {number} [maxLength=120] - Maximum excerpt length.
 * @returns {string} The truncated excerpt.
 */
function getExcerpt(content, maxLength = 120) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + '…';
}

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
 * Determines whether the edit icon should be shown.
 * Admins can always edit. Users can only edit their own posts.
 * @param {Object|null} session - The current session object.
 * @param {string} authorId - The post author's ID.
 * @returns {boolean}
 */
function canEdit(session, authorId) {
  if (!session) return false;
  if (session.role === 'admin') return true;
  return session.userId === authorId;
}

/**
 * Reusable blog post card component.
 * @param {Object} props
 * @param {Object} props.post - The post object.
 * @param {string} props.post.id - Post ID.
 * @param {string} props.post.title - Post title.
 * @param {string} props.post.content - Post content.
 * @param {string} props.post.createdAt - ISO date string.
 * @param {string} props.post.authorId - Author user ID.
 * @param {string} props.post.authorName - Author display name.
 * @param {number} [props.index=0] - Index for cycling border color.
 * @param {Object|null} [props.session=null] - Current session for edit icon logic.
 * @param {string} [props.authorRole="user"] - Role of the post author for avatar rendering.
 * @returns {JSX.Element}
 */
export default function BlogCard({ post, index = 0, session = null, authorRole = 'user' }) {
  const borderColor = borderColors[index % borderColors.length];
  const showEdit = canEdit(session, post.authorId);

  return (
    <div
      className={`bg-white rounded-2xl shadow-card border-t-4 ${borderColor} p-6 flex flex-col justify-between transition-shadow hover:shadow-soft`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getAvatar(authorRole)}
            <span className="text-sm font-medium text-neutral-700 truncate">
              {post.authorName}
            </span>
          </div>
          {showEdit && (
            <Link
              to={`/write/${post.id}`}
              className="text-neutral-400 hover:text-primary-600 transition-colors"
              title="Edit post"
            >
              <span className="text-lg">✏️</span>
            </Link>
          )}
        </div>
        <Link to={`/blog/${post.id}`} className="block group">
          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            {getExcerpt(post.content)}
          </p>
        </Link>
      </div>
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <span className="text-xs text-neutral-400">{formatDate(post.createdAt)}</span>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
  session: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    role: PropTypes.string,
  }),
  authorRole: PropTypes.string,
};