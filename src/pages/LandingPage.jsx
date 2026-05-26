import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import PublicNavbar from '../components/PublicNavbar';
import BlogCard from '../components/BlogCard';

/**
 * Public landing page component.
 * Displays hero section, features, latest blog posts preview, and footer.
 * @returns {JSX.Element}
 */
export default function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const session = getSession();

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const sorted = [...allPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLatestPosts(sorted.slice(0, 3));
    } catch (e) {
      setLatestPosts([]);
    }
  }, []);

  const features = [
    {
      icon: '✍️',
      title: 'Write Freely',
      description: 'Create and publish your thoughts with a clean, distraction-free writing experience.',
    },
    {
      icon: '👥',
      title: 'Community Driven',
      description: 'Join a growing community of writers sharing ideas and stories with the world.',
    },
    {
      icon: '🔒',
      title: 'Role-Based Access',
      description: 'Admins manage users and content while writers focus on what they do best.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-6">
                Your Space to{' '}
                <span className="text-secondary-200">Write</span>,{' '}
                <span className="text-primary-200">Share</span> &{' '}
                <span className="text-secondary-200">Inspire</span>
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mb-8 leading-relaxed">
                WriteSpace is a modern platform for writers to craft beautiful blog posts,
                connect with readers, and build their audience — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                {session ? (
                  <Link
                    to={session.role === 'admin' ? '/admin' : '/blogs'}
                    className="inline-flex items-center px-8 py-3 rounded-xl text-base font-semibold bg-white text-primary-700 hover:bg-primary-50 transition-colors shadow-soft"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-8 py-3 rounded-xl text-base font-semibold bg-white text-primary-700 hover:bg-primary-50 transition-colors shadow-soft"
                    >
                      Get Started — It&apos;s Free
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-8 py-3 rounded-xl text-base font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-colors"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Floating Card Animation */}
            <div className="flex-1 hidden lg:flex justify-center">
              <div className="relative w-80 h-80">
                <div
                  className="absolute top-0 left-4 w-64 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-soft"
                  style={{ animation: 'floatCard1 6s ease-in-out infinite' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-secondary-400 inline-flex items-center justify-center text-sm">👑</span>
                    <span className="text-sm font-medium text-white/80">Site Owner</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full w-3/4 mb-2" />
                  <div className="h-2 bg-white/15 rounded-full w-1/2" />
                </div>
                <div
                  className="absolute bottom-0 right-0 w-64 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-soft"
                  style={{ animation: 'floatCard2 6s ease-in-out infinite' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-primary-400 inline-flex items-center justify-center text-sm">📖</span>
                    <span className="text-sm font-medium text-white/80">New Writer</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full w-full mb-2" />
                  <div className="h-2 bg-white/15 rounded-full w-2/3 mb-2" />
                  <div className="h-2 bg-white/10 rounded-full w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes floatCard1 {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-15px) rotate(0deg); }
          }
          @keyframes floatCard2 {
            0%, 100% { transform: translateY(0px) rotate(2deg); }
            50% { transform: translateY(-20px) rotate(0deg); }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif mb-4">
              Why WriteSpace?
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Everything you need to start writing and sharing your ideas with the world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-neutral-50 rounded-2xl p-8 text-center transition-shadow hover:shadow-soft"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-3xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="py-20 sm:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif mb-4">
                Latest Posts
              </h2>
              <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                Check out what our community has been writing about recently.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={index}
                  session={null}
                  authorRole="user"
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to={session ? '/blogs' : '/register'}
                className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                {session ? 'View All Posts' : 'Join to Read More'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <span className="text-xl font-bold text-white font-serif">✍️ WriteSpace</span>
              <p className="mt-3 text-sm leading-relaxed">
                A modern writing platform for creators, thinkers, and storytellers.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-4">
                About
              </h4>
              <p className="text-sm leading-relaxed">
                WriteSpace is a demo blogging platform built with React, Vite, and Tailwind CSS.
                All data is stored locally in your browser.
              </p>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-10 pt-8 text-center">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}