# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-01

### Added

- **Public Landing Page** — Hero section with animated floating cards, feature highlights (Write Freely, Community Driven, Role-Based Access), latest posts preview, and footer with quick links ([SCRUM-8518])
- **User Authentication** — Login page with username/password form, hard-coded admin credentials (`admin` / `adminpass`), and localStorage-based session management ([SCRUM-8518])
- **User Registration** — Registration page with display name, username, password, and confirm password fields, including inline validation and username uniqueness checks ([SCRUM-8518])
- **Role-Based Access Control** — `ProtectedRoute` component supporting role-based route guarding; guests redirected to `/login`, unauthorized users redirected to `/blogs` ([SCRUM-8519])
- **Blog Post CRUD** — Create, read, update, and delete blog posts with title and content fields, character counters, ownership checks, and delete confirmation dialogs ([SCRUM-8519])
- **Blog List Page** — Authenticated blog listing with responsive grid layout, `BlogCard` components, author avatars, edit icons based on ownership, and empty state with call-to-action ([SCRUM-8519])
- **Blog Reader Page** — Full post view with author avatar, formatted date, edit/delete actions for authorized users, and back navigation ([SCRUM-8519])
- **Admin Dashboard** — Gradient banner header, stat cards (total posts, total users, admins, users), quick action buttons, and recent posts list with inline edit/delete ([SCRUM-8520])
- **User Management** — Admin-only page with create user form (display name, username, password, role selection) and user table/card list with delete confirmation; hard-coded admin protected from deletion ([SCRUM-8520])
- **Navigation Components** — `PublicNavbar` for guest users with login/register buttons; `Navbar` for authenticated users with role-based links, avatar chip, logout dropdown, and mobile hamburger menu ([SCRUM-8518])
- **Avatar Component** — Role-based avatar rendering with crown emoji for admins and book emoji for users, with Tailwind color-coded backgrounds ([SCRUM-8518])
- **StatCard Component** — Reusable admin dashboard stat tile with configurable title, value, icon, and color theme ([SCRUM-8520])
- **UserRow Component** — Responsive user display as table row (desktop) or stacked card (mobile) with role badge, delete confirmation, and self-deletion protection ([SCRUM-8520])
- **BlogCard Component** — Reusable blog post card with cycling border colors, author avatar, excerpt, formatted date, and conditional edit link ([SCRUM-8519])
- **localStorage Persistence** — All application data stored in browser localStorage under `writespace_session`, `writespace_posts`, and `writespace_users` keys ([SCRUM-8518])
- **Auth Utilities** — `getSession`, `setSession`, and `clearSession` functions for session management with error handling ([SCRUM-8518])
- **Storage Utilities** — `getPosts`, `savePosts`, `getUsers`, and `saveUsers` functions for localStorage CRUD with error handling ([SCRUM-8518])
- **Responsive Design** — Mobile-first layout using Tailwind CSS with `sm:`, `md:`, and `lg:` responsive breakpoints throughout all pages and components ([SCRUM-8518])
- **Tailwind CSS Configuration** — Custom color palette (primary, secondary, neutral), custom fonts (Inter, Merriweather, Fira Code), custom shadows (soft, card), and extended spacing ([SCRUM-8518])
- **Vercel Deployment** — `vercel.json` with SPA rewrite rules for client-side routing support ([SCRUM-8520])
- **Unit Tests** — Test suites for `Avatar`, `ProtectedRoute`, `Home` page, `auth` utilities, and `storage` utilities using Vitest and Testing Library ([SCRUM-8519])

[1.0.0]: https://github.com/writespace/writespace/releases/tag/v1.0.0

[SCRUM-8518]: #SCRUM-8518
[SCRUM-8519]: #SCRUM-8519
[SCRUM-8520]: #SCRUM-8520