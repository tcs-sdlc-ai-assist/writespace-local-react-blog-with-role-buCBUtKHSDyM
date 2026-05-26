import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { getAvatar } from '../components/Avatar';

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
 * Extracts a plain-text excerpt from content.
 * @param {string} content - The full post content.
 * @param {number} [maxLength=80] - Maximum excerpt length.
 * @returns {string} The truncated excerpt.
 */
function getExcerpt(content, maxLength = 80) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Admin-only dashboard page component.
 * Displays gradient banner header, stat cards, quick action buttons,
 * and recent 5 posts with inline edit/delete functionality.
 * @returns {JSX.Element}
 */
export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const session = getSession();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const sorted = [...allPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sorted);
    } catch (e) {
      setPosts([]);
    }

    try {
      const allUsers = getUsers();
      setUsers(allUsers);
    } catch (e) {
      setUsers([]);
    }
  }, []);

  const totalPosts = posts.length;
  // +1 for hard-coded admin
  const totalUsers = users.length + 1;
  const adminCount = users.filter((u) => u.role === 'admin').length + 1;
  const userCount = users.filter((u) => u.role === 'user').length;
  const recentPosts = posts.slice(0, 5);

  /**
   * Gets the role for a given author ID.
   * @param {string} authorId - The author's user ID.
   * @returns {string} The role string ("admin" or "user").
   */
  function getAuthorRole(authorId) {
    if (authorId === 'admin') return 'admin';
    const user = users.find((u) => u.id === authorId);
    return user ? user.role : 'user';
  }

  /**
   * Handles the delete button click, showing confirmation.
   * @param {string} postId - The post ID to delete.
   */
  function handleDeleteClick(postId) {
    setConfirmingDeleteId(postId);
  }

  /**
   * Handles confirmed deletion of a post.
   * @param {string} postId - The post ID to delete.
   */
  function handleConfirmDelete(postId) {
    try {
      const allPosts = getPosts();
      const filtered = allPosts.filter((p) => p.id !== postId);
      savePosts(filtered);
      const sorted = [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sorted);
    } catch (e) {
      // Silently fail
    }
    setConfirmingDeleteId(null);
  }

  /**
   * Handles cancellation of the delete confirmation.
   */
  function handleCancelDelete() {
    setConfirmingDeleteId(null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Gradient Banner Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary-600 via-secondary-500 to-primary-600 rounded-2xl shadow-card p-6 sm:p-8 mb-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-48 h-48 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-4 left-4 w-64 h-64 bg-primary-300 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              {getAvatar('admin')}
              <span className="text-sm font-medium text-white/80">
                Welcome back, {session ? session.displayName : 'Admin'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              Admin Dashboard
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Manage your blog posts, users, and site content
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Posts" value={totalPosts} icon="📝" color="primary" />
          <StatCard title="Total Users" value={totalUsers} icon="👥" color="secondary" />
          <StatCard title="Admins" value={adminCount} icon="👑" color="secondary" />
          <StatCard title="Users" value={userCount} icon="📖" color="primary" />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
          <Link
            to="/write"
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            ✍️ Write a Post
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-secondary-600 hover:bg-secondary-700 transition-colors"
          >
            👥 Manage Users
          </Link>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 font-serif">Recent Posts</h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {getAvatar(getAuthorRole(post.authorId))}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors line-clamp-1 block"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                        {getExcerpt(post.content)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-400">{post.authorName}</span>
                        <span className="text-xs text-neutral-300">·</span>
                        <span className="text-xs text-neutral-400">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {confirmingDeleteId !== post.id ? (
                      <>
                        <Link
                          to={`/write/${post.id}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
                          title="Edit post"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(post.id)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                          title="Delete post"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Delete?</span>
                        <button
                          onClick={() => handleConfirmDelete(post.id)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={handleCancelDelete}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-3xl mb-4">
                📝
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">No posts yet</h3>
              <p className="text-sm text-neutral-500 max-w-md mb-4">
                Get started by writing your first blog post.
              </p>
              <Link
                to="/write"
                className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                ✍️ Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}