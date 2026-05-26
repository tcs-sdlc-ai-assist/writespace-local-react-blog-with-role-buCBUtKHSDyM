import { useState, useEffect } from 'react';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';
import Navbar from '../components/Navbar';
import UserRow from '../components/UserRow';

/**
 * Generates a unique user ID.
 * @returns {string} A unique user ID string.
 */
function generateUserId() {
  return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
}

/**
 * Admin-only user management page component.
 * Displays a create user form at the top and a table/card list of all users below.
 * Hard-coded admin is shown but cannot be deleted.
 * Currently logged-in user cannot delete themselves.
 * @returns {JSX.Element}
 */
export default function UserManagement() {
  const session = getSession();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Loads users from localStorage and updates state.
   */
  function loadUsers() {
    try {
      const allUsers = getUsers();
      setUsers(allUsers);
    } catch (e) {
      setUsers([]);
    }
  }

  /**
   * Builds the full user list including the hard-coded admin.
   * @returns {Array<Object>} Array of all users including hard-coded admin.
   */
  function getAllUsersWithAdmin() {
    const hardCodedAdmin = {
      id: 'admin',
      displayName: 'Site Owner',
      username: 'admin',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    return [hardCodedAdmin, ...users];
  }

  /**
   * Handles form submission for creating a new user.
   * @param {React.FormEvent} e - The form submit event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (trimmedPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);

    try {
      // Check if username is the hard-coded admin username
      if (trimmedUsername === 'admin') {
        setError('Username already exists.');
        setLoading(false);
        return;
      }

      // Check username uniqueness against localStorage users
      const currentUsers = getUsers();
      const existingUser = currentUsers.find((u) => u.username === trimmedUsername);

      if (existingUser) {
        setError('Username already exists.');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: generateUserId(),
        displayName: trimmedDisplayName,
        username: trimmedUsername,
        password: trimmedPassword,
        role: role,
        createdAt: new Date().toISOString(),
      };

      currentUsers.push(newUser);
      saveUsers(currentUsers);
      setUsers(currentUsers);

      // Reset form
      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setSuccess(`User "${newUser.displayName}" created successfully.`);
      setLoading(false);
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  /**
   * Handles deletion of a user by ID.
   * @param {string} userId - The ID of the user to delete.
   */
  function handleDelete(userId) {
    try {
      const currentUsers = getUsers();
      const filtered = currentUsers.filter((u) => u.id !== userId);
      saveUsers(filtered);
      setUsers(filtered);
      setSuccess('User deleted successfully.');
    } catch (e) {
      setError('Failed to delete user. Please try again.');
    }
  }

  const allUsers = getAllUsersWithAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-serif">
            User Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Create new users and manage existing accounts
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-neutral-900 font-serif mb-6">Create New User</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter display name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 font-serif">
              All Users ({allUsers.length})
            </h2>
          </div>

          {allUsers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      session={session}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {allUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    session={session}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 text-3xl mb-4">
                👥
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">No users yet</h3>
              <p className="text-sm text-neutral-500 max-w-md">
                Create your first user using the form above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}