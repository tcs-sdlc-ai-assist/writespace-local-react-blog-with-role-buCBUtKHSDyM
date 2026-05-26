import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';
import Navbar from '../components/Navbar';

const TITLE_MAX_LENGTH = 150;
const CONTENT_MAX_LENGTH = 5000;

/**
 * Blog create and edit page component.
 * Handles /write (create) and /write/:id (edit) routes.
 * Ownership checks: users can only edit their own posts, admins can edit any.
 * Title and content fields with inline validation and character counter.
 * @returns {JSX.Element}
 */
export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (!isEditing) return;

    try {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        setNotFound(true);
        return;
      }

      // Ownership check: admin can edit any, user can only edit own
      if (session && session.role !== 'admin' && session.userId !== post.authorId) {
        setUnauthorized(true);
        return;
      }

      setTitle(post.title);
      setContent(post.content);
    } catch (e) {
      setNotFound(true);
    }
  }, [id, isEditing, session]);

  /**
   * Generates a unique post ID.
   * @returns {string} A unique post ID string.
   */
  function generatePostId() {
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
  }

  /**
   * Handles form submission for creating or updating a blog post.
   * @param {React.FormEvent} e - The form submit event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are required.');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setError(`Title must be ${TITLE_MAX_LENGTH} characters or less.`);
      return;
    }

    if (trimmedContent.length > CONTENT_MAX_LENGTH) {
      setError(`Content must be ${CONTENT_MAX_LENGTH} characters or less.`);
      return;
    }

    setLoading(true);

    try {
      const posts = getPosts();

      if (isEditing) {
        const postIndex = posts.findIndex((p) => p.id === id);

        if (postIndex === -1) {
          setError('Post not found.');
          setLoading(false);
          return;
        }

        // Re-check ownership
        if (session.role !== 'admin' && session.userId !== posts[postIndex].authorId) {
          setError('You do not have permission to edit this post.');
          setLoading(false);
          return;
        }

        posts[postIndex] = {
          ...posts[postIndex],
          title: trimmedTitle,
          content: trimmedContent,
        };

        savePosts(posts);
        navigate(`/blog/${id}`, { replace: true });
      } else {
        const newPost = {
          id: generatePostId(),
          title: trimmedTitle,
          content: trimmedContent,
          createdAt: new Date().toISOString(),
          authorId: session.userId,
          authorName: session.displayName,
        };

        posts.push(newPost);
        savePosts(posts);
        navigate(`/blog/${newPost.id}`, { replace: true });
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  /**
   * Handles cancel button click, navigating back without saving.
   */
  function handleCancel() {
    if (isEditing) {
      navigate(`/blog/${id}`);
    } else {
      navigate('/blogs');
    }
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
              The post you are trying to edit does not exist.
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

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-100 text-4xl mb-6">
              🚫
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Unauthorized</h1>
            <p className="text-sm text-neutral-500 mb-6">
              You do not have permission to edit this post.
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

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif">
            {isEditing ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {isEditing
              ? 'Update your blog post below'
              : 'Share your thoughts with the community'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter your post title"
                maxLength={TITLE_MAX_LENGTH}
              />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs ${
                    title.length > TITLE_MAX_LENGTH
                      ? 'text-red-500'
                      : 'text-neutral-400'
                  }`}
                >
                  {title.length}/{TITLE_MAX_LENGTH}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-y min-h-[200px]"
                placeholder="Write your blog post content here..."
                rows={10}
                maxLength={CONTENT_MAX_LENGTH}
              />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-xs ${
                    content.length > CONTENT_MAX_LENGTH
                      ? 'text-red-500'
                      : 'text-neutral-400'
                  }`}
                >
                  {content.length}/{CONTENT_MAX_LENGTH}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEditing
                    ? 'Saving…'
                    : 'Publishing…'
                  : isEditing
                    ? 'Save Changes'
                    : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}