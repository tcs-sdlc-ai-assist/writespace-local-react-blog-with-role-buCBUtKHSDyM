import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPosts, savePosts, getUsers, saveUsers } from './storage';

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns parsed posts from localStorage', () => {
      const posts = [
        {
          id: 'p_1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
    });

    it('returns multiple posts from localStorage', () => {
      const posts = [
        {
          id: 'p_1',
          title: 'First Post',
          content: 'First content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'User One',
        },
        {
          id: 'p_2',
          title: 'Second Post',
          content: 'Second content',
          createdAt: '2024-01-02T00:00:00.000Z',
          authorId: 'u_2',
          authorName: 'User Two',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains null', () => {
      localStorage.removeItem('writespace_posts');

      const result = getPosts();
      expect(result).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves posts to localStorage', () => {
      const posts = [
        {
          id: 'p_1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Test User',
        },
      ];

      savePosts(posts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(posts);
    });

    it('saves an empty array to localStorage', () => {
      savePosts([]);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });

    it('overwrites existing posts in localStorage', () => {
      const oldPosts = [
        {
          id: 'p_old',
          title: 'Old Post',
          content: 'Old content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Old User',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(oldPosts));

      const newPosts = [
        {
          id: 'p_new',
          title: 'New Post',
          content: 'New content',
          createdAt: '2024-02-01T00:00:00.000Z',
          authorId: 'u_2',
          authorName: 'New User',
        },
      ];
      savePosts(newPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(newPosts);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('p_new');
    });

    it('does not throw when localStorage.setItem throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage full');
      });

      expect(() => savePosts([{ id: 'p_1' }])).not.toThrow();
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns parsed users from localStorage', () => {
      const users = [
        {
          id: 'u_1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'testpass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
    });

    it('returns multiple users from localStorage', () => {
      const users = [
        {
          id: 'u_1',
          displayName: 'User One',
          username: 'userone',
          password: 'pass1',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'u_2',
          displayName: 'Admin Two',
          username: 'admintwo',
          password: 'pass2',
          role: 'admin',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_users', 'corrupted{data');

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains null', () => {
      localStorage.removeItem('writespace_users');

      const result = getUsers();
      expect(result).toEqual([]);
    });
  });

  describe('saveUsers', () => {
    it('saves users to localStorage', () => {
      const users = [
        {
          id: 'u_1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'testpass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      saveUsers(users);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(users);
    });

    it('saves an empty array to localStorage', () => {
      saveUsers([]);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual([]);
    });

    it('overwrites existing users in localStorage', () => {
      const oldUsers = [
        {
          id: 'u_old',
          displayName: 'Old User',
          username: 'olduser',
          password: 'oldpass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(oldUsers));

      const newUsers = [
        {
          id: 'u_new',
          displayName: 'New User',
          username: 'newuser',
          password: 'newpass',
          role: 'admin',
          createdAt: '2024-02-01T00:00:00.000Z',
        },
      ];
      saveUsers(newUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(newUsers);
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('u_new');
    });

    it('does not throw when localStorage.setItem throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage full');
      });

      expect(() => saveUsers([{ id: 'u_1' }])).not.toThrow();
    });
  });

  describe('integration between save and get', () => {
    it('getPosts returns what savePosts saved', () => {
      const posts = [
        {
          id: 'p_1',
          title: 'Integration Test',
          content: 'Integration content',
          createdAt: '2024-03-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Integration User',
        },
        {
          id: 'p_2',
          title: 'Second Integration',
          content: 'More content',
          createdAt: '2024-03-02T00:00:00.000Z',
          authorId: 'u_2',
          authorName: 'Another User',
        },
      ];

      savePosts(posts);
      const result = getPosts();
      expect(result).toEqual(posts);
    });

    it('getUsers returns what saveUsers saved', () => {
      const users = [
        {
          id: 'u_1',
          displayName: 'User A',
          username: 'usera',
          password: 'passa',
          role: 'user',
          createdAt: '2024-03-01T00:00:00.000Z',
        },
        {
          id: 'u_2',
          displayName: 'User B',
          username: 'userb',
          password: 'passb',
          role: 'admin',
          createdAt: '2024-03-02T00:00:00.000Z',
        },
      ];

      saveUsers(users);
      const result = getUsers();
      expect(result).toEqual(users);
    });

    it('posts and users do not interfere with each other', () => {
      const posts = [
        {
          id: 'p_1',
          title: 'A Post',
          content: 'Content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'u_1',
          authorName: 'Author',
        },
      ];
      const users = [
        {
          id: 'u_1',
          displayName: 'A User',
          username: 'auser',
          password: 'apass',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      savePosts(posts);
      saveUsers(users);

      expect(getPosts()).toEqual(posts);
      expect(getUsers()).toEqual(users);

      savePosts([]);
      expect(getPosts()).toEqual([]);
      expect(getUsers()).toEqual(users);
    });
  });
});