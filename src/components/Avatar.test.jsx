import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar, { getAvatar } from './Avatar';

describe('Avatar component', () => {
  describe('getAvatar', () => {
    it('returns a span with crown emoji for admin role', () => {
      const { container } = render(getAvatar('admin'));
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('👑');
      expect(span).toHaveAttribute('title', 'Admin');
    });

    it('returns a span with book emoji for user role', () => {
      const { container } = render(getAvatar('user'));
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('📖');
      expect(span).toHaveAttribute('title', 'User');
    });

    it('applies admin-specific Tailwind classes for admin role', () => {
      const { container } = render(getAvatar('admin'));
      const span = container.querySelector('span');

      expect(span.className).toContain('bg-secondary-100');
      expect(span.className).toContain('text-secondary-700');
      expect(span.className).toContain('rounded-full');
      expect(span.className).toContain('w-8');
      expect(span.className).toContain('h-8');
      expect(span.className).toContain('inline-flex');
      expect(span.className).toContain('items-center');
      expect(span.className).toContain('justify-center');
    });

    it('applies user-specific Tailwind classes for user role', () => {
      const { container } = render(getAvatar('user'));
      const span = container.querySelector('span');

      expect(span.className).toContain('bg-primary-100');
      expect(span.className).toContain('text-primary-700');
      expect(span.className).toContain('rounded-full');
      expect(span.className).toContain('w-8');
      expect(span.className).toContain('h-8');
      expect(span.className).toContain('inline-flex');
      expect(span.className).toContain('items-center');
      expect(span.className).toContain('justify-center');
    });

    it('defaults to user avatar for unknown role', () => {
      const { container } = render(getAvatar('unknown'));
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('📖');
      expect(span).toHaveAttribute('title', 'User');
      expect(span.className).toContain('bg-primary-100');
      expect(span.className).toContain('text-primary-700');
    });

    it('defaults to user avatar for empty string role', () => {
      const { container } = render(getAvatar(''));
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('📖');
      expect(span).toHaveAttribute('title', 'User');
    });
  });

  describe('Avatar component', () => {
    it('renders admin avatar when role is admin', () => {
      const { container } = render(<Avatar role="admin" />);
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('👑');
      expect(span).toHaveAttribute('title', 'Admin');
      expect(span.className).toContain('bg-secondary-100');
      expect(span.className).toContain('text-secondary-700');
    });

    it('renders user avatar when role is user', () => {
      const { container } = render(<Avatar role="user" />);
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('📖');
      expect(span).toHaveAttribute('title', 'User');
      expect(span.className).toContain('bg-primary-100');
      expect(span.className).toContain('text-primary-700');
    });

    it('renders user avatar for unrecognized role', () => {
      const { container } = render(<Avatar role="moderator" />);
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('📖');
      expect(span).toHaveAttribute('title', 'User');
      expect(span.className).toContain('bg-primary-100');
    });

    it('renders exactly one span element', () => {
      const { container } = render(<Avatar role="admin" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(1);
    });

    it('includes font-semibold class on the avatar span', () => {
      const { container } = render(<Avatar role="user" />);
      const span = container.querySelector('span');

      expect(span.className).toContain('font-semibold');
      expect(span.className).toContain('text-sm');
    });
  });
});