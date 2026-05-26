import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import { getAvatar } from '../components/Avatar';
import Navbar from '../components/Navbar';

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
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return '';
  }
}

/**
 * Determines the role of a given author by ID.
 * @param {string} authorId - The author's user ID.
 * @param {Array<Object>} users - Array of user objects from storage.
 * @returns {string} The role string ("admin" or "user").
 */
function getAuthorRole(authorId, users) {
  if (authorId === 'admin') return 'admin';
  const user = users.find((u) => u.id === authorId);
  return user ? user.role : 'user';
}

/**
 * Full blog post reader page component.
 * Displays title, author with avatar, date, and full content.
 * Admin sees edit/delete buttons on all posts.
 * User sees edit/delete only on own posts.
 * Delete confirms before removal and redirects to /blogs.
 * Handles invalid/missing IDs with 'Post not found' message.
 * @returns {JSX.Element}
 */
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [authorRole, setAuthorRole] = useState('user');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    try {
      const posts = getPosts();
      const found = posts.find((p) => p.id === id);

      if (!found) {
        setNotFound(true);
        return;
      }

      setPost(found);

      try {
        const users = getUsers();
        setAuthorRole(getAuthorRole(found.authorId, users));
      } catch (e) {
        setAuthorRole('user');
      }
    } catch (e) {
      setNotFound(true);
    }
  }, [id]);

  /**
   * Determines whether the current session user can edit/delete this post.
   * Admins can always edit/delete. Users can only edit/delete their own posts.
   * @returns {boolean}
   */
  function canModify() {
    if (!session || !post) return false;
    if (session.role === 'admin') return true;
    return session.userId === post.authorId;
  }

  /**
   * Handles the delete button click, showing confirmation.
   */
  function handleDeleteClick() {
    setConfirmingDelete(true);
  }

  /**
   * Handles confirmed deletion of the post.
   */
  function handleConfirmDelete() {
    try {
      const posts = getPosts();
      const filtered = posts.filter((p) => p.id !== id);
      savePosts(filtered);
      navigate('/blogs', { replace: true });
    } catch (e) {
      // Silently fail and redirect
      navigate('/blogs', { replace: true });
    }
  }

  /**
   * Handles cancellation of the delete confirmation.
   */
  function handleCancelDelete() {
    setConfirmingDelete(false);
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neutral-100 text-4xl mb-6">
              🔍
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Post Not Found</h1>
            <p className="text-sm text-neutral-500 mb-6">
              The post you are looking for does not exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <p className="text-sm text-neutral-500">Loading…</p>
        </main>
      </div>
    );
  }

  const showModifyButtons = canModify();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-primary-600 transition-colors"
          >
            ← Back to Blogs
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-3">
              {getAvatar(authorRole)}
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-700 truncate">
                  {post.authorName}
                </p>
                <p className="text-xs text-neutral-400">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100 mb-6" />

          {/* Content */}
          <div className="prose prose-neutral max-w-none">
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Action buttons */}
          {showModifyButtons && (
            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-end gap-3">
              {!confirmingDelete ? (
                <>
                  <Link
                    to={`/write/${post.id}`}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    ✏️ Edit Post
                  </Link>
                  <button
                    onClick={handleDeleteClick}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500">
                    Are you sure you want to delete this post?
                  </span>
                  <button
                    onClick={handleConfirmDelete}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}