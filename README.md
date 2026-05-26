# WriteSpace

A modern blogging platform built with React, Vite, and Tailwind CSS. All data is stored locally in your browser using localStorage — no backend required.

## Tech Stack

- **React 18** — UI library with functional components and hooks
- **Vite 6** — Fast build tool and dev server
- **Tailwind CSS 3** — Utility-first CSS framework
- **React Router v6** — Client-side routing with protected routes
- **PropTypes** — Runtime prop validation
- **Vitest** — Unit testing framework
- **Testing Library** — React component testing utilities

## Features

- **Public landing page** with hero section, feature highlights, and latest posts preview
- **User registration and login** with localStorage-based authentication
- **Role-based access control** — Admin and User roles
- **Blog post CRUD** — Create, read, update, and delete blog posts
- **Admin dashboard** — Stats overview, recent posts management, and quick actions
- **User management** — Admins can create and delete user accounts
- **Responsive design** — Mobile-first layout with Tailwind CSS
- **Session persistence** — Sessions stored in localStorage

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173).

### Build

```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

### Testing

```bash
# Run all tests
npm test
```

## Default Credentials

A hard-coded admin account is available out of the box:

| Username | Password    | Role  |
| -------- | ----------- | ----- |
| admin    | adminpass   | Admin |

Additional users can be registered via the registration page or created by an admin through the User Management page.

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment config
├── setupTests.js               # Test setup
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with route definitions
│   ├── index.css               # Tailwind directives
│   ├── setupTests.js           # Testing Library setup
│   ├── components/
│   │   ├── Avatar.jsx          # Role-based avatar component
│   │   ├── Avatar.test.jsx     # Avatar tests
│   │   ├── BlogCard.jsx        # Blog post card component
│   │   ├── Navbar.jsx          # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx  # Route guard component
│   │   ├── ProtectedRoute.test.jsx # ProtectedRoute tests
│   │   ├── PublicNavbar.jsx     # Guest navigation bar
│   │   ├── StatCard.jsx        # Admin dashboard stat tile
│   │   └── UserRow.jsx         # User table row / mobile card
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin dashboard page
│   │   ├── Home.jsx            # Blog list page
│   │   ├── Home.test.jsx       # Home page tests
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── LoginPage.jsx       # Login page
│   │   ├── ReadBlog.jsx        # Blog post reader page
│   │   ├── RegisterPage.jsx    # Registration page
│   │   ├── UserManagement.jsx  # Admin user management page
│   │   └── WriteBlog.jsx       # Blog create/edit page
│   └── utils/
│       ├── auth.js             # Session management utilities
│       ├── auth.test.js        # Auth utility tests
│       ├── storage.js          # localStorage CRUD utilities
│       └── storage.test.js     # Storage utility tests
```

## Route Map

### Public Routes

| Path        | Component      | Description                  |
| ----------- | -------------- | ---------------------------- |
| `/`         | LandingPage    | Public landing page          |
| `/login`    | LoginPage      | User login form              |
| `/register` | RegisterPage   | User registration form       |

### Protected Routes (Authenticated Users)

| Path         | Component | Description                     |
| ------------ | --------- | ------------------------------- |
| `/blogs`     | Home      | Blog post listing               |
| `/blog/:id`  | ReadBlog  | Full blog post reader           |
| `/write`     | WriteBlog | Create a new blog post          |
| `/write/:id` | WriteBlog | Edit an existing blog post      |

### Admin-Only Routes

| Path           | Component      | Description                |
| -------------- | -------------- | -------------------------- |
| `/admin`       | AdminDashboard | Admin dashboard with stats |
| `/admin/users` | UserManagement | User CRUD management       |

## Data Storage

All application data is persisted in the browser's localStorage under the following keys:

- **`writespace_session`** — Current user session object
- **`writespace_posts`** — Array of blog post objects
- **`writespace_users`** — Array of registered user objects

Clearing your browser's localStorage will reset all data.

## Deployment

### Vercel

The project includes a `vercel.json` with SPA rewrites configured. To deploy:

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and apply the correct build settings
4. All routes will be rewritten to `index.html` for client-side routing

### Manual Deployment

```bash
npm run build
```

Serve the `dist/` directory with any static file server. Ensure all routes fall back to `index.html` for client-side routing to work correctly.

## License

Private — All rights reserved.