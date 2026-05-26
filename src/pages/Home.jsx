import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import { getUsers } from '../utils/storage';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';

/**
 * Authenticated blog list page component.
 * Displays a responsive grid of all blog posts sorted newest first.
 * Shows empty state with CTA if no posts exist.
 * Uses session for role/ownership checks on BlogCard edit icons.
 * @returns {JSX.Element}
 */
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const session = getSession();

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
      const users = getUsers();
      const roles = {};
      // Add hard-coded admin
      roles['admin'] = 'admin';
      users.forEach((u) => {
        roles[u.id] = u.role;
      });
      setUserRoles(roles);
    } catch (e) {
      setUserRoles({});
    }
  }, []);

  /**
   * Gets the role for a given author ID.
   * @param {string} authorId - The author's user ID.
   * @returns {string} The role string ("admin" or "user").
   */
  function getAuthorRole(authorId) {
    return userRoles[authorId] || 'user';
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif">
              All Posts
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Browse the latest posts from the community
            </p>
          </div>
          <Link
            to="/write"
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            ✍️ Write a Post
          </Link>
        </div>

        {/* Posts Grid or Empty State */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                session={session}
                authorRole={getAuthorRole(post.authorId)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 text-4xl mb-6">
              📝
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">No posts yet</h2>
            <p className="text-sm text-neutral-500 max-w-md mb-6">
              Be the first to share your thoughts with the community. Start writing your first blog post today!
            </p>
            <Link
              to="/write"
              className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              ✍️ Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}