import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSession, setSession, clearSession } from './auth';

describe('auth utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      const session = {
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
    });

    it('returns admin session object from localStorage', () => {
      const session = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Site Owner',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
    });

    it('returns null when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_session', '{not valid json!!!');

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains null', () => {
      localStorage.removeItem('writespace_session');

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage item is empty string', () => {
      localStorage.setItem('writespace_session', '');

      const result = getSession();
      expect(result).toBeNull();
    });
  });

  describe('setSession', () => {
    it('saves session object to localStorage', () => {
      const session = {
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };

      setSession(session);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(session);
    });

    it('saves admin session object to localStorage', () => {
      const session = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Site Owner',
        role: 'admin',
      };

      setSession(session);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(session);
    });

    it('overwrites existing session in localStorage', () => {
      const oldSession = {
        userId: 'u_old',
        username: 'olduser',
        displayName: 'Old User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(oldSession));

      const newSession = {
        userId: 'u_new',
        username: 'newuser',
        displayName: 'New User',
        role: 'admin',
      };
      setSession(newSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(newSession);
      expect(stored.userId).toBe('u_new');
    });

    it('does not throw when localStorage.setItem throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage full');
      });

      expect(() =>
        setSession({
          userId: 'u_1',
          username: 'testuser',
          displayName: 'Test User',
          role: 'user',
        })
      ).not.toThrow();
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const session = {
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('does not throw when localStorage.removeItem throws', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      expect(() => clearSession()).not.toThrow();
    });

    it('only removes session key and does not affect other localStorage items', () => {
      localStorage.setItem('writespace_session', JSON.stringify({ userId: 'u_1' }));
      localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'p_1' }]));
      localStorage.setItem('writespace_users', JSON.stringify([{ id: 'u_1' }]));

      clearSession();

      expect(localStorage.getItem('writespace_session')).toBeNull();
      expect(localStorage.getItem('writespace_posts')).not.toBeNull();
      expect(localStorage.getItem('writespace_users')).not.toBeNull();
    });
  });

  describe('integration between setSession, getSession, and clearSession', () => {
    it('getSession returns what setSession saved', () => {
      const session = {
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };

      setSession(session);
      const result = getSession();
      expect(result).toEqual(session);
    });

    it('getSession returns null after clearSession', () => {
      const session = {
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };

      setSession(session);
      expect(getSession()).toEqual(session);

      clearSession();
      expect(getSession()).toBeNull();
    });

    it('setSession followed by setSession overwrites and getSession returns latest', () => {
      const session1 = {
        userId: 'u_1',
        username: 'user1',
        displayName: 'User One',
        role: 'user',
      };
      const session2 = {
        userId: 'u_2',
        username: 'user2',
        displayName: 'User Two',
        role: 'admin',
      };

      setSession(session1);
      setSession(session2);

      const result = getSession();
      expect(result).toEqual(session2);
    });

    it('session does not interfere with posts or users storage', () => {
      const session = {
        userId: 'u_1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      const posts = [{ id: 'p_1', title: 'A Post' }];
      const users = [{ id: 'u_1', username: 'testuser' }];

      localStorage.setItem('writespace_posts', JSON.stringify(posts));
      localStorage.setItem('writespace_users', JSON.stringify(users));

      setSession(session);

      expect(getSession()).toEqual(session);
      expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual(posts);
      expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual(users);

      clearSession();

      expect(getSession()).toBeNull();
      expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual(posts);
      expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual(users);
    });
  });
});