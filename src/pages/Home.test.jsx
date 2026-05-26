import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import * as auth from '../utils/auth';
import * as storage from '../utils/storage';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

vi.mock('../utils/storage', () => ({
  getPosts: vi.fn(),
  savePosts: vi.fn(),
  getUsers: vi.fn(),
  saveUsers: vi.fn(),
}));

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/blogs']}>
      <Home />
    </MemoryRouter>
  );
}

describe('Home page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    auth.getSession.mockReturnValue({
      userId: 'u_1',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    });
    storage.getPosts.mockReturnValue([]);
    storage.getUsers.mockReturnValue([]);
  });

  describe('page header', () => {
    it('renders the page title "All Posts"', () => {
      renderHome();
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('renders the subtitle text', () => {
      renderHome();
      expect(screen.getByText('Browse the latest posts from the community')).toBeInTheDocument();
    });

    it('renders the "Write a Post" link', () => {
      renderHome();
      const writeLink = screen.getByText('✍️ Write a Post');
      expect(writeLink).toBeInTheDocument();
      expect(writeLink.closest('a')).toHaveAttribute('href', '/write');
    });
  });

  describe('empty state', () => {
    it('renders empty state when no posts exist', () => {
      storage.getPosts.mockReturnValue([]);
      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Be the first to share your thoughts with the community. Start writing your first blog post today!'
        )
      ).toBeInTheDocument();
    });

    it('renders "Write Your First Post" CTA in empty state', () => {
      storage.getPosts.mockReturnValue([]);
      renderHome();

      const cta = screen.getByText('✍️ Write Your First Post');
      expect(cta).toBeInTheDocument();
      expect(cta.closest('a')).toHaveAttribute('href', '/write');
    });
  });

  describe('blog list rendering', () => {
    it('renders blog post cards when posts exist', () => {
      storage.getPosts.mockReturnValue([
        {
          id: 'p_1',
          title: 'First Post',
          content: 'First content here',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
        {
          id: 'p_2',
          title: 'Second Post',
          content: 'Second content here',
          createdAt: '2024-06-02T00:00:00.000Z',
          authorId: 'u_2',
          authorName: 'Another User',
        },
      ]);
      storage.getUsers.mockReturnValue([
        { id: 'u_1', username: 'testuser', displayName: 'Test User', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'u_2', username: 'another', displayName: 'Another User', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' },
      ]);

      renderHome();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    it('does not render empty state when posts exist', () => {
      storage.getPosts.mockReturnValue([
        {
          id: 'p_1',
          title: 'A Post',
          content: 'Some content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
      ]);

      renderHome();

      expect(screen.queryByText('No posts yet')).not.toBeInTheDocument();
    });

    it('renders author names on blog cards', () => {
      storage.getPosts.mockReturnValue([
        {
          id: 'p_1',
          title: 'My Post',
          content: 'Content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
      ]);

      renderHome();

      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('renders posts sorted newest first', () => {
      storage.getPosts.mockReturnValue([
        {
          id: 'p_old',
          title: 'Old Post',
          content: 'Old content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
        {
          id: 'p_new',
          title: 'New Post',
          content: 'New content',
          createdAt: '2024-12-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
        {
          id: 'p_mid',
          title: 'Mid Post',
          content: 'Mid content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
      ]);

      renderHome();

      const postTitles = screen.getAllByRole('heading', { level: 3 });
      expect(postTitles[0]).toHaveTextContent('New Post');
      expect(postTitles[1]).toHaveTextContent('Mid Post');
      expect(postTitles[2]).toHaveTextContent('Old Post');
    });
  });

  describe('edit icon visibility for regular user', () => {
    it('shows edit icon on own posts for regular user', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });
      storage.getPosts.mockReturnValue([
        {
          id: 'p_1',
          title: 'My Post',
          content: 'My content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
      ]);

      renderHome();

      const editLink = screen.getByTitle('Edit post');
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', '/write/p_1');
    });

    it('does not show edit icon on other users posts for regular user', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });
      storage.getPosts.mockReturnValue([
        {
          id: 'p_2',
          title: 'Other Post',
          content: 'Other content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_2',
          authorName: 'Another User',
        },
      ]);
      storage.getUsers.mockReturnValue([
        { id: 'u_2', username: 'another', displayName: 'Another User', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' },
      ]);

      renderHome();

      expect(screen.queryByTitle('Edit post')).not.toBeInTheDocument();
    });
  });

  describe('edit icon visibility for admin', () => {
    it('shows edit icon on all posts for admin user', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Site Owner',
        role: 'admin',
      });
      storage.getPosts.mockReturnValue([
        {
          id: 'p_1',
          title: 'User Post',
          content: 'User content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
        {
          id: 'p_2',
          title: 'Admin Post',
          content: 'Admin content',
          createdAt: '2024-06-02T00:00:00.000Z',
          authorId: 'admin',
          authorName: 'Site Owner',
        },
      ]);
      storage.getUsers.mockReturnValue([
        { id: 'u_1', username: 'testuser', displayName: 'Test User', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' },
      ]);

      renderHome();

      const editLinks = screen.getAllByTitle('Edit post');
      expect(editLinks).toHaveLength(2);
    });

    it('shows edit icon on other users posts for admin', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Site Owner',
        role: 'admin',
      });
      storage.getPosts.mockReturnValue([
        {
          id: 'p_1',
          title: 'Someone Else Post',
          content: 'Content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_99',
          authorName: 'Someone Else',
        },
      ]);

      renderHome();

      const editLink = screen.getByTitle('Edit post');
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', '/write/p_1');
    });
  });

  describe('author role avatars', () => {
    it('renders admin avatar for posts by admin', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });
      storage.getPosts.mockReturnValue([
        {
          id: 'p_1',
          title: 'Admin Post',
          content: 'Admin content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'admin',
          authorName: 'Site Owner',
        },
      ]);
      storage.getUsers.mockReturnValue([]);

      renderHome();

      const avatar = screen.getByTitle('Admin');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('👑');
    });

    it('renders user avatar for posts by regular users', () => {
      auth.getSession.mockReturnValue({
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });
      storage.getPosts.mockReturnValue([
        {
          id: 'p_1',
          title: 'User Post',
          content: 'User content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
      ]);
      storage.getUsers.mockReturnValue([
        { id: 'u_1', username: 'testuser', displayName: 'Test User', role: 'user', createdAt: '2024-01-01T00:00:00.000Z' },
      ]);

      renderHome();

      const avatar = screen.getByTitle('User');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('📖');
    });
  });

  describe('error handling', () => {
    it('renders empty state when getPosts throws', () => {
      storage.getPosts.mockImplementation(() => {
        throw new Error('Storage error');
      });

      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('renders posts even when getUsers throws', () => {
      storage.getPosts.mockReturnValue([
        {
          id: 'p_1',
          title: 'A Post',
          content: 'Content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
      ]);
      storage.getUsers.mockImplementation(() => {
        throw new Error('Users storage error');
      });

      renderHome();

      expect(screen.getByText('A Post')).toBeInTheDocument();
    });
  });

  describe('data fetching', () => {
    it('calls getPosts on mount', () => {
      renderHome();
      expect(storage.getPosts).toHaveBeenCalled();
    });

    it('calls getUsers on mount', () => {
      renderHome();
      expect(storage.getUsers).toHaveBeenCalled();
    });

    it('calls getSession for session data', () => {
      renderHome();
      expect(auth.getSession).toHaveBeenCalled();
    });
  });
});